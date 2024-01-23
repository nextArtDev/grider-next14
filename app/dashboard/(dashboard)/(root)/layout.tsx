import { notFound, redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import Navbar from '@/components/dashboard/Navbar'
import { auth } from '@/auth'

import { ModalProvider } from '@/providers/modal-providers'

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    // redirect('/sign-in')
    return notFound()
  }

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  })
  // const store = getStoreById(params.storeId, userId)

  if (store) {
    redirect(`/dashboard/${store.id}`)
  }

  return (
    <>
      <ModalProvider />
      {children}
    </>
  )
}
