'use client'

import { ContributorWithImage } from '@/lib/queries/home/contributors'
import { FC } from 'react'
import ContributorItem from './ContributorItem'

interface ContributorListProps {
  contributors: ContributorWithImage[]
}

const ContributorList: FC<ContributorListProps> = ({ contributors }) => {
  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 place-content-baseline">
      {contributors.map((contributor) => (
        <ContributorItem key={contributor.id} contributor={contributor} />
      ))}
    </div>
  )
}

export default ContributorList
