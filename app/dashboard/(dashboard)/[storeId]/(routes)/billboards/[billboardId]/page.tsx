import { prisma } from '@/lib/prisma'
import { BillboardForm } from './components/billboard-form'

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string }
}) => {
  //if any 'billboardId' we'll gonna use that as initial data, if not just we route here to create a new billboard
  const billboard = await prisma.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}

export default BillboardPage
