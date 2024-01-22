import { prisma } from '@/lib/prisma'
import { format, formatDistance, getMonth } from 'date-fns-jalali'

interface GraphData {
  name: string
  total: number
}

export const getGraphRevenue = async (
  storeId: string
): Promise<GraphData[]> => {
  const paidOrders = await prisma.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  const monthlyRevenue: { [key: number]: number } = {}

  // Grouping the orders by month and summing the revenue
  for (const order of paidOrders) {
    const month = getMonth(order.createdAt) // 0 for Jan, 1 for Feb, ...
    // console.log(getMonth(order.createdAt))

    let revenueForOrder = 0

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber()
    }

    // Adding the revenue for this order to the respective month
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
  }

  // Converting the grouped data into the format expected by the graph
  const graphData: GraphData[] = [
    { name: 'فروردین', total: 0 },
    { name: 'اردیبهشت', total: 0 },
    { name: 'خرداد', total: 0 },
    { name: 'تیر', total: 0 },
    { name: 'مرداد', total: 0 },
    { name: 'شهریور', total: 0 },
    { name: 'مهر', total: 0 },
    { name: 'آبان', total: 0 },
    { name: 'آذر', total: 0 },
    { name: 'دی', total: 0 },
    { name: 'بهمن', total: 0 },
    { name: 'اسفند', total: 0 },
  ]

  // Filling in the revenue data
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
  }

  return graphData
}
