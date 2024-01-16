import { auth } from '@/auth'
import { LoginForm } from '@/components/auth/login-form'
import { redirect } from 'next/navigation'
import React from 'react'

async function LoginPage() {
  const session = await auth()
  if (session?.user.id) return redirect('/')

  return <LoginForm />
}

export default LoginPage
