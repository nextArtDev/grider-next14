import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'

import { SettingsForm } from './components/SettingForm'
import { auth } from '@/auth'
import { getStoreById } from '@/lib/queries/dashboard/store'

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    redirect('/login')
  }

  const store = await getStoreById(params.storeId, userId)

  //   const store = await prisma.store.findFirst({
  //     where: {
  //       id: params.storeId,
  //       userId,
  //     },
  //   })

  //user can write whatever want, so redirect it back if its not a related store
  if (!store) {
    redirect('/dashboard')
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default SettingsPage
