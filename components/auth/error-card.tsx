import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

import { CardWrapper } from '@/components/auth/card-wrapper'

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="مشکلی پیش آمده!"
      backButtonHref="/login"
      backButtonLabel="برگشت به صفحه ورود"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  )
}
