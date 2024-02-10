import { getBillboardsWithCategories } from '@/lib/queries/home/billboard'
import MobileMenu from './MobileMenu'
import { DesktopNavigationMenu } from './NavigationMenu'
import { getAllContributors } from '@/lib/queries/home/contributors'
import { getAllContributions } from '@/lib/queries/dashboard/contributors'

type Props = {}

async function Navbar({}: Props) {
  const billboards = await getBillboardsWithCategories()
  const contributors = await getAllContributors()
  // console.log(contributors)
  return (
    <div className=" ">
      <MobileMenu billboards={billboards} />
      <DesktopNavigationMenu
        contributors={contributors}
        billboards={billboards}
      />
    </div>
  )
}

export default Navbar
