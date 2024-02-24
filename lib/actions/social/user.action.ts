'use server'

import { revalidatePath } from 'next/cache'

import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './shared.types'
import { BadgeCriteriaType } from '@/types/social'
import { assignBadges } from '@/lib/socialUtils'
import { prisma } from '@/lib/prisma'

export async function getUserByID(params: any) {
  try {
    // connectToDatabase()

    const { userId } = params

    // const user = await User.findOne({ userId })

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    return user
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    // connectToDatabase()

    const { page = 1, pageSize = 20, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize

    let sortOptions = {}

    switch (filter) {
      case 'new_users':
        sortOptions = { createdAt: 'desc' }
        break
      case 'old_users':
        sortOptions = { createdAt: 'asc' }
        break
      case 'top_contributors':
        sortOptions = { reputation: 'desc' }
        break
      // case 'recommended':
      //   break

      default:
        break
    }

    // const query: FilterQuery<typeof User> = {}
    const query: any = {}

    // if (searchQuery) {
    //   query.$or = [
    //     { title: { $regex: new RegExp(searchQuery, 'i') } },
    //     { username: { $regex: new RegExp(searchQuery, 'i') } },
    //   ]
    // }
    if (searchQuery) {
      query.OR = [
        { name: { contains: searchQuery } },
        { phone: { contains: searchQuery } },
      ]
    }
    // const users = await User.find(query)
    //   .skip(skipAmount)
    //   .limit(pageSize)
    //   .sort(sortOptions)

    const users = await prisma.user.findMany({
      where: query,
      include: { image: { select: { url: true } } },
      skip: skipAmount,
      take: pageSize,
      orderBy: sortOptions,
    })

    // const totalUsers = await Question.countDocuments(query)

    const totalUsers = await prisma.user.count({ where: query })

    const isNext = totalUsers > skipAmount + users.length

    return { users, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    const { userId, questionId, path } = params

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }
    const isQuestionSaved = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        saved: {
          where: { id: questionId },
        },
      },
    })

    if (isQuestionSaved?.saved.length) {
      await prisma.user.update({
        where: { id: userId },
        data: { saved: { disconnect: { id: questionId } } },
      })
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { saved: { connect: { id: questionId } } },
      })
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    const { userId, page = 1, pageSize = 10, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize
    const query: any = searchQuery ? { title: { contains: searchQuery } } : {}

    let orderByOptions: any = {}
    switch (filter) {
      case 'most_recent':
        orderByOptions = { created_at: 'desc' }
        break
      case 'oldest':
        orderByOptions = { created_at: 'asc' }
        break
      case 'most_voted':
        orderByOptions = { upvoters: { _count: 'desc' } }
        break
      case 'most_viewed':
        orderByOptions = { views: 'desc' }
        break
      case 'most_answered':
        orderByOptions = { answers: { _count: 'desc' } }
        break
      // case 'recommended':
      //   break;
      default:
        break
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        saved: {
          where: query,
          orderBy: orderByOptions,
          skip: skipAmount,
          take: pageSize + 1,
          include: {
            tags: { select: { id: true, name: true } },
            author: {
              // select: {
              //   id: true,
              //   // authorId: true,
              //   name: true,
              //   picture: true,
              // },
              include: { image: { select: { url: true } } },
            },
            upvoters: true,
            answers: true,
          },
        },
      },
    })

    if (!user) throw new Error('User not found')

    const isNext = user.saved.length > pageSize

    const savedQuestions = user.saved

    return { questions: savedQuestions, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    // connectToDatabase()

    const { userId } = params

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: { image: { select: { url: true } } },
    })

    if (!user) return
    const totalQuestions = await prisma.question.count({
      where: {
        authorId: user.id,
      },
    })
    const totalAnswers = await prisma.answer.count({
      where: {
        authorId: user.id,
      },
    })
    const questionUpvotes = await prisma.question.count({
      where: {
        authorId: user.id,
        upvoters: {
          some: {},
        },
      },
    })
    const answerUpvotes = await prisma.answer.count({
      where: {
        authorId: user.id,
        upvoters: {
          some: {},
        },
      },
    })

    const questionViews = await prisma.question.aggregate({
      where: {
        authorId: user.id,
      },
      _sum: {
        views: true,
      },
    })

    const criteria = [
      {
        type: 'QUESTION_COUNT' as BadgeCriteriaType,
        count: totalQuestions,
      },
      {
        type: 'ANSWER_COUNT' as BadgeCriteriaType,
        count: totalAnswers,
      },
      {
        type: 'QUESTION_UPVOTES' as BadgeCriteriaType,
        count: questionUpvotes,
      },
      {
        type: 'ANSWER_UPVOTES' as BadgeCriteriaType,
        count: answerUpvotes,
      },
      {
        type: 'TOTAL_VIEWS' as BadgeCriteriaType,
        count: questionViews._sum.views || 0,
      },
    ]

    const badgeCounts = assignBadges({ criteria })

    return {
      user,
      totalAnswers,
      totalQuestions,
      badgeCounts,
      reputation: user.reputation,
    }
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    // connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize

    // const totalQuestions = await Question.countDocuments({
    //   author: userId,
    // })

    const totalQuestions = await prisma.question.count({
      where: {
        authorId: userId,
      },
    })

    // const userQuestions = await Question.find({
    //   author: userId,
    // })
    //   .sort({ createdAt: -1, views: -1, upvotes: -1 })
    //   .populate('tags', '_id name')
    //   .populate('author', '_id userId name picture')
    //   .skip(skipAmount)
    //   .limit(pageSize)

    const userQuestions = await prisma.question.findMany({
      where: { authorId: userId },
      include: {
        tags: {
          select: { id: true, name: true },
        },
        author: {
          // select: {
          //   id: true,
          //   name: true,
          //   picture: true,
          // },
          include: { image: { select: { url: true } } },
        },
        upvoters: true,
        answers: true,
      },
      skip: skipAmount,
      take: pageSize + 1,
      orderBy: [{ upvoters: { _count: 'desc' } }, { views: 'desc' }],
    })
    const isNext = totalQuestions > skipAmount + userQuestions.length

    return { questions: userQuestions, totalQuestions, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    // connectToDatabase()

    const { userId, page = 1, pageSize = 1 } = params
    const skipAmount = (page - 1) * pageSize

    // const totalAnswers = await Answer.countDocuments({
    //   author: userId,
    // })

    // const userAnswers = await Answer.find({
    //   author: userId,
    // })
    //   .skip(skipAmount)
    //   .limit(pageSize)
    //   .sort({ upvotes: -1 })
    //   .populate('question', '_id title')
    //   .populate('author', '_id userId name picture')
    const totalAnswers = await prisma.answer.count({
      where: {
        authorId: userId,
      },
    })
    const userAnswers = await prisma.answer.findMany({
      where: { authorId: userId },
      include: {
        author: {
          // select: {
          //   id: true,
          //   name: true,
          //   picture: true,
          // },
          include: { image: { select: { url: true } } },
        },
        upvoters: true,
        Question: true,
      },
      skip: skipAmount,
      take: pageSize + 1,
      orderBy: { upvoters: { _count: 'desc' } },
    })

    const isNext = totalAnswers > skipAmount + userAnswers.length
    // console.log(isNext) // true-false
    return { answers: userAnswers, totalAnswers, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    // connectToDatabase()

    const { userId, updateData, path } = params

    // await User.findOneAndUpdate({ userId }, updateData, {
    //   new: true,
    // })

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: updateData.name,
        portfolioWebsite: updateData.portfolioWebsite,
        location: updateData.location,
        bio: updateData.bio,
      },
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
