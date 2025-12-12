import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Habits from './components/Habits'
import RequestReset from './components/RequestReset'
import ResetPassword from './components/ResetPassword'

export default function App(){
  return (
    <BrowserRouter>
      <div className="container">
        <nav className="header">
          <h2>RhythmLoop</h2>
          <div>
            <Link to="/" style={{marginRight:10}}>Dashboard</Link>
            <Link to="/habits" style={{marginRight:10}}>Habits</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/habits" element={<Habits/>}/>
          <Route path="/request-reset" element={<RequestReset/>} />
          <Route path="/reset" element={<ResetPassword/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
