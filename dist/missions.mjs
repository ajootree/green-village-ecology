import {shutter,photo} from './effects.mjs';
import {springLandscape,roadDebris,broomArt,traceArt,traceCloseups,surveySites} from './spring-art.mjs';
import {seasonalBoard} from './mission-scenes.mjs';
import {inspectionTargets,inspectionSites,inspectionLocations} from './mission-content.mjs';
import {cropDetail,netArt} from './mission-art.mjs';
// Each task rehearses the selected action; ecological consequences stay in the story.
const definitions = [
  {
    cut:{kind:'connect',title:'도로 설계판 맞추기',icon:'🛣️',goal:'출발지에서 축제장까지 도로 조각을 이어 주세요.',how:'조각을 누르면 돌아가요. 길이 끊기지 않게 연결해요.',theme:'road'},
    detour:{kind:'scrub',title:'기존 길 정비하기',icon:'🧹',goal:'원래 있던 흙길에 떨어진 가지와 낙엽, 흙더미를 치워 주세요.',how:'길 위의 물체를 누른 채 빗자루로 쓸어요. 네 번 눌러 치워도 돼요.',theme:'road'},
    corridor:{kind:'survey',title:'동물 통로 자리 찾기',icon:'🔎',goal:'발자국은 동물이 오가던 길의 단서예요. 새 도로가 생겨도 먹이 풀밭과 쉼터를 오갈 수 있도록 안전한 통로 자리를 찾아요.',how:'돋보기 손잡이를 잡고 움직여 세 곳의 흔적을 살펴요. 도로가 생겨도 동물이 건널 수 있도록 통로를 골라요.',theme:'tracks'},
    garden:{kind:'plant',title:'꽃밭 준비하기',icon:'🌷',goal:'흙밭 여섯 곳에 꽃씨를 심고 물을 주세요.',how:'심을 곳을 누르거나 씨앗을 끌어 심어요. 다 심으면 같은 곳에 두 번씩 물을 주세요.',theme:'flowers'}
  },
  {
    treat:{kind:'plumb',title:'처리 시설 배관 정비',icon:'🔧',goal:'새 배관 세 개를 빈 곳에 끼우고 물 밸브를 열어 주세요.',how:'아래 배관을 같은 모양의 빈 자리에 끌어 놓아요. 다 끼우면 밸브를 열어요.',theme:'water'},
    clean:{kind:'haul',title:'뜰채로 쓰레기 건지기',icon:'🪣',goal:'하천에 떠 있는 쓰레기 여섯 개를 수거통에 담아 주세요.',how:'쓰레기를 끌어 수거통에 놓아요. 쓰레기 → 수거통 순서로 눌러도 돼요.',theme:'river'},
    hide:{kind:'memory',title:'가림막 조명 점검',icon:'🏮',goal:'작업자가 알려 주는 순서대로 조명 스위치를 점검해 주세요.',how:'등이 켜지는 순서를 보고 똑같이 눌러요. 두 번 점검하면 끝나요.',theme:'lanterns'},
    share:{kind:'tune',title:'세 작업에 예산 나누기',icon:'🪙',goal:'동전 아홉 개를 시설·청소·꾸미기 주머니에 세 개씩 나누어 담아 주세요.',how:'동전을 잡고 주머니 안으로 끌어 놓아요. 각 주머니에 세 개씩 담아요.',theme:'partial'}
  },
  {
    care:{kind:'inspect',title:'작물 피해 구역 조사',icon:'🔎',goal:'돋보기로 잎을 살피고, 피해 입은 세 지점을 골라 제출해 주세요.',how:'돋보기 손잡이를 잡고 렌즈를 잎 위로 움직이면 상태가 보여요. 1~6번 중 피해 입은 곳 세 개를 골라 제출해요.',theme:'leaves'},
    spray:{kind:'spray',title:'밭에 농약 뿌리기',icon:'💨',goal:'밭지기은 정해진 양보다 많은 농약을 쓰기로 했어요. 분무기를 밭 위로 움직여 주세요.',how:'밭을 누른 채 쓸어 분무해요. 분무기를 움직여 열두 구역을 모두 적셔요.',theme:'coverage'},
    garden:{kind:'plant',title:'한 종류 꽃밭 준비',icon:'🌷',goal:'한 종류의 꽃씨를 여섯 칸에 심고 물을 주세요.',how:'씨앗을 끌어 밭을 지나가요. 다 심으면 물뿌리개로 바뀌어요.',theme:'flowers'},
    wait:{kind:'inspect',title:'작물 관찰 사진 남기기',icon:'📷',goal:'관리 대신 작물 세 곳의 사진을 남겨 주세요.',how:'관찰 구역에 카메라를 맞추고 「사진 찍기」를 눌러요. 실제 작물 풍경이 사진에 남아요.',theme:'photos'}
  },
  {
    reuse:{kind:'sort',title:'반납함과 분리배출 운영',icon:'♻️',goal:'물건을 알맞은 곳에 넣고 낮 조명을 꺼 주세요.',how:'물건을 끌어 반납함·종이함·플라스틱함에 넣어요. 물건 → 함 순서로 눌러도 돼요.',theme:'recycle'},
    once:{kind:'scrub',title:'행사 뒤 바닥 청소',icon:'🧹',goal:'광장 바닥에 남은 얼룩과 종이 조각을 치워 주세요.',how:'물체를 누른 채 빗자루로 쓸어요. 네 번 눌러 치워도 돼요.',theme:'plaza'},
    party:{kind:'stack',title:'컵 받아 쌓고 꼬마전구 끄기',icon:'💡',goal:'받침을 좌우로 움직여 종이컵 다섯 개를 받고, 낮에 켜진 꼬마전구를 꺼 주세요.',how:'화면 아래 받침을 좌우로 끌어 떨어지는 컵을 받아요. 다섯 개를 받으면 꼬마전구 화면으로 바뀌어요.',theme:'party'},
    burn:{kind:'ignite',title:'쓰레기 태우는 계획 실행',icon:'🔥',goal:'게임 속 도구를 문질러 마찰열을 높이고, 쓰레기를 태웠을 때 생기는 연기를 살펴보세요.',how:'손잡이를 누른 채 좌우로 문질러요. 이 장면은 게임 속 표현이에요. 실제 쓰레기에는 불을 붙이지 않아요.',theme:'cart'}
  }
];
const turnMask = mask => ((mask<<1)&15)|(mask>>3);
const targetPipe = [10,12,0,6,9,0,3,10,10];
export const missionInfo = (stage,id) => definitions[stage]?.[id];
export function connectedTiles(tiles){
  if(!(tiles[0]&8)) return [];
  const found=new Set([0]),queue=[0],directions=[[-3,1,4],[1,2,8],[3,4,1],[-1,8,2]];
  for(const at of queue) for(const [offset,exit,entry] of directions){
    const next=at+offset;
    if(next<0||next>8||(offset===1&&at%3===2)||(offset===-1&&at%3===0))continue;
    if((tiles[at]&exit)&&(tiles[next]&entry)&&!found.has(next)){found.add(next);queue.push(next);}
  }
  return [...found];
}
export function createMission(stage,id){
  const info=missionInfo(stage,id);if(!info)throw new Error('Unknown mission');
  const tiles=targetPipe.map((mask,i)=>{for(let n=0;n<[1,1,0,2,3,0,1,1,1][i];n++)mask=turnMask(mask);return mask;});
  return {stage,id,kind:info.kind,done:false,tiles,marks:Array(12).fill(0),water:Array(6).fill(0),focus:null,picked:null,round:0,index:0,showing:false,values:[0,0,0],heat:0,lights:[true,true,true],cups:0,seen:Array(6).fill(false),catcherX:50,photos:[],message:'',revision:0};
}
export function missionProgress(m){
  if(m.kind==='survey')return [m.marks.slice(0,3).filter(Boolean).length+(m.values[0]?1:0),4];
  if(m.kind==='plumb')return [m.marks.slice(0,3).filter(Boolean).length+(m.values[0]?1:0),4];
  if(m.kind==='stack')return [m.cups+m.lights.filter(v=>!v).length,8];
  if(m.kind==='ignite')return [m.heat,100];
  if(m.kind==='inspect')return [m.id==='care'?m.marks.slice(0,6).filter(Boolean).length:inspectionTargets(m).filter(i=>m.marks[i]).length,3];
  if(m.kind==='spray')return [m.marks.filter(v=>v>=3).length,12];
  if(m.kind==='connect')return [connectedTiles(m.tiles).length,7];
  if(m.kind==='memory')return [m.round,2];
  if(m.kind==='tune')return [m.values.reduce((a,b)=>a+b,0),9];
  if(m.kind==='plant')return [m.marks.slice(0,6).filter(Boolean).length+m.water.filter(v=>v>=2).length,12];
  if(m.kind==='sort')return [m.marks.slice(0,6).filter(Boolean).length+m.lights.filter(v=>!v).length,9];
  return [m.marks.slice(0,m.kind==='paint'?12:m.kind==='inspect'?3:6).filter(v=>v>=(m.kind==='scrub'?4:1)).length,m.kind==='paint'?12:m.kind==='inspect'?3:6];
}
const sequence = m => m.id==='party'?(m.round===0?[0,2,1]:[1,0,2,1]):(m.round===0?[1,0,2]:[2,1,0,2]);
const categories=['cup','paper','plastic','cup','paper','plastic'];
export function actMission(m,action,value,extra){
  if(m.done)return false;
  m.message='';let valid=false;
  if(action==='fit'&&m.kind==='plumb'&&Number.isInteger(value)&&value>=0&&value<3){if(value===extra&&!m.marks[value]){m.marks[value]=1;m.picked=null;valid=true;}else m.message='모양이 달라요. 비어 있는 자리와 배관의 꺾인 방향을 살펴보세요.';
  }else if(action==='valve'&&m.kind==='plumb'&&m.marks.slice(0,3).every(Boolean)){m.values[0]=1;valid=true;
  }else if(action==='cup'&&m.kind==='stack'&&m.cups<5){m.cups++;valid=true;
  }else if(action==='switch'&&m.kind==='stack'&&m.cups===5&&Number.isInteger(value)&&value>=0&&value<3){m.lights[value]=false;valid=true;
  }else if(action==='rub'&&m.kind==='ignite'&&Number.isFinite(value)&&value>0){m.heat=Math.min(100,m.heat+Math.min(8,value));valid=true;
  }else if(action==='spray'&&m.kind==='spray'&&Number.isInteger(value)&&value>=0&&value<12){m.marks[value]=Math.min(3,m.marks[value]+1);valid=true;
  }else if(action==='turn'&&m.kind==='connect'&&Number.isInteger(value)&&value>=0&&value<9&&m.tiles[value]){
    m.tiles[value]=turnMask(m.tiles[value]);valid=true;
    const linked=connectedTiles(m.tiles);m.done=linked.includes(8)&&Boolean(m.tiles[8]&2);
  }else if(action==='scrub'&&m.kind==='scrub'&&Number.isInteger(value)&&value>=0&&value<6){m.marks[value]=Math.min(4,m.marks[value]+1);valid=true;
  }else if(action==='plant'&&m.kind==='plant'&&Number.isInteger(value)&&value>=0&&value<6){
    if(m.marks.slice(0,6).every(Boolean))m.water[value]=Math.min(2,m.water[value]+1);else m.marks[value]=1;m.activePlot=value;valid=true;
  }else if(action==='paint'&&m.kind==='paint'&&Number.isInteger(value)&&value>=0&&value<12){m.marks[value]=1;valid=true;
  }else if(action==='observe'&&['survey','inspect'].includes(m.kind)&&Number.isInteger(value)&&value>=0&&value<(m.kind==='survey'?3:inspectionSites(m).length)){m.focus=value;m.seen[value]=true;if(m.kind==='survey')m.marks[value]=1;valid=true;
  }else if(action==='record'&&m.kind==='survey'){
    if(Number.isInteger(value)&&value>=0&&value<3&&m.focus===value&&!m.marks[value]){m.marks[value]=1;valid=true;}else m.message='먼저 조사 지점을 눌러 흔적을 자세히 살펴보세요.';
  }else if(action==='route'&&m.kind==='survey'&&Number.isInteger(value)&&value>=0&&value<3){
    if(!m.marks.slice(0,3).every(Boolean))m.message='세 지점을 모두 관찰하고 기록한 뒤 통로 위치를 골라요.';
    else if(value===1){m.values[0]=1;valid=true;}
    else m.message=value===0?'A의 신발 자국은 사람들이 길을 따라 걸은 흔적이에요. 길 양쪽 풀숲을 잇는 흔적을 찾아요.':'C의 줄무늬는 바퀴가 길을 따라 지나간 흔적이에요. 길 양쪽에 같은 발자국이 있는 곳을 찾아요.';
  }else if(action==='select'&&m.kind==='inspect'&&m.id==='care'&&Number.isInteger(value)&&value>=0&&value<6){
    if(!m.seen[value])m.message='먼저 돋보기로 이 잎을 살펴보세요.';
    else if(m.marks[value]){m.marks[value]=0;valid=true;}
    else if(m.marks.slice(0,6).filter(Boolean).length<3){m.marks[value]=1;valid=true;}
    else m.message='세 곳을 골랐어요. 바꾸려면 선택한 번호를 다시 눌러요.';
  }else if(action==='submit'&&m.kind==='inspect'&&m.id==='care'){
    const selected=m.marks.slice(0,6).flatMap((v,i)=>v?[i]:[]);
    if(selected.length!==3)m.message='피해 입은 곳 세 개를 고른 뒤 제출해요.';
    else if(inspectionTargets(m).every(i=>selected.includes(i))){m.done=true;valid=true;}
    else m.message='피해가 없는 잎도 섞여 있어요. 잎의 구멍과 뜯긴 자리를 다시 살펴보세요.';
  }else if(action==='record'&&m.kind==='inspect'&&m.id==='wait'){
    if(Number.isInteger(value)&&m.focus===value&&inspectionTargets(m).includes(value)&&!m.marks[value]){m.marks[value]=1;valid=true;}
    else m.message=m.focus!==value?'먼저 기록할 지점을 확대 관찰해 주세요.':m.id==='wait'?'사진에 작물이 들어오도록 카메라를 옮겨 주세요.':value===2||value===5?'주변 생물이 있다는 이유만으로 피해 구역은 아니에요. 잎의 상태를 살펴봐요.':'잎의 표면과 가장자리가 온전해요. 실제 피해가 있는 곳을 기록해요.';
  }else if(action==='load'&&m.kind==='haul'&&Number.isInteger(value)&&value>=0&&value<6){m.marks[value]=1;m.picked=null;valid=true;
  }else if(action==='sort'&&m.kind==='sort'&&Number.isInteger(value)&&value>=0&&value<6){
    if(categories[value]===extra){m.marks[value]=1;m.picked=null;valid=true;}else m.message='이 물건은 다른 함에 넣어요. 함에 적힌 이름을 확인해 주세요.';
  }else if(action==='light'&&m.kind==='sort'&&m.marks.slice(0,6).every(Boolean)&&Number.isInteger(value)&&value>=0&&value<3){m.lights[value]=false;valid=true;
  }else if(action==='coin'&&m.kind==='tune'&&Number.isInteger(value)&&value>=0&&value<9&&Number.isInteger(extra)&&extra>=0&&extra<3&&!m.marks[value]){if(m.values[extra]<3){m.marks[value]=1;m.values[extra]++;m.picked=null;valid=true;}else m.message='이 주머니에는 세 개를 담았어요. 다른 주머니에 나누어 주세요.';
  }else if(action==='memory'&&m.kind==='memory'&&!m.showing&&Number.isInteger(value)&&value>=0&&value<3){
    valid=true;
    if(value===sequence(m)[m.index]){m.index++;if(m.index===sequence(m).length){m.round++;m.index=0;m.message=m.round===2?'점검을 마쳤어요.':'첫 점검을 마쳤어요. 다음 순서를 확인해요.';}}
    else{m.index=0;m.message='순서가 달랐어요. 처음부터 다시 눌러요. 「순서 보기」로 확인할 수 있어요.';}
  }
  if(valid){m.revision++;const [done,total]=missionProgress(m);if(m.kind!=='connect'&&!(m.kind==='inspect'&&m.id==='care'))m.done=done===total;}
  return valid;
}
function tilesHTML(m){
  const linked=connectedTiles(m.tiles);
  return `<div class="connection-station ${m.id==='cut'?'road-station':'water-station'}"><div class="pipe-end source">${m.id==='cut'?'<span aria-hidden="true">🚗</span><strong>출발지</strong>':'💧 작업장'}</div><div class="pipe-grid">${m.tiles.map((mask,i)=>`<button class="pipe-tile ${linked.includes(i)?'flowing':''} ${mask?'':'blocked'}" data-turn="${i}" ${mask?'':'disabled'} aria-label="${Math.floor(i/3)+1}행 ${i%3+1}열 ${m.id==='cut'?'도로':'배관'} 돌리기"><svg viewBox="0 0 100 100" aria-hidden="true">${mask?[1,2,4,8].map((bit,j)=>mask&bit?`<path d="M50 50L${[[50,0],[100,50],[50,100],[0,50]][j].join(' ')}"/>`:'').join('')+'<circle cx="50" cy="50" r="11"/>':'<text x="50" y="65" text-anchor="middle" font-size="45">🌿</text>'}</svg></button>`).join('')}</div><div class="pipe-end destination">${m.id==='cut'?'<span aria-hidden="true">🏮</span><strong>축제장</strong>':'처리 시설 ⚙️'}</div></div>`;
}
function boardHTML(m){
  if(m.kind==='survey'){
    const ready=m.marks.slice(0,3).every(Boolean);
    return `<div class="survey-work lens-survey"><div class="survey-scene" id="mission-field">${springLandscape()}<span class="habitat-label north">덤불 쉼터</span><span class="habitat-label south">먹이 풀밭</span>${surveySites.map(({label,x},i)=>`<button class="survey-pin ${m.marks[i]?'noted':''}" data-survey="${i}" style="left:${x}%;top:58%" aria-label="${label} 지점에 돋보기 대기">${label}</button>`).join('')}<div class="inspection-cursor trace-cursor" id="inspection-cursor" style="left:85%;top:37%"></div>${m.done?'<div class="animal-crossing"><span>동물 통로</span></div>':''}</div><div class="survey-observation"><p id="focus-name">돋보기를 흙길 위로 옮겨 흔적을 찾아요.</p></div><div class="survey-decision"><span id="survey-progress">${ready?'새 도로를 안전하게 건널 통로 자리를 골라요.':'살펴본 곳 '+m.marks.slice(0,3).filter(Boolean).length+'/3'}</span><div>${surveySites.map(({label},i)=>`<button data-route="${i}" ${ready?'':'disabled'} aria-label="${label} 지점에 동물 통로 만들기">${label}에 통로 만들기</button>`).join('')}</div></div></div>`;
  }
  if(m.stage===0&&m.id==='detour')return `<div class="mission-field spring-road-work" id="mission-field">${springLandscape()}${[[13,50],[29,54],[43,55],[58,61],[73,62],[87,66]].map(([x,y],i)=>`<button class="road-debris debris-${i} ${m.marks[i]>=4?'removed':''}" data-brush="${i}" style="left:${x}%;top:${y}%;--swept:${m.marks[i]}" aria-label="${['나뭇가지','낙엽','흙더미'][i%3]} ${Math.floor(i/3)+1} 쓸기">${roadDebris[i]}</button>`).join('')}<div class="brush-cursor spring-broom" id="brush-cursor">${broomArt}</div><span class="road-scene-caption">마을에서 축제장으로 이어지는 기존 흙길</span></div>`;
  if(m.kind==='connect')return tilesHTML(m);
  return seasonalBoard(m);
}
export function mountMission(host,m,onChange){
  const info=missionInfo(m.stage,m.id);let disposed=false,timers=[],drag=null,stroke=null,previewing=false,sprayTimer=null,cursorPoint=null,photographing=false,cupFrame=0,cupLast=0,cupNext=0,cupDrop=null,noticeTimer=null,lastNotice=null,lastMessage='',completionShown=false;
  host.innerHTML=`<div class="mission-device ${info.theme}"><div class="mission-device-top"><span>${info.icon} ${m.id==='wait'?'사진 남기기':'작업 도구'}</span>${m.id==='wait'?'<div class="photo-strip" aria-label="남긴 관찰 사진"></div>':''}<span id="mission-sequence-cue" role="status" aria-live="polite" hidden></span><strong id="mission-counter"></strong></div><div class="mission-play-area" id="mission-play-area">${boardHTML(m)}</div><div class="mission-feedback"><p id="mission-feedback"></p><button type="button" id="mission-notice-replay" aria-label="최근 작업 안내 다시 보기" disabled>🔔 알림</button></div><div class="mission-notice" id="mission-notice" role="status" aria-live="polite" aria-atomic="true" hidden><span class="mission-notice-icon" aria-hidden="true"></span><div><strong class="mission-notice-title"></strong><p class="mission-notice-text"></p></div></div></div>`;
  const $=s=>host.querySelector(s),$$=s=>[...host.querySelectorAll(s)],later=(fn,ms)=>{timers.push(setTimeout(()=>{if(!disposed)fn();},ms));};
  $('#mission-feedback').textContent=info.how;
  const roadStation=$('.road-station');
  const roadSize=()=>{const roadStation=$('.road-station'),roadGrid=$('.road-station .pipe-grid');if(!roadStation)return;const side=Math.max(60,Math.min(roadStation.clientHeight-12,roadStation.clientWidth-176));roadGrid.style.width=side+'px';roadGrid.style.height=side+'px';roadStation.style.setProperty('--road-side',side+'px');};
  const roadObserver=roadStation?new ResizeObserver(roadSize):null;roadObserver?.observe(host);roadSize();
  function updatePhotos(){const strip=$('.photo-strip');if(strip)strip.innerHTML=Array.from({length:3},(_,i)=>m.photos[i]?`<img src="${m.photos[i]}" alt="찍어 둔 작물 사진 ${i+1}">`:`<span aria-label="사진 ${i+1} 빈자리">${i+1}</span>`).join('');}
  updatePhotos();
  function notify(text,tone='hint'){
    if(disposed)return;
    clearTimeout(noticeTimer);lastNotice={text,tone};
    const notice=$('#mission-notice'),labels={hint:['💬','작업 안내'],error:['!','다시 살펴봐요'],next:['→','다음 작업'],complete:['✓','준비가 끝났어요']},[icon,title]=labels[tone];
    notice.dataset.tone=tone;notice.querySelector('.mission-notice-icon').textContent=icon;notice.querySelector('.mission-notice-title').textContent=title;notice.querySelector('.mission-notice-text').textContent=text;notice.hidden=false;
    $('#mission-notice-replay').disabled=false;
    noticeTimer=setTimeout(()=>{if(!disposed)notice.hidden=true;},Math.min(9000,Math.max(4200,1800+text.length*80)));
  }
  $('#mission-notice-replay').onclick=()=>{if(lastNotice)notify(lastNotice.text,lastNotice.tone);};
  const stepPrompt=()=>{
    if(m.done)return '';
    if(m.kind==='plumb'&&m.marks.slice(0,3).every(Boolean))return '배관을 모두 끼웠어요. 이제 물 밸브를 열어 주세요.';
    if(m.kind==='plant'&&m.marks.slice(0,6).every(Boolean))return '씨앗을 모두 심었어요. 이제 같은 곳에 두 번씩 물을 주세요.';
    if(m.kind==='sort'&&m.marks.slice(0,6).every(Boolean))return '물건을 모두 분류했어요. 이제 낮 조명 세 개를 꺼 주세요.';
    if(m.kind==='stack'&&m.cups===5)return '컵 다섯 개를 받았어요. 이제 낮에 켜진 꼬마전구를 꺼 주세요.';
    if(m.kind==='survey'&&m.marks.slice(0,3).every(Boolean))return '세 지점의 흔적을 살펴봤어요. 흔적을 비교해 동물이 길을 건너는 곳에 통로를 표시해 주세요.';
    return '';
  };
  let previousStep=stepPrompt();
  const feedback=()=>{
    const [done,total]=missionProgress(m);$('#mission-counter').textContent=`${done}/${total}`;
    const nextStep=stepPrompt();
    if(m.done&&!completionShown){completionShown=true;notify('작업을 모두 마쳤어요. 아래의 「작업 마치기」를 눌러 주세요.','complete');}
    else if(m.message&&m.message!==lastMessage)notify(m.message,m.message.includes('완료')?'next':'error');
    else if(nextStep&&nextStep!==previousStep)notify(nextStep,'next');
    lastMessage=m.message;previousStep=nextStep;
    host.classList.toggle('mission-complete',m.done);onChange(m.done);
    if(m.done)$$('.mission-play-area button,.mission-play-area input').forEach(b=>b.disabled=true);
  };
  function positionCursor(){const cursor=$('#brush-cursor'),field=$('#mission-field');if(cursor&&field&&cursorPoint){const r=field.getBoundingClientRect();cursor.style.left=cursorPoint[0]-r.left+'px';cursor.style.top=cursorPoint[1]-r.top+'px';cursor.style.right='auto';cursor.classList.toggle('active',!!stroke);}}
  const refresh=()=>{if(disposed)return;$('#mission-play-area').innerHTML=boardHTML(m);bind();updatePhotos();roadSize();if(m.kind==='inspect'&&m.id==='wait'&&m.focus!==null)focus(m.focus);positionCursor();feedback();};
  const act=(a,v,e)=>{lastMessage='';actMission(m,a,v,e);refresh();};
  function preview(){
    if(previewing||m.done)return;previewing=true;m.showing=true;m.index=0;
    const seq=sequence(m);$$('[data-lamp]').forEach(b=>b.disabled=true);$('#preview-sequence').disabled=true;
    notify(m.round?'첫 점검을 마쳤어요. 이번에는 다음 순서를 기억해요.':'등이 켜지는 순서를 기억해요. 다 보여 준 뒤 스위치를 누를 수 있어요.',m.round?'next':'hint');
    const cue=$('#mission-sequence-cue');cue.hidden=false;
    seq.forEach((v,i)=>{later(()=>{$(`[data-lamp="${v}"]`)?.classList.add('lit');cue.textContent=['주황','파랑','초록'][v]+' 등';},300+i*750);later(()=>{$(`[data-lamp="${v}"]`)?.classList.remove('lit');},850+i*750);});
    later(()=>{previewing=false;m.showing=false;cue.hidden=true;$$('[data-lamp]').forEach(b=>b.disabled=false);$('#preview-sequence').disabled=false;notify('이제 방금 본 순서대로 스위치를 눌러 주세요.','next');},400+seq.length*750);
  }
  function bind(){
    $$('[data-pipe]').forEach(b=>b.onclick=()=>{m.picked=Number(b.dataset.pipe);$$('[data-pipe]').forEach(el=>el.classList.toggle('carrying',el===b));notify('배관을 골랐어요. 같은 모양의 빈 자리를 눌러 주세요.');});
    $$('[data-fit]').forEach(b=>b.onclick=()=>{if(m.picked!==null)act('fit',m.picked,Number(b.dataset.fit));else notify('먼저 아래에서 끼울 배관을 골라 주세요.','error');});
    if($('#water-valve'))$('#water-valve').onclick=()=>act('valve');
    if($('#drop-cup'))$('#drop-cup').onclick=()=>act('cup');
    if($('#catching-tray'))$('#catching-tray').onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();moveCatcher(m.catcherX+(e.key==='ArrowLeft'?-8:8));}};
    if($('#friction-handle'))$('#friction-handle').onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();act('rub',8);}};
    $$('[data-crop-select]').forEach(b=>b.onclick=()=>act('select',Number(b.dataset.cropSelect)));
    if($('#submit-damage'))$('#submit-damage').onclick=()=>act('submit');
    $$('[data-switch]').forEach(b=>b.onclick=()=>act('switch',Number(b.dataset.switch)));
    $$('[data-watch]').forEach(b=>b.onclick=()=>act('watch',Number(b.dataset.watch)));
    $$('[data-turn]').forEach(b=>b.onclick=()=>act('turn',Number(b.dataset.turn)));
    $$('[data-lamp]').forEach(b=>b.onclick=()=>{const previous=m.round;lastMessage='';actMission(m,'memory',Number(b.dataset.lamp));refresh();if(m.round>previous&&!m.done)preview();});
    if($('#preview-sequence'))$('#preview-sequence').onclick=preview;
    $$('[data-light]').forEach(b=>b.onclick=()=>act('light',Number(b.dataset.light)));
    $$('[data-brush]').forEach(b=>b.onclick=e=>{if(e.detail===0)act(m.kind,Number(b.dataset.brush));});
    $$('[data-observe]').forEach(b=>b.onclick=e=>{if(e.detail===0||m.id==='wait')focus(Number(b.dataset.observe));});
    $$('[data-survey]').forEach(b=>b.onclick=e=>{if(e.detail===0)focusTrace(Number(b.dataset.survey));});
    $$('[data-route]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.route);act('route',i);if(!m.done)$(`[data-route="${i}"]`)?.focus();});
    if($('#record-observation'))$('#record-observation').disabled=m.focus===null||!!m.marks[m.focus];
    if($('#record-observation'))$('#record-observation').onclick=async()=>{const index=m.focus;if(photographing)return;if(m.id!=='wait'||!Number.isInteger(index)||index>=3){act('record',index);$(`[data-observe="${index}"]`)?.focus();return;}if(m.marks[index])return;photographing=true;shutter();$('#mission-field').classList.add('taking-photo');$('#record-observation').disabled=true;try{const src=await photo(index);if(disposed)return;m.photos[index]=src;later(()=>{photographing=false;act('record',index);$(`[data-observe="${index}"]`)?.focus();},220);}catch{photographing=false;if(!disposed){m.message='사진을 다시 찍어 주세요.';feedback();$('#record-observation').disabled=false;}}};
    $$('[data-carry]').forEach(b=>b.onclick=e=>{if(drag?.moved||(m.kind==='tune'&&e.detail!==0))return;m.picked=Number(b.dataset.carry);$$('[data-carry]').forEach(el=>el.classList.toggle('carrying',el===b));notify(m.kind==='tune'?'동전을 골랐어요. 나누어 담을 주머니를 눌러 주세요.':m.kind==='sort'?'물건을 골랐어요. 넣을 함을 눌러 주세요.':`집었어요. ${m.id==='burn'?'수거차':'수거통'}를 눌러 주세요.`);});
    $$('[data-target]').forEach(b=>b.onclick=e=>{if(m.kind==='tune'&&e.detail!==0)return;if(m.picked===null){m.message='먼저 옮길 물건을 골라 주세요.';feedback();return;}act(m.kind==='sort'?'sort':m.kind==='tune'?'coin':'load',m.picked,m.kind==='tune'?Number(b.dataset.target):b.dataset.target);});
  }
  function focus(i){
    const site=inspectionSites(m)[i];if(!site||photographing)return;
    if(m.id==='care')actMission(m,'observe',i);else m.focus=i;
    $('#focus-name').textContent=site.description;const cursor=$('#inspection-cursor'),locations=inspectionLocations(m);if(cursor){cursor.style.left=locations[i][0]+'%';cursor.style.top=locations[i][1]+'%';if(m.id==='care')cursor.innerHTML=cropDetail[i];}
    $$('[data-observe]').forEach(b=>{const selected=Number(b.dataset.observe)===i;b.classList.toggle('in-focus',selected);b.setAttribute('aria-pressed',String(selected));});
    $$('[data-crop-select]').forEach(b=>b.disabled=!m.seen[Number(b.dataset.cropSelect)]);
    const record=$('#record-observation');if(record)record.disabled=!!m.marks[i];
  }
  function focusTrace(i){const site=surveySites[i];if(!site)return;const fresh=!m.marks[i];actMission(m,'observe',i);$('#inspection-cursor').innerHTML=traceCloseups[i];$('#inspection-cursor').style.left=site.x+'%';$('#inspection-cursor').style.top='58%';$('#focus-name').textContent=site.description;$$('[data-survey]').forEach(b=>b.classList.toggle('noted',!!m.marks[Number(b.dataset.survey)]));if(m.marks.slice(0,3).every(Boolean)){$$('[data-route]').forEach(b=>b.disabled=false);$('#survey-progress').textContent='새 도로를 안전하게 건널 통로 자리를 골라요.';}else $('#survey-progress').textContent='살펴본 곳 '+m.marks.slice(0,3).filter(Boolean).length+'/3';if(fresh)feedback();}
  function moveLens(e){
    const field=$('#mission-field'),cursor=$('#inspection-cursor');if(!field||!cursor)return;
    const r=field.getBoundingClientRect(),camera=m.id==='wait';
    const x=Math.max(r.left+44,Math.min(r.right-44,e.clientX-(camera?0:38))),y=Math.max(r.top+44,Math.min(r.bottom-44,e.clientY-(camera?0:52)));
    const item=under(x,y,m.kind==='survey'?'[data-survey]':'[data-observe]');
    if(item){if(m.kind==='survey')focusTrace(Number(item.dataset.survey));else focus(Number(item.dataset.observe));}
    else if(!camera){m.focus=null;cursor.innerHTML='';$('#focus-name').textContent=m.kind==='survey'?'손잡이를 움직여 렌즈로 흔적을 살펴요.':'손잡이를 움직여 렌즈로 잎을 살펴요.';}
    cursor.style.left=(x-r.left)+'px';cursor.style.top=(y-r.top)+'px';
  }
  function moveCatcher(x){m.catcherX=Math.max(12,Math.min(88,x));const plate=$('#catching-tray');if(plate){plate.style.left=m.catcherX+'%';plate.setAttribute('aria-valuenow',Math.round(m.catcherX));}}
  function catcherPointer(e){const field=$('#cup-catch-field');if(!field)return;const r=field.getBoundingClientRect();moveCatcher((e.clientX-(stroke?.catchOffset||0)-r.left)/r.width*100);}
  function animateCups(time){if(disposed||m.done||m.cups>=5)return;const field=$('#cup-catch-field');if(!field)return;const dt=cupLast?Math.min(.06,(time-cupLast)/1000):0;cupLast=time;if(!cupDrop&&time>=cupNext){cupDrop={x:[24,74,42,83,57][m.cups],y:-12};}
    if(cupDrop){cupDrop.y+=dt*30;const cup=$('#falling-cup');if(cup){cup.hidden=false;cup.style.left=cupDrop.x+'%';cup.style.top=cupDrop.y+'%';}const landing=83-m.cups*5;if(cupDrop.y>=landing){const reach=Math.max(4,field.clientWidth?(($('#catching-tray')?.clientWidth||100)/2+14)/field.clientWidth*100:10);if(Math.abs(cupDrop.x-m.catcherX)<=reach){cupDrop=null;cupNext=time+600;act('cup');}else if(cupDrop.y>108){cupDrop=null;cupNext=time+500;notify('컵을 놓쳤어요. 다음 컵 아래로 받침을 옮겨 주세요.','hint');if(cup)cup.hidden=true;}}}
    if(m.cups<5)cupFrame=requestAnimationFrame(animateCups);
  }
  function under(x,y,selector){return $$(selector).find(b=>{if(b.disabled||getComputedStyle(b).visibility==='hidden')return false;const r=b.getBoundingClientRect();return r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;});}
  host.onpointerdown=e=>{
    if(m.done||photographing||e.button!==0)return;
    if(m.kind==='stack'&&m.cups<5&&e.target.closest('#catching-tray')){stroke={x:e.clientX,y:e.clientY,catchOffset:e.clientX-$('#catching-tray').getBoundingClientRect().left-$('#catching-tray').getBoundingClientRect().width/2};catcherPointer(e);host.setPointerCapture(e.pointerId);return;}
    if(m.kind==='ignite'&&e.target.closest('#friction-handle')){stroke={x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId);e.preventDefault();return;}
    const carry=e.target.closest('[data-carry],[data-pipe]'),brush=e.target.closest('[data-brush]');
    if(carry&&!m.marks[Number(carry.dataset.carry??carry.dataset.pipe)]){
      if(m.kind==='tune'){m.picked=null;carry.classList.remove('carrying');carry.classList.add('in-transit');}
      drag={id:Number(carry.dataset.carry??carry.dataset.pipe),pipe:carry.hasAttribute('data-pipe'),x:e.clientX,y:e.clientY,moved:false,ghost:document.createElement('div')};drag.ghost.className='mission-drag-ghost'+(m.kind==='haul'?' net-carry':m.kind==='tune'?' coin-carry':'');if(m.kind==='haul')drag.ghost.innerHTML=netArt;const graphic=carry.querySelector('svg');if(graphic){const copy=graphic.cloneNode(true);copy.classList.add('carried-art');drag.ghost.append(copy);}else drag.ghost.textContent=carry.querySelector('span')?.textContent||carry.textContent;host.append(drag.ghost);host.classList.add('dragging-cargo');drag.ghost.style.left=e.clientX-host.getBoundingClientRect().left+'px';drag.ghost.style.top=e.clientY-host.getBoundingClientRect().top+'px';host.setPointerCapture(e.pointerId);e.preventDefault();
    }else if(brush||(['scrub','spray'].includes(m.kind)&&e.target.closest('#mission-field'))){stroke={x:e.clientX,y:e.clientY,moved:false};cursorPoint=[e.clientX,e.clientY];if(brush)actMission(m,m.kind,Number(brush.dataset.brush));refresh();positionCursor();host.setPointerCapture(e.pointerId);if(m.kind==='spray'){clearInterval(sprayTimer);sprayTimer=setInterval(()=>{if(!stroke||m.done){clearInterval(sprayTimer);return;}const item=under(...cursorPoint,'[data-brush]');if(item){actMission(m,'spray',Number(item.dataset.brush));refresh();}},120);}}
    else if(['inspect','survey'].includes(m.kind)&&e.target.closest('#mission-field')){const cameraTarget=m.id==='wait'?e.target.closest('[data-observe]'):null;if(cameraTarget)focus(Number(cameraTarget.dataset.observe));else moveLens(e);stroke={x:e.clientX,y:e.clientY,moved:false};host.setPointerCapture(e.pointerId);}
  };
  host.onpointermove=e=>{
    if(m.done||disposed)return;
    if(drag){if(m.kind==='tune'){const target=under(e.clientX,e.clientY,'[data-target]');$$('[data-target]').forEach(b=>{b.classList.toggle('drop-ready',b===target&&m.values[Number(b.dataset.target)]<3);b.classList.toggle('drop-full',b===target&&m.values[Number(b.dataset.target)]===3);});}drag.moved ||= Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7;drag.ghost.style.left=e.clientX-host.getBoundingClientRect().left+'px';drag.ghost.style.top=e.clientY-host.getBoundingClientRect().top+'px';return;}
    if(m.kind==='ignite'&&stroke){const moved=Math.abs(e.clientX-stroke.x);if(moved>=5){act('rub',moved/4);stroke.x=e.clientX;const handle=$('#friction-handle');if(handle)handle.style.setProperty('--rub',Math.sin(e.clientX/15)*12+'px');}return;}
    if(m.kind==='stack'&&m.cups<5&&stroke){catcherPointer(e);return;}
    if(['inspect','survey'].includes(m.kind)&&stroke){moveLens(e);return;}
    if(!stroke)return;
    cursorPoint=[e.clientX,e.clientY];positionCursor();
    const distance=Math.hypot(e.clientX-stroke.x,e.clientY-stroke.y);if(distance<9)return;
    stroke.moved=true;stroke.x=e.clientX;stroke.y=e.clientY;
    const item=under(e.clientX,e.clientY,'[data-brush]');if(item){actMission(m,m.kind,Number(item.dataset.brush));refresh();}
    positionCursor();
  };
  host.onpointerup=e=>{
    host.classList.remove('dragging-cargo');
    if(drag){const captured=drag;drag=null;captured.ghost.remove();if(m.kind==='tune'){m.picked=null;const target=captured.moved?under(e.clientX,e.clientY,'[data-target]'):null;if(target)act('coin',captured.id,Number(target.dataset.target));else{refresh();notify('동전을 주머니 안으로 끌어 놓아 주세요.','hint');}return;}if(captured.pipe){const target=under(e.clientX,e.clientY,'[data-fit]');if(captured.moved&&target)act('fit',captured.id,Number(target.dataset.fit));else{m.picked=captured.id;refresh();$(`[data-pipe="${captured.id}"]`)?.classList.add('carrying');notify('배관을 골랐어요. 같은 모양의 빈 자리를 눌러 주세요.');}return;}if(captured.moved){const target=under(e.clientX,e.clientY,'[data-target]');if(target)act(m.kind==='sort'?'sort':m.kind==='tune'?'coin':'load',captured.id,m.kind==='tune'?Number(target.dataset.target):target.dataset.target);else{m.picked=captured.id;refresh();notify('놓을 곳까지 끌어 주세요. 물건을 고른 뒤 함을 눌러도 돼요.','error');}}else{m.picked=captured.id;refresh();$(`[data-carry="${captured.id}"]`)?.classList.add('carrying');notify('집었어요. 놓을 곳을 눌러 주세요.');}}
    stroke=null;clearInterval(sprayTimer);positionCursor();
  };
  host.onpointercancel=()=>{host.classList.remove('dragging-cargo');drag?.ghost.remove();drag=null;stroke=null;clearInterval(sprayTimer);if(m.kind==='tune'){m.picked=null;refresh();}positionCursor();};
  bind();feedback();if(m.kind==='stack'&&m.cups<5)cupFrame=requestAnimationFrame(animateCups);if(m.kind==='memory'&&!m.done)preview();
  return ()=>{disposed=true;roadObserver?.disconnect();cancelAnimationFrame(cupFrame);timers.forEach(clearTimeout);clearTimeout(noticeTimer);clearInterval(sprayTimer);m.showing=false;drag?.ghost.remove();host.classList.remove('dragging-cargo');host.onpointerdown=host.onpointermove=host.onpointerup=host.onpointercancel=null;};
}
