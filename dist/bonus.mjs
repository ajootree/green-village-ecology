const H=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function bonusLines(name='마을의 새 친구'){
 return ['열 개의 봄을 지나','초록마을의 마지막 편지',
 `${name}, 책장에 열 개의 봄이 모였어요.`,
 '마을이 조용해진 저녁, 숲지기는 낡은 조사 수첩을 펼쳤어요.',
 '어떤 페이지에는 돌아오지 않은 새가, 어떤 페이지에는 다시 맑아지기 시작한 하천이 있었어요.',
 '밭지기는 수확 바구니 옆에 작은 꽃 한 송이를 놓았어요. 물지기는 물고기 관찰 기록을 꺼냈고, 빛지기는 축제에 쓰던 컵을 씻었어요.',
 '“다시 고를 수 있는 건 게임 안에서뿐일지도 몰라요.”',
 '“하지만 내일 할 일은 지금부터 고를 수 있잖아요.”',
 `${name}의 수첩에는 열 개의 이야기가 남았어요. 빠른 길을 고른 날도, 보이지 않던 문제를 알아본 날도 있었어요.`,
 '다음 날 아침, 주민들은 새 계획보다 먼저 마을을 걸었어요. 하천의 물을 살피고, 작물의 잎을 보고, 동물 통로에 남은 작은 발자국을 찾았어요.',
 '한 번 좋은 결말을 만났다고 마을이 영원히 안전해지는 것은 아니었어요. 그래서 주민들은 다음 계절에도 서로의 기록을 나누기로 했어요.',
 '달력이 넘어가고, 초록마을에 열한 번째 봄이 왔어요.',
 '아직 제목이 없는 그 봄은, 오늘 우리가 하는 작은 일에서 시작돼요.',
 `${name}, 열 개의 이야기를 끝까지 만나 주어서 고마워요.`,
 '이제 게임 밖의 우리 마을에서도, 다음 봄을 함께 만들어 가요.',
 '초록마을의 네 계절 · 모든 이야기 수집 완료'];
}
export function playBonus(name,onEnd=()=>{}){
 const parent=document.querySelector('.cinema')||document.querySelector('#app'),wasInert=parent?.inert;if(parent)parent.inert=true;
 const panel=document.createElement('section');panel.className='bonus-story';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','모든 엔딩을 모은 뒤의 이야기');
 panel.innerHTML=`<div class="bonus-window"><div class="bonus-credits">${bonusLines(name).map((s,i)=>i<2?`<h${i+1}>${H(s)}</h${i+1}>`:`<p>${H(s)}</p>`).join('')}</div></div><div class="bonus-actions"><button id="bonus-pause">잠깐 멈춤</button><button id="bonus-speed">빠르게</button><button id="bonus-exit">앨범으로 돌아가기</button></div>`;document.body.append(panel);
 const window=panel.querySelector('.bonus-window'),credits=panel.querySelector('.bonus-credits');let position=window.clientHeight*.8,last=performance.now(),speed=1,paused=false,frame=0;credits.style.transform=`translateY(${position}px)`;
 const previousFocus=document.activeElement;
 const close=()=>{cancelAnimationFrame(frame);panel.remove();if(parent?.isConnected)parent.inert=wasInert;onEnd();if(previousFocus?.isConnected&&!previousFocus.closest('[inert]'))previousFocus.focus();};
 panel.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='Tab'){const buttons=[...panel.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
 const tick=time=>{if(!panel.isConnected)return;if(!paused)position-=Math.min(.1,(time-last)/1000)*32*speed;last=time;credits.style.transform=`translateY(${position}px)`;if(position+credits.scrollHeight>28)frame=requestAnimationFrame(tick);else{panel.classList.add('bonus-finished');panel.querySelector('#bonus-pause').disabled=true;panel.querySelector('#bonus-speed').disabled=true;panel.querySelector('#bonus-exit').focus();}};frame=requestAnimationFrame(tick);
 panel.querySelector('#bonus-pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'계속 읽기':'잠깐 멈춤';};panel.querySelector('#bonus-speed').onclick=e=>{speed=speed===1?2.5:1;e.target.textContent=speed===1?'빠르게':'천천히';};panel.querySelector('#bonus-exit').onclick=close;panel.querySelector('#bonus-pause').focus();return close;
}
