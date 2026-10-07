import assert from 'node:assert/strict';
import {seasons} from '../dist/model.mjs';
import {learningReport,humanConsequences,effortReady,cleanEffort,effortText} from '../dist/learning.mjs';
let routes=0;
for(const s of seasons[0].choices)for(const w of seasons[1].choices)for(const f of seasons[2].choices)for(const l of seasons[3].choices)for(const repair of [false,true]){
 const a=[s.id,w.id,f.id,l.id],r=learningReport(a,repair);routes++;
 assert.equal(r.results.length,5);assert.equal(r.helped.length+r.remaining.length,5);
 const result=id=>r.results.find(x=>x.id===id);
 assert.equal(result('soil').level==='remaining',f.id==='spray');
 assert.equal(result('air').level==='remaining',l.id==='burn');
 assert.equal(result('water').level==='remaining',w.id!=='treat'||f.id==='spray');
 assert.equal(result('habitat').level==='remaining',s.id==='cut'||s.id==='garden'||f.id==='garden'||f.id==='spray');
 assert.equal(result('waste').level==='remaining',l.id!=='reuse');
 assert(r.results.every(x=>x.chain.length===4&&x.chain.every(Boolean)));
 assert.equal(Boolean(r.repairNote),repair);assert(humanConsequences(a).length>0);
 if(repair)assert.deepEqual(r.results,learningReport(a,false).results,'Late promises do not erase the observed harm.');
}
assert.throws(()=>learningReport(['cut','treat',null,'burn']));
const bird=humanConsequences(['garden','treat','care','reuse']).join('');assert(bird.includes('작물')&&bird.includes('주민'));
const pesticide=learningReport(['corridor','treat','spray','reuse']);assert(pesticide.remaining.some(x=>x.id==='water'));
const untouched=['corridor','treat','care','reuse'];assert.equal(learningReport(untouched).remaining.length,0);
const invalid={kind:'campaign',message:'지켜요',reason:'물고기가 살아요',action:'컵을 다시 써요',partner:'친구',when:''};assert(!effortReady(invalid));
const valid={...invalid,when:'오늘부터'};assert(effortReady(valid));assert(effortText(valid).includes('오늘부터'));
assert.equal(cleanEffort({...valid,message:'x'.repeat(500)}).message.length,260);
assert.equal(cleanEffort({kind:'unexpected'}),null);
console.log(`Learning checked across ${routes} outcomes; pollution sources, habitat distinction, irreversible harm and writing validation passed.`);
