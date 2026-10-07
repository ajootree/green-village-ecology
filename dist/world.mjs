import {seasons, statusFor} from './model.mjs';

export const regions = [
  {name:'숲길',box:'60 50 720 600',color:'#577b42',icon:'🌳'},
  {name:'하천과 작업장',box:'570 130 540 620',color:'#417f83',icon:'💧'},
  {name:'농장',box:'870 55 730 530',color:'#98773e',icon:'🌾'},
  {name:'마을 축제장',box:'1010 370 590 500',color:'#8f6645',icon:'🏮'}
];
const valid = (a,i) => seasons[i].choices.some(c=>c.id===a?.[i]) ? a[i] : null;
// Each atlas panel is a painted version of the same village. SVG only positions
// and softly masks the paintings; roads, buildings and damage are raster art.
const paintings = [
  {file:'forest-local',version:3,frame:[75,55,680,540],rows:2,panels:{cut:0,detour:1,corridor:2,garden:3},area:[90,75,640,500],className:'change-road'},
  {file:'river-local',version:3,frame:[670,210,315,300],rows:3,panels:{baseline:0,treat:1,clean:2,hide:3,share:4,harm:5},area:[690,300,270,185],className:'change-river'},
  {file:'farm-local',version:3,frame:[880,100,670,390],rows:2,panels:{care:0,spray:1,garden:2,wait:3},area:[930,145,565,250],className:'change-farm'},
  {file:'festival-local',version:3,frame:[1080,390,520,420],rows:2,panels:{reuse:0,once:1,party:2,burn:3},area:[1120,470,475,300],className:'change-festival'}
];
export const paintedWorldAssets=paintings.map(p=>`assets/world/${p.file}-atlas-v${p.version||2}.webp`);
function paintedLayer(i,id,prefix,area=paintings[i].area){
  const p=paintings[i],panel=p.panels[id],column=panel%2,row=Math.floor(panel/2);
  const mask=`${prefix}-${i}-${id}`, [x,y,w,h]=area,[fx,fy,fw,fh]=p.frame||[0,0,1600,900];
  const detail=i===0&&id==='corridor'?'동물 통로':i===1&&id==='treat'?'처리 시설':i===3&&id==='reuse'?'컵 반납과 분리배출':id==='baseline'?'작업장에서 흘러드는 오염된 물':id==='harm'?'오염으로 피해를 입은 하천':seasons[i].choices.find(c=>c.id===id)?.name;
  return `<g class="painted-change ${p.className} ${id}" aria-label="${detail}"><defs><filter id="${mask}-soft" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="6"/></filter><mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40" fill="white" filter="url(#${mask}-soft)"/></mask></defs><g mask="url(#${mask})"><svg x="${fx}" y="${fy}" width="${fw}" height="${fh}" viewBox="${column*fw} ${row*fh} ${fw} ${fh}" overflow="hidden"><image href="${paintedWorldAssets[i]}" width="${fw*2}" height="${p.rows*fh}" preserveAspectRatio="none"/></svg></g></g>`;
}
export function worldChanges(choices){return seasons.map((s,i)=>valid(choices,i));}
export function worldSVG({choices=[null,null,null,null],chapter=null,stage=0,ending=false,repair=false,instance=''}={}){
  const a=worldChanges(choices),prefix=`painted-${chapter??'all'}-${ending?'ending':'play'}${instance?'-'+instance:''}`;
  const layers=a.map((id,i)=>{
    if(!id)return i===1&&(chapter===1||stage>=1)?paintedLayer(i,'baseline',prefix):'';
    const harm=i===1&&ending&&id!=='treat'?paintedLayer(i,'harm',prefix,[745,375,110,80]):'';
    return `<g data-world-change="${i}:${id}">${paintedLayer(i,id,prefix)}${harm}</g>`;
  }).join('');
  const pendingRepair=repair?'<desc class="late-repair">복원 작업을 시작했지만 네 계절 동안 생긴 도로와 피해는 아직 남아 있습니다.</desc>':'';
  return `<svg class="world-art" viewBox="${chapter===null?'0 0 1600 900':regions[chapter].box}" preserveAspectRatio="${chapter===null?'xMidYMid meet':'xMidYMid slice'}" role="img" aria-label="${chapter===null?'네 계절의 선택이 남은 초록마을 전체 지도':regions[chapter].name+'의 풍경'}"><image href="assets/village.webp" width="1600" height="900"/>${layers}${pendingRepair}</svg>`;
}
export function changeCaption(choices,i){return valid(choices,i)?statusFor(choices)[i]:'';}
