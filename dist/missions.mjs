import {shutter,photo} from './effects.mjs';
// Each task rehearses the selected action; ecological consequences stay in the story.
const definitions = [
  {
    cut:{kind:'connect',title:'도로 설계판 맞추기',icon:'🛣️',goal:'출발지에서 축제장까지 도로 조각을 이어 주세요.',how:'조각을 누르면 돌아가요. 길이 끊기지 않게 연결해요.',theme:'road'},
    detour:{kind:'scrub',title:'기존 길 정비하기',icon:'🧹',goal:'원래 있던 길의 흙과 나뭇가지를 치워 주세요.',how:'솔을 누른 채 얼룩 위를 왕복해요. 여러 번 눌러도 돼요.',theme:'road'},
    corridor:{kind:'inspect',title:'동물 이동 흔적 조사',icon:'🔎',goal:'돋보기로 토끼 발자국 세 곳을 찾아 기록해 주세요.',how:'돋보기를 끌어 살피고, 발자국 위에서 「흔적 기록」을 눌러요.',theme:'tracks'},
    garden:{kind:'plant',title:'꽃밭 준비하기',icon:'🌷',goal:'고른 꽃의 씨앗을 여섯 칸에 심고 물을 주세요.',how:'씨앗을 누른 채 밭 위로 움직여요. 다 심으면 물뿌리개로 바뀌어요.',theme:'flowers'}
  },
  {
    treat:{kind:'plumb',title:'처리 시설 배관 정비',icon:'🔧',goal:'새 배관 세 개를 빈 곳에 끼우고 물 밸브를 열어 주세요.',how:'아래 배관을 같은 모양의 빈 자리에 끌어 놓아요. 다 끼우면 밸브를 열어요.',theme:'water'},
    clean:{kind:'haul',title:'뜰채로 쓰레기 건지기',icon:'🪣',goal:'하천에 떠 있는 쓰레기 여섯 개를 수거통에 담아 주세요.',how:'쓰레기를 끌어 수거통에 놓아요. 쓰레기 → 수거통 순서로 눌러도 돼요.',theme:'river'},
    hide:{kind:'memory',title:'가림막 조명 점검',icon:'🏮',goal:'작업자가 알려 주는 순서대로 조명 스위치를 점검해 주세요.',how:'등이 켜지는 순서를 보고 똑같이 눌러요. 두 번 점검하면 끝!',theme:'lanterns'},
    share:{kind:'tune',title:'세 작업의 부분 정비',icon:'🛠️',goal:'세 작업의 조절 손잡이를 표시된 홈에 맞춰 주세요.',how:'손잡이를 끌어 초록 표시 안에 놓아요. 시설·청소·꾸미기를 조금씩 준비해요.',theme:'partial'}
  },
  {
    care:{kind:'inspect',title:'벌레가 먹은 잎 찾기',icon:'🔎',goal:'벌레가 먹어서 구멍 난 잎 세 장을 찾아요. 벌과 거미, 멀쩡한 잎은 그대로 두어요.',how:'잎을 누르거나 돋보기를 끌어 살펴요. 구멍이 보이는 잎에서 「이 잎 기록하기」를 눌러요.',theme:'leaves'},
    spray:{kind:'spray',title:'밭에 농약 뿌리기',icon:'💨',goal:'도윤이 분무기를 들었어요. 밭 위로 움직이며 농약을 뿌려 주세요.',how:'밭을 누른 채 쓸어 분무해요. 분무기를 움직여 열두 구역을 모두 적셔요.',theme:'coverage'},
    garden:{kind:'plant',title:'한 종류 꽃밭 준비',icon:'🌷',goal:'한 종류의 꽃씨를 여섯 칸에 심고 물을 주세요.',how:'씨앗을 끌어 밭을 지나가요. 다 심으면 물뿌리개로 바뀌어요.',theme:'flowers'},
    wait:{kind:'inspect',title:'작물 관찰 사진 남기기',icon:'📷',goal:'관리 대신 작물 세 곳의 사진을 남겨 주세요.',how:'카메라를 끌어 작물에 맞춘 뒤 「사진 찍기」를 눌러요.',theme:'photos'}
  },
  {
    reuse:{kind:'sort',title:'반납함과 분리배출 운영',icon:'♻️',goal:'물건을 알맞은 곳에 넣고 낮 조명을 꺼 주세요.',how:'물건을 끌어 반납함·종이함·플라스틱함에 넣어요. 물건 → 함 순서로 눌러도 돼요.',theme:'recycle'},
    once:{kind:'scrub',title:'행사 뒤 바닥 청소',icon:'🧹',goal:'축제 바닥에 남은 얼룩과 종이 조각을 치워 주세요.',how:'솔을 누른 채 얼룩 위를 왕복해요. 여러 번 눌러도 돼요.',theme:'plaza'},
    party:{kind:'stack',title:'컵 쌓고 조명 켜기',icon:'💡',goal:'종이컵 다섯 개를 쌓고 축제 조명을 모두 켜 주세요.',how:'「컵 떨어뜨리기」를 다섯 번 눌러요. 컵을 다 쌓으면 세 조명 스위치를 켜요.',theme:'party'},
    burn:{kind:'ignite',title:'쓰레기 태우기',icon:'🔥',goal:'마을 어른들이 쓰레기를 모았어요. 화면을 문질러 불이 붙는 장면을 만들어 주세요.',how:'가운데를 빠르게 문지르거나 여러 번 눌러요. 온도가 차면 불과 연기가 나타나요.',theme:'cart'}
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
  return {stage,id,kind:info.kind,done:false,tiles,marks:Array(12).fill(0),water:Array(6).fill(0),focus:null,picked:null,round:0,index:0,showing:false,values:[0,0,0],lights:info.kind==='stack'?[false,false,false]:[true,true,true],cups:0,heat:0,photos:[],message:'',revision:0};
}
export function missionProgress(m){
  if(m.kind==='plumb')return [m.marks.slice(0,3).filter(Boolean).length+(m.values[0]?1:0),4];
  if(m.kind==='stack')return [m.cups+m.lights.filter(Boolean).length,8];
  if(m.kind==='ignite')return [m.heat,40];
  if(m.kind==='spray')return [m.marks.filter(v=>v>=3).length,12];
  if(m.kind==='connect')return [connectedTiles(m.tiles).length,7];
  if(m.kind==='memory')return [m.round,2];
  if(m.kind==='tune')return [m.values.filter((v,i)=>Math.abs(v-[25,50,75][i])<=5).length,3];
  if(m.kind==='plant')return [m.marks.slice(0,6).filter(Boolean).length+m.water.filter(v=>v>=2).length,12];
  if(m.kind==='sort')return [m.marks.slice(0,6).filter(Boolean).length+m.lights.filter(v=>!v).length,9];
  return [m.marks.slice(0,m.kind==='paint'?12:m.kind==='inspect'?3:6).filter(v=>v>=(m.kind==='scrub'?4:1)).length,m.kind==='paint'?12:m.kind==='inspect'?3:6];
}
const sequence = m => m.id==='party'?(m.round===0?[0,2,1]:[1,0,2,1]):(m.round===0?[1,0,2]:[2,1,0,2]);
const categories=['cup','paper','plastic','cup','paper','plastic'];
export function actMission(m,action,value,extra){
  if(m.done)return false;
  m.message='';let valid=false;
  if(action==='fit'&&m.kind==='plumb'&&Number.isInteger(value)&&value>=0&&value<3){if(value===extra){m.marks[value]=1;valid=true;}else m.message='모양이 달라요. 배관의 꺾인 방향을 살펴보세요.';
  }else if(action==='valve'&&m.kind==='plumb'&&m.marks.slice(0,3).every(Boolean)){m.values[0]=1;valid=true;
  }else if(action==='cup'&&m.kind==='stack'&&m.cups<5){m.cups++;valid=true;
  }else if(action==='switch'&&m.kind==='stack'&&m.cups===5&&Number.isInteger(value)&&value>=0&&value<3){m.lights[value]=true;valid=true;
  }else if(action==='rub'&&m.kind==='ignite'){m.heat=Math.min(40,m.heat+1);valid=true;
  }else if(action==='spray'&&m.kind==='spray'&&Number.isInteger(value)&&value>=0&&value<12){m.marks[value]=Math.min(3,m.marks[value]+1);valid=true;
  }else if(action==='turn'&&m.kind==='connect'&&Number.isInteger(value)&&value>=0&&value<9&&m.tiles[value]){
    m.tiles[value]=turnMask(m.tiles[value]);valid=true;
    const linked=connectedTiles(m.tiles);m.done=linked.includes(8)&&Boolean(m.tiles[8]&2);
  }else if(action==='scrub'&&m.kind==='scrub'&&Number.isInteger(value)&&value>=0&&value<6){m.marks[value]=Math.min(4,m.marks[value]+1);valid=true;
  }else if(action==='plant'&&m.kind==='plant'&&Number.isInteger(value)&&value>=0&&value<6){
    if(m.marks.slice(0,6).every(Boolean))m.water[value]=Math.min(2,m.water[value]+1);else m.marks[value]=1;m.activePlot=value;valid=true;
  }else if(action==='paint'&&m.kind==='paint'&&Number.isInteger(value)&&value>=0&&value<12){m.marks[value]=1;valid=true;
  }else if(action==='record'&&m.kind==='inspect'){
    if(Number.isInteger(value)&&value>=0&&value<3){m.marks[value]=1;valid=true;}else m.message=m.id==='corridor'?'발자국을 찾아 돋보기를 옮겨 주세요.':m.id==='wait'?'사진에 작물이 들어오도록 카메라를 옮겨 주세요.':'구멍 난 잎을 찾아 돋보기를 옮겨 주세요.';
  }else if(action==='load'&&m.kind==='haul'&&Number.isInteger(value)&&value>=0&&value<6){m.marks[value]=1;m.picked=null;valid=true;
  }else if(action==='sort'&&m.kind==='sort'&&Number.isInteger(value)&&value>=0&&value<6){
    if(categories[value]===extra){m.marks[value]=1;m.picked=null;valid=true;}else m.message='이 물건은 다른 함에 넣어요. 함에 적힌 이름을 확인해 주세요.';
  }else if(action==='light'&&m.kind==='sort'&&m.marks.slice(0,6).every(Boolean)&&Number.isInteger(value)&&value>=0&&value<3){m.lights[value]=false;valid=true;
  }else if(action==='tune'&&m.kind==='tune'&&Number.isInteger(value)&&value>=0&&value<3&&Number.isFinite(extra)){m.values[value]=Math.max(0,Math.min(100,extra));valid=true;
  }else if(action==='memory'&&m.kind==='memory'&&!m.showing&&Number.isInteger(value)&&value>=0&&value<3){
    valid=true;
    if(value===sequence(m)[m.index]){m.index++;if(m.index===sequence(m).length){m.round++;m.index=0;m.message=m.round===2?'점검 완료!':'첫 점검 완료! 다음 순서를 확인해요.';}}
    else{m.index=0;m.message='순서가 달랐어요. 처음부터 다시 눌러요. 「순서 보기」로 확인할 수 있어요.';}
  }
  if(valid){m.revision++;const [done,total]=missionProgress(m);if(m.kind!=='connect')m.done=done===total;}
  return valid;
}
const things=[['반납용 컵','☕'],['종이 안내지','📄'],['빈 페트병','🧴'],['반납용 음료잔','🥤'],['종이 상자','📦'],['플라스틱 뚜껑','🟦']];
const locations=[[13,24],[37,20],[61,28],[17,72],[42,68],[63,73]];
const observations=(m)=>m.id==='corridor'?[['토끼 발자국','🐾'],['토끼 발자국','🐾'],['토끼 발자국','🐾'],['낙엽','🍂'],['바위','🪨'],['풀','🌿']]:m.id==='wait'?[['작물','🌱'],['작물','🌾'],['작물','🥬'],['벌','🐝'],['거미','🕷️'],['바위','🪨']]:[['구멍 난 잎','leaf'],['구멍 난 잎','leaf'],['구멍 난 잎','leaf'],['벌','🐝'],['거미','🕷️'],['건강한 잎','🌿']];
const leaf=`<svg viewBox="0 0 70 65" aria-hidden="true"><path d="M10 52Q2 8 56 6Q76 39 20 56Z" fill="#78a65a" stroke="#45653b" stroke-width="3"/><path d="m5 61 48-47" stroke="#345b39" stroke-width="4"/><circle cx="31" cy="25" r="7" fill="#f2e5ba"/><circle cx="46" cy="38" r="6" fill="#f2e5ba"/></svg>`;
const blossom=`<span class="flower-art" aria-hidden="true"><i class="flower-stem"></i><i class="flower-leaf"></i><span class="flower-head">${Array.from({length:5},(_,i)=>`<i class="petal" style="--petal:${i}"></i>`).join('')}<i class="flower-center"></i></span></span>`;
const fieldBackdrop=`<svg class="mission-land" viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0h600v240H0Z" fill="#cad7a1"/><path d="M0 190Q120 128 230 170T600 128V240H0Z" fill="#91b679"/><path d="M0 105Q150 90 230 139T600 160" fill="none" stroke="#bba477" stroke-width="42"/><path d="M0 105Q150 90 230 139T600 160" fill="none" stroke="#e0ca94" stroke-width="32"/></svg>`;
const riverBackdrop=`<svg class="mission-land" viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0h600v240H0Z" fill="#87bcc2"/><path d="M0 0h600v25Q450 2 345 25T0 16ZM0 228Q150 205 295 225T600 205V240H0Z" fill="#a3ba80"/><g fill="none" stroke="#d1e7d9" stroke-width="4" opacity=".65"><path d="M20 80q25-10 55 0m80-17q25-10 60 0m110 10q20-10 50 0M40 163q25-10 65 0m66 18q20-10 60 0m64-15q25-10 65 0"/></g><g fill="#729b88"><ellipse cx="45" cy="20" rx="20" ry="9"/><ellipse cx="310" cy="224" rx="22" ry="10"/></g></svg>`;
function tilesHTML(m){
  const linked=connectedTiles(m.tiles);
  return `<div class="connection-station ${m.id==='cut'?'road-station':'water-station'}"><div class="pipe-end source">${m.id==='cut'?'🚗 출발':'💧 작업장'}</div><div class="pipe-grid">${m.tiles.map((mask,i)=>`<button class="pipe-tile ${linked.includes(i)?'flowing':''} ${mask?'':'blocked'}" data-turn="${i}" ${mask?'':'disabled'} aria-label="${Math.floor(i/3)+1}행 ${i%3+1}열 ${m.id==='cut'?'도로':'배관'} 돌리기"><svg viewBox="0 0 100 100" aria-hidden="true">${mask?[1,2,4,8].map((bit,j)=>mask&bit?`<path d="M50 50L${[[50,0],[100,50],[50,100],[0,50]][j].join(' ')}"/>`:'').join('')+'<circle cx="50" cy="50" r="11"/>':'<text x="50" y="65" text-anchor="middle" font-size="45">🌿</text>'}</svg></button>`).join('')}</div><div class="pipe-end destination">${m.id==='cut'?'축제장 🏮':'처리 시설 ⚙️'}</div></div>`;
}
function boardHTML(m){
  if(m.kind==='plumb')return `<div class="plumbing-work ${m.values[0]?'water-running':''}"><div class="plumbing-route"><span>작업장 💧</span>${[0,1,2].map(i=>`<button class="pipe-socket ${m.marks[i]?'fitted':''}" data-fit="${i}" aria-label="${['직선','아래로 꺾인','위로 꺾인'][i]} 배관 자리"><span>${['━','┓','┗'][i]}</span></button>`).join('')}<span>⚙️ 처리 시설</span><div class="water-stream"></div></div><div class="pipe-supplies">${[2,0,1].map(i=>`<button class="loose-pipe ${m.marks[i]?'stored':''}" data-pipe="${i}" aria-label="${['직선','아래로 꺾인','위로 꺾인'][i]} 배관 집기">${['━','┓','┗'][i]}</button>`).join('')}</div><button class="valve" id="water-valve" ${m.marks.slice(0,3).every(Boolean)?'':'disabled'}>${m.values[0]?'💧 물이 흐르고 있어요':'✥ 밸브 열기'}</button></div>`;
  if(m.kind==='stack')return `<div class="cup-work"><div class="cup-stack">${Array.from({length:m.cups},(_,i)=>`<span class="paper-cup ${i===m.cups-1?'falling-cup':''}" style="--cup:${i}">▱</span>`).join('')}<div class="cup-table"></div></div><div class="cup-controls"><button id="drop-cup" ${m.cups===5?'disabled':''}>컵 떨어뜨리기 · ${m.cups}/5</button><div class="festival-switches">${m.lights.map((on,i)=>`<button class="festival-bulb ${on?'lit':''}" data-switch="${i}" ${m.cups===5?'':'disabled'} aria-label="축제 조명 ${i+1} 켜기">💡</button>`).join('')}</div></div></div>`;
  if(m.kind==='ignite')return `<div class="fire-work ${m.done?'burning':''}"><div class="fire-smoke"><i></i><i></i><i></i></div><button id="friction-area" aria-label="쓰레기 더미 문질러 불 붙이기"><span class="rubbish-pile">📦 📄 🛍️</span><span class="fire-flame">🔥</span><span class="friction-sparks">✦ ✧</span></button><div class="heat-meter"><span style="width:${m.heat/40*100}%"></span></div><p>${m.done?'불이 붙고 연기가 올라옵니다.':'손가락으로 빠르게 문질러요.'}</p></div>`;
  if(m.kind==='spray')return `<div class="spraying-work" id="mission-field"><div class="crop-bed">${m.marks.map((v,i)=>`<button class="spray-crop ${v>=3?'sprayed':''}" data-brush="${i}" aria-label="밭 ${i+1} 농약 뿌리기"><span>🌿</span><i style="opacity:${v/4}"></i></button>`).join('')}</div><div class="sprayer-cursor" id="brush-cursor"><span>🧴</span><i class="mist"></i></div></div>`;
  if(m.kind==='connect')return tilesHTML(m);
  if(m.kind==='memory')return `<div class="lamp-work"><div class="lamp-wire"></div><div class="mission-lamps">${['주황','파랑','초록'].map((color,i)=>`<button class="mission-lamp lamp-${i}" data-lamp="${i}" aria-label="${color} 등 스위치"><span>💡</span><strong>${color}</strong></button>`).join('')}</div><div class="memory-track">${m.done?'두 번의 점검 완료!':`점검 ${m.round+1}/2 · <span id="memory-index">${m.index}/${sequence(m).length}</span>`}</div><button class="preview-sequence" id="preview-sequence">▶ 순서 보기</button></div>`;
  if(m.kind==='tune')return `<div class="tuning-work">${['처리 시설 손잡이','청소 도구 손잡이','가림막 조명 손잡이'].map((name,i)=>`<label class="tuning-row"><span>${['⚙️','🧹','🏮'][i]} ${name}</span><div class="tuning-rail"><span class="tuning-target" style="left:${[25,50,75][i]}%"></span><input type="range" min="0" max="100" step="5" value="${m.values[i]}" data-tune="${i}" aria-label="${name}"></div><b class="tuning-check" data-tuning-check="${i}">${Math.abs(m.values[i]-[25,50,75][i])<=5?'✓':'↔'}</b></label>`).join('')}</div>`;
  if(m.kind==='sort')return `<div class="sorting-work"><div class="sorting-items">${things.map(([name,icon],i)=>`<button class="sort-item ${m.marks[i]?'stored':''}" data-carry="${i}" aria-label="${name}"><span>${icon}</span><small>${name}</small></button>`).join('')}</div><div class="sorting-bins">${[['cup','☕','컵 반납함'],['paper','📄','종이함'],['plastic','🧴','플라스틱함']].map(([id,icon,name])=>`<button class="mission-bin bin-${id}" data-target="${id}"><span>${icon}</span><strong>${name}</strong></button>`).join('')}</div><div class="day-lights ${m.marks.slice(0,6).every(Boolean)?'':'waiting'}"><span>다 담았다면 낮 조명을 꺼요 →</span>${m.lights.map((on,i)=>`<button data-light="${i}" ${m.marks.slice(0,6).every(Boolean)?'':'disabled'} aria-label="낮 조명 ${i+1} 끄기" class="${on?'on':'off'}">${on?'💡':'✓'}</button>`).join('')}</div></div>`;
  if(m.kind==='paint')return `<div class="coverage-work"><span class="tool-indicator">🖌️ 구역표 붓</span><div class="coverage-grid">${m.marks.map((v,i)=>`<button data-brush="${i}" class="coverage-cell ${v?'painted':''}" aria-label="작업 구역 ${i+1} 표시">${v?'✓':'🌾'}</button>`).join('')}</div></div>`;
  if(m.kind==='plant')return `<div class="planting-work"><div class="plant-tool">${m.marks.slice(0,6).every(Boolean)?'🚿 물뿌리개 · 한 칸에 두 번 물 주기':'🌰 씨앗 주머니 · 여섯 칸에 심기'}</div><div class="planting-grid">${m.marks.slice(0,6).map((v,i)=>`<button data-brush="${i}" class="soil-pot ${v?'seeded':''} ${m.water[i]>=2?'watered':''} ${m.water[i]?'watering':''} ${m.activePlot===i?'recent-plot':''}" aria-label="꽃밭 ${i+1} ${m.marks.slice(0,6).every(Boolean)?'물 주기':'씨앗 심기'}"><i class="seed-grains">· · ·</i><i class="water-drops">💧 💧</i><span class="growing-flower">${m.water[i]>=2?blossom:v?'🌱':''}</span><small>${m.water[i]>=2?'꽃이 피었어요':v?(m.marks.slice(0,6).every(Boolean)?'💧'.repeat(m.water[i])||'물을 주세요':'씨앗 심음'):'빈 흙'}</small></button>`).join('')}</div></div>`;
  if(m.kind==='inspect')return `<div class="observation-work"><div class="mission-field ${m.id==='wait'?'photo-field':''}" id="mission-field">${m.id==='wait'?'':fieldBackdrop}${observations(m).map(([name,icon],i)=>`<button class="observation-object ${i<3&&m.marks[i]?'recorded':''}" data-observe="${i}" style="left:${locations[i][0]}%;top:${locations[i][1]}%" aria-label="${name} 살피기"><span>${icon==='leaf'?leaf:icon}</span><small>${name}</small>${i<3&&m.marks[i]?'<b>✓</b>':''}</button>`).join('')}<div class="inspection-cursor ${m.id==='wait'?'camera-cursor':''}" id="inspection-cursor" style="left:82%;top:48%"><span>${m.id==='wait'?'📷':'🔎'}</span></div><div class="camera-flash"></div></div>${m.id==='wait'?`<div class="photo-strip">${m.photos.map((src,i)=>src?`<img src="${src}" alt="찍어 둔 작물 사진 ${i+1}">`:'').join('')}</div>`:''}<div class="observation-console"><span id="focus-name">${m.id==='wait'?'사진에 남길 작물을 찾아요.':m.id==='care'?'구멍 난 잎을 찾아 눌러 보세요.':'발자국을 찾아 눌러 보세요.'}</span><button id="record-observation">${m.id==='corridor'?'흔적 기록':m.id==='wait'?'사진 찍기':'이 잎 기록하기'}</button></div></div>`;
  const haul=m.kind==='haul';
  return `<div class="mission-field ${haul?'haul-field':'scrub-field'}" id="mission-field">${haul&&m.id==='clean'?riverBackdrop:fieldBackdrop}${locations.map(([x,y],i)=>`<button class="field-object ${m.marks[i]>=(haul?1:4)?'removed':''}" ${haul?'data-carry':'data-brush'}="${i}" style="left:${x}%;top:${y}%;${!haul?'opacity:'+Math.max(.18,1-m.marks[i]/5):''}" aria-label="${haul?'쓰레기 '+(i+1)+' 집기':'얼룩 '+(i+1)+' 닦기'}"><span>${haul?['🥤','🧴','📄','🛍️','🥫','📦'][i]:m.id==='detour'?['🍂','🪵','🪨','🍂','🪵','🪨'][i]:['🥤','🟤','📄','🟤','🥤','📄'][i]}</span>${!haul?`<small>${'·'.repeat(4-m.marks[i])}</small>`:''}</button>`).join('')}${haul?`<button class="haul-target" data-target="load"><span>${m.id==='burn'?'🛒':'🪣'}</span><strong>${m.id==='burn'?'수거차':'수거통'}</strong><small>${m.marks.slice(0,6).filter(Boolean).length}/6</small></button>`:'<div class="brush-cursor" id="brush-cursor">🧹</div>'}</div>`;
}
export function mountMission(host,m,onChange){
  const info=missionInfo(m.stage,m.id);let disposed=false,timers=[],drag=null,stroke=null,previewing=false,sprayTimer=null,cursorPoint=null;
  host.innerHTML=`<div class="mission-device ${info.theme}"><div class="mission-device-top"><span>${info.icon} 작업 도구</span><strong id="mission-counter"></strong></div><div class="mission-play-area" id="mission-play-area">${boardHTML(m)}</div><div class="mission-feedback" id="mission-feedback" role="status" aria-live="polite"></div></div>`;
  const $=s=>host.querySelector(s),$$=s=>[...host.querySelectorAll(s)],later=(fn,ms)=>{timers.push(setTimeout(()=>{if(!disposed)fn();},ms));};
  const feedback=()=>{
    const [done,total]=missionProgress(m);$('#mission-counter').textContent=`${done}/${total}`;
    $('#mission-feedback').textContent=m.done?'✓ 준비가 끝났어요.':m.message||info.how;
    host.classList.toggle('mission-complete',m.done);onChange(m.done);
    if(m.done)$$('.mission-play-area button,.mission-play-area input').forEach(b=>b.disabled=true);
  };
  function positionCursor(){const cursor=$('#brush-cursor'),field=$('#mission-field');if(cursor&&field&&cursorPoint){const r=field.getBoundingClientRect();cursor.style.left=cursorPoint[0]-r.left+'px';cursor.style.top=cursorPoint[1]-r.top+'px';cursor.style.right='auto';cursor.classList.toggle('active',!!stroke);}}
  const refresh=()=>{if(disposed)return;$('#mission-play-area').innerHTML=boardHTML(m);bind();if(m.kind==='inspect'&&m.focus!==null)focus(m.focus);positionCursor();feedback();};
  const act=(a,v,e)=>{actMission(m,a,v,e);refresh();};
  function preview(){
    if(previewing||m.done)return;previewing=true;m.showing=true;m.index=0;
    const seq=sequence(m);$$('[data-lamp]').forEach(b=>b.disabled=true);$('#preview-sequence').disabled=true;
    $('#mission-feedback').textContent='등이 켜지는 순서를 기억해요.';
    seq.forEach((v,i)=>{later(()=>{$(`[data-lamp="${v}"]`)?.classList.add('lit');$('#mission-feedback').textContent=['주황','파랑','초록'][v]+' 등';},300+i*750);later(()=>{$(`[data-lamp="${v}"]`)?.classList.remove('lit');},850+i*750);});
    later(()=>{previewing=false;m.showing=false;$$('[data-lamp]').forEach(b=>b.disabled=false);$('#preview-sequence').disabled=false;$('#mission-feedback').textContent='이제 같은 순서로 스위치를 눌러요.';},400+seq.length*750);
  }
  function bind(){
    $$('[data-pipe]').forEach(b=>b.onclick=()=>{m.picked=Number(b.dataset.pipe);b.classList.add('carrying');});
    $$('[data-fit]').forEach(b=>b.onclick=()=>{if(m.picked!==null)act('fit',m.picked,Number(b.dataset.fit));});
    if($('#water-valve'))$('#water-valve').onclick=()=>act('valve');
    if($('#drop-cup'))$('#drop-cup').onclick=()=>act('cup');
    $$('[data-switch]').forEach(b=>b.onclick=()=>act('switch',Number(b.dataset.switch)));
    if($('#friction-area'))$('#friction-area').onclick=e=>{if(e.detail===0)act('rub');};
    $$('[data-turn]').forEach(b=>b.onclick=()=>act('turn',Number(b.dataset.turn)));
    $$('[data-lamp]').forEach(b=>b.onclick=()=>{const previous=m.round;actMission(m,'memory',Number(b.dataset.lamp));refresh();if(m.round>previous&&!m.done)preview();});
    if($('#preview-sequence'))$('#preview-sequence').onclick=preview;
    $$('[data-tune]').forEach(b=>b.oninput=()=>{actMission(m,'tune',Number(b.dataset.tune),Number(b.value));const i=Number(b.dataset.tune);$(`[data-tuning-check="${i}"]`).textContent=Math.abs(m.values[i]-[25,50,75][i])<=5?'✓':'↔';feedback();});
    $$('[data-light]').forEach(b=>b.onclick=()=>act('light',Number(b.dataset.light)));
    $$('[data-brush]').forEach(b=>b.onclick=e=>{if(e.detail===0)act(m.kind,Number(b.dataset.brush));});
    $$('[data-observe]').forEach(b=>b.onclick=()=>focus(Number(b.dataset.observe)));
    if($('#record-observation'))$('#record-observation').disabled=m.focus===null||m.focus>=3||!!m.marks[m.focus];
    if($('#record-observation'))$('#record-observation').onclick=async()=>{const index=m.focus;if(m.id!=='wait'||!Number.isInteger(index)||index>=3){act('record',index);return;}if(m.marks[index])return;shutter();$('#mission-field').classList.add('taking-photo');$('#record-observation').disabled=true;try{const src=await photo(index);if(disposed)return;m.photos[index]=src;later(()=>act('record',index),220);}catch{if(!disposed){m.message='사진을 다시 찍어 주세요.';feedback();$('#record-observation').disabled=false;}}};
    $$('[data-carry]').forEach(b=>b.onclick=()=>{if(drag?.moved)return;m.picked=Number(b.dataset.carry);$$('[data-carry]').forEach(el=>el.classList.toggle('carrying',el===b));$('#mission-feedback').textContent=m.kind==='sort'?'물건을 골랐어요. 넣을 함을 눌러 주세요.':`집었어요. ${m.id==='burn'?'수거차':'수거통'}를 눌러 주세요.`;});
    $$('[data-target]').forEach(b=>b.onclick=()=>{if(m.picked===null){m.message='먼저 옮길 물건을 골라 주세요.';feedback();return;}act(m.kind==='sort'?'sort':'load',m.picked,b.dataset.target);});
  }
  function focus(i){
    m.focus=i;const [name]=observations(m)[i];$('#focus-name').textContent=m.id==='care'?(i<3?'구멍이 있어요. 이 잎을 기록해요.':i===5?'멀쩡한 잎이에요. 다른 잎을 찾아요.':'작물을 돕는 생물이에요. 그대로 두어요.'):name;const cursor=$('#inspection-cursor');if(cursor){cursor.style.left=locations[i][0]+'%';cursor.style.top=locations[i][1]+'%';}
    $$('[data-observe]').forEach(b=>b.classList.toggle('in-focus',Number(b.dataset.observe)===i));
    const record=$('#record-observation');if(record)record.disabled=i>=3||!!m.marks[i];
  }
  function under(x,y,selector){return $$(selector).find(b=>{const r=b.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;});}
  host.onpointerdown=e=>{
    if(m.done||e.button!==0)return;
    const carry=e.target.closest('[data-carry],[data-pipe]'),brush=e.target.closest('[data-brush]');
    if(carry&&!m.marks[Number(carry.dataset.carry??carry.dataset.pipe)]){
      drag={id:Number(carry.dataset.carry??carry.dataset.pipe),pipe:carry.hasAttribute('data-pipe'),x:e.clientX,y:e.clientY,moved:false,ghost:document.createElement('div')};drag.ghost.className='mission-drag-ghost';drag.ghost.textContent=carry.querySelector('span')?.textContent||carry.textContent;host.append(drag.ghost);drag.ghost.style.left=e.clientX-host.getBoundingClientRect().left+'px';drag.ghost.style.top=e.clientY-host.getBoundingClientRect().top+'px';host.setPointerCapture(e.pointerId);e.preventDefault();
    }else if(brush||(['scrub','spray'].includes(m.kind)&&e.target.closest('#mission-field'))){stroke={x:e.clientX,y:e.clientY,moved:false};cursorPoint=[e.clientX,e.clientY];if(brush)actMission(m,m.kind,Number(brush.dataset.brush));refresh();positionCursor();host.setPointerCapture(e.pointerId);if(m.kind==='spray'){clearInterval(sprayTimer);sprayTimer=setInterval(()=>{if(!stroke||m.done){clearInterval(sprayTimer);return;}const item=under(...cursorPoint,'[data-brush]');if(item){actMission(m,'spray',Number(item.dataset.brush));refresh();}},120);}}
    else if(m.kind==='ignite'&&e.target.closest('#friction-area')){stroke={x:e.clientX,y:e.clientY,moved:false};act('rub');host.setPointerCapture(e.pointerId);}
    else if(m.kind==='inspect'&&e.target.closest('#mission-field')){const item=e.target.closest('[data-observe]');if(item)focus(Number(item.dataset.observe));stroke={x:e.clientX,y:e.clientY,moved:false};host.setPointerCapture(e.pointerId);}
  };
  host.onpointermove=e=>{
    if(drag){drag.moved ||= Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7;drag.ghost.style.left=e.clientX-host.getBoundingClientRect().left+'px';drag.ghost.style.top=e.clientY-host.getBoundingClientRect().top+'px';return;}
    if(!stroke)return;
    cursorPoint=[e.clientX,e.clientY];positionCursor();
    const distance=Math.hypot(e.clientX-stroke.x,e.clientY-stroke.y);if(distance<9)return;
    stroke.moved=true;stroke.x=e.clientX;stroke.y=e.clientY;
    if(m.kind==='ignite'){if(e.target.closest('.mission-play-area')||under(e.clientX,e.clientY,'#friction-area'))act('rub');return;}
    if(m.kind==='inspect'){
      const field=$('#mission-field'),r=field.getBoundingClientRect(),cursor=$('#inspection-cursor');cursor.style.left=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))+'%';cursor.style.top=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))+'%';const item=under(e.clientX,e.clientY,'[data-observe]');if(item)focus(Number(item.dataset.observe));else{m.focus=null;$('#record-observation').disabled=true;$('#focus-name').textContent='살펴볼 대상을 렌즈 안에 맞춰요.';}return;
    }
    const item=under(e.clientX,e.clientY,'[data-brush]');if(item){actMission(m,m.kind,Number(item.dataset.brush));refresh();}
    positionCursor();
  };
  host.onpointerup=e=>{
    if(drag){const captured=drag;drag=null;captured.ghost.remove();if(captured.pipe){const target=under(e.clientX,e.clientY,'[data-fit]');if(captured.moved&&target)act('fit',captured.id,Number(target.dataset.fit));else{m.picked=captured.id;refresh();$(`[data-pipe="${captured.id}"]`)?.classList.add('carrying');}return;}if(captured.moved){const target=under(e.clientX,e.clientY,'[data-target]');if(target)act(m.kind==='sort'?'sort':'load',captured.id,target.dataset.target);else{m.picked=captured.id;refresh();$('#mission-feedback').textContent='놓을 곳까지 끌어 주세요. 물건을 고른 뒤 함을 눌러도 돼요.';}}else{m.picked=captured.id;refresh();$(`[data-carry="${captured.id}"]`)?.classList.add('carrying');$('#mission-feedback').textContent='집었어요. 놓을 곳을 눌러 주세요.';}}
    stroke=null;clearInterval(sprayTimer);positionCursor();
  };
  host.onpointercancel=()=>{drag?.ghost.remove();drag=null;stroke=null;clearInterval(sprayTimer);positionCursor();};
  bind();feedback();if(m.kind==='memory'&&!m.done)preview();
  return ()=>{disposed=true;timers.forEach(clearTimeout);clearInterval(sprayTimer);m.showing=false;drag?.ghost.remove();host.onpointerdown=host.onpointermove=host.onpointerup=host.onpointercancel=null;};
}
