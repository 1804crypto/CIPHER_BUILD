import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { SignalLayer } from '../../types'

interface Props {
  layers?: SignalLayer[]
}

export const SignalRadar: React.FC<Props> = ({ layers }) => {
  if (!layers || layers.length === 0) return null

  // Format data for Recharts
  const data = layers.map(layer => ({
    subject: layer.name,
    score: layer.score || 0,
    fullMark: 10,
    confidence: layer.confidence
  }))

  return (
    <div className="w-full flex w-full flex-col items-center">
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#2a2a3e" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e2f0', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar name="Signal Strength" dataKey="score" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {layers.map(layer => {
          let confColor = 'text-cipher-dim'
          if (layer.confidence === 'HIGH') confColor = 'text-cipher-green'
          if (layer.confidence === 'MODERATE') confColor = 'text-cipher-amber'
          if (layer.confidence === 'LOW') confColor = 'text-cipher-red'
          
          return (
            <div key={layer.name} className="flex items-center gap-1 text-xs">
              <span className="text-cipher-dim">{layer.name}:</span>
              <span className={`font-semibold ${confColor}`}>
                {layer.score}/10 ({layer.confidence})
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
