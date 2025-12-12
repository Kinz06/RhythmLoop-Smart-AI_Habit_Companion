import React from 'react'
export default function LoadingButton({loading, children, ...props}){
  return (
    <button {...props} disabled={loading} style={{position:'relative', padding: '8px 12px', display:'inline-flex', alignItems:'center', gap:8}}>
      {loading && <span className="spinner" style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.6)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite'}}/>}
      <span>{children}</span>
    </button>
  )
}
