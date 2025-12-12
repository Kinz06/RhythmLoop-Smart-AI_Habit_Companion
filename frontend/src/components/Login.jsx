import React, {useState} from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/users/login',{ email, password })
      localStorage.setItem('token', res.data.access_token)
      nav('/')
    } catch (err) {
      alert(err?.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div style={{marginTop:12}}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}
