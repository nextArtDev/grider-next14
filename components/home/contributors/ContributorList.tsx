'use client'

import { ContributorWithImage } from '@/lib/queries/home/contributors'
import { FC } from 'react'
import ContributorItem from './ContributorItem'
import SearchIcon from '@/public/assets/icons/search.svg'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
interface ContributorListProps {
  contributors: ContributorWithImage[]
}

const ContributorList: FC<ContributorListProps> = ({ contributors }) => {
  return (
    <section>
      <div className="my-8 max-w-sm mx-auto">
        <LocalSearchbar
          route="/contributors"
          iconPosition="left"
          imgSrc={SearchIcon}
          placeholder="جست‌وجوی نام عوامل انتشار کتاب..."
          otherClasses="flex-1"
        />
      </div>
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 place-content-baseline">
        {contributors.map((contributor) => (
          <ContributorItem key={contributor.id} contributor={contributor} />
        ))}
      </div>
    </section>
  )
}

export default ContributorList
