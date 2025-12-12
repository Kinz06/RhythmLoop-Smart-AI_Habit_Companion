// frontend/src/pages/ResetPassword.jsx
import React, {useState} from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword(){
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/users/reset', { token, password })
      alert(res.data.msg || 'Password reset successful')
      nav('/login')
    } catch (err) {
      alert(err?.response?.data?.msg || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>Reset password</h3>
      <form onSubmit={submit}>
        <div>
          <textarea placeholder="Paste reset token here" value={token} onChange={e=>setToken(e.target.value)} style={{width:'100%',height:80}}/>
        </div>
        <div style={{marginTop:8}}>
          <input placeholder="New password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div style={{marginTop:12}}>
          <button type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</button>
        </div>
      </form>
    </div>
  )
}
