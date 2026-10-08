import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {seasons} from '../dist/model.mjs';
import {freshState,cleanState} from '../dist/state.mjs';
import {worldSVG,worldChanges,regions,paintedWorldAssets} from '../dist/world.mjs';

for(const asset of paintedWorldAssets){
  const data=readFileSync(new URL('../dist/'+asset,import.meta.url));
  assert.equal(data.toString('ascii',0,4),'RIFF');
  assert.equal(data.toString('ascii',8,12),'WEBP','Painted states must have real deployable image assets.');
}
const empty=[null,null,null,null];
assert(!worldSVG({choices:empty}).includes('data-world-change'), 'Unmade choices must not appear in the world.');
assert(!worldSVG({choices:empty,chapter:0}).includes('change-road'), 'No road is previewed before execution.');
assert(worldSVG({choices:empty,chapter:1}).includes('change-river baseline'), 'The river shows its existing problem, not a proposed result.');
for(const s of seasons[0].choices)for(const w of seasons[1].choices)for(const f of seasons[2].choices)for(const l of seasons[3].choices){
  const choices=[s.id,w.id,f.id,l.id];
  const whole=worldSVG({choices,ending:true});
  assert(!/<(?:path|circle|ellipse|text)\b|stroke=/.test(whole),'Environmental changes use paintings, not geometric illustration stand-ins.');
  for(const asset of paintedWorldAssets.slice(0,4))assert(whole.includes(asset));
  assert.equal(whole.includes(paintedWorldAssets[4]), f.id==='spray', 'Farm runoff appears only after excessive pesticide use.');
  for(let i=0;i<4;i++){
    const scene=worldSVG({choices,chapter:i});
    assert(scene.includes(`viewBox="${regions[i].box}"`));
    assert(scene.includes(`data-world-change="${i}:${choices[i]}"`));
    assert(whole.includes(`data-world-change="${i}:${choices[i]}"`));
  }
  const saved=freshState();saved.game={stage:3,phase:'result',choices,player:[50,65]};
  const restored=cleanState(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(worldChanges(restored.game.choices), choices);
}
const road=['cut','treat','care','reuse'];
assert(worldSVG({choices:road,ending:true,repair:true}).includes('change-road cut'), 'Late repair does not erase the original road.');
assert(worldSVG({choices:road,ending:true,repair:true}).includes('late-repair'));
assert(worldSVG({choices:['corridor',null,null,null]}).includes('동물 통로'));
assert(!worldSVG({choices:['cut',null,null,null]}).includes('동물 통로'));
assert(!worldSVG({choices:['cut',null,null,null]}).includes('treatment-plant'));
assert(!worldSVG({choices:empty,stage:3}).includes('change-runoff'));
const secondSource=['corridor','treat','spray','burn'];
for(const chapter of [null,1,2,3]){
 const svg=worldSVG({choices:secondSource,chapter});
 assert(svg.includes('change-runoff runoff'), 'A repaired workshop does not remove later farm pollution.');
 assert(svg.includes('과도한 농약이 남은 흙'));
 assert(svg.includes('대기오염'));
 assert(svg.includes('y="398"'), 'Smoke remains visible above the plaza.');
}
assert(worldSVG({choices:secondSource,ending:true,repair:true}).includes('change-runoff runoff'));
const unrepaired=worldSVG({choices:['detour','hide','spray','reuse'],ending:true});
assert(unrepaired.includes('change-river hide'));
assert(!unrepaired.includes('change-river treat'));
assert(unrepaired.indexOf('change-river harm')>unrepaired.indexOf('change-runoff runoff'), 'Later runoff must not hide the ending fish.');
console.log('World: 256 routes; chapter/global consistency, no pre-choice outcomes, restored records, and late repair: passed');
