'use client'
import { FC } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'

interface RouteSwitcherProps {
  routes: {
    href: string
    label: string
    active: boolean
  }[]
}

const RouteSwitcher: FC<RouteSwitcherProps> = ({ routes }) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? routes.find((route) => route.href === value)?.label
            : routes[0].label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="" />
          <CommandEmpty>پیدا نشد!</CommandEmpty>
          <CommandGroup>
            {routes.map((route) => (
              <CommandItem
                key={route.href}
                value={route.href}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === route.href ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    ' text-sm font-medium transition-colors hover:text-primary',
                    route.active
                      ? 'text-black underline underline-offset-8 dark:text-white'
                      : 'text-muted-foreground'
                  )}
                >
                  {route.label}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default RouteSwitcher
