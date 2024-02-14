import { FC } from 'react'

interface pageProps {
  params: { productId: string }
}

const page: FC<pageProps> = async ({ params: { productId } }) => {
  return <div>page</div>
}

export default page
