// frontend/src/pages/RequestReset.jsx
import React, {useState} from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function RequestReset(){
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/users/request-reset', { email })
      // demo: API returns reset_token — in production you would not show it.
      setToken(res.data.reset_token || null)
      alert('If email exists, reset instructions were sent (demo shows token).')
    } catch (err) {
      alert(err?.response?.data?.msg || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>Request password reset</h3>
      <form onSubmit={submit}>
        <input placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
        <div style={{marginTop:8}}>
          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
          <button type="button" onClick={()=>nav('/login')} style={{marginLeft:8}}>Back</button>
        </div>
      </form>

      {token && (
        <div style={{marginTop:12}}>
          <div className="small">Demo reset token (copy this to Reset page):</div>
          <textarea readOnly style={{width:'100%',height:80,marginTop:6}} value={token}/>
        </div>
      )}
    </div>
  )
}
