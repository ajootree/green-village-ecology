import {seasons,endings,choiceLabel,resolveEnding,endingText,statusFor} from './model.mjs';
import {cleanState,freshState} from './state.mjs';
import * as cloud from './cloud.mjs';
import * as music from './music.mjs';
import {regions,worldSVG,paintedWorldAssets} from './world.mjs';
import {createMission,mountMission,missionInfo} from './missions.mjs';
import {destinations,homePoint,project,route,pathSVG,distance} from './navigation.mjs';
import {setting,storyCards,calendar,transition,typeText} from './story.mjs';
import {photo} from './effects.mjs';
import {humanConsequences} from './learning.mjs';
import {openLearning} from './learning-ui.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const H=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const resultCopy=s=>H(s).replace(/(?:토양|수질|대기)오염/g,term=>`<strong>${term}</strong>`);
const spots=destinations,icons=['🌳','💧','🌾','🏮'];
const planSentences=[['도로를 짧게 연결해서 숲을 가로지른다.','새 도로 대신 원래 있던 길로 돌아간다.','동물의 이동을 조사하고 안전한 통로를 만든다.','숲 일부를 정리하고 꽃밭으로 꾸민다.'],['작업장의 물 처리 시설을 고치고 계속 점검한다.','하천에 떠 있는 쓰레기를 건져 낸다.','가림막과 조명을 설치해서 물가를 꾸민다.','시설 수리·청소·꾸미기에 돈을 조금씩 나눈다.'],['전문가와 피해 입은 잎을 살피고 필요한 곳만 관리한다.','정해진 양보다 많은 농약을 농장 전체에 뿌린다.','작물과 풀을 없애고 한 종류의 꽃을 심는다.','작물 사진을 찍으며 관리하지 않고 기다린다.'],['컵을 돌려받고 쓰레기를 분리하며 낮 조명을 끈다.','행사가 끝난 뒤 바닥을 한 번 청소한다.','일회용 컵을 넉넉히 쌓고 축제 조명을 많이 준비한다.','모은 쓰레기를 불에 태워 처리한다.']];
const planText=(i,id)=>planSentences[i][seasons[i].choices.findIndex(c=>c.id===id)];
let walkFrame=0,stopStory=()=>{},dialogueTyping=null,arrivalSeen=new Set(),titleSeen=new Set(),travelBusy=false,chapterIntro=false,missionBriefed=false;
const spokenSeasons=new Set();
let saveMode='device',localName=readName(),key=localName?'eco-village-local-v2-'+encodeURIComponent(localName):'eco-village-guest-v2',state=readLocal(),selected=null,mission=null,stopMission=()=>{},toastTimer,cinemaTimer,cloudStatus='guest',booting=cloud.configured,viewMode='auto',pastChapter=null;
function readName(){try{return (localStorage.getItem('eco-village-local-name')||'').normalize('NFKC').trim().slice(0,16);}catch{return '';}}
const playerAccount=()=>saveMode==='online'?cloud.account():null;
const myName=()=>saveMode==='none'?'나':playerAccount()?.nickname||localName||'나';
const endingLine=s=>s.replace(/^(숲지기|물지기|밭지기|빛지기):/,myName()+':');
let endingLocked=false;
function readLocal(){try{return cleanState(JSON.parse(localStorage.getItem(key)||'null'));}catch{return freshState();}}
function writeLocal(){if(saveMode==='none')return;try{localStorage.setItem(key,JSON.stringify(state));if(playerAccount())localStorage.setItem(key+'-base',String(cloud.version()));}catch{toast('기기 저장 공간이 부족해요.');}}
function save(){state.updatedAt=Date.now();writeLocal();if(saveMode==='online')cloud.queueCloud(state);}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);}
function reset(){stopMission();stopMission=()=>{};selected=null;mission=null;missionBriefed=false;}
const g=()=>state.game, count=()=>Object.keys(state.album).length;
function header(){const a=playerAccount(),stage=g()?.stage;return `<header class="topbar"><button class="logo" id="home" aria-label="처음 화면"><span class="brand-star">✦</span><span><b>초록마을</b><small>네 계절의 생태 이야기</small></span></button><nav class="seasons" aria-label="계절 진행"><small class="season-caption">${stage===4?'다음 봄을 앞두고':stage===undefined?'FOUR SEASONS':seasons[stage].month+' · '+seasons[stage].title}</small><div>${seasons.map((s,i)=>`<span class="season ${stage===i?'active':''} ${g()?.choices[i]?'complete':''}" ${stage===i?'aria-current="step"':''}>${s.name}${g()?.choices[i]?' ✓':''}</span>`).join('')}</div></nav><div class="top-actions">${musicUI()}<button id="save-cloud" class="save-state" title="진행 기록 저장">${cloudLabel()}</button><button id="account" class="icon-button" aria-label="학교 계정">${a?H(a.nickname||'주민'):'학교 계정'}</button><button id="album" class="icon-button" aria-label="엔딩 앨범">▤ ${count()}/10</button><button id="help" class="icon-button" aria-label="게임 방법">?</button></div></header>`;}
function cloudLabel(){if(saveMode==='none')return '저장 없이 체험';return ({guest:'기기에 저장',online:'온라인 연결',saved:'☁ 저장 완료',pending:'☁ 저장 대기',saving:'☁ 저장 중',error:'☁ 다시 저장',conflict:'☁ 다른 기기 기록'})[cloudStatus]||'기기에 저장';}
function musicUI(){return `<span class="music-controls"><button class="icon-button music-toggle" data-music-toggle aria-label="배경음악 켜기" aria-pressed="false" title="배경음악 켜기">🔇</button><button class="icon-button music-settings" data-music-settings aria-label="배경음악 음량 설정" title="배경음악 음량 설정">♫</button></span>`;}
function updateMusic(){const s=music.status();$$('[data-music-toggle]').forEach(b=>{b.textContent=s.loading?'…':s.enabled?'🔊':'🔇';b.setAttribute('aria-pressed',String(s.enabled));b.setAttribute('aria-label',s.enabled?'배경음악 끄기':'배경음악 켜기');b.title=s.enabled?'배경음악 끄기':'배경음악 켜기';});const v=$('#music-volume-label');if(v)v.textContent=Math.round(s.volume*100)+'%';const t=$('#music-title');if(t)t.textContent=s.loading?'음악을 준비하고 있어요…':s.enabled?s.title:'배경음악이 꺼져 있어요.';}
function bindMusic(){updateMusic();$$('[data-music-toggle]').forEach(b=>b.onclick=()=>music.setEnabled(!music.status().enabled).catch(()=>toast('음악을 불러오지 못했어요. 소리 버튼을 다시 눌러 주세요.')));$$('[data-music-settings]').forEach(b=>b.onclick=musicDialog);}
function musicDialog(){const s=music.status();modal('♫ 마을의 배경음악',`<div class="music-panel"><p id="music-title">${s.enabled?s.title:'배경음악이 꺼져 있어요.'}</p><button class="secondary" data-music-toggle aria-label="배경음악 켜기"></button><label for="music-volume">음량 <strong id="music-volume-label">${Math.round(s.volume*100)}%</strong></label><input id="music-volume" type="range" min="0" max="100" step="5" value="${Math.round(s.volume*100)}" aria-label="배경음악 음량"><p class="small-note">소리 버튼으로 켜고 끌 수 있어요. 음량은 이 기기에 기억해요.<br>새로 열면 소리는 꺼져 있어요.</p><p class="small-note">마을과 엔딩을 위해 직접 만든 무료 곡이에요.<br>「초록마을 산책」 · 「우리의 다음 봄」 · 「돌아오지 않는 봄」</p></div>`);bindMusic();$('#music-volume').oninput=e=>music.setVolume(Number(e.target.value)/100);}
music.subscribe(updateMusic);
function bindHeader(){bindMusic();$('#home').onclick=home;$('#album').onclick=openAlbum;$('#help').onclick=help;$('#account').onclick=accountDialog;$('#save-cloud').onclick=async()=>{if(saveMode==='none'){toast('저장 없이 플레이하고 있어요.');return;}if(!playerAccount()){accountDialog();return;}if(cloudStatus==='conflict'){conflictDialog();return;}try{cloud.queueCloud(state);await cloud.flushCloud();toast('온라인에 저장했어요. 다른 기기에서도 이어 할 수 있어요.');}catch{toast('연결을 확인해 주세요. 기기 기록은 남아 있어요.');}};}
function home(){endingLocked=false;$('#app').inert=false;chapterIntro=false;document.body.dataset.screen='home';cancelAnimationFrame(walkFrame);stopStory();dialogueTyping?.stop();stopMission();pastChapter=null;viewMode='auto';music.setScene('village');clearInterval(cinemaTimer);$('.cinema')?.remove();$('#dialog').close();$('#app').innerHTML=header()+`<main class="home-screen"><div class="home-art"></div><section class="welcome parchment"><span class="eyebrow">GREEN VILLAGE · ECO ADVENTURE</span><h1>초록마을의<br><em>네 계절</em></h1><div class="title-rule"></div><p>작은 마을의 새 주민이 된 당신.<br>숲과 하천, 농장과 축제를 걸으며<br>우리의 다음 봄을 만들어 보세요.</p><div class="welcome-badges"><span>네 계절의 선택</span><span>10개의 엔딩</span></div><div class="welcome-actions">${g()?'<button class="primary" id="continue">모험 이어 하기</button>':''}<button class="${g()?'secondary':'primary'}" id="new-game">마을로 출발</button><button class="text-button" id="login-start">다른 기기에서 이어 하기</button></div><small>가고 싶은 곳을 터치하세요.<br>다른 선택으로 새로운 엔딩을 모아 보세요.</small></section><div class="home-note">네 번의 계절, 당신이 바꿀 마을.</div></main>`;bindHeader();$('#new-game').onclick=()=>playerAccount()?start(0):startDialog();$('#login-start').onclick=()=>startDialog('online');if($('#continue'))$('#continue').onclick=()=>{if(!playerAccount()&&!localName&&saveMode!=='none'){startDialog('device',true);return;}if(g().stage<4&&g().phase==='task'&&!arrivalSeen.has(g().stage)){viewMode='map';render();enterChapter();}else render();};if(booting){$('#login-start').disabled=true;$('#new-game').disabled=true;if($('#continue'))$('#continue').disabled=true;}}
function start(stage=0){endingLocked=false;$('#app').inert=false;if(booting){toast('기록을 확인하고 있어요. 잠시만 기다려 주세요.');return;}clearInterval(cinemaTimer);$('.cinema')?.remove();$('#dialog').close();const previous=state.last;if(stage&& !previous){toast('먼저 한 판을 끝내 주세요.');return;}stopStory();arrivalSeen=new Set();titleSeen=new Set();spokenSeasons.clear();chapterIntro=false;viewMode='map';pastChapter=null;state.game={stage,choices:stage?previous.choices.map((v,i)=>i<stage?v:null):[null,null,null,null],phase:'explore',player:[...homePoint]};reset();save();render();if(stage===0)stopStory=storyCards(setting);}
function playerHTML(){return `<div class="explorer" id="explorer" style="left:${g().player[0]}%;top:${g().player[1]}%" role="img" aria-label="내 캐릭터"><span class="explorer-hair"></span><span class="explorer-face"></span><span class="explorer-shirt"></span><span class="explorer-feet"></span><span class="explorer-name">${H(myName())}</span></div>`;}
function mapHTML(){
  const current=Math.min(g().stage,3),s=seasons[current],done=g().stage===4,recorded=g().choices.filter(Boolean).length;
  const destination=done?'마을 회의':s.area+' · '+s.speaker,action=done?'마을 회의 참석하기':s.speaker+' 만나기';
  return `<section class="map-frame" aria-label="초록마을 이동 지도"><div class="world-plane">${worldSVG({choices:g().choices,stage:g().stage})}${pathSVG()}<div class="map-glow"></div>${seasons.map((season,i)=>`<button class="village-spot ${i===current&&!done?'current':''} ${g().choices[i]?'recorded':''}" data-spot="${i}" style="left:${spots[i][0]}%;top:${spots[i][1]}%" ${!g().choices[i]&&i!==g().stage?'disabled':''} aria-label="${season.area} · ${season.speaker}${g().choices[i]?' · 기록 다시 보기':i===g().stage?' 만나기':' · 다음 계절'}"><strong>${season.area} · ${season.speaker}</strong><small>${g().choices[i]?'방문 기록':i===current?'이야기 듣기':'다음 계절'}</small>${g().choices[i]?'<i>✓</i>':i===current?'<i>!</i>':''}</button>`).join('')}${playerHTML()}</div><aside class="field-journal"><span class="eyebrow">${done?'우리의 네 계절':'이번 계절의 현장 기록'}</span><h2>${done?'다음 봄을 앞두고':s.title}</h2><p>${done?'함께 고른 네 가지 방법을 돌아보고, 마을의 다음 봄을 만나 보세요.':g().phase==='result'?'이번 '+s.name+'에 고른 방법을 다시 보거나 다음 계절로 떠나 보세요.':s.area+'에서 기다리는 '+s.speaker+'의 이야기를 듣고, 마을을 위한 방법을 골라 보세요.'}</p><div class="field-progress">남긴 계절 기록 <b>${recorded} / 4</b></div><button id="journal" class="journal-button">▤ 조사 수첩 <span>${recorded}</span></button></aside><div class="map-name"><b>초록마을 · ${done?'마을 회의':s.area}</b><small>${done?'겨울의 마지막 기록':s.month+' · '+s.name+'의 이야기'}</small></div><div class="map-dock"><span class="movement-tip">가고 싶은 곳을 터치하세요.</span></div><div class="travel-guide"><small>${destination}</small>${g().phase==='result'?`<button id="review-choice" class="secondary">내 선택 다시 보기</button><button id="next-season-map" class="primary">${g().stage===3?'마을 회의로 가기':'다음 계절로 가기'} →</button>`:`<button id="enter-chapter" class="primary">${action} →</button>`}</div></section>`;
}
function render(){
  cancelAnimationFrame(walkFrame);dialogueTyping?.stop();stopMission();
  if(!g()){home();return;}
  music.setScene('village');clearInterval(cinemaTimer);$('.cinema')?.remove();
  const chapter=viewMode==='chapter'||(viewMode==='auto'&&g().phase!=='explore');
  document.body.dataset.screen=chapter?'chapter':'map';
  $('#app').innerHTML=header()+`<main class="${chapter?'chapter-screen':'travel-screen'}">${chapter?chapterHTML():mapHTML()}</main>`;
  bindHeader();
  if(chapter){$('#back-map').onclick=()=>transition(()=>{viewMode='map';pastChapter=null;render();});renderQuest();}
  else {g().player=project(g().player).point;const p=$('#explorer');p.style.left=g().player[0]+'%';p.style.top=g().player[1]+'%';bindMap();}
}
function chapterHTML(){
  const i=pastChapter??Math.min(g().stage,3),s=seasons[i],isResult=pastChapter!==null||g().phase==='result',meeting=g().stage===4&&pastChapter===null;
  return `<section class="chapter-scene" aria-label="${s.area}의 배경">${worldSVG({choices:g().choices,chapter:meeting?null:i,stage:g().stage})}</section><div class="chapter-banner"><small>${meeting?'네 계절의 마지막 장':'CHAPTER '+(i+1)+' · '+s.name.toUpperCase()}</small><h1>${meeting?'마을 회의':regions[i].name}</h1><p>${pastChapter!==null?'내 선택이 남긴 풍경':s.month+' · '+s.speaker+'의 이야기'}</p></div><button class="chapter-back" id="back-map">↖ 전체 지도로</button><div id="route-work"></div><section class="quest parchment ${isResult?'result-panel':meeting?'final-panel':''}" id="quest" aria-label="${meeting?'마을 회의':s.speaker+'의 대화와 선택'}"></section>`;
}
async function enterChapter(i=g().stage,past=false){
  if(travelBusy)return;travelBusy=true;
  const first=!past&&g().stage<4&&g().phase!=='result'&&!arrivalSeen.has(i);
  chapterIntro=first;
  await transition(()=>{pastChapter=past?i:null;viewMode='chapter';if(!past&&g().phase==='explore'){g().player=[...spots[i]];g().phase='task';save();}render();});
  travelBusy=false;
  if(first){arrivalSeen.add(i);const tell=()=>{chapterIntro=false;renderQuest();};if(titleSeen.has(i))tell();else{titleSeen.add(i);stopStory=calendar(seasons[i],i,tell);}}
}
function bindMap(){
  $$('[data-spot]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.spot);if(g().choices[i]||i===g().stage)moveTo(...spots[i],()=>enterChapter(i,!!g().choices[i]&&i!==g().stage));else toast('지금은 '+seasons[g().stage].name+'이에요. 기다리는 주민부터 만나 주세요.');});
  $('.world-plane').onclick=e=>{if(e.target.closest('button'))return;const r=e.currentTarget.getBoundingClientRect();moveTo((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);};
  $('#journal').onclick=journal;if($('#enter-chapter'))$('#enter-chapter').onclick=()=>{if(g().stage===4)enterChapter();else moveTo(...spots[g().stage],()=>enterChapter());};if($('#review-choice'))$('#review-choice').onclick=()=>enterChapter();if($('#next-season-map'))$('#next-season-map').onclick=nextSeason;
}
function moveTo(x,y,onArrival){
  const p=$('#explorer');if(!p||travelBusy)return;cancelAnimationFrame(walkFrame);
  const steps=route(g().player,[x,y]);let segment=1,last=0;
  const trail=$('#walk-route');if(trail)trail.setAttribute('d',steps.map((a,i)=>(i?'L':'M')+a.join(',')).join(' '));p.classList.add('walking');
  const finish=()=>{p.classList.remove('walking');if(trail)trail.setAttribute('d','');writeLocal();onArrival?.();};
  if(steps.length<2){finish();return;}
  const tick=time=>{if(!p.isConnected)return;let amount=last?Math.min(1,(time-last)/1000)*17:0;last=time;
    while(segment<steps.length&&amount>=0){const target=steps[segment],d=distance(g().player,target);if(d<=amount+.001){g().player=[...target];amount-=d;segment++;}else{const t=amount/d;g().player=[g().player[0]+(target[0]-g().player[0])*t,g().player[1]+(target[1]-g().player[1])*t];break;}}
    p.style.left=g().player[0]+'%';p.style.top=g().player[1]+'%';const marker=$('.mini-player');if(marker){marker.style.left=g().player[0]+'%';marker.style.top=g().player[1]+'%';}if(segment===steps.length)finish();else walkFrame=requestAnimationFrame(tick);
  };walkFrame=requestAnimationFrame(tick);
}
function nextSeason(){return transition(()=>{g().stage++;g().phase=g().stage===4?'final':'explore';viewMode=g().stage===4?'chapter':'map';pastChapter=null;reset();save();render();if(g().stage<4){titleSeen.add(g().stage);stopStory=calendar(seasons[g().stage],g().stage,()=>{});}});}
function hasWorked(i,id){let local=[];try{if(saveMode!=='none')local=JSON.parse(localStorage.getItem(key+'-worked')||'[]');}catch{}return (Array.isArray(local)&&local.includes(i+':'+id))||state.last?.choices[i]===id||Object.values(state.album).some(r=>r.choices[i]===id);}
function rememberWork(i,id){if(saveMode==='none')return;try{const list=JSON.parse(localStorage.getItem(key+'-worked')||'[]');localStorage.setItem(key+'-worked',JSON.stringify([...new Set([...list,i+':'+id])]));}catch{}}
function choosePlan(i,id){selected=id;missionBriefed=false;mission=createMission(i,id);if(hasWorked(i,id)){modal('전에 해 본 작업이에요',`<p>${H(planText(i,id))}</p><div class="account-actions"><button id="work-again" class="secondary">작업 다시 하기</button><button id="work-skip" class="primary">작업 건너뛰기</button></div>`);$('#work-again').onclick=()=>{$('#dialog').close();renderQuest();};$('#work-skip').onclick=()=>{$('#dialog').close();mission.done=true;commit();};}else renderQuest();}
function friendLine(speaker,line,nextLabel,onNext){
  const q=$('#quest');q.classList.add('dialogue-panel');q.setAttribute('aria-label',speaker+'의 말');
  q.innerHTML=`<span class="friend-name">${H(speaker)}</span><p id="villager-line" aria-live="polite"></p><button class="primary" id="read-line">대사 펼치기 →</button>`;
  const text=$('#villager-line'),button=$('#read-line');
  dialogueTyping=typeText(text,line,()=>{button.textContent=nextLabel;});
  button.onclick=()=>{if(text.classList.contains('typewriter'))dialogueTyping.finish();else onNext();};
  button.focus();
}
function renderQuest(){
  const i=pastChapter??Math.min(g().stage,3),s=seasons[i],q=$('#quest');
  dialogueTyping?.stop();
  if(chapterIntro){q.hidden=true;q.replaceChildren();return;}
  q.hidden=false;
  if(pastChapter!==null){const c=s.choices.find(c=>c.id===g().choices[i]);q.classList.add('result-panel');q.innerHTML=`<span class="quest-tag">${s.name}에 남긴 기록</span><h2>${H(planText(i,c.id))}</h2><p class="result-text">${resultCopy(c.result)}</p><button class="primary" id="return-map">전체 지도 보기</button>`;$('#return-map').onclick=()=>transition(()=>{viewMode='map';pastChapter=null;render();});return;}
  if(g().stage===4||g().phase==='final'){q.classList.add('final-panel');final();return;}
  if(g().phase==='result'){
    const c=s.choices.find(c=>c.id===g().choices[g().stage]);q.classList.add('result-panel');
    q.innerHTML=`<span class="quest-tag">${s.speaker} · 선택이 남긴 변화</span><h2>${H(planText(i,c.id))}</h2><p class="result-text">${resultCopy(c.result)}</p><button class="secondary" id="see-world">바뀐 전체 지도 보기</button><button class="primary" id="next">${g().stage===3?'마을 회의로 가기':'다음 계절로 가기'}</button>`;
    $('#see-world').onclick=()=>transition(()=>{viewMode='map';render();});$('#next').onclick=nextSeason;return;
  }
  stopMission();q.classList.remove('result-panel','final-panel','mission-panel','dialogue-panel','choice-panel','task-only');
  if(selected){
    mission ||= createMission(i,selected);const info=missionInfo(i,selected),plan=s.choices.find(c=>c.id===selected);
    if(!missionBriefed){friendLine(s.speaker,info.goal,'작업 시작 →',()=>{missionBriefed=true;renderQuest();});return;}
    q.setAttribute('aria-label',info.title+' 작업');q.classList.add('mission-panel','task-only');
    q.innerHTML=`<div class="quest-heading"><span class="speaker-badge">${info.icon}</span><div><h2>${info.title}</h2><small class="mission-plan-name">${H(planText(i,plan.id))}</small></div></div><div class="task-area"><div id="work"></div></div><div class="quest-footer"><p id="task-note"></p><div><button class="secondary" id="plan-back">다시 고르기</button><button class="secondary" id="reset-mission">미션 다시 하기</button><button class="primary" id="commit" disabled>작업 마치기</button></div></div>`;
    $('#plan-back').onclick=()=>{reset();renderQuest();};$('#reset-mission').onclick=()=>{stopMission();mission=createMission(i,selected);renderQuest();};$('#commit').onclick=commit;
    stopMission=mountMission($('#work'),mission,done=>{if(!$('#commit'))return;$('#commit').disabled=!done;$('#task-note').textContent=done?'일을 마쳤어요.':'';$('#reset-mission').hidden=done;});return;
  }
  if(!spokenSeasons.has(i)){friendLine(s.speaker,s.line,'방법 고르기 →',()=>{spokenSeasons.add(i);renderQuest();});return;}
  q.classList.add('choice-panel');q.setAttribute('aria-label','방법 고르기');
  q.innerHTML=`<div class="choices">${s.choices.map((c,j)=>`<button class="choice" data-plan="${c.id}"><span>${j+1}</span><strong>${planSentences[i][j]}</strong></button>`).join('')}</div>`;
  $$('[data-plan]').forEach(b=>b.onclick=()=>{const id=b.dataset.plan;for(const asset of [paintedWorldAssets[i],...(i===2&&id==='spray'?[paintedWorldAssets[4]]:[])]){const painting=new Image();painting.src=asset;}choosePlan(i,id);});
  $('[data-plan]')?.focus();

}
function commit(){
  if(!mission?.done||mission.stage!==g().stage||mission.id!==selected||!seasons[g().stage].choices.some(c=>c.id===selected))return;
  const before=[...g().choices],i=g().stage;stopMission();rememberWork(i,selected);g().choices[i]=selected;g().phase='result';save();render();const scene=$('.chapter-scene'),old=document.createElement('div');old.className='previous-scene';old.innerHTML=worldSVG({choices:before,chapter:i,stage:i,instance:'before'});scene.append(old);const buttons=$$('#quest button');buttons.forEach(b=>b.disabled=true);requestAnimationFrame(()=>requestAnimationFrame(()=>old.classList.add('dissolving')));setTimeout(()=>{old.remove();if(scene.isConnected)buttons.forEach(b=>b.disabled=false);},1900);
}
function final(){
  const q=$('#quest');q.classList.add('meeting-records');
  q.innerHTML=`<span class="quest-tag">冬 · 겨울의 마지막 기록</span><h2>우리가 고른 네 계절</h2><div class="meeting-journal">${seasons.map((s,i)=>`<p><b>${icons[i]} ${s.name}</b><span>${H(planText(i,g().choices[i]))}</span></p>`).join('')}</div><button class="primary" id="attend-meeting">마을 회의 참석하기 →</button>`;
  $('#attend-meeting').onclick=()=>{
    q.classList.remove('meeting-records','final-panel');
    friendLine(seasons[3].speaker,'네 계절 동안 함께 준비해 주어서 고마워요. 우리가 고른 방법을 앞으로도 이어 갈까요?','계획 고르기 →',()=>{
      dialogueTyping?.stop();q.classList.remove('dialogue-panel');q.classList.add('choice-panel');q.setAttribute('aria-label','다음 봄의 계획 고르기');
      q.innerHTML='<div class="final-choices"><button id="keep"><strong>지금 계획대로 진행한다.</strong></button><button id="repair"><strong>담당 어른들과 문제가 된 방법을 고친다.</strong></button></div>';
      $('#keep').onclick=()=>finish(false);$('#repair').onclick=()=>finish(true);$('#keep').focus();
    });
  };
}

function finish(repair){const choices=[...g().choices],id=resolveEnding(choices,repair),fresh=!state.album[id];state.album[id]={choices,repair};state.last={choices,repair};state.game=null;save();cinema({id,choices,repair},fresh);}
function modal(title,html){const d=$('#dialog');d.innerHTML=`<div class="dialog-head"><h2>${title}</h2><button id="close" aria-label="닫기">×</button></div><div class="dialog-body">${html}</div>`;$('#close').onclick=()=>d.close();if(!d.open)d.showModal();return d;}
function recordDialog(i){if(!g()?.choices[i])return;const s=seasons[i],c=s.choices.find(c=>c.id===g().choices[i]);modal(`${icons[i]} ${s.name}의 기록`,`<p class="record-date">${s.month} · ${s.area}</p><h3>${c.name}</h3><p>${c.result}</p>`);if(c.id==='wait')savedPhotos();}
function savedPhotos(){const d=$('#dialog'),strip=document.createElement('div');strip.className='saved-photos';strip.setAttribute('aria-label','작물 관찰 사진');d.querySelector('.dialog-body').append(strip);for(let i=0;i<3;i++)photo(i).then(src=>{if(!strip.isConnected)return;const image=document.createElement('img');image.src=src;image.alt='가을에 남긴 작물 사진 '+(i+1);strip.append(image);}).catch(()=>{});}
function journal(){const a=g()?.choices||state.last?.choices||[null,null,null,null];modal('🎒 내 모험 기록',`<div class="journal-pages">${seasons.map((s,i)=>`<button class="journal-entry ${a[i]?'written':''}" data-record="${i}"><span>${icons[i]}</span><div><strong>${s.name} · ${s.area}</strong><p>${a[i]?planText(i,a[i]):'아직 기록하지 않았어요.'}</p></div></button>`).join('')}</div>`);$$('[data-record]').forEach(b=>b.onclick=()=>{if(g()?.choices[b.dataset.record])recordDialog(Number(b.dataset.record));else if(a[b.dataset.record]){const i=Number(b.dataset.record),c=seasons[i].choices.find(c=>c.id===a[i]);modal(`${icons[i]} ${seasons[i].name}의 기록`,`<h3>${c.name}</h3><p>${c.result}</p>`);if(c.id==='wait')savedPhotos();}});}
function openAlbum(page=0){page=page===1?1:0;modal(`📖 엔딩 앨범 ${count()}/10`,`<p class="album-lead">다른 선택으로 새로운 이야기를 찾아보세요.</p><div class="album-grid">${endings.slice(page*5,page*5+5).map(e=>`<button class="ending-card ${state.album[e.id]?'found':'locked'}" data-ending="${e.id}"><span>${state.album[e.id]?'✦':'🔒'}</span><small>${e.id}</small><strong>${state.album[e.id]?e.title:'아직 펼치지 않은 이야기'}</strong></button>`).join('')}</div><div class="album-nav"><button id="prev" ${page===0?'disabled':''}>◀ 앞장</button><span>${page+1}/2</span><button id="next-page" ${page===1?'disabled':''}>다음 장 ▶</button></div>`);$('#prev').onclick=()=>openAlbum(0);$('#next-page').onclick=()=>openAlbum(1);$$('[data-ending]').forEach(b=>b.onclick=()=>albumDetail(b.dataset.ending));}
function albumDetail(id){const e=endings.find(e=>e.id===id),r=state.album[id];modal(`${id} · ${r?e.title:'새 엔딩의 단서'}`,`<p>${r?'이 이야기를 이미 발견했어요. 영화처럼 다시 볼 수 있어요.':state.last?e.hint:'첫 모험을 마치면 새 이야기의 단서를 볼 수 있어요.'}</p>${r?'<button class="primary" id="rewatch">엔딩 다시 보기</button>':''}${state.last?'<button id="album-new-run" class="primary">처음부터 다른 선택 해보기</button>':''}<button class="text-button" id="album-back">앨범으로 돌아가기</button>`);if(r)$('#rewatch').onclick=()=>cinema({id,...r});$('#album-back').onclick=()=>openAlbum(id>'E05'?1:0);if($('#album-new-run'))$('#album-new-run').onclick=()=>start(0);}
function cinema(r,fresh=false){
  clearInterval(cinemaTimer);$('#dialog').close();$('.cinema')?.remove();
  const e=endings.find(e=>e.id===r.id),guided=fresh||e.tone==='dark',baseLines=endingText(r.id,r.choices),lines=[...baseLines.slice(0,-1),...humanConsequences(r.choices),baseLines.at(-1)].map(endingLine);music.setScene(e.tone);
  const c=document.createElement('section');c.className='cinema '+e.tone;
  c.innerHTML=`<div class="cinema-top"><span>초록마을 · 다음 봄</span><div>${musicUI()}${r.choices[2]==='wait'?'<button id="ending-photos">관찰 사진</button>':''}<button id="cinema-save" data-cloud-status title="다른 기기로 이동하기 전에 눌러 주세요">${cloudLabel()}</button><button id="pause">잠깐 멈춤</button><button id="speed">빠르게</button><button id="all">전체 보기</button><button id="type">크레딧 다시 보기</button></div></div><div class="cinema-body"><section class="ending-world" aria-label="이 엔딩에서 내가 만든 마을"><div class="ending-world-label"><strong>내 선택이 남긴 초록마을</strong><small>${r.repair?'뒤늦은 대책도 피해를 모두 지우지는 못해요':'네 계절 동안 바뀐 풍경'}</small></div><div class="ending-world-map"><div class="world-plane">${worldSVG({choices:r.choices,ending:true,repair:r.repair,stage:4})}</div></div><div class="ending-world-records">${seasons.map((s,i)=>`<span><strong>${icons[i]} ${s.area}</strong>${choiceLabel(i,r.choices[i])}</span>`).join('')}</div></section><div class="credits-window" id="credits-window"><div class="credits"><small>ENDING ${r.id.slice(1)} / 10</small><h1>${e.title}</h1><div id="lines"></div></div></div></div><div class="cinema-bottom"><div><strong>${fresh?'새 엔딩을 발견했어요!':'다시 만난 이야기'} · ${count()}/10</strong><small>${saveMode==='none'?'저장 없이 플레이 중이에요.':playerAccount()?'기기를 바꾸기 전 ☁ 저장 버튼을 눌러 주세요.':'이 기기에 모험을 기록했어요.'}</small></div><button class="ending-learning" id="ending-learning" disabled>내 선택 돌아보기</button>${e.tone==='dark'?'<button class="ending-effort" id="ending-effort" disabled>생태계를 위해 노력하기</button>':''}<button id="cinema-album">📖 엔딩 앨범</button><button class="primary" id="replay" ${guided?'disabled':''}>다른 선택 해보기</button></div>`;
  document.body.append(c);$('#app').inert=true;endingLocked=guided;$('#cinema-album').disabled=guided;$('#cinema-save').disabled=guided;bindMusic();if($('#ending-photos'))$('#ending-photos').onclick=()=>{modal('가을에 남긴 관찰 사진','<p>관리를 기다리며 기록한 세 곳의 모습이에요.</p>');savedPhotos();};$('#cinema-save').onclick=()=>$('#save-cloud').click();
  let paused=false,speed=1,lastTime=0,position=0,reflectionOffered=false;
  const unlock=()=>{endingLocked=false;for(const b of $$('#replay,#cinema-album,#cinema-save,#ending-learning,#ending-effort'))b.disabled=false;};
  const effortPrompt=()=>flowPrompt('다음 봄을 위해', '마을에 남길 노력이나 동물에게 전할 마음을 적어 볼까요?', '생태계를 위해 노력하기',()=>learn('effort',true));
  const learn=(mode='report',required=false)=>openLearning({record:r,storageKey:key,saveEnabled:saveMode!=='none',mode,required,onComplete:()=>{if(required&&mode==='report'&&e.tone==='dark')effortPrompt();else if(required)unlock();}});
  const reflectionPrompt=()=>flowPrompt('내가 만든 마을', '내가 줄인 문제와 아직 남은 문제를 함께 살펴봐요.', '내 선택 돌아보기',()=>learn('report',true));
  $('#ending-learning').onclick=()=>learn();if($('#ending-effort'))$('#ending-effort').onclick=()=>learn('effort');
  const win=$('#credits-window'),credits=win.querySelector('.credits'),world=c.querySelector('.ending-world');
  const pictureButton=document.createElement('button');pictureButton.id='reveal-ending';pictureButton.textContent='마을 그림 보기 →';credits.append(pictureButton);
  const textOnly=()=>{c.classList.remove('credits-finished');world.setAttribute('aria-hidden','true');world.inert=true;win.removeAttribute('aria-hidden');win.inert=false;};
  const revealPicture=()=>{clearInterval(cinemaTimer);$('#pause').disabled=true;$('#speed').disabled=true;win.setAttribute('aria-hidden','true');win.inert=true;world.removeAttribute('aria-hidden');world.inert=false;c.classList.add('credits-finished');$('#ending-learning').disabled=guided&&endingLocked;if($('#ending-effort'))$('#ending-effort').disabled=guided&&endingLocked;if(guided&&!reflectionOffered){reflectionOffered=true;setTimeout(()=>{if(c.isConnected&&c.classList.contains('credits-finished'))reflectionPrompt();},1900);}else if(!guided)unlock();};
  pictureButton.onclick=revealPicture;
  const roll=()=>{clearInterval(cinemaTimer);textOnly();$('#ending-learning').disabled=true;if($('#ending-effort'))$('#ending-effort').disabled=true;pictureButton.hidden=true;$('#lines').innerHTML=lines.map(s=>`<p>${H(s)}</p>`).join('');c.classList.add('rolling');c.classList.remove('reading-all');win.scrollTop=0;position=win.clientHeight*.9;credits.style.transform=`translateY(${position}px)`;paused=false;speed=1;lastTime=performance.now();$('#pause').disabled=false;$('#speed').disabled=false;$('#pause').textContent='잠깐 멈춤';$('#speed').textContent='빠르게';
    cinemaTimer=setInterval(()=>{const now=performance.now(),dt=Math.min(1,(now-lastTime)/1000);lastTime=now;if(paused||$('#dialog').open)return;position-=dt*35*speed;credits.style.transform=`translateY(${position}px)`;const lastLine=$('#lines p:last-child');if(position<=-(lastLine.offsetTop+lastLine.offsetHeight))revealPicture();},30);
  };
  $('#type').onclick=roll;$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'계속 읽기':'잠깐 멈춤';};$('#speed').onclick=()=>{speed=speed===1?2.5:1;$('#speed').textContent=speed===1?'빠르게':'천천히';};
  $('#all').textContent='글 전체 보기';$('#type').textContent='엔딩 다시 보기';
  $('#all').onclick=()=>{clearInterval(cinemaTimer);textOnly();c.classList.remove('rolling');c.classList.add('reading-all');credits.style.transform='';$('#lines').innerHTML=lines.map(s=>`<p>${H(s)}</p>`).join('');pictureButton.hidden=false;win.scrollTop=0;$('#pause').disabled=true;$('#speed').disabled=true;};$('#cinema-album').onclick=openAlbum;$('#replay').onclick=replayDialog;
  roll();
}
function flowPrompt(title,text,label,onContinue){const c=$('.cinema');if(c)c.inert=true;const d=modal(title,`<p>${H(text)}</p><button class="primary flow-continue" id="flow-continue">${label} →</button>`);d.classList.add('flow-prompt');$('#close').hidden=true;d.oncancel=e=>e.preventDefault();$('#flow-continue').onclick=()=>{d.close();d.classList.remove('flow-prompt');d.oncancel=null;if(c)c.inert=false;onContinue();};$('#flow-continue').focus();}
function replayDialog(){if(endingLocked)return;start(0);}
function startDialog(initial='device',resumeGuest=false){
 const guestRecord=resumeGuest?state:null;
 modal('초록마을로 출발',`<form id="start-form"><label>마을에서 사용할 이름<input name="nickname" maxlength="16" minlength="2" required autocomplete="off" value="${H(localName)}" placeholder="이름이나 별명 (2~16자)"></label><div class="start-modes"><label><input type="radio" name="mode" value="device" ${initial==='device'?'checked':''}> 이 기기에 저장</label><label><input type="radio" name="mode" value="online" ${initial==='online'?'checked':''}> 다른 기기에서도 이어 하기</label></div><div id="online-fields" ${initial==='online'?'':'hidden'}><div class="login-tabs"><button type="button" id="start-login" class="active">로그인</button><button type="button" id="start-signup">처음 가입</button></div><label>학교 이름<input name="school" minlength="2" maxlength="60" autocomplete="organization" placeholder="학교 이름"></label><label>비밀번호<input name="password" type="password" minlength="8" maxlength="128" autocomplete="current-password" placeholder="8자 이상"></label><p class="small-note">같은 학교·이름·비밀번호로 다른 기기에서 이어 해요.</p></div><p id="start-error" class="form-error" role="status"></p><button type="submit" class="primary" id="start-submit">${initial==='online'?'로그인하고 이어 하기':'모험 시작하기'}</button></form><button class="text-button" id="start-nosave">저장 없이 바로 플레이</button>`);
 let create=false;const form=$('#start-form'),update=()=>{const online=form.elements.mode.value==='online';$('#online-fields').hidden=!online;form.elements.school.required=online;form.elements.password.required=online;form.elements.school.disabled=!online;form.elements.password.disabled=!online;$('#start-submit').textContent=online?(create?'가입하고 모험 시작':'로그인하고 이어 하기'):'모험 시작하기';};form.querySelectorAll('[name=mode]').forEach(r=>r.onchange=update);$('#start-login').onclick=()=>{create=false;$('#start-login').classList.add('active');$('#start-signup').classList.remove('active');form.elements.password.autocomplete='current-password';update();};$('#start-signup').onclick=()=>{create=true;$('#start-signup').classList.add('active');$('#start-login').classList.remove('active');form.elements.password.autocomplete='new-password';update();};
 $('#start-nosave').onclick=()=>{saveMode='none';localName='';key='eco-village-unsaved';state=freshState();$('#dialog').close();start(0);};
 form.onsubmit=async ev=>{ev.preventDefault();const f=new FormData(form),name=String(f.get('nickname')).normalize('NFKC').trim();if(name.length<2||name.length>16){$('#start-error').textContent='이름은 2~16자로 입력해 주세요.';return;}if(f.get('mode')==='online'){saveMode='online';$('#start-submit').disabled=true;try{await cloud.signIn({school:f.get('school'),nickname:name,password:f.get('password'),create});$('#dialog').close();if(!g())start(0);else render();}catch(e){$('#start-error').textContent=cloud.authMessage(e);$('#start-submit').disabled=false;}}else{saveMode='device';localName=name;key='eco-village-local-v2-'+encodeURIComponent(name);try{localStorage.setItem('eco-village-local-name',name);}catch{}state=guestRecord||readLocal();if(guestRecord)save();$('#dialog').close();if(g())render();else start(0);}};update();
}
function accountDialog(){const a=playerAccount();if(a){modal('☁ 내 학교 계정',`<h3>${H(a.school)} · ${H(a.nickname)}</h3><p>${cloudStatus==='conflict'?'다른 기기에 더 최근 기록이 있어요. 불러오기로 확인해 주세요.':'기기에는 바로 저장하고, 온라인에는 10분마다 묶어 저장해요. 기기를 바꾸거나 수업을 마칠 때 지금 저장하기를 눌러 주세요.'}</p><div class="account-actions"><button class="primary" id="sync">지금 저장하기</button><button id="pull">온라인 기록 불러오기</button><button id="logout">저장하고 로그아웃</button></div><p class="form-error" id="account-error"></p>`);$('#sync').onclick=async()=>{try{cloud.queueCloud(state);await cloud.flushCloud();toast('온라인 저장 완료');$('#dialog').close();}catch(e){$('#account-error').textContent=cloud.authMessage(e);}};$('#pull').onclick=async()=>{const pending={...state};try{const remote=await cloud.loadCloud();state=remote;state.album={...pending.album,...remote.album};pastChapter=null;viewMode='auto';reset();save();$('#dialog').close();render();toast('온라인 기록을 불러왔어요.');}catch(e){$('#account-error').textContent=cloud.authMessage(e);}};$('#logout').onclick=async()=>{try{cloud.queueCloud(state);await cloud.signOut();$('#dialog').close();home();}catch(e){$('#account-error').textContent='온라인 저장이 안 되어 로그아웃을 멈췄어요. 연결을 확인해 주세요.';}};return;}
  startDialog('online');
}
function conflictDialog(){accountDialog();}
function help(){modal('🌿 마을 모험 안내',`<div class="help-copy"><p>전체 지도에서 장소에 들어가면 그곳의 풍경과 대화가 펼쳐져요. 네 계절을 이어 가요. 가고 싶은 곳을 터치하세요. 길을 따라 걸어가요. 조사 수첩은 지도에서 열 수 있어요. 아래쪽 만나기 버튼을 누르면 길을 따라 주민을 찾아가요.</p><p>계획을 고르면 짧은 작업 미션이 열려요. 도로 설계, 배관 끌어 잇기, 솔 청소, 잎 조사, 씨앗 심기, 농약 뿌리기, 사진 촬영, 컵 쌓기와 분리배출 등이 있어요. 도구를 끌거나 물건과 놓을 곳을 차례로 눌러도 돼요. 시간이 지나도 실패하지 않아요. 미션이 끝나면 계획을 실행해요.</p><p>선택의 결과는 실행한 뒤 나타나요. 실행한 선택에 따라 도로·하천·농장·축제장의 모습이 달라져요. 전체 지도에서도 변화가 남고, 이미 방문한 장소를 누르면 풍경과 기록을 다시 볼 수 있어요.</p><p>10개의 엔딩을 모아요. 앨범에는 새 엔딩의 단서가 있어요. 다른 선택으로 도전할 때는 봄부터 다시 시작해요. 전에 끝낸 작업은 건너뛸 수 있어요.</p><p>계정으로 로그인하면 온라인에 10분마다 자동 저장해요. 기기를 바꾸기 전에는 ‘지금 저장하기’를 눌러 주세요. 공유 태블릿에서는 모험 뒤 ‘저장하고 로그아웃’을 눌러 주세요.</p><p>위쪽 소리 버튼으로 배경음악을 켜고 끌 수 있어요. 음표 버튼에서 음량을 조절해요. 결말을 만난 뒤에는 음악도 이야기 분위기에 맞게 바뀌어요.</p><p class="small-note">가상의 생태계 이야기입니다. 공사·농약·시설 관리는 담당 어른들이 합니다. 생물의 죽음을 직접 설명하는 결말이 있습니다. 배경은 AI로 제작한 일러스트입니다.</p></div>`);}
$('#dialog').addEventListener('click',e=>{if(e.target===$('#dialog')&&!$('#dialog').classList.contains('flow-prompt')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
cloud.onCloudStatus((status)=>{cloudStatus=status;if(status==='error'&&booting){booting=false;home();toast('온라인 연결을 확인해 주세요. 체험은 계속할 수 있어요.');}if(status==='saved')writeLocal();document.querySelectorAll('#save-cloud,[data-cloud-status]').forEach(b=>b.textContent=cloudLabel());});
home();cloud.initCloud((profile,remote)=>{booting=false;saveMode=profile?'online':'device';key=profile?'eco-village-'+profile.uid:localName?'eco-village-local-v2-'+encodeURIComponent(localName):'eco-village-guest-v2';const local=readLocal();let recover=false;if(profile&&remote){let base=-1;try{base=Number(localStorage.getItem(key+'-base')??-1);}catch{}recover=base===cloud.version()&&local.updatedAt>remote.updatedAt;state=recover?local:remote;const more=Object.keys(local.album).some(id=>!state.album[id]);state.album={...local.album,...state.album};recover ||= more;writeLocal();}else state=local;cloudStatus=profile?'online':'guest';reset();home();if(recover){cloud.queueCloud(state);toast('이 기기에 남은 기록도 이어서 저장해요.');}}).catch(()=>{booting=false;cloudStatus='error';home();toast('온라인 연결이 어려워요. 체험은 계속할 수 있어요.');});
