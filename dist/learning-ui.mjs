import {topics,learningReport,animals,cleanEffort,effortReady,effortText,animalsFor,animalMessage} from './learning.mjs';
const H=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={reduced:'줄이기 시작했어요',protected:'피해를 예방했어요',remaining:'아직 남아 있어요'};
export function openLearning({record,storageKey,mode='report',required=false,onComplete=()=>{},saveEnabled=true}){
 document.querySelector('.learning-screen')?.remove();
 const report=learningReport(record.choices,record.repair);
 const parent=document.querySelector('.cinema'),restoreFocus=document.activeElement;
 if(parent)parent.inert=true;
 const screen=document.createElement('section');screen.className='learning-screen';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label',mode==='report'?'내 선택 돌아보기':'생태계를 위해 노력하기');
 document.body.append(screen);
 const key=storageKey+'-effort-'+record.id+'-'+record.choices.join('-')+(record.repair?'-repair':'');
 let stored;try{if(saveEnabled)stored=JSON.parse(localStorage.getItem(key)||'null');}catch{}
 let draft=cleanEffort(stored?.draft)||cleanEffort({kind:'campaign',topic:report.remaining[0]?.id||'habitat'}),completed=stored?.complete===true&&effortReady(draft),page=0;
 const close=()=>{screen.remove();if(parent?.isConnected)parent.inert=false;if(restoreFocus?.isConnected)restoreFocus.focus();};
 screen.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();if(!required)close();}if(e.key==='Tab'){const nodes=[...screen.querySelectorAll('button:not(:disabled),input,textarea,select,a[href]')].filter(e=>e.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
 const saveDraft=()=>{if(!saveEnabled)return true;try{localStorage.setItem(key,JSON.stringify({draft,complete:completed}));return true;}catch{return false;}};
 const finishPage=()=>{close();onComplete();};
 const shell=(body,footer)=>{screen.classList.add('separate-pages');screen.innerHTML=`<header class="learning-head"><div><small>${record.id} · 네 계절 뒤의 기록</small><h1>${mode==='report'?'내 선택 돌아보기':'생태계를 위해 노력하기'}</h1></div>${required?'':'<button id="learning-close" aria-label="닫기">×</button>'}</header><main class="learning-body">${body}</main><footer class="learning-footer">${footer}</footer>`;const button=screen.querySelector('#learning-close');if(button)button.onclick=close;screen.querySelector('h1').tabIndex=-1;screen.querySelector('h1').focus();};
 function reportPage(){
  if(page===0){const group=(rs,title,cls)=>`<section class="report-group ${cls}"><h2>${title}</h2>${rs.length?rs.map(r=>{const t=topics.find(t=>t.id===r.id);return `<button class="report-entry" data-topic="${topics.indexOf(t)+1}"><span>${t.icon}</span><div><strong>${t.name}</strong><p>${r.summary}</p></div><b>›</b></button>`;}).join(''):`<p class="report-empty">${cls==='helped'?'이번 선택에서는 피해를 충분히 줄인 분야를 찾지 못했어요. 남은 문제에서 바꿀 방법을 찾아보세요.':'이번 선택에서는 다섯 분야의 피해를 줄이거나 예방했어요. 다음 계절에도 점검과 관리가 필요해요.'}</p>`}</section>`;
   shell(`<div class="report-intro"><h2>내가 줄인 문제, 아직 남은 문제</h2><p>내 선택 → 환경의 변화 → 생물의 변화 → 우리 생활을 차근차근 이어 보세요.</p></div><div class="report-overview">${group(report.helped,'줄이거나 예방한 문제','helped')}${group(report.remaining,'아직 남은 문제','remaining')}</div><p class="report-caveat">${report.repairNote||'좋은 선택도 한 번으로 끝나지 않아요. 이 수첩은 이야기 속 선택을 돌아보는 기록이에요.'}</p>`,`<small>1 / 6 · 한 분야를 눌러도 자세히 볼 수 있어요.</small><button class="primary" id="report-next">토양오염부터 알아보기 →</button>`);
  }else{
   const t=topics[page-1],r=report.results[page-1];
   shell(`<section class="knowledge-title"><span>${t.icon}</span><div><small>생태계에 미친 영향</small><h2>${t.name}</h2><p>${t.definition}</p></div><b class="learning-badge ${r.level}">${labels[r.level]}</b>${r.extra?`<button class="concept-more" popovertarget="concept-extra">함께 생각해요</button><div class="concept-popover" id="concept-extra" popover><p>${r.extra}</p><button popovertarget="concept-extra" popovertargetaction="hide">닫기</button></div>`:''}</section><div class="knowledge-grid"><section class="concept-card"><section><h3>내 선택</h3><p>${r.chain[0]}</p><h3>이번 마을에서는</h3><p>${r.summary}</p></section><section><h3>어떤 활동에서 생길까요?</h3><p>${t.example}</p></section></section></div><section class="cooperate-card"><p><strong>내가 할 수 있는 일</strong>${t.me}</p><p><strong>사회·국가가 함께 할 일</strong>${t.together}</p></section>`,`<button id="report-prev">← 앞장</button><small>${page+1} / 6</small><button class="primary" id="report-next">${page===5?'돌아보기 마치기 →':'다음 장 →'}</button>`);
  }
  screen.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.topic);render();});
  const prev=screen.querySelector('#report-prev');if(prev)prev.onclick=()=>{page--;render();};
  screen.querySelector('#report-next').onclick=()=>{if(page===5){finishPage();return;}page++;render();};
 }
 function effortPage(){
  const choices=animalsFor(record.choices),a=animals.find(a=>a.id===draft.animal),letter=draft.kind==='letter';
  const fields=letter?`<label>${a.name}에게 하고 싶은 말<textarea name="message" maxlength="260" rows="5" placeholder="안부도, 미안한 마음도, 앞으로의 약속도 좋아요.">${H(draft.message)}</textarea></label>`:`<label>해야 할 노력<textarea name="action" maxlength="120" rows="4" placeholder="마을을 지키려면 어떤 노력이 필요할까요?">${H(draft.action)}</textarea></label><label>나의 다짐<textarea name="message" maxlength="260" rows="4" placeholder="나는 앞으로 이렇게 해 볼 거예요.">${H(draft.message)}</textarea></label>`;
  shell(`<div class="effort-intro"><h2>다음 봄에 남기는 마음</h2></div><div class="effort-switch"><button data-kind="campaign" aria-pressed="${!letter}">📣 캠페인</button><button data-kind="letter" aria-pressed="${letter}">✉ 동물에게 편지</button></div><div class="effort-grid ${letter?'letter-work':'campaign-work'}">${letter?`<aside class="effort-guide"><label>편지를 받을 동물<select id="effort-animal">${choices.map(an=>`<option value="${an.id}" ${a.id===an.id?'selected':''}>${an.name}${an.related.length?' · '+an.related.map(id=>topics.find(t=>t.id===id).name).join('·'):''}</option>`).join('')}</select></label><div class="animal-profile"><span>${a.icon}</span><h3>${a.name}</h3><small>${a.grade}</small><div class="animal-speech">${animalMessage(a.id,record.choices)}</div></div></aside>`:''}<form id="effort-form" class="effort-form ${letter?'letter-form':'campaign-form'}">${fields}<p id="effort-status" role="status">${letter?'이 동물에게 전하고 싶은 마음을 자유롭게 적어 주세요.':'우리 마을에 필요한 노력과 내가 실천할 다짐을 적어 주세요.'}</p></form></div>`,`<small>${saveEnabled?'쓴 글은 이 기기에 저장돼요.':'저장 없이 플레이 중이에요. 그림으로 받아 둘 수 있어요.'}</small><button class="primary" id="effort-complete" ${effortReady(draft)?'':'disabled'}>${letter?'편지 마무리하기':'다짐 남기기'} →</button>`);
  screen.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{draft.kind=b.dataset.kind;if(draft.kind==='letter'&&!stored?.draft?.animal)draft.animal=animalsFor(record.choices)[0].id;completed=false;saveDraft();render();});
  const select=screen.querySelector('#effort-animal');if(select)select.onchange=()=>{draft.animal=select.value;completed=false;saveDraft();render();};
  screen.querySelector('#effort-form').onsubmit=e=>e.preventDefault();
  screen.querySelectorAll('#effort-form textarea').forEach(el=>el.oninput=()=>{draft[el.name]=el.value;completed=false;const saved=saveDraft();screen.querySelector('#effort-complete').disabled=!effortReady(draft);screen.querySelector('#effort-status').textContent=saved?(saveEnabled?'쓴 글을 이 기기에 보관했어요.':'마음을 담아 적고 있어요.'):'기기 저장 공간이 부족해요. 완성 후 그림으로 받아 두세요.';});
  screen.querySelector('#effort-complete').onclick=()=>{if(!effortReady(draft))return;completed=true;saveDraft();mode='card';render();};
 }
 function cardPage(){const letter=draft.kind==='letter',a=animals.find(a=>a.id===draft.animal);
  shell(`<article class="effort-card ${letter?'letter-card':'campaign-card'}"><small>초록마을 · 다음 봄에 남기는 마음</small><div class="card-emblem">${letter?a.icon:'🌿'}</div><h2>${letter?a.name+'에게 보내는 편지':'초록마을을 지키는 캠페인'}</h2>${letter?`<p class="card-message">${H(draft.message)}</p>`:`<div class="campaign-messages"><section><h3>해야 할 노력</h3><p class="card-message">${H(draft.action)}</p></section><section><h3>나의 다짐</h3><p class="card-message">${H(draft.message)}</p></section></div>`}<p class="card-note">다음 봄에는 이 마음이 작은 실천으로 이어지기를.</p></article>`,`<button id="effort-edit">글 다듬기</button><button id="effort-download">그림으로 받기</button><button class="primary" id="effort-finish">마무리하기 ✓</button>`);
  screen.querySelector('#effort-edit').onclick=()=>{mode='effort';render();};screen.querySelector('#effort-download').onclick=()=>downloadCard(draft);screen.querySelector('#effort-finish').onclick=finishPage;
 }
 function render(){if(mode==='report')reportPage();else if(mode==='card'&&effortReady(draft))cardPage();else effortPage();}
 if(mode==='effort'&&completed)mode='card';render();return close;
}
export function downloadCard(draft){
 const text=effortText(draft),canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1400;
 const ctx=canvas.getContext('2d');ctx.font='26px "Malgun Gothic", sans-serif';
 const lines=[];for(const paragraph of text.split('\n')){let line='';for(const c of paragraph){if(ctx.measureText(line+c).width>820){lines.push(line);line=c;}else line+=c;}lines.push(line);}
 canvas.height=Math.max(700,200+lines.length*45+100);ctx.fillStyle='#f8f0d7';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#91aa70';ctx.lineWidth=5;ctx.strokeRect(35,35,930,canvas.height-70);ctx.fillStyle='#365345';ctx.font='22px "Malgun Gothic", sans-serif';ctx.fillText('초록마을 · 다음 봄을 위한 나의 노력',90,100);ctx.font='26px "Malgun Gothic", sans-serif';lines.forEach((line,i)=>ctx.fillText(line,90,175+i*45));ctx.font='18px "Malgun Gothic", sans-serif';ctx.fillText('다음 봄에는 이 마음이 작은 실천으로 이어지기를.',90,canvas.height-65);
 canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=draft.kind==='letter'?'초록마을_생물에게_보내는_편지.png':'초록마을_보전_캠페인.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);},'image/png');
}
