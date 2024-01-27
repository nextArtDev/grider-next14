import { redirect } from 'next/navigation'

import { getStoreById } from '@/lib/queries/dashboard/store'
import { auth } from '@/auth'
import Navbar from '@/components/dashboard/Navbar'
import { ModalProvider } from '@/providers/modal-providers'
import {
  numericBoldFont,
  numericFont,
  numericRegularFont,
  primaryFont,
} from '@/lib/fonts'

// import Navbar from '@/components/navbar'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    redirect('/login')
  }

  const store = getStoreById(params.storeId, userId)

  if (!store) {
    redirect('/')
  }

  return (
    <section className={` ${numericRegularFont.className} adad  `}>
      <Navbar />
      <ModalProvider />
      {children}
    </section>
  )
}
