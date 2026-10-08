import {seasons} from '/model.mjs';
import {villagerImage} from '/characters.mjs';
import {storyCards,arrivals} from '/story.mjs';
const select=document.querySelector('#speaker'),panel=document.querySelector('#quest');
select.innerHTML=seasons.map((s,i)=>`<option value="${i}">${s.speaker}</option>`).join('');
function draw(){const s=seasons[Number(select.value)];panel.innerHTML=`<img class="friend-character" src="${villagerImage(s.speaker)}" alt="${s.speaker}" draggable="false"><span class="friend-name">${s.speaker}</span><p id="villager-line">${s.line}</p><button class="primary" id="read-line">방법 고르기 →</button>`;}
select.onchange=draw;draw();
document.querySelector('#intro').onclick=()=>storyCards([arrivals[Number(select.value)][1]],()=>{});
