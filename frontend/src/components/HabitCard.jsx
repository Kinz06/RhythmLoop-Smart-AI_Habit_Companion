import React from 'react'

export default function HabitCard({habit, onLog, streak}){
  return (
    <div className="card">
      <div className="habit-row">
        <div>
          <div style={{fontWeight:600}}>{habit.title}</div>
          <div className="small">Goal: {habit.goal || 1} per day</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <div className="small">Streak: {streak || 0}</div>
          <button onClick={() => onLog(habit._id)}>Log today</button>
        </div>
      </div>
    </div>
  )
}
