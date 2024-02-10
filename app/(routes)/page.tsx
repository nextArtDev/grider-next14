import { Button, buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="py-8">
        <Link
          href={'/dashboard'}
          className={cn(buttonVariants({ variant: 'destructive' }))}
        >
          Dashboard
        </Link>
      </div>
      <ThemeToggle />
    </main>
  )
}
