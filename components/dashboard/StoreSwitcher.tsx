'use client'

import * as React from 'react'
import {
  LuCheck,
  LuChevronsUpDown,
  LuPlusCircle,
  LuStore,
} from 'react-icons/lu'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
// import { useStoreModal } from '@/hooks/use-store-modal'
import { useParams, useRouter } from 'next/navigation'
import { AppDispatch } from '@/redux/store'
import { useDispatch } from 'react-redux'
import { onOpen } from '@/redux/slices/modalSlice'
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[]
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const dispatch = useDispatch<AppDispatch>()
  //   const storeModal = useStoreModal()
  const params = useParams()
  const router = useRouter()

  //To easily define them for Combobox
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))
  //which one is selected
  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  )

  const [open, setOpen] = React.useState(false)

  //instead of just selecting, it routes to our store, so we should pass our store id, as a value for routing
  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="یک فروشگاه را انتخاب کنید"
          className={cn('w-[200px] justify-between', className)}
        >
          <LuStore className="ml-2 h-4 w-4" />
          {currentStore?.label}
          <LuChevronsUpDown className="mr-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="جست‌وجوی فروشگاه..." />
            <CommandEmpty>فروشگاهی یاف نشد.</CommandEmpty>
            <CommandGroup heading="فروشگاه‌ها">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm md:text-xs"
                >
                  <LuStore className="ml-2 h-4 w-4" />
                  {store.label}
                  <LuCheck
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value === store.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="cursor-pointer"
                onSelect={() => {
                  setOpen(false)
                  //   storeModal.onOpen()
                  dispatch(onOpen())
                }}
              >
                <LuPlusCircle className="ml-2 h-5 w-5" />
                ایجاد فروشگاه
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
