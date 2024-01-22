'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Modal } from '../modal'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      title="آیا مطمئن هستید؟"
      description="این عملیات برگشت پذیر نیست!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 gap-2 flex items-center justify-start w-full">
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          ادامه
        </Button>
        <Button disabled={loading} variant="outline" onClick={onClose}>
          انصراف
        </Button>
      </div>
    </Modal>
  )
}
