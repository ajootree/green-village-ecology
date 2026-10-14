import {endings,isValidChoices,resolveEnding} from './model.mjs';
export const freshState=()=>({schema:2,album:{},game:null,last:null,updatedAt:0});
export function cleanState(raw){
  const s=freshState();if(!raw||typeof raw!=='object')return s;
  for(const e of endings){const r=raw.album?.[e.id];if(r&&isValidChoices(r.choices)&&r.choices.every(Boolean)&&resolveEnding(r.choices,!!r.repair)===e.id)s.album[e.id]={choices:[...r.choices],repair:!!r.repair};}
  if(raw.last&&isValidChoices(raw.last.choices)&&raw.last.choices.every(Boolean))s.last={choices:[...raw.last.choices],repair:!!raw.last.repair};
  const g=raw.game;
  if(g&&Number.isInteger(g.stage)&&g.stage>=0&&g.stage<=4&&isValidChoices(g.choices)&&g.choices.slice(0,g.stage).every(Boolean)&&['explore','task','result','final'].includes(g.phase)&&(g.phase!=='result'||g.choices[g.stage])&&(g.stage!==4||g.choices.every(Boolean)))s.game={stage:g.stage,phase:g.phase,choices:[...g.choices],player:Array.isArray(g.player)?g.player.map(v=>Math.max(7,Math.min(93,Number(v)||50))).slice(0,2):[50,65]};
  s.updatedAt=Number(raw.updatedAt)||0;return s;
}
export function mergeAlbum(a,b){return {...cleanState(a).album,...cleanState(b).album};}
// E10 is an existing, persistent record, including for saves made before this limit.
export function canChooseRegret(state,choices){return !cleanState(state).album.E10&&(choices===undefined||resolveEnding(choices,true)==='E10');}
export function normalIdentity(school,nickname){
  const norm=v=>String(v).normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('ko');
  const s=norm(school),n=norm(nickname);if(s.length<2||s.length>60||n.length<2||n.length>16||/[\u0000-\u001f]/.test(s+n))throw new Error('학교는 2~60자, 닉네임은 2~16자로 입력해 주세요.');return [s,n];
}
export async function identityEmail(school,nickname){const pair=normalIdentity(school,nickname);const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(pair)));return 'v'+[...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')+'@green-village.invalid';}
