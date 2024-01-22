'use client'

import { onOpen } from '@/redux/slices/modalSlice'

import { useAppSelector } from '@/redux/store'
import { AppDispatch } from '@/redux/store'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { isOpen } = useAppSelector((state) => state.modalReducer)

  useEffect(() => {
    if (!isOpen) dispatch(onOpen())
  }, [dispatch, isOpen])
  return null
}
