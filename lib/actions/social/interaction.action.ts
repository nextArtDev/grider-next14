'use server'

import { prisma } from '@/lib/prisma'
import { ViewQuestionParams } from './shared.types'

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    const { questionId, userId } = params

    // Update view count for the question
    await prisma.question.update({
      where: { id: questionId },
      data: { views: { increment: 1 } },
    })

    // Check if user viewed question before
    if (userId) {
      const existingInteraction = await prisma.interaction.findFirst({
        where: {
          userId,
          action: 'view',
          questionId,
        },
      })
      if (existingInteraction) return

      // Creating interaction
      await prisma.interaction.create({
        data: {
          userId,
          action: 'view',
          questionId,
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
}
