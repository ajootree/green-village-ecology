import {seasons} from '/model.mjs';
import {createMission,missionInfo,mountMission} from '/missions.mjs';
import '/_qa/crop-layout.mjs';
const select=document.querySelector('#review-plan'),quest=document.querySelector('#review-quest');
select.innerHTML=seasons.flatMap((s,stage)=>s.choices.map(c=>`<option value="${stage}:${c.id}">${s.name} · ${missionInfo(stage,c.id).title}</option>`)).join('');
let dispose=()=>{};
function open(){
  dispose();const [stageText,id]=select.value.split(':'),stage=Number(stageText),info=missionInfo(stage,id),m=createMission(stage,id);
  document.querySelector('#review-season').textContent=seasons[stage].area+' · '+seasons[stage].name;
  quest.innerHTML=`<div class="quest-heading"><span class="speaker-badge">${info.icon}</span><div><h2>${info.title}</h2><small class="mission-plan-name">${seasons[stage].choices.find(c=>c.id===id).name}</small></div></div><div class="task-area"><div id="work"></div></div><div class="quest-footer"><p id="task-note"></p><div><button id="review-reset" class="secondary">미션 다시 하기</button><button id="review-next" class="secondary">다음 미션 검수</button><button id="review-complete" class="primary" disabled>미션 완료 확인</button></div></div>`;
  document.querySelector('#review-reset').onclick=open;
  document.querySelector('#review-next').onclick=()=>{select.selectedIndex=(select.selectedIndex+1)%select.options.length;open();};
  dispose=mountMission(document.querySelector('#work'),m,done=>{document.querySelector('#review-complete').disabled=!done;document.querySelector('#task-note').textContent=done?'준비 완료 · 실제 게임에서는 선택을 실행할 수 있어요.':'';});
  document.querySelector('#review-complete').onclick=()=>{document.querySelector('#task-note').textContent='완료 조건과 실행 버튼 활성화 확인';};
}
select.onchange=open;open();
