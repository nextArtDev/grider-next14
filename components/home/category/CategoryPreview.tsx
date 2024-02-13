import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryPreviewProps {
  imageSrc?: string
  billboardName: string
  billboardId: string
  categoryName: string
  description?: string | null
}

export default function CategoryPreview({
  imageSrc,
  billboardName,
  billboardId,
  categoryName,
  description,
}: CategoryPreviewProps) {
  return (
    <div className="">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl">
        <div className="relative overflow-hidden rounded-lg lg:h-96">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover object-center"
            />
          )}

          <div aria-hidden="true" className="relative h-96 w-full lg:hidden" />
          <div aria-hidden="true" className="relative h-32 w-full lg:hidden" />
          <div className="absolute inset-x-0 bottom-0 rounded-bl-lg rounded-br-lg bg-secondary/20 bg-opacity-75 p-6 backdrop-blur backdrop-filter sm:flex sm:items-center sm:justify-between lg:inset-x-auto lg:inset-y-0 lg:w-96 lg:flex-col lg:items-start lg:rounded-bl-none lg:rounded-tr-lg">
            <div>
              <h2 className="text-xl font-bold ">{categoryName}</h2>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <Link
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'mt-6 px-4 py-3 text-base font-medium  hover:bg-opacity-10 sm:ml-8 sm:mt-0 lg:ml-0 lg:w-full'
              )}
              href={`/billboards/${billboardId}`}
              // className="mt-6 flex flex-shrink-0 items-center justify-center rounded-md border border-white border-opacity-25 bg-muted-foreground/40 text-muted  bg-opacity-0 px-4 py-3 text-base font-medium  hover:bg-opacity-10 sm:ml-8 sm:mt-0 lg:ml-0 lg:w-full"
            >
              دیدن {billboardName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
