import CardParallax from '@/components/home/card-parallax'
import { Button, buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { getAllCategories } from '@/lib/queries/home/category'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const categories = await getAllCategories()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CardParallax categories={categories} />
    </main>
  )
}
