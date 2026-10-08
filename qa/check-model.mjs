import assert from 'node:assert/strict';
import {seasons,endings,resolveEnding,endingText} from '../dist/model.mjs';
const counts={},examples={};
for(const s of seasons[0].choices)for(const w of seasons[1].choices)for(const f of seasons[2].choices)for(const l of seasons[3].choices)for(const repair of [false,true]){
 const a=[s.id,w.id,f.id,l.id],id=resolveEnding(a,repair);counts[id]=(counts[id]||0)+1;examples[id]??={choices:a,repair};
 assert(endings.some(e=>e.id===id));assert(endingText(id,a).every(t=>typeof t==='string'&&t.length>0));
}
assert.equal(Object.keys(counts).length,10,'All endings must be reachable.');
assert.equal(resolveEnding(['corridor','treat','care','reuse']),'E01');
assert.equal(resolveEnding(['cut','treat','care','reuse']),'E08','Changing only the road must change the ending.');
assert.equal(resolveEnding(['cut','treat','care','reuse'],true),'E10','Late repair cannot erase an earlier death.');
assert(endingText('E10',['cut','treat','care','reuse']).join('').includes('죽은 토끼는 살릴 수 없었습니다'));
assert.throws(()=>resolveEnding([null,'treat','care','reuse']));
const result=(i,id)=>seasons[i].choices.find(c=>c.id===id).result;
for(const id of ['treat','clean','hide','share'])assert(result(1,id).includes('수질오염'));
assert(result(2,'spray').includes('토양오염')&&result(2,'spray').includes('수질오염'));
assert(result(3,'burn').includes('대기오염')&&result(3,'burn').includes('학교'));
assert(seasons[2].choices.find(c=>c.id==='spray').name.includes('정해진 양보다 많이'), 'The chosen action must disclose overuse, not punish normal pesticide use.');
assert(endingText('E06',['corridor','treat','spray','reuse']).join('').includes('토양오염'));
assert(endingText('E06',['corridor','treat','care','burn']).join('').includes('대기오염'));
console.log(JSON.stringify({checked:512,reachableEndings:10,counts,examples},null,2));
