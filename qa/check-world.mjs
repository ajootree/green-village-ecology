import assert from 'node:assert/strict';
import {seasons} from '../dist/model.mjs';
import {freshState,cleanState} from '../dist/state.mjs';
import {worldSVG,worldChanges,regions} from '../dist/world.mjs';

const empty=[null,null,null,null];
assert(!worldSVG({choices:empty}).includes('data-world-change'), 'Unmade choices must not appear in the world.');
assert(!worldSVG({choices:empty,chapter:0}).includes('change-road'), 'No road is previewed before execution.');
assert(worldSVG({choices:empty,chapter:1}).includes('change-river baseline'), 'The river shows its existing problem, not a proposed result.');
for(const s of seasons[0].choices)for(const w of seasons[1].choices)for(const f of seasons[2].choices)for(const l of seasons[3].choices){
  const choices=[s.id,w.id,f.id,l.id];
  const whole=worldSVG({choices,ending:true});
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
console.log('World: 256 routes; chapter/global consistency, no pre-choice outcomes, restored records, and late repair: passed');
