'use server'

import { prisma } from '@/lib/prisma'
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types'

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    // connectToDatabase()

    const { phone, limit = 3 } = params

    // const user = await User.findById(userId)
    const user = await prisma.user.findUnique({ where: { phone } })

    if (!user) throw new Error('User not found')

    // Find interactions for the user and group by tags...
    // Interaction

    return [
      { id: 1, name: 'سوال' },
      { id: 2, name: 'جواب' },
      { id: 3, name: 'تگ سوم' },
    ]
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    // connectToDatabase()

    const { searchQuery, filter, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize

    // const query: FilterQuery<typeof Tag> = {}
    const query: any = {}

    if (searchQuery) {
      query.OR = [{ name: { contains: searchQuery } }]
    }
    let sortOptions = {}

    switch (filter) {
      case 'popular':
        sortOptions = {
          questions: {
            _count: 'desc',
          },
        }
        break
      case 'recent':
        sortOptions = { created_at: 'desc' }
        break
      case 'name':
        sortOptions = { name: 'asc' }
        break
      case 'old':
        sortOptions = { created_at: 'asc' }
        break

      default:
        break
    }

    const tags = await prisma.tag.findMany({
      where: {
        ...query,
        AND: [
          {
            questions: {
              some: {}, // This ensures that the tags returned have at least one question connected
            },
          },
        ],
      },
      include: {
        questions: true,
      },
      skip: skipAmount,
      take: pageSize,
      orderBy: sortOptions,
    })

    // const totalTags = await Tag.countDocuments(query)
    const totalTags = await prisma.tag.count({ where: query })

    const isNext = totalTags > skipAmount + tags.length
    return { tags, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    // connectToDatabase()
    const { tagId, page = 1, pageSize = 10, filter, searchQuery } = params

    const skipAmount = (page - 1) * pageSize

    const tag = await prisma.tag.findFirst({
      where: { id: +tagId },
      include: {
        questions: {
          where: searchQuery ? { title: { contains: searchQuery } } : {},
          orderBy: { created_at: 'desc' },
          skip: skipAmount,
          take: pageSize + 1,
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
              //   authoredQuestions: true,
              //   name: true,
              // },
              include: { image: { select: { url: true } } },
            },
            upvoters: true,
            answers: true,
          },
        },
      },
    })

    if (!tag) return
    const isNext = tag.questions.length > pageSize

    const questions = tag.questions

    return { tagTitle: tag.name, questions, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getTopPopularTags() {
  try {
    // connectToDatabase()

    // const popularTags = await Tag.aggregate([
    //   { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
    //   { $sort: { numberOfQuestions: -1 } },
    //   { $limit: 5 },
    // ])
    // Get the top 5 popular tags based on the number of questions
    const populars = await prisma.tag.findMany({
      where: {
        questions: {
          some: {}, // This ensures that the tags returned have at least one question connected
        },
      },
      take: 5,
      include: { questions: true },
      orderBy: {
        questions: {
          _count: 'desc',
        },
      },

      // select: {
      //   name: true,
      //   questions: true,
      //   // {
      //   //   _count: true,
      //   // },
      // },
    })

    // Map the result to include the name and the number of questions
    const popularTags = populars.map((tag) => ({
      id: tag.id,
      name: tag.name,
      numberOfQuestions: tag.questions.length,
    }))

    return popularTags
  } catch (error) {
    console.log(error)

    throw error
  }
}
