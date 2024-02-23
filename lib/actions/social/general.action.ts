'use server'

import { prisma } from '@/lib/prisma'
import { SearchParams } from './shared.types'

const searchableTypes = ['question', 'user', 'answer', 'tag']
export async function globalSearch(params: SearchParams) {
  try {
    // await connectToDatabase()

    const { query, type } = params
    // const regexQuery = { $regex: query, $options: 'i' }

    const regexQuery = { contains: query }

    let results = []

    // const modelsAndTypes = [
    //   { model: Question, searchField: 'title', type: 'question' },
    //   { model: User, searchField: 'name', type: 'user' },
    //   { model: Answer, searchField: 'content', type: 'answer' },
    //   { model: Tag, searchField: 'name', type: 'tag' },
    // ]
    const modelsAndTypes = [
      { model: prisma.question, searchField: 'title', type: 'question' },
      { model: prisma.user, searchField: 'name', type: 'user' },
      { model: prisma.answer, searchField: 'content', type: 'answer' },
      { model: prisma.tag, searchField: 'name', type: 'tag' },
    ]

    const typeLower = type?.toLowerCase()

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // Search across everything

      //   for (const { model, searchField, type } of modelsAndTypes) {
      //     const queryResults = await model
      //       .find({ [searchField]: regexQuery })
      //       .limit(2)

      //     results.push(
      //       ...queryResults.map((item) => ({
      //         title:
      //           type === 'answer'
      //             ? `Answers contain ${query}`
      //             : item[searchField],
      //         type,
      //         id:
      //           type === 'user'
      //             ? item.userId
      //             : type === 'answer'
      //             ? item.question
      //             : item._id,
      //       }))
      //     )
      //   }
      // } else {
      //   // Search across specific model type
      //   const modelInfo = modelsAndTypes.find((item) => item.type === type)

      //   if (!modelInfo) {
      //     throw new Error('invalid search type')
      //   }
      //   const queryResults = await modelInfo.model
      //     .find({ [modelInfo.searchField]: regexQuery })
      //     .limit(8)

      //   results = queryResults.map((item) => ({
      //     title:
      //       type === 'answer'
      //         ? `Answers contain ${query}`
      //         : item[modelInfo.searchField],
      //     type,
      //     id:
      //       type === 'user'
      //         ? item.userId
      //         : type === 'answer'
      //         ? item.question
      //         : item._id,
      //   }))
      // }

      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model.findMany({
          where: { [searchField]: regexQuery },
          take: 2,
        })

        results.push(
          ...queryResults.map((item) => ({
            title: type === 'answer' ? `جواب شامل ${query}` : item[searchField],
            type,

            id:
              type === 'user'
                ? item.userId
                : type === 'answer'
                ? item.questionId
                : item.id,
          }))
        )
      }
    } else {
      // Search across specific model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type)

      if (!modelInfo) {
        throw new Error('invalid search type')
      }

      const queryResults = await modelInfo.model.findMany({
        where: { [modelInfo.searchField]: regexQuery },
        take: 8,
      })

      results = queryResults.map((item) => ({
        title:
          type === 'answer'
            ? `جواب شامل ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === 'user'
            ? item.userId
            : type === 'answer'
            ? item.questionId
            : item.id,
      }))
    }
    // console.log(results)
    return JSON.stringify(results)
  } catch (error) {
    console.log(error)
    throw error
  }
}
