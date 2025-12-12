import React, {useState} from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/users/signup',{ email, password })
      alert('Created! Please login.')
      nav('/login')
    } catch (err) {
      alert(err?.response?.data?.msg || 'Signup failed')
    }
  }

  return (
    <div className="card">
      <h3>Signup</h3>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div style={{marginTop:8}}><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:12}}><button type="submit">Create account</button></div>
      </form>
    </div>
  )
}
