let audio;
export function shutter(){
  try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();const buffer=audio.createBuffer(1,Math.floor(audio.sampleRate*.12),audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/(audio.sampleRate*.018));for(const delay of [0,.09]){const s=audio.createBufferSource(),g=audio.createGain();s.buffer=buffer;g.gain.value=.17;s.connect(g);g.connect(audio.destination);s.start(audio.currentTime+delay);}}catch{}
}
let village;
export async function photo(index){
  village ||= new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=new URL('assets/village.webp',import.meta.url).href;});
  const image=await village,c=document.createElement('canvas');c.width=240;c.height=160;const ctx=c.getContext('2d');
  const crops=[[965,174],[1120,225],[1280,264]],at=crops[index];ctx.drawImage(image,at[0]/1672*image.width,at[1]/941*image.height,235/1672*image.width,155/941*image.height,0,0,240,160);
  ctx.fillStyle='#173d24b3';ctx.fillRect(0,134,240,26);ctx.fillStyle='#fff4d7';ctx.font='14px sans-serif';ctx.fillText('10월 · 관찰 '+(index+1),12,152);return c.toDataURL('image/webp',.8);
}
