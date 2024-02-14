import { prisma } from '@/lib/prisma'
import { Billboard, Contributor } from '@prisma/client'
import { cache } from 'react'

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
