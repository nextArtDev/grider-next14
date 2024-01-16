import { NewPasswordForm } from '@/components/auth/new-password-form'

const NewPasswordPage = ({ params }: { params: { phone: string } }) => {
  return <NewPasswordForm phone={params.phone} />
}

export default NewPasswordPage
