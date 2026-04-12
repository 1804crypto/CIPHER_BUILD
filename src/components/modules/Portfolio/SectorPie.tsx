import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'

interface Props {
  data?: { sector: string; pct: number }[]
}

const COLORS = ['#00d4aa', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899', '#14b8a6', '#f43f5e']

export const SectorPie: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="pct"
            nameKey="sector"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#111118', borderColor: '#1e1e2e', color: '#e2e2f0' }}
            itemStyle={{ color: '#00d4aa' }}
            formatter={(value: number) => [`${value}%`, 'Allocation']}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
