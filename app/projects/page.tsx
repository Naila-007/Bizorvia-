'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Project = { id: string; name: string; framework: string; url: string; custom_domain?: string; status: string; last_deployed_at?: string; created_at: string; netlify_site_name: string; };
type TabType = 'overview' | 'deploy' | 'env' | 'domain' | 'logs';

const FW_ICONS: Record<string,string> = { html:'🌐', nextjs:'▲', react:'⚛️', vue:'💚', svelte:'🔥', astro:'🚀', nuxt:'💚', remix:'💿', static:'📄' };
const FW_NAMES: Record<string,string> = { html:'HTML/CSS/JS', nextjs:'Next.js', react:'React', vue:'Vue.js', svelte:'SvelteKit', astro:'Astro', nuxt:'Nuxt', remix:'Remix', static:'Static Site' };
const STATUS_COLORS: Record<string,string> = { created:'#555', deployed:'#d8ff72', error:'#ff4444', building:'#fb923c' };

function fmt(s?:string){ if(!s) return 'Never'; return new Date(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}); }

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects,setProjects] = useState<Project[]>([]);
  const [view,setView] = useState<'list'|'new'|'detail'>('list');
  const [selected,setSelected] = useState<Project|null>(null);
  const [tab,setTab] = useState<TabType>('overview');
  const [creating,setCreating] = useState(false);
  const [toast,setToast] = useState('');
  const [dataLoading,setDataLoading] = useState(true);
  const [newName,setNewName] = useState('');
  const [newFw,setNewFw] = useState('html');
  const [deploys,setDeploys] = useState<any[]>([]);
  const [deploying,setDeploying] = useState(false);
  const [deployFile,setDeployFile] = useState<File|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [envKey,setEnvKey] = useState('');
  const [envVal,setEnvVal] = useState('');
  const [envList,setEnvList] = useState<{key:string;value:string}[]>([]);
  const [savingEnv,setSavingEnv] = useState(false);
  const [domain,setDomain] = useState('');
  const [savingDomain,setSavingDomain] = useState(false);
  const [dnsInfo,setDnsInfo] = useState<any>(null);

  useEffect(()=>{ if(!loading&&!user) router.push('/login'); },[loading,user]);
  const notify=(m:string)=>{ setToast(m); setTimeout(()=>setToast(''),3500); };
  async function getToken(){ const {data:{session}}=await supabase.auth.getSession(); return session?.access_token||''; }

  async function loadProjects(){
    const t=await getToken();
    const res=await fetch('/api/projects',{headers:{Authorization:`Bearer ${t}`}});
    if(res.ok){const d=await res.json();setProjects(d.projects||[]);}
    setDataLoading(false);
  }
  useEffect(()=>{ if(user) loadProjects(); },[user]);

  async function createProject(e:React.FormEvent){
    e.preventDefault(); if(!newName.trim()) return;
    setCreating(true);
    const t=await getToken();
    const res=await fetch('/api/projects',{method:'POST',headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json'},body:JSON.stringify({name:newName,framework:newFw})});
    const data=await res.json();
    if(res.ok){notify('✓ Project created!');setNewName('');await loadProjects();setView('list');}
    else notify(`✗ ${data.error}`);
    setCreating(false);
  }

  async function openProject(p:Project){
    setSelected(p);setView('detail');setTab('overview');
    const t=await getToken();
    const res=await fetch(`/api/projects/${p.id}/deploy`,{headers:{Authorization:`Bearer ${t}`}});
    if(res.ok){const d=await res.json();setDeploys(d.deploys||[]);}
  }

  async function deployZip(){
    if(!deployFile||!selected) return;
    setDeploying(true);
    const t=await getToken();
    const fd=new FormData(); fd.append('file',deployFile);
    const res=await fetch(`/api/projects/${selected.id}/deploy`,{method:'POST',headers:{Authorization:`Bearer ${t}`},body:fd});
    const data=await res.json();
    if(res.ok){notify('✓ Deployed!');setDeployFile(null);await loadProjects();}
    else notify(`✗ ${data.error}`);
    setDeploying(false);
  }

  async function saveEnv(e:React.FormEvent){
    e.preventDefault(); if(!envKey||!envVal||!selected) return;
    setSavingEnv(true);
    const t=await getToken();
    const res=await fetch(`/api/projects/${selected.id}/env`,{method:'POST',headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json'},body:JSON.stringify({key:envKey.toUpperCase(),value:envVal})});
    if(res.ok){notify(`✓ ${envKey} saved`);setEnvKey('');setEnvVal('');setEnvList(l=>[...l,{key:envKey.toUpperCase(),value:'***'}]);}
    else{const d=await res.json();notify(`✗ ${d.error}`);}
    setSavingEnv(false);
  }

  async function saveDomain(e:React.FormEvent){
    e.preventDefault(); if(!domain||!selected) return;
    setSavingDomain(true);
    const t=await getToken();
    const res=await fetch(`/api/projects/${selected.id}/domain`,{method:'POST',headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json'},body:JSON.stringify({domain})});
    const data=await res.json();
    if(res.ok){notify('✓ Domain connected!');setDnsInfo(data.dnsInfo);}
    else notify(`✗ ${data.error}`);
    setSavingDomain(false);
  }

  async function deleteProject(p:Project){
    if(!confirm(`Delete "${p.name}"? This removes the live site.`)) return;
    const t=await getToken();
    await fetch(`/api/projects/${p.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}});
    notify('✓ Deleted');setView('list');await loadProjects();
  }

  const S={btn:{background:'#111',border:'1px solid #2a2a2a',color:'#888',padding:'7px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'},inp:{background:'#111',border:'1px solid #2a2a2a',borderRadius:'8px',padding:'11px 14px',color:'#fff',fontSize:'14px',outline:'none',width:'100%',boxSizing:'border-box' as const}};

  if(loading||dataLoading) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:'#555',fontFamily:'Inter,sans-serif'}}>Loading…</div></div>;

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'#fff',fontFamily:'Inter,sans-serif'}}>
      {toast&&<div style={{position:'fixed',top:20,right:20,background:'#1a2a1a',border:'1px solid #2a4a2a',color:'#d8ff72',padding:'12px 20px',borderRadius:10,zIndex:999,fontSize:14}}>{toast}</div>}

      <header style={{borderBottom:'1px solid #1a1a1a',padding:'14px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:'#0a0a0a',zIndex:10}}>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <a href='/' style={{fontWeight:700,fontSize:17,textDecoration:'none',color:'#fff'}}>Bizorvia</a>
          <span style={{color:'#333'}}>›</span>
          <span style={{color:'#888',fontSize:13}}>{view==='list'?'Projects':view==='new'?'New Project':selected?.name}</span>
        </div>
        <div style={{display:'flex',gap:10}}>
          {view!=='list'&&<button onClick={()=>setView('list')} style={S.btn}>← Back</button>}
          {view==='list'&&<button onClick={()=>setView('new')} style={{background:'#d8ff72',border:'none',color:'#0a0a0a',padding:'8px 20px',borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer'}}>+ New project</button>}
          {view==='detail'&&selected&&<button onClick={()=>deleteProject(selected)} style={{...S.btn,color:'#ff6b6b',borderColor:'#3a1a1a'}}>Delete</button>}
        </div>
      </header>

      {/* LIST */}
      {view==='list'&&(
        <div style={{maxWidth:920,margin:'0 auto',padding:'40px 28px'}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:4}}>⚡ Web Projects</h1>
          <p style={{color:'#666',fontSize:14,marginBottom:32}}>Deploy and manage websites — free SSL, CDN, custom domains.</p>

          <div style={{background:'linear-gradient(135deg,#0d180d,#111)',border:'1px solid #1e3a1e',borderRadius:14,padding:22,marginBottom:30,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[{l:'Sites',u:projects.length,m:3},{l:'Bandwidth',u:0,m:100,unit:'GB'},{l:'Functions',u:0,m:10000,unit:'calls'},{l:'Storage',u:0,m:1,unit:'GB'}].map(s=>(
              <div key={s.l}>
                <div style={{fontSize:11,color:'#666',marginBottom:6}}>{s.l}</div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                  <div style={{flex:1,background:'#1a1a1a',borderRadius:99,height:5,overflow:'hidden'}}><div style={{background:'#d8ff72',width:`${Math.min(100,(s.u/s.m)*100)}%`,height:'100%',borderRadius:99}}/></div>
                  <span style={{fontSize:10,color:'#555',whiteSpace:'nowrap'}}>{s.u}/{s.m}</span>
                </div>
                <div style={{fontSize:10,color:'#444'}}>{s.unit||''} free tier</div>
              </div>
            ))}
          </div>

          {projects.length===0?(
            <div style={{textAlign:'center',padding:'72px 0'}}>
              <div style={{fontSize:52,marginBottom:14}}>⚡</div>
              <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>Deploy your first project</h2>
              <p style={{color:'#666',marginBottom:24}}>Free hosting · HTTPS · CDN · Custom domain</p>
              <button onClick={()=>setView('new')} style={{background:'#d8ff72',border:'none',color:'#0a0a0a',padding:'12px 28px',borderRadius:10,fontWeight:800,fontSize:15,cursor:'pointer'}}>Create project →</button>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {projects.map(p=>(
                <div key={p.id} onClick={()=>openProject(p)} style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:13,padding:'18px 22px',cursor:'pointer',display:'flex',alignItems:'center',gap:18}}>
                  <span style={{fontSize:28}}>{FW_ICONS[p.framework]||'🌐'}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{p.name}</div>
                    <div style={{color:'#555',fontSize:12}}>{FW_NAMES[p.framework]} · {p.url?<a href={p.url} target='_blank' onClick={e=>e.stopPropagation()} style={{color:'#d8ff72',textDecoration:'none'}}>{p.netlify_site_name}.netlify.app ↗</a>:'Not deployed'}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{display:'inline-block',background:STATUS_COLORS[p.status]+'22',color:STATUS_COLORS[p.status],fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,marginBottom:3,textTransform:'uppercase'}}>{p.status}</div>
                    <div style={{color:'#444',fontSize:11}}>{fmt(p.last_deployed_at||p.created_at)}</div>
                  </div>
                  <span style={{color:'#333'}}>›</span>
                </div>
              ))}
              <button onClick={()=>setView('new')} style={{background:'transparent',border:'2px dashed #222',color:'#555',padding:18,borderRadius:13,cursor:'pointer',fontSize:13}}>+ New project</button>
            </div>
          )}
        </div>
      )}

      {/* NEW */}
      {view==='new'&&(
        <div style={{maxWidth:580,margin:'56px auto',padding:'0 28px'}}>
          <h1 style={{fontSize:26,fontWeight:800,marginBottom:6}}>New project</h1>
          <p style={{color:'#666',marginBottom:32,fontSize:14}}>Every project gets free HTTPS, global CDN, and a live URL in seconds.</p>
          <form onSubmit={createProject} style={{display:'flex',flexDirection:'column',gap:20}}>
            <label style={{display:'flex',flexDirection:'column',gap:6}}>
              <span style={{fontSize:11,color:'#888',textTransform:'uppercase',letterSpacing:1}}>Project name *</span>
              <input required value={newName} onChange={e=>setNewName(e.target.value)} placeholder='my-awesome-site' style={S.inp}/>
            </label>
            <div>
              <span style={{fontSize:11,color:'#888',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:10}}>Framework</span>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                {Object.entries(FW_NAMES).map(([k,v])=>(
                  <button type='button' key={k} onClick={()=>setNewFw(k)} style={{background:newFw===k?'#d8ff72':'#111',color:newFw===k?'#0a0a0a':'#888',border:`1px solid ${newFw===k?'#d8ff72':'#2a2a2a'}`,borderRadius:9,padding:'10px 6px',cursor:'pointer',fontSize:11,fontWeight:newFw===k?700:400,textAlign:'center'}}>
                    <div style={{fontSize:18,marginBottom:4}}>{FW_ICONS[k]}</div>{v}
                  </button>
                ))}
              </div>
            </div>
            <div style={{background:'#0d180d',border:'1px solid #1e3a1e',borderRadius:10,padding:16}}>
              {['Free HTTPS & SSL certificate','Global CDN (150+ PoPs)','Custom domain support','Serverless functions (10k/mo)','100GB bandwidth free','Instant rollbacks'].map(f=>(
                <div key={f} style={{fontSize:12,color:'#7a9a7a',marginBottom:5}}>✓ {f}</div>
              ))}
            </div>
            <button type='submit' disabled={creating} style={{background:'#d8ff72',border:'none',color:'#0a0a0a',padding:13,borderRadius:10,fontWeight:800,fontSize:15,cursor:'pointer'}}>
              {creating?'Creating project…':'Create project →'}
            </button>
          </form>
        </div>
      )}

      {/* DETAIL */}
      {view==='detail'&&selected&&(
        <div style={{maxWidth:880,margin:'0 auto',padding:'32px 28px'}}>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:26}}>
            <span style={{fontSize:34}}>{FW_ICONS[selected.framework]||'🌐'}</span>
            <div>
              <h1 style={{fontSize:22,fontWeight:800,marginBottom:3}}>{selected.name}</h1>
              {selected.url?<a href={selected.url} target='_blank' style={{color:'#d8ff72',fontSize:13,textDecoration:'none'}}>{selected.netlify_site_name}.netlify.app ↗</a>:<span style={{color:'#555',fontSize:13}}>Not yet deployed</span>}
            </div>
            <div style={{marginLeft:'auto',background:STATUS_COLORS[selected.status]+'22',color:STATUS_COLORS[selected.status],fontSize:11,fontWeight:700,padding:'5px 14px',borderRadius:20,textTransform:'uppercase'}}>{selected.status}</div>
          </div>

          <div style={{display:'flex',gap:2,borderBottom:'1px solid #1a1a1a',marginBottom:26}}>
            {(['overview','deploy','env','domain','logs'] as TabType[]).map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{background:'none',border:'none',color:tab===t?'#fff':'#555',borderBottom:tab===t?'2px solid #d8ff72':'2px solid transparent',padding:'9px 15px',cursor:'pointer',fontSize:13,fontWeight:tab===t?700:400,textTransform:'capitalize',marginBottom:-1}}>{t}</button>
            ))}
          </div>

          {tab==='overview'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {[
                {l:'Status',v:selected.status,c:STATUS_COLORS[selected.status]},
                {l:'Framework',v:FW_NAMES[selected.framework]},
                {l:'Last deployed',v:fmt(selected.last_deployed_at)},
                {l:'Created',v:fmt(selected.created_at)},
                {l:'Live URL',v:selected.url?.replace('https://',''),href:selected.url},
                {l:'Custom domain',v:selected.custom_domain||'None',href:selected.custom_domain?`https://${selected.custom_domain}`:undefined},
              ].map(item=>(
                <div key={item.l} style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:12,padding:18}}>
                  <div style={{color:'#555',fontSize:11,marginBottom:5}}>{item.l}</div>
                  {item.href?<a href={item.href} target='_blank' style={{color:item.c||'#d8ff72',fontWeight:600,fontSize:13,textDecoration:'none'}}>{item.v}</a>:<div style={{color:item.c||'#fff',fontWeight:600,fontSize:13}}>{item.v}</div>}
                </div>
              ))}
            </div>
          )}

          {tab==='deploy'&&(
            <div>
              <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:14,padding:22,marginBottom:18}}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:8}}>Deploy files</h3>
                <p style={{color:'#666',fontSize:12,marginBottom:14}}>Upload a ZIP of your built site. For Next.js: <code style={{color:'#d8ff72',background:'#1a1a1a',padding:'1px 6px',borderRadius:4}}>next export</code> → zip the <code style={{color:'#d8ff72',background:'#1a1a1a',padding:'1px 6px',borderRadius:4}}>out/</code> folder.</p>
                <div onClick={()=>fileRef.current?.click()} style={{border:'2px dashed #2a2a2a',borderRadius:10,padding:24,textAlign:'center',cursor:'pointer',marginBottom:12}}>
                  <div style={{fontSize:26,marginBottom:6}}>📦</div>
                  {deployFile?<div style={{color:'#d8ff72',fontWeight:600,fontSize:13}}>{deployFile.name}</div>:<div style={{color:'#666',fontSize:12}}>Drop ZIP or <span style={{color:'#d8ff72'}}>click to select</span> (max 20MB)</div>}
                </div>
                <input ref={fileRef} type='file' accept='.zip' style={{display:'none'}} onChange={e=>setDeployFile(e.target.files?.[0]||null)}/>
                <button onClick={deployZip} disabled={!deployFile||deploying} style={{background:deployFile?'#d8ff72':'#1a1a1a',color:deployFile?'#0a0a0a':'#555',border:'none',padding:'10px 22px',borderRadius:8,fontWeight:700,fontSize:13,cursor:deployFile?'pointer':'default'}}>
                  {deploying?'⚡ Deploying…':'🚀 Deploy now'}
                </button>
              </div>
              {deploys.length>0&&(
                <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:12,padding:18}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Deploy history</div>
                  {deploys.map((d:any,i:number)=>(
                    <div key={d.id} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:i<deploys.length-1?'1px solid #1a1a1a':'none',fontSize:12}}>
                      <div><span style={{color:d.state==='ready'?'#d8ff72':d.state==='error'?'#ff4444':'#fb923c',fontWeight:600,marginRight:10}}>{d.state==='ready'?'✓ Live':d.state==='error'?'✗ Failed':'⟳ '+d.state}</span><span style={{color:'#555'}}>#{d.id?.slice(0,8)}</span></div>
                      <span style={{color:'#444'}}>{d.created_at?new Date(d.created_at).toLocaleString():''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab==='env'&&(
            <div>
              <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:14,padding:22,marginBottom:18}}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:6}}>Environment variables</h3>
                <p style={{color:'#666',fontSize:12,marginBottom:18}}>Encrypted at rest. Available during build and in serverless functions.</p>
                <form onSubmit={saveEnv} style={{display:'flex',gap:8}}>
                  <input required value={envKey} onChange={e=>setEnvKey(e.target.value)} placeholder='API_KEY' style={{flex:'1',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:8,padding:'10px 12px',color:'#d8ff72',fontFamily:'monospace',fontSize:12,outline:'none'}}/>
                  <input required value={envVal} onChange={e=>setEnvVal(e.target.value)} placeholder='value' type='password' style={{flex:'2',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:12,outline:'none'}}/>
                  <button type='submit' disabled={savingEnv} style={{background:'#d8ff72',border:'none',color:'#0a0a0a',padding:'10px 16px',borderRadius:8,fontWeight:700,fontSize:12,cursor:'pointer'}}>+ Add</button>
                </form>
              </div>
              {envList.length>0&&(
                <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:12,padding:18}}>
                  {envList.map(v=>(
                    <div key={v.key} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #1a1a1a'}}>
                      <code style={{color:'#d8ff72',fontSize:12}}>{v.key}</code>
                      <code style={{color:'#555',fontSize:12}}>••••••••</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab==='domain'&&(
            <div>
              <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:14,padding:22,marginBottom:18}}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:6}}>Custom domain</h3>
                <p style={{color:'#666',fontSize:12,marginBottom:16}}>Free automatic HTTPS included. Point your domain's CNAME to your project.</p>
                <div style={{background:'#0d180d',border:'1px solid #1e3a1e',borderRadius:10,padding:14,marginBottom:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {['Free HTTPS / SSL','Global CDN','Wildcard subdomains','Instant propagation'].map(f=><div key={f} style={{fontSize:11,color:'#7a9a7a'}}>✓ {f}</div>)}
                </div>
                <form onSubmit={saveDomain} style={{display:'flex',gap:8}}>
                  <input required value={domain} onChange={e=>setDomain(e.target.value)} placeholder='yourdomain.com' style={{flex:1,background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none'}}/>
                  <button type='submit' disabled={savingDomain} style={{background:'#d8ff72',border:'none',color:'#0a0a0a',padding:'10px 20px',borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer'}}>{savingDomain?'…':'Connect →'}</button>
                </form>
              </div>
              {dnsInfo&&(
                <div style={{background:'#0d180d',border:'1px solid #1e3a1e',borderRadius:14,padding:22}}>
                  <div style={{fontWeight:700,marginBottom:14,color:'#d8ff72',fontSize:14}}>✓ Add this DNS record at your registrar:</div>
                  <div style={{background:'#111',borderRadius:10,padding:16,fontFamily:'monospace',fontSize:12,display:'grid',gridTemplateColumns:'70px 1fr',rowGap:8}}>
                    <span style={{color:'#555'}}>Type</span><span style={{color:'#fff'}}>CNAME</span>
                    <span style={{color:'#555'}}>Host</span><span style={{color:'#d8ff72'}}>{dnsInfo.host||domain}</span>
                    <span style={{color:'#555'}}>Value</span><span style={{color:'#d8ff72'}}>{dnsInfo.value}</span>
                    <span style={{color:'#555'}}>TTL</span><span style={{color:'#fff'}}>Auto / 3600</span>
                  </div>
                  <p style={{color:'#555',fontSize:11,marginTop:10}}>SSL activates within minutes of DNS propagation.</p>
                </div>
              )}
            </div>
          )}

          {tab==='logs'&&(
            <div style={{background:'#0d1117',border:'1px solid #1e2a1e',borderRadius:14,overflow:'hidden'}}>
              <div style={{background:'#111',borderBottom:'1px solid #1a1a1a',padding:'9px 16px',display:'flex',gap:7}}>
                <div style={{width:11,height:11,borderRadius:'50%',background:'#ff5f57'}}/><div style={{width:11,height:11,borderRadius:'50%',background:'#febc2e'}}/><div style={{width:11,height:11,borderRadius:'50%',background:'#28c840'}}/>
                <span style={{color:'#555',fontSize:11,marginLeft:8}}>build log</span>
              </div>
              <div style={{padding:22,fontFamily:'monospace',fontSize:12,lineHeight:1.9}}>
                {deploys.length===0?<span style={{color:'#555'}}>No deploys yet. Go to Deploy tab to push your first build.</span>
                :deploys.slice(0,1).map((d:any)=>(
                  <div key={d.id}>
                    <div style={{color:'#555'}}>[{new Date(d.created_at).toLocaleString()}] Deploy started</div>
                    <div style={{color:'#7ec87e'}}>→ Preparing build environment</div>
                    <div style={{color:'#7ec87e'}}>→ Installing dependencies</div>
                    <div style={{color:'#7ec87e'}}>→ Building site artifacts</div>
                    <div style={{color:'#7ec87e'}}>→ Uploading to global CDN (150+ PoPs)</div>
                    <div style={{color:'#7ec87e'}}>→ Provisioning SSL certificate</div>
                    <div style={{color:d.state==='ready'?'#d8ff72':'#ff4444',fontWeight:700}}>{d.state==='ready'?'✓ Deploy live — '+d.ssl_url:'✗ Deploy failed: '+d.error_message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
