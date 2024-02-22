import LeftSideBar from '@/components/social/LeftSideBar'
import RightSideBar from '@/components/social/RightSideBar'
import Navbar from '@/components/social/navbar/Navbar'
import { currentUser } from '@/lib/auth'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Layout = async ({ children }: Props) => {
  const user = await currentUser()
  const userId = user?.id

  return (
    <main className="relative">
      <Navbar />
      <div className="flex">
        <LeftSideBar userId={userId} />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14 ">
          <div className="mx-auto w-full max-w-5xl ">{children}</div>
        </section>
        <RightSideBar />
      </div>
    </main>
  )
}

export default Layout
