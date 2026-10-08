// Scene objects are vector illustrations, so they stay crisp on tablets.
const svg=(body,box='0 0 120 90')=>`<svg viewBox="${box}" aria-hidden="true">${body}</svg>`;
export const springLandscape=()=>svg(`
  <defs><pattern id="road-grain" width="34" height="29" patternUnits="userSpaceOnUse"><path d="m5 8 6 1m12 13 4-1" stroke="#aa8961" stroke-width="1.4" opacity=".5"/><ellipse cx="28" cy="5" rx="2" ry="1" fill="#e8ce9e"/></pattern></defs>
  <path fill="#92b67d" d="M0 0h600v300H0z"/>
  <path fill="#b7cb8c" d="M0 0h600v70Q450 100 320 58T0 78z"/>
  <path fill="#709f67" d="M0 236q110-30 240 15t360-23v72H0z"/>
  <path fill="#8b7753" d="M0 105 65 101 123 115 191 107 249 124 312 120 375 140 447 130 525 147 600 138v105l-78 8-76-18-68 9-70-21-62 7-62-16-65 5-58-14L0 210z"/>
  <path fill="#cfb17d" d="M0 112 65 109 123 123 191 116 249 133 312 130 375 149 447 140 525 157 600 148v85l-78 8-76-18-68 9-70-21-62 7-62-16-65 5-58-14L0 201z"/>
  <path fill="url(#road-grain)" d="M0 112 65 109 123 123 191 116 249 133 312 130 375 149 447 140 525 157 600 148v85l-78 8-76-18-68 9-70-21-62 7-62-16-65 5-58-14L0 201z"/>
  <g fill="#587c4c">${[[25,72],[68,49],[158,76],[226,62],[345,74],[409,91],[547,77],[43,267],[189,266],[476,280]].map(([x,y])=>`<path d="M${x-8} ${y}q-5-19-10-23 12 3 17 16 4-26 14-32-6 24-2 39z"/>`).join('')}</g>
  <g fill="#477450" stroke="#395e3c" stroke-width="2">${[[21,25,35],[112,12,29],[510,13,40],[588,43,30],[270,285,28]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.7}"/><ellipse cx="${x+15}" cy="${y+13}" rx="${r*.7}" ry="${r*.5}" fill="#638f58"/>`).join('')}</g>
  <g fill="#f2dc9c"><circle cx="88" cy="79" r="3"/><circle cx="93" cy="73" r="3"/><circle cx="423" cy="267" r="3"/></g>
`, '0 0 600 300').replace('<svg ', '<svg class="spring-landscape" preserveAspectRatio="none" ');

const branch=svg(`<ellipse cx="59" cy="68" rx="51" ry="8" fill="#55452d" opacity=".18"/><g stroke-linecap="round" stroke-linejoin="round"><path d="m12 72 92-46M39 58 33 22m28 25 8-30M77 40 109 43" stroke="#513d2b" stroke-width="9"/><path d="m12 69 92-46M39 55 33 22m28 23 8-28M77 37 109 40" stroke="#997345" stroke-width="5"/><path d="m17 66 17-8m18-8 12-6m19-8 13-6" stroke="#c39d67" stroke-width="2"/></g><path d="M69 23q-4-19 13-17-1 16-13 17" fill="#79964e"/>`);
const leaves=svg(`<ellipse cx="61" cy="69" rx="47" ry="8" fill="#6b4f30" opacity=".17"/>${[[20,24,-25,'#aa713e'],[52,43,28,'#cc994e'],[73,24,45,'#996537'],[36,54,-47,'#d4ad5b'],[88,54,12,'#b88142']].map(([x,y,r,c])=>`<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 26Q-18 1 3-16 23 7 0 26" fill="${c}" stroke="#785634" stroke-width="1.5"/><path d="m0 30 3-41m-2 25-8-7m9-4 8-6" fill="none" stroke="#785634" stroke-width="1.3"/></g>`).join('')}`);
const soil=svg(`<ellipse cx="61" cy="60" rx="45" ry="18" fill="#93734d" opacity=".58"/><path d="m24 61 12-22 23-8 27 14 15 18-40 8z" fill="#ab8658"/><g fill="#715a40"><ellipse cx="39" cy="54" rx="7" ry="4"/><ellipse cx="70" cy="44" rx="5" ry="3"/><ellipse cx="86" cy="62" rx="6" ry="4"/><circle cx="18" cy="61" r="3"/><circle cx="108" cy="57" r="2"/></g>`);
export const roadDebris=[branch,leaves,soil,branch,leaves,soil];
export const broomArt=svg(`<defs><linearGradient id="straw" x2="1" y2="1"><stop stop-color="#ecd59a"/><stop offset="1" stop-color="#b98a46"/></linearGradient></defs><path d="m151 12-83 101" stroke="#544330" stroke-width="13" stroke-linecap="round"/><path d="m150 12-82 99" stroke="#b38a53" stroke-width="8" stroke-linecap="round"/><path d="m147 17-69 84" stroke="#dfbb7c" stroke-width="2"/><path d="m57 91 29 25-38 61-47-39z" fill="url(#straw)" stroke="#9c713b" stroke-width="2"/><g stroke="#9c713b" stroke-width="2">${[10,18,26,34,42].map(x=>`<path d="m${x} ${139+x*.65} 52-51"/>`).join('')}</g><path d="m52 101 27 23" stroke="#687e52" stroke-width="9"/><path d="m51 98 30 26" stroke="#405c3c" stroke-width="3"/>`, '0 0 180 180');

const rabbitPrint=(x,y)=>`<g transform="translate(${x} ${y})" fill="#705739"><ellipse cx="-11" cy="-9" rx="5" ry="12" transform="rotate(-9)"/><ellipse cx="11" cy="-9" rx="5" ry="12" transform="rotate(9)"/><ellipse cx="-4" cy="15" rx="3" ry="5"/><ellipse cx="4" cy="22" rx="3" ry="5"/></g>`;
const shoePrint=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r})" fill="#765b3c"><path d="M-8-20q18-9 18 8v21H-9z"/><rect x="-9" y="14" width="19" height="12" rx="4"/><path d="m-6-8h13m-13 7h13m-13 7h13" stroke="#bda078" stroke-width="2"/></g>`;
export const traceArt=[svg(shoePrint(36,29,-18)+shoePrint(77,65,-18),'0 0 120 110'),svg(rabbitPrint(37,31)+rabbitPrint(80,83),'0 0 120 120'),svg(`<g stroke="#755c3e" fill="none" stroke-width="5"><path d="M43 0v110M67 0v110"/><path d="${Array.from({length:10},(_,i)=>`M43 ${i*12}l24 8`).join('')}" stroke-width="3"/></g>`,'0 0 120 110')];
// A lens shows one enlarged impression, rather than the whole distant trackway.
export const traceCloseups=[
  svg(shoePrint(36,29,-18),'13 -3 49 65'),
  svg(rabbitPrint(37,31)+'<g fill="#765c3c"><circle cx="55" cy="43" r="3"/><circle cx="59" cy="50" r="3"/><circle cx="51" cy="52" r="3"/></g>','13 0 50 65'),
  traceArt[2].replace('0 0 120 110','30 8 50 64')
];
export const surveySites=[
  {label:'A',x:20,description:'길을 따라 넓은 자국과 네모난 뒤꿈치 자국이 이어져요. 숲 쪽으로 이어지는 흔적은 없어요.'},
  {label:'B',x:52,description:'작은 앞발 두 개와 긴 뒷발 두 개가 한 묶음이에요. 둥근 배설물도 보여요. 길 양쪽 풀숲에 같은 발자국이 이어져요.'},
  {label:'C',x:83,description:'가로줄이 반복되는 두 줄의 자국이 길을 따라 이어져요. 길 건너 풀숲에는 같은 흔적이 없어요.'}
];
