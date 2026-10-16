import assert from 'node:assert/strict';
import {seasons,endings,resolveEnding} from '../dist/model.mjs';
import {recommendEnding} from '../dist/ending-guide.mjs';
const paths=seasons.reduce((a,s)=>a.flatMap(p=>s.choices.map(c=>[...p,c.id])),[[]]);
const routes=paths.flatMap(choices=>[false,true].map(repair=>({id:resolveEnding(choices,repair),choices,repair}))).filter(r=>!r.repair||r.id==='E10');
const album=Object.fromEntries(endings.map(e=>{const r=routes.find(r=>r.id===e.id);return[e.id,{choices:r.choices,repair:r.repair}];}));
const prefixes=new Map(paths.flatMap(p=>Array.from({length:5},(_,i)=>[JSON.stringify(p.slice(0,i)),p.slice(0,i)])));
const masks=[0,1023,...endings.map((_,i)=>1<<i),...endings.map((_,i)=>1023^(1<<i))];
let checked=0;
for(const prefix of prefixes.values())for(const mask of masks){
  const state={album:Object.fromEntries(Object.entries(album).filter((_,i)=>mask&(1<<i))),game:{stage:prefix.length,phase:prefix.length===4?'final':'task',choices:[...prefix,...Array(4-prefix.length).fill(null)],player:[50,65]}};
  const snapshot=JSON.stringify(state),r=recommendEnding(state);
  const possible=routes.filter(p=>!state.album[p.id]&&(!p.repair||!state.album.E10)&&prefix.every((c,i)=>p.choices[i]===c));
  assert.equal(!!r,possible.length>0,'Recommend only an unseen ending reachable from the actual choices.');
  if(r){
    assert(!state.album[r.id]);assert.equal(resolveEnding(r.choices,r.repair),r.id);
    assert(prefix.every((c,i)=>r.choices[i]===c));
    assert.equal(r.stage,prefix.length);
    assert.equal(r.choice,prefix.length===4?r.repair?'repair':'keep':r.choices[prefix.length]);
    assert(!r.repair||!state.album.E10,'Never recommend a used regret choice.');
  }
  assert.equal(JSON.stringify(state),snapshot,'Hints must not change progress or grant an ending.');checked++;
}
const result={album:{E01:album.E01},game:{stage:0,phase:'result',choices:['detour',null,null,null],player:[50,65]}};
assert.equal(recommendEnding(result).stage,1,'A completed season recommends the next season.');
assert.equal(recommendEnding({album:{E01:album.E01},last:album.E01}).choice,'detour','A new run should lead to a different ending.');
assert.equal(recommendEnding({album}),null,'All collected endings need no new recommendation.');
const onlyRegret={album:Object.fromEntries(Object.entries(album).filter(([id])=>id!=='E10')),game:{stage:4,phase:'final',choices:['cut','hide','spray','burn'],player:[50,65]}};
assert.equal(recommendEnding(onlyRegret).choice,'repair');
assert.equal(recommendEnding({...onlyRegret,album}),null);
console.log(`Ending guide: ${checked} progress/album combinations, reachable routes, regret limit and unchanged progress passed.`);
