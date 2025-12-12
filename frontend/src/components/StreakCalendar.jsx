import React from 'react'
import { subDays, format } from 'date-fns'

function intensityColor(count){
  if(count <= 0) return '#ebedf0'    // empty
  if(count === 1) return '#c6e48b'
  if(count === 2) return '#7bc96f'
  if(count >= 3) return '#196127'
  return '#ebedf0'
}

export default function StreakCalendar({countsByDate = {}, days = 30}){
  const cells = []
  const today = new Date()
  for(let i = days-1; i >= 0; i--){
    const dt = subDays(today, i)
    const key = format(dt, 'yyyy-MM-dd')
    const count = countsByDate[key] || 0
    cells.push({ key, date: dt, count })
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6}}>
      {cells.map(c => (
        <div key={c.key} title={`${c.key}: ${c.count}`} style={{
          width:22, height:22, borderRadius:4, background: intensityColor(c.count)
        }}/>
      ))}
    </div>
  )
}
