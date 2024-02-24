'use server'

import { prisma } from '@/lib/prisma'
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from './shared.types'
import { revalidatePath } from 'next/cache'

export async function createAnswer(params: CreateAnswerParams) {
  try {
    const { content, author, question, path } = params

    const newAnswer = await prisma.answer.create({
      data: {
        content,
        authorId: author,
        questionId: question,
      },
    })
    // Add the answer to the question's answers array
    const questionObject = await prisma.question.update({
      where: { id: question },
      data: {
        answers: {
          connect: {
            id: newAnswer.id,
          },
        },
      },
      include: { tags: true },
    })
    if (!questionObject) throw Error('سوال حذف شده است.')
    await prisma.interaction.create({
      data: {
        answerId: newAnswer.id,
        userId: author,
        action: 'answer',
        questionId: question,
        tags: { connect: questionObject.tags.map((id) => id) },
      },
    })
    // console.log({ interact })
    await prisma.user.update({
      where: { id: author },
      data: { reputation: { increment: 10 } },
    })
    revalidatePath(path)
  } catch (error) {}
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    // connectToDatabase()

    const { questionId, sortBy, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize

    let sortOptions = {}

    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvoters: { _count: 'desc' } }
        break
      case 'lowestUpvotes':
        sortOptions = { upvoters: { _count: 'asc' } }
        break
      case 'recent':
        sortOptions = { created_at: 'desc' }
        break
      case 'old':
        sortOptions = { created_at: 'asc' }
        break

      default:
        break
    }

    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: {
        author: {
          // select: {
          //   id: true,
          //   name: true,
          //   phone: true,
          //   picture: true,
          // },
          include: { image: { select: { url: true } } },
        },
        upvoters: true,
        downvoters: true,
      },
      skip: skipAmount,
      take: pageSize,
      orderBy: sortOptions,
    })

    // const totalAnswers = await Answer.countDocuments({
    //   question: questionId,
    // })
    const totalAnswers = await prisma.answer.count({ where: { questionId } })

    const isNext = totalAnswers > skipAmount + answers.length

    return { answers, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    // connectToDatabase()

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}
    // if (hasupVoted) {
    //   updateQuery = { $pull: { upvotes: userId } }
    // } else if (hasdownVoted) {
    //   updateQuery = {
    //     $pull: { downvotes: userId },
    //     $push: { upvotes: userId },
    //   }
    // } else {
    //   updateQuery = {
    //     $addToSet: {
    //       upvotes: userId,
    //     },
    //   }
    // }
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
    // const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
    //   new: true,
    // })

    // if (!answer) {
    //   throw new Error('Answer not Found')
    // }
    // // Increment authors reputation
    // await User.findByIdAndUpdate(userId, {
    //   $inc: { reputation: hasupVoted ? -2 : 2 },
    // })
    // await User.findByIdAndUpdate(answer.author, {
    //   $inc: { reputation: hasupVoted ? -10 : 10 },
    // })
    // Update the question to reflect the vote changes
    const answer = await prisma.answer.update({
      where: { id: answerId },
      data: updateQuery,
      // data: { upvoters: { connect: { id: userId } } },
    })
    //   new: true,
    // })

    if (!answer) {
      throw new Error('Question not Found')
    }

    // Increment author's reputation based on the vote action
    await prisma.user.update({
      where: { id: answer.authorId },
      data: { reputation: { increment: hasupVoted ? -2 : 2 } },
    })

    // Increment voter's reputation
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

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

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

    const answer = await prisma.answer.update({
      where: { id: answerId },
      data: updateQuery,
      // data: { upvoters: { connect: { id: userId } } },
    })

    if (!answer) {
      throw new Error('Answer not Found')
    }

    await prisma.user.update({
      where: { id: answer.authorId },
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
export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    // connectToDatabase()

    const { answerId, path } = params
    console.log({ answerId, path })
    // const answer = await Answer.findById(answerId)
    // if (!answer) return

    // await Answer.deleteOne({ _id: answerId })
    // await Question.updateMany(
    //   { _id: answer.question },
    //   { $pull: { answers: answerId } }
    // )
    // await Interaction.deleteMany({ answer: answerId })

    const answer = await prisma.answer.findUnique({ where: { id: answerId } })
    if (!answer) return

    await prisma.answer.delete({ where: { id: answerId } })
    // await prisma.question.updateMany({where:{answers}})

    await prisma.interaction.deleteMany({ where: { answerId } })
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
