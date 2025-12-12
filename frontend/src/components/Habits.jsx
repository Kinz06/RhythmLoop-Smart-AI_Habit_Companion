import React, {useEffect, useState} from 'react'
import API from '../api'
import HabitCard from './HabitCard'

export default function Habits(){
  const [habits, setHabits] = useState([])
  const [title, setTitle] = useState('')
  const [streaks, setStreaks] = useState({})

  useEffect(()=>{ fetchAll() },[])

  async function fetchAll(){
    try {
      const r = await API.get('/habits/')
      setHabits(r.data)
      const s = await API.get('/analytics/streaks')
      setStreaks(s.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function create(){
    try {
      await API.post('/habits/', { title })
      setTitle('')
      fetchAll()
    } catch (err) {
      alert('Create failed')
    }
  }

  async function logToday(hid){
    try {
      await API.post(`/habits/${hid}/log`, {})
      fetchAll()
    } catch (err) {
      alert('Log failed')
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Create Habit</h3>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="Habit title" value={title} onChange={e=>setTitle(e.target.value)} />
          <button onClick={create}>Add</button>
        </div>
      </div>

      <h3>Your Habits</h3>
      {habits.map(h => <HabitCard key={h._id} habit={h} onLog={logToday} streak={(streaks[h._id] && streaks[h._id].current_streak) || 0} />)}
    </div>
  )
}
