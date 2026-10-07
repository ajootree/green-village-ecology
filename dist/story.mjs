export const setting = [
  {title:'초록마을에 온 것을 환영해요',text:'여기는 숲과 하천, 농장이 있는 작은 마을이에요. 주민들은 다음 봄에 열릴 마을 축제를 준비하고 있어요.',icon:'🌿'},
  {title:'네 계절 동안 함께 준비해요',text:'당신은 마을의 새 주민이에요. 봄에는 민우, 여름에는 하람, 가을에는 도윤, 겨울에는 은솔을 만나게 돼요. 모두 축제를 위해 당신의 의견을 기다리고 있어요.',icon:'🏡'},
  {title:'어떤 마을을 만들고 싶나요?',text:'빠른 길, 깨끗한 물, 건강한 작물, 즐거운 축제. 주민들의 바람은 서로 달라요. 이야기를 듣고, 당신이 하고 싶은 일을 골라 주세요.',icon:'💬'},
  {title:'마을을 걸어 다녀요',text:'지도에서 가고 싶은 곳을 누르면 길을 따라 걸어가요. 지금 만날 주민이 있는 장소를 누르면 그곳으로 이동해요. 방향키나 화면의 화살표로도 걸을 수 있어요.',icon:'👣'},
  {title:'당신이 만든 다음 봄',text:'일을 마치면 마을 풍경이 바뀌어요. 겨울이 끝나면 당신이 만든 마을의 다음 봄을 만나게 돼요. 서로 다른 선택으로 열 개의 이야기를 모아 보세요.',icon:'📖'}
];
export const arrivals = [
  [{title:'축제장으로 가는 숲길',text:'축제장에 가려면 숲을 돌아가는 길을 지나야 해요. 마을에서는 더 빨리 갈 수 있는 새 도로를 만들자는 이야기가 나오고 있어요.'},{title:'숲에서 기다리는 민우',text:'이 숲에는 토끼와 새, 작은 곤충들이 살아요. 민우는 주민들에게 편한 길을 만들고 싶어 해요. 길을 어떻게 만들지, 당신에게 묻고 있어요.',speaker:'민우'}],
  [{title:'여름의 하천',text:'더워진 마을에서 주민들은 하천을 찾았어요. 그런데 물 위에는 쓰레기가 떠 있고, 물가의 작업장에서는 탁한 물이 흘러나오고 있어요.'},{title:'하람의 걱정',text:'하람은 축제 손님들이 이곳을 찾기 전에 하천을 돌보고 싶어 해요. 하지만 쓸 수 있는 돈은 정해져 있어요. 어디에 먼저 돈을 써야 할까요?',speaker:'하람'}],
  [{title:'수확을 앞둔 농장',text:'가을이 되었어요. 도윤은 축제에서 주민들과 나눌 작물을 기르고 있어요. 그런데 밭의 잎에 벌레가 먹은 구멍이 보이기 시작했어요.'},{title:'농장에는 누가 살까요?',text:'밭에는 작물을 먹는 벌레도, 꽃가루를 옮기는 벌도, 벌레를 잡는 거미도 살고 있어요. 도윤은 작물을 지킬 방법을 당신과 함께 정하려고 해요.',speaker:'도윤'}],
  [{title:'축제 준비의 마지막 겨울',text:'겨울이 되었어요. 은솔은 다음 봄 축제에 사용할 컵과 조명을 준비하고 있어요. 사람들이 모인 뒤에는 쓰레기도 남게 될 거예요.'},{title:'축제가 끝난 뒤까지',text:'은솔은 축제 당일의 준비와 뒷정리를 고민하고 있어요. 물건을 얼마나 준비하고, 사용한 물건은 어떻게 처리할지 당신의 의견을 기다려요.',speaker:'은솔'}]
];
export function typeText(element,text,done=()=>{}){
  let at=0,finished=false;
  element.textContent='';element.classList.add('typewriter');
  const finish=()=>{if(finished)return;finished=true;clearInterval(timer);element.textContent=text;element.classList.remove('typewriter');done();};
  const timer=setInterval(()=>{element.textContent=text.slice(0,++at);if(at===text.length)finish();},30);
  return {finish,stop:()=>{finished=true;clearInterval(timer);}};
}
export function storyCards(cards,onEnd){
  const overlay=document.createElement('section');overlay.className='story-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','마을 이야기');document.body.append(overlay);
  let index=0,typing;
  const draw=()=>{typing?.stop();const card=cards[index];overlay.innerHTML=`<div class="story-card"><div class="story-portrait ${card.speaker?'villager':''}">${card.speaker?`<span class="villager-head"></span><span class="villager-body"></span><b>${card.speaker}</b>`:card.icon||'🌿'}</div><small>${card.speaker?card.speaker+'을 만나기 전에':'초록마을의 이야기'} · ${index+1}/${cards.length}</small><h1>${card.title}</h1><p id="story-text"></p><button class="primary" id="story-next">${index===cards.length-1?'마을로 들어가기':'다음 이야기'} →</button></div>`;typing=typeText(overlay.querySelector('p'),card.text);overlay.querySelector('button').onclick=()=>{if(overlay.querySelector('p').classList.contains('typewriter')){typing.finish();return;}if(++index===cards.length){typing.stop();overlay.remove();onEnd?.();}else draw();};overlay.querySelector('button').focus();};draw();
  return ()=>{typing?.stop();overlay.remove();};
}
let transitioning=false;
export async function transition(action){
  if(transitioning)return;transitioning=true;const cover=document.createElement('div');cover.className='scene-fade';cover.setAttribute('aria-label','장소로 이동 중');document.body.append(cover);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  try{await wait(40);cover.classList.add('covered');await wait(430);await action();await wait(160);cover.classList.remove('covered');await wait(450);}finally{cover.remove();transitioning=false;}
}
export function calendar(season,index,onEnd){
  const o=document.createElement('section');o.className='calendar-overlay';o.setAttribute('role','dialog');o.setAttribute('aria-label',season.name+' 챕터');const month=parseInt(season.month),old=month===4?1:month===7?4:month===10?7:10;
  o.innerHTML=`<div class="chapter-film"><small>CHAPTER ${index+1}</small><div class="calendar-book"><div class="calendar-page next-page"><small>초록마을 달력</small><strong>${month}</strong><span>${season.name}</span></div><div class="calendar-page turning-page"><small>초록마을 달력</small><strong>${old}</strong><span>${index?'지난 계절':'새로운 해'}</span></div><i></i><i></i></div><h1>${season.name} · ${season.title}</h1><p>${season.area}</p><button class="secondary">이야기 시작 →</button></div>`;document.body.append(o);
  const button=o.querySelector('button');button.disabled=true;const timer=setTimeout(()=>{button.disabled=false;button.focus();},1100);button.onclick=()=>{clearTimeout(timer);o.remove();onEnd();};return ()=>{clearTimeout(timer);o.remove();};
}
