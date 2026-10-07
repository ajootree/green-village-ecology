// Original recorded scores, downloaded only when the player enables music.
const tracks={village:{file:'village',title:'초록마을 산책'},light:{file:'ending-light',title:'우리의 다음 봄'},dark:{file:'ending-dark',title:'돌아오지 않는 봄'}};
const PREF='eco-village-music-volume-v1';
let volume=.35;
try{const v=localStorage.getItem(PREF);if(v!==null&&Number.isFinite(Number(v)))volume=Math.max(0,Math.min(1,Number(v)));}catch{}
let enabled=false,loading=false,scene='village',context,master,active,ticket=0;
const buffers=new Map(),listeners=new Set();
export const status=()=>({enabled,volume,loading,scene,title:tracks[scene].title});
function notify(){for(const cb of listeners)cb(status());}
export function subscribe(cb){listeners.add(cb);cb(status());return()=>listeners.delete(cb);}
function fadeOut(){if(!active)return;const old=active;active=null;const now=context.currentTime;old.gain.gain.cancelScheduledValues(now);old.gain.gain.setValueAtTime(old.gain.gain.value,now);old.gain.gain.linearRampToValueAtTime(0,now+.8);old.source.stop(now+.85);}
async function load(track){
  if(!buffers.has(track)){
    const task=fetch(new URL(`assets/music/${tracks[track].file}.mp3`,import.meta.url)).then(r=>{if(!r.ok)throw Error('music-load');return r.arrayBuffer();}).then(b=>context.decodeAudioData(b));
    buffers.set(track,task);task.catch(()=>buffers.delete(track));
    if(buffers.size>2){const oldest=[...buffers.keys()].find(k=>k!==track&&k!==active?.track);if(oldest)buffers.delete(oldest);}
  }
  return buffers.get(track);
}
async function play(){
  const request=++ticket,track=scene;
  if(!enabled||document.hidden||!context)return;
  if(active?.track===track)return;
  loading=true;notify();
  try{
    const buffer=await load(track);
    if(request!==ticket||!enabled||document.hidden)return;
    fadeOut();
    const source=context.createBufferSource(),gain=context.createGain();
    source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(master);
    gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(1,context.currentTime+1.2);
    source.onended=()=>{source.disconnect();gain.disconnect();};source.start();active={source,gain,track};
  }catch(error){if(request===ticket){enabled=false;fadeOut();throw error;}}
  finally{if(request===ticket){loading=false;notify();}}
}
export async function setEnabled(value){
  enabled=Boolean(value);notify();
  if(!enabled){ticket++;loading=false;fadeOut();notify();return;}
  try{
    // Unlock audio during the explicit tap, including on Safari/iPad.
    if(!context){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error('music-unsupported');context=new AC();master=context.createGain();master.gain.value=volume*.7;master.connect(context.destination);}
    await context.resume();await play();
  }catch(error){enabled=false;loading=false;notify();throw error;}
}
export function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));try{localStorage.setItem(PREF,String(volume));}catch{}if(master)master.gain.setTargetAtTime(volume*.7,context.currentTime,.08);notify();}
export function setScene(value){const next=value==='dark'||value==='mixed'?'dark':value==='light'?'light':'village';if(next===scene)return;scene=next;ticket++;loading=false;notify();if(enabled&&!document.hidden)play().catch(()=>{});}
document.addEventListener('visibilitychange',()=>{ticket++;loading=false;if(document.hidden){context?.suspend().catch(()=>{});}else if(enabled&&context){context.resume().then(()=>play()).catch(()=>{});}notify();});
