export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
      <div style={{ textAlign:'center', padding:48 }}>
        <div style={{ fontSize:80, fontWeight:800, color:'#d8ff72', lineHeight:1 }}>404</div>
        <h1 style={{ fontSize:24, fontWeight:600, margin:'16px 0 8px' }}>Page not found</h1>
        <p style={{ color:'#666', marginBottom:32 }}>This page doesn't exist or was moved.</p>
        <a href='/' style={{ background:'#d8ff72', color:'#0a0a0a', padding:'12px 28px', borderRadius:10, textDecoration:'none', fontWeight:700 }}>Back to Bizorvia →</a>
      </div>
    </div>
  );
}
