// import UserCard from '@/components/card/UserCard'
// import Pagination from '@/components/shared/Pagination'
// import Filter from '@/components/shared/search/Filter'
// import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
// import { UserFilters } from '@/constants'
// import { getAllUsers } from '@/lib/actions/user.action'
// import { SearchParamsProps } from '@/types'
import Link from 'next/link'
import Loading from './loading'
import SearchImage from '@/public/assets/icons/search.svg'
// import SearchImage from '../../public/assets/icons/search.svg'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
import Filter from '@/components/social/search/Filter'
import { UserFilters } from '@/lib/constants'
import UserCard from '@/components/social/card/UserCard'
import Pagination from '@/components/social/Pagination'
import { SearchParamsProps } from '@/types/social'
import { getAllUsers } from '@/lib/actions/social/user.action'

async function page({ searchParams }: SearchParamsProps) {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })
  // console.log(result)
  return (
    <div className="text-slate-200">
      <h1 className="font-bold text-gray-100"> همه کاربرها</h1>
      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/social/community"
          iconPosition="left"
          imgSrc={SearchImage}
          placeholder="جست و جوی کاربر"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {result.users.length ? (
          result.users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <div className="mx-auto max-w-4xl text-center">
            <p>کاربری یافت نشد</p>
            <Link href={'/sign-up'} className="mt-4 font-bold text-blue-300">
              عضو شوید تا اولین نفر باشید.
            </Link>
          </div>
        )}
      </section>{' '}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  )
}

export default page
