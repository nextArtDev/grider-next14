'use server'

import { prisma } from '@/lib/prisma'
import { SearchParams } from './shared.types'

const searchableTypes = ['question', 'user', 'answer', 'tag']
export async function globalSearch(params: SearchParams) {
  try {
    const { query, type } = params

    const regexQuery = { contains: query }

    let results = []

    const modelsAndTypes = [
      { model: prisma.question, searchField: 'title', type: 'question' },
      { model: prisma.user, searchField: 'name', type: 'user' },
      { model: prisma.answer, searchField: 'content', type: 'answer' },
      { model: prisma.tag, searchField: 'name', type: 'tag' },
    ]

    const typeLower = type?.toLowerCase()

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // Search across everything

      for (const { model, searchField, type } of modelsAndTypes) {
        //@ts-ignore
        const queryResults = await model.findMany({
          where: { [searchField]: regexQuery },
          take: 8,
        })

        results.push(
          ...queryResults.map((item: any) => ({
            title: type === 'answer' ? `جواب شامل ${query}` : item[searchField],
            type,

            id:
              type === 'user'
                ? item.id
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
      //@ts-ignore
      const queryResults = await modelInfo.model.findMany({
        where: { [modelInfo.searchField]: regexQuery },
        take: 8,
      })

      results = queryResults.map((item: any) => ({
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

const searchableHomeTypes = ['product', 'contributor', 'category']
export async function globalHomeSearch(params: SearchParams) {
  try {
    const { query, type } = params

    const regexQuery = { contains: query }

    let results = []

    const modelsAndTypes = [
      { model: prisma.product, searchField: 'title', type: 'product' },
      { model: prisma.product, searchField: 'subTitle', type: 'product' },
      // { model: prisma.product, searchField: 'description', type: 'product' },
      { model: prisma.contributor, searchField: 'name', type: 'contributor' },
      { model: prisma.category, searchField: 'name', type: 'category' },
    ]

    const typeLower = type?.toLowerCase()

    if (!typeLower || !searchableHomeTypes.includes(typeLower)) {
      // Search across everything

      for (const { model, searchField, type } of modelsAndTypes) {
        //@ts-ignore
        const queryResults = await model.findMany({
          where: { [searchField]: regexQuery },
          take: 8,
        })

        results.push(
          ...queryResults.map((item: any) => ({
            title:
              type === 'products' ? `کتاب شامل ${query}` : item[searchField],
            type,

            id:
              type === 'product'
                ? item.id
                : // : type === 'contributor'
                  // ? item.id
                  item.id,
          }))
        )
      }
    } else {
      // Search across specific model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type)

      if (!modelInfo) {
        throw new Error('invalid search type')
      }
      //@ts-ignore
      const queryResults = await modelInfo.model.findMany({
        where: { [modelInfo.searchField]: regexQuery },
        take: 8,
      })

      results = queryResults.map((item: any) => ({
        title:
          type === 'contributor'
            ? `نویسنده/مترجم شامل ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === 'contributor'
            ? item.id
            : // : type === 'answer'
              // ? item.questionId
              item.id,
      }))
    }
    // console.log(results)
    return JSON.stringify(results)
  } catch (error) {
    console.log(error)
    throw error
  }
}
