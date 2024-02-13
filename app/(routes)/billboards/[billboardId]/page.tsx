import { Tabs } from '@/components/shared/Tabs'
import { getCategoryByBillboardId } from '@/lib/queries/home/category'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: { billboardId: string }
}

const page: FC<pageProps> = async ({ params: { billboardId } }) => {
  const categories = await getCategoryByBillboardId({ billboardId })
  // console.log(categories)
  if (!categories) return notFound()

  const tabs = categories?.map((category, i) => ({
    title: category.name,
    value: category.id,
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700  to-violet-900">
        <Link href={`/categories/${category.id}`}>
          {category.image && (
            <Image
              src={category.image?.url || ''}
              alt={category.name}
              fill
              className="object-cover object-left-top h-[80%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto opacity-40 "
            />
          )}

          {category.name}
        </Link>
      </div>
    ),
  }))

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-[94%] md:w-[90%]  items-start justify-start my-10">
      <Tabs tabs={tabs} />
    </div>
  )
}

export default page
