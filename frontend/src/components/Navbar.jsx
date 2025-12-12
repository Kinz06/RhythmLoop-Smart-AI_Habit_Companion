import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const nav = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    nav('/login')
  }
  return (
    <header className="header card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:44,height:44,borderRadius:8,background:'#2b6ef6',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>SH</div>
        <div>
          <div style={{fontWeight:700}}>RhythmLoop</div>
          <div className="small" style={{marginTop:2}}>Build Habits with Intelligent Insights</div>
        </div>
      </div>

      <nav style={{display:'flex',gap:12,alignItems:'center'}}>
        <Link to="/">Dashboard</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/request-reset">Forgot Password</Link>
        <button onClick={handleLogout} style={{background:'#e53e3e'}}>Logout</button>
      </nav>
    </header>
  )
}
