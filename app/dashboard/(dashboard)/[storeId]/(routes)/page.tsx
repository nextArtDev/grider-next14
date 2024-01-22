import { Heading } from '@/components/dashboard/Heading'
import { Overview } from '@/components/dashboard/Overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getGraphRevenue } from '@/lib/queries/dashboard/get-graph-revenue'
import { getSalesCount } from '@/lib/queries/dashboard/get-sales-count'
import { getStockCount } from '@/lib/queries/dashboard/get-stock-count'
import { getTotalRevenue } from '@/lib/queries/dashboard/get-total-revenue'
import { formatter } from '@/lib/utils'
import { LuCreditCard, LuDollarSign, LuPackage } from 'react-icons/lu'

interface DashboardPageProps {
  params: {
    storeId: string
  }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId)
  const graphRevenue = await getGraphRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId)
  const stockCount = await getStockCount(params.storeId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="دشبورد" description="وضعیت کلی فروشگاه شما" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-col text-center gap-y-2 sm:gap-x-2 sm:text-right sm:flex-row items-center justify-evenly space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل درآمد</CardTitle>
              <LuDollarSign className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-8 text-lg md:text-2xl font-bold text-center text-red-500 ">
                {formatter.format(totalRevenue)} تومان
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col text-center gap-y-2 sm:gap-x-2 sm:text-right sm:flex-row items-center justify-evenly space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">فروخته شده</CardTitle>
              <LuCreditCard className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-8 text-lg md:text-2xl font-bold text-center text-red-500 ">
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col text-center gap-y-2 sm:gap-x-2 sm:text-right sm:flex-row items-center justify-evenly space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                محصولات انبار
              </CardTitle>
              <LuPackage className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-8 text-lg md:text-2xl font-bold text-center text-red-500 ">
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>وضعیت</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
