import Footer from '@/components/home/Footer'
import Navbar from '@/components/home/navbar/Navbar'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}

      <Footer />
    </>
  )
}
