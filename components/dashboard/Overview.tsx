'use client'

import { formatter } from '@/lib/utils'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface OverviewProps {
  data: any[]
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          // fontSize={12}
          tickLine={false}
          axisLine={true}
        />
        <Tooltip />
        {/* <CartesianGrid stroke="#f5f5f5" /> */}
        <YAxis
          stroke="#888888"
          // fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${formatter.format(value)}`}
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
