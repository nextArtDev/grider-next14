import { prisma } from '@/lib/prisma'
import {
  Billboard,
  Contributor,
  Image,
  Product,
  Review,
  User,
} from '@prisma/client'
import { cache } from 'react'
import { ReviewsWithUserAndImage } from './products'

export const getAllContributors = cache(
  async (): Promise<{
    writers: Contributor[]
    translators: Contributor[]
    editors: Contributor[]
    photographers: Contributor[]
    illustrators: Contributor[]
  } | null> => {
    const writersPromise = prisma.contributor.findMany({
      where: {
        storeId: process.env.STORE_ID,
        OR: [{ role: { has: 'Writer' } }],
      },
    })
    const translatorsPromise = prisma.contributor.findMany({
      where: {
        storeId: process.env.STORE_ID,
        OR: [{ role: { has: 'Translator' } }],
      },
    })
    const editorsPromise = prisma.contributor.findMany({
      where: {
        storeId: process.env.STORE_ID,
        OR: [{ role: { has: 'Editor' } }],
      },
    })
    const photographersPromise = prisma.contributor.findMany({
      where: {
        storeId: process.env.STORE_ID,
        OR: [{ role: { has: 'Photographer' } }],
      },
    })
    const illustratorsPromise = prisma.contributor.findMany({
      where: {
        storeId: process.env.STORE_ID,
        OR: [{ role: { has: 'Illustrator' } }],
      },
    })

    const [writers, translators, editors, photographers, illustrators] =
      await Promise.all([
        writersPromise,
        translatorsPromise,
        editorsPromise,
        photographersPromise,
        illustratorsPromise,
      ])
    return { writers, translators, editors, photographers, illustrators }
  }
)

export type ContributorWithImage = Contributor & {
  image: { url: string } | null
}

export const getAllContributorsWithoutRole = cache(
  ({
    page = 1,
    pageSize = 10,
    searchQuery,
    filter,
  }: // orderBy,
  {
    page?: number
    pageSize?: number
    searchQuery?: string
    filter?: string
    // orderBy?: OrderByType
  }): Promise<ContributorWithImage[] | null> => {
    const skipAmount = (page - 1) * pageSize
    const query: any = {} // This will be used to build the Prisma query

    if (searchQuery) {
      query.OR = [
        { name: { contains: searchQuery } },
        { bio: { contains: searchQuery } },
      ]
    }

    let orderByOptions: any = {}

    const contributors = prisma.contributor.findMany({
      where: {
        storeId: process.env.STORE_ID,
        AND: query,
      },
      include: {
        image: { select: { url: true } },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return contributors
  }
)

export type ProductWithImages = Product & { images: { url: string }[] | null }

export type ContributorFullStructure = ContributorWithImage & {
  writer: ProductWithImages[]
  Translator: ProductWithImages[]
  editor: ProductWithImages[]
  photographer: ProductWithImages[]
  illustrator: ProductWithImages[]
  Reviews: ReviewsWithUserAndImage[]
}
export const getContributorById = cache(
  ({ id }: { id: string }): Promise<ContributorFullStructure | null> => {
    const contributor = prisma.contributor.findFirst({
      where: {
        storeId: process.env.STORE_ID,
        id,
      },
      include: {
        image: { select: { url: true } },
        writer: { include: { images: { select: { url: true } } } },
        editor: { include: { images: { select: { url: true } } } },
        photographer: { include: { images: { select: { url: true } } } },
        Translator: { include: { images: { select: { url: true } } } },
        illustrator: { include: { images: { select: { url: true } } } },
        Reviews: {
          include: { User: { include: { image: { select: { url: true } } } } },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return contributor
  }
)
