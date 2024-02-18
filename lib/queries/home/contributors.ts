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
  (): Promise<ContributorWithImage[] | null> => {
    const contributors = prisma.contributor.findMany({
      where: {
        storeId: process.env.STORE_ID,
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

type ProductWithImages = Product & { images: { url: string }[] | null }

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
