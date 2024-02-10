import { getBillboardsWithCategories } from '@/lib/queries/home/billboard'
import MobileMenu from './MobileMenu'
import { NavigationMenuDemo } from './NavigationMenu'

type Props = {}

async function Navbar({}: Props) {
  const billboards = await getBillboardsWithCategories()
  return (
    <div className=" ">
      <MobileMenu billboards={billboards} />
      {/* <NavigationMenuDemo /> */}
    </div>
  )
}

export default Navbar
