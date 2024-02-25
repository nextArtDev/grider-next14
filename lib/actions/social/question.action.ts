'use server'

import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from './shared.types'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { currentUser } from '@/lib/auth'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    const { searchQuery, filter, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize
    const query: any = {} // This will be used to build the Prisma query

    if (searchQuery) {
      query.OR = [
        { title: { contains: searchQuery } },
        { content: { contains: searchQuery } },
      ]
    }

    let orderByOptions: any = {} // This will be used to define the sorting options

    switch (filter) {
      case 'newest':
        orderByOptions = { created_at: 'desc' }
        break
      case 'frequent':
        orderByOptions = { views: 'desc' }
        break
      case 'unanswered':
        orderByOptions = {
          answers: {
            _count: 'asc',
          },
        }
        break
      default:
        break
    }

    // Fetch questions using Prisma
    const questions = await prisma.question.findMany({
      where: query,
      include: {
        tags: true, // Include the related tags
        author: { include: { image: { select: { url: true } } } }, // Include the related author
        answers: true,
        downvoters: true,
        upvoters: true,
      },
      skip: skipAmount,
      take: pageSize,
      orderBy: orderByOptions,
    })
    // console.log(questions)

    // Fetch the total count of questions for pagination
    const totalQuestions = await prisma.question.count({ where: query })

    // Calculate if there are more questions to be fetched
    const isNext = totalQuestions > skipAmount + questions.length
    // q.l: 101 => pages: 4 * skipAmount: 20 + lastPage: 20 = 100

    return { questions, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    const user = await currentUser()
    if (!user) return

    const { title, content, tags, authorId, path } = params
    // console.log({ title, content, tags, authorId, path })
    const question = await prisma.question.create({
      data: {
        title,
        content,
        authorId,
      },
    })

    const tagDocuments = []

    for (const tag of tags) {
      const existingTag = await prisma.tag.findUnique({
        where: {
          name: tag,
        },
      })

      if (existingTag) {
        tagDocuments.push(existingTag.id)
      } else {
        const newTag = await prisma.tag.create({
          data: {
            name: tag,
            questions: { connect: { id: question.id } },
            // followers: { connect: { id: authorId } },
          },
        })
        tagDocuments.push(newTag.id)
      }
    }

    // Connect tags to the question
    await prisma.question.update({
      where: { id: question.id },
      data: { tags: { connect: tagDocuments.map((id) => ({ id })) } },
    })

    // Create an interaction record
    await prisma.interaction.create({
      data: {
        user: { connect: { id: authorId } },
        action: 'ask_question',
        question: { connect: { id: question.id } },
        tags: { connect: tagDocuments.map((id) => ({ id })) },
      },
    })
    // console.log(interaction)
    // Increment author's reputation by +5 for creating a question
    await prisma.user.update({
      where: { id: authorId },
      data: { reputation: { increment: 5 } },
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    const { questionId } = params

    const question = await prisma.question.findFirst({
      where: { id: questionId },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          // select: {
          //   id: true,
          //   name: true,
          //   // picture: true,
          // },
          include: {
            image: { select: { url: true } },
          },
        },
        answers: true,
        upvoters: { select: { id: true } },
        downvoters: { select: { id: true } },
        usersWhoSaved: { select: { id: true } },
      },
    })
    return { question }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}
    if (hasupVoted) {
      updateQuery = { upvoters: { disconnect: { id: userId } } }
    } else if (hasdownVoted) {
      updateQuery = {
        downvoters: { disconnect: { id: userId } },
        upvoters: { connect: { id: userId } },
      }
    } else {
      updateQuery = {
        upvoters: { connect: { id: userId } },
      }
    }
    const question = await prisma.question.update({
      where: { id: questionId },
      include: { upvoters: true },
      data: updateQuery,
      // data: { upvoters: { connect: { id: userId } } },
    })
    //   new: true,
    // })

    if (!question) {
      throw new Error('Question not Found')
    }

    await prisma.user.update({
      where: { id: question.authorId },
      data: { reputation: { increment: hasupVoted ? -1 : 1 } },
    })

    // Increment authors reputation by +10/-10 for receiving an upvote/downvote to the question
    await prisma.user.update({
      where: { id: userId },
      data: { reputation: { increment: hasupVoted ? -10 : 10 } },
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasdownVoted) {
      updateQuery = { downvoters: { disconnect: { id: userId } } }
    } else if (hasupVoted) {
      updateQuery = {
        upvoters: { disconnect: { id: userId } },
        downvoters: { connect: { id: userId } },
      }
    } else {
      updateQuery = {
        downvoters: { connect: { id: userId } },
      }
    }

    const question = await prisma.question.update({
      where: { id: questionId },
      include: { downvoters: true },
      data: updateQuery,
      // data: { upvoters: { connect: { id: userId } } },
    })
    //   new: true,
    // })

    if (!question) {
      throw new Error('Question not Found')
    }
    // Increment authors reputation
    await prisma.user.update({
      where: { id: question.authorId },
      data: { reputation: { increment: hasdownVoted ? -2 : 2 } },
    })

    // Increment voter's reputation
    await prisma.user.update({
      where: { id: userId },
      data: { reputation: { increment: hasdownVoted ? -10 : 10 } },
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    const { questionId, path } = params

    // TAGS

    const tagsToDisconnect = await prisma.question
      .findUnique({ where: { id: questionId } })
      .tags()

    const tagsQuestions = await prisma.tag.findMany({
      where: { id: { in: tagsToDisconnect?.map((t) => +t.id) } },
      include: { questions: { select: { id: true } } },
    })
    // console.log(tagsQuestions.map((tagsQuestion) => tagsQuestion.id))
    const tagIds = tagsQuestions.map((tagsQuestion) => tagsQuestion.id)

    await prisma.question.update({
      where: { id: questionId },
      data: {
        tags: {
          disconnect: tagIds.map((tagId) => ({ id: +tagId })),
        },
      },
    })

    // for (const tagId of tagIds) {
    //   console.log(tagId)
    //   const isTagLast = await prisma.tag.count({ where: { id: +tagId } })
    //   console.log(isTagLast)
    //   if (isTagLast === 1) {
    //     await prisma.tag.delete({ where: { id: +tagId } })
    //   }
    // }

    // const answersToDisconnect = await prisma.question
    //   .findUnique({ where: { id: questionId } })
    //   .answers()

    // const answersQuestions = await prisma.answer.findMany({
    //   where: { id: { in: answersToDisconnect?.map((t) => t.id) } },
    //   include: { Question: { select: { id: true } } },
    // })

    // const questionAnswerUpdate = await prisma.question.update({
    //   where: { id: questionId },
    //   data: {
    //     answers: {
    //       disconnect: answerIds.map((answerId) => ({ id: answerId })),
    //     },
    //   },
    // })

    await prisma.answer.deleteMany({ where: { questionId } })

    await prisma.interaction.deleteMany({
      where: { questionId },
      // data: { questionId: undefined },
    })
    await prisma.question.delete({ where: { id: questionId } })

    // console.log(questionAnswerUpdate)
    // await prisma.tag.deleteMany({
    //   where: { id: { in: tagsToDisconnect?.map((t) => +t.id) } },
    // })
    // console.log(tagsQuestions)
    // await prisma.tag.updateMany({
    //   where: { id: { in: tagsToDisconnect?.map((t) => +t.id) } },
    //   data: {
    //     id: {},
    //   },
    // })
    // await prisma.answer.updateMany({
    //   where: { questionId },
    //   data: { questionId: undefined },
    // })
    // const del = await prisma.question.delete({ where: { id: questionId } })
    // console.log({ del })

    // await prisma.answer.deleteMany({ where: { questionId } })
    // await prisma.interaction.deleteMany({ where: { questionId } })

    // // Disconnect the question from the Answer model

    // // Disconnect the question from the Question model
    // await prisma.question.update({
    //   where: { id: questionId },
    //   data: { tags: { disconnect: [{ id: 'tag_id' }] } }, // Replace 'tag_id' with the actual tag ID
    // })

    // // Disconnect the question from the Tag model
    // await prisma.tag.updateMany({
    //   where: { questions: { some: { id: questionId } } },
    //   data: {
    //     questions: {
    //       disconnect: { id: questionId },
    //     },
    //   },
    // })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    // connectToDatabase()

    const { questionId, title, content, path } = params

    // const question = await Question.findById(questionId).populate('tags')

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { tags: true },
    })

    if (!question) return
    await prisma.question.update({
      where: { id: questionId },
      data: {
        title,
        content,
      },
    })

    // question.title = title
    // question.content = content

    // await question.save()

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getHotQuestions() {
  try {
    // connectToDatabase()

    // const hotQuestions = await Question.find({})
    //   .sort({
    //     views: -1,
    //     upvotes: -1,
    //   })
    //   .limit(5)

    const hotQuestions = await prisma.question.findMany({
      orderBy: [{ upvoters: { _count: 'desc' } }, { views: 'desc' }],
      take: 5,
    })
    return hotQuestions
  } catch (error) {
    console.log(error)
    throw error
  }
}

// export async function getRecommendedQuestions(params: RecommendedParams) {
//   try {
//     await connectToDatabase()

//     const { userId, page = 1, pageSize = 10, searchQuery } = params

//     const user = await User.findOne({ userId })

//     if (!user) return
//     const skipAmount = (page - 1) * pageSize

//     const userInteractions = await Interaction.find({ user: user.id })
//       .populate('tags')
//       .exec()

//     const userTags = userInteractions.reduce((tags, interaction) => {
//       if (interaction.tags) {
//         tags = tags.concat(interaction.tags)
//       }
//       return tags
//     }, [])

//     const distinctUserTagIds = [...new Set(userTags.map((tag: any) => tag.id))]

//     const query: FilterQuery<typeof Question> = {
//       $and: [
//         { tags: { $in: distinctUserTagIds } },
//         { author: { $ne: user.id } },
//       ],
//     }
//     if (searchQuery) {
//       query.$or = [
//         { title: { $regex: searchQuery, $options: 'i' } },
//         { content: { $regex: searchQuery, $options: 'i' } },
//       ]
//     }

//     const totalQuestions = await Question.countDocuments(query)

//     const recommendedQuestions = await Question.find(query)
//       .populate({
//         path: 'tags',
//         model: Tag,
//       })
//       .populate({
//         path: 'author',
//         model: User,
//       })
//       .skip(skipAmount)
//       .limit(pageSize)

//     const isNext = totalQuestions > skipAmount + recommendedQuestions.length

//     return { questions: recommendedQuestions, isNext }
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }
