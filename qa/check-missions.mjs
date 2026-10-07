import assert from 'node:assert/strict';
import {seasons,resolveEnding} from '../dist/model.mjs';
import {createMission,actMission,missionInfo,missionProgress,connectedTiles} from '../dist/missions.mjs';

const expected=[10,12,0,6,9,0,3,10,10];
let tested=0;
for(let stage=0;stage<4;stage++)for(const choice of seasons[stage].choices){
  const m=createMission(stage,choice.id);
  assert(missionInfo(stage,choice.id).goal);
  assert.equal(m.done,false,'No plan is prepared before interaction.');
  const before=JSON.stringify(m);
  for(const bad of [-5,20,null,NaN])actMission(m,'turn',bad);
  assert.equal(JSON.stringify(m),before,'Invalid actions cannot prepare the plan.');
  if(m.kind==='plumb'){
    actMission(m,'valve');assert.equal(m.values[0],0,'Do not open an unfinished pipeline.');
    actMission(m,'fit',0,1);assert.equal(m.marks[0],0,'Wrong-shaped pipes do not fit.');
    for(let i=0;i<3;i++)actMission(m,'fit',i,i);
    assert(!m.done);actMission(m,'valve');
  }else if(m.kind==='stack'){
    actMission(m,'switch',0);assert(!m.lights[0]);
    for(let i=0;i<5;i++)actMission(m,'cup');
    assert(!m.done);for(let i=0;i<3;i++)actMission(m,'switch',i);
  }else if(m.kind==='ignite'){
    for(let i=0;i<39;i++)actMission(m,'rub');assert(!m.done);actMission(m,'rub');
  }else if(m.kind==='spray'){
    for(let i=0;i<12;i++)actMission(m,'spray',i);assert(!m.done);
    for(let n=0;n<2;n++)for(let i=0;i<12;i++)actMission(m,'spray',i);
  }else if(m.kind==='connect'){
    assert(!connectedTiles(m.tiles).includes(8)||!(m.tiles[8]&2));
    for(let i=0;i<9;i++)for(let n=0;n<4&&m.tiles[i]!==expected[i];n++)actMission(m,'turn',i);
    assert(connectedTiles(m.tiles).includes(8));
  }else if(m.kind==='scrub'){
    for(let i=0;i<6;i++)actMission(m,'scrub',i);
    assert(!m.done,'One tap on every stain is not enough.');
    for(let n=0;n<3;n++)for(let i=0;i<6;i++)actMission(m,'scrub',i);
  }else if(m.kind==='plant'){
    for(let i=0;i<6;i++)actMission(m,'plant',i);
    assert(!m.done,'Sown seeds still need water.');
    for(let n=0;n<2;n++)for(let i=0;i<6;i++)actMission(m,'plant',i);
  }else if(m.kind==='survey'){
    actMission(m,'record',0);assert.equal(m.marks[0],0,'Evidence must be inspected before recording.');
    actMission(m,'route',1);assert(!m.done,'A lucky guess cannot skip the survey.');
    for(let i=0;i<3;i++){
      const other=(i+1)%3,previous=m.marks[other];
      actMission(m,'observe',i);actMission(m,'record',other);
      assert.equal(m.marks[other],previous,'A different site cannot be recorded without inspecting it.');
      actMission(m,'record',i);
      const progress=missionProgress(m)[0];actMission(m,'record',i);assert.equal(missionProgress(m)[0],progress);
    }
    assert(!m.done,'Observations alone do not identify a crossing.');
    for(const wrong of [0,2]){actMission(m,'route',wrong);assert(!m.done);assert.equal(m.values[0],0);assert(m.message);}
    actMission(m,'route',1);
  }else if(m.kind==='inspect'){
    actMission(m,'record',4);assert(!m.done);
    for(let i=0;i<3;i++)actMission(m,'record',i);
  }else if(m.kind==='haul'){
    for(let i=0;i<6;i++)actMission(m,'load',i);
  }else if(m.kind==='paint'){
    for(let i=0;i<12;i++)actMission(m,'paint',i);
  }else if(m.kind==='tune'){
    actMission(m,'tune',0,NaN);assert.equal(m.values[0],0);
    [25,50,75].forEach((value,i)=>actMission(m,'tune',i,value));
  }else if(m.kind==='memory'){
    m.showing=true;actMission(m,'memory',1);assert.equal(m.index,0,'Switch input cannot skip the demonstration.');m.showing=false;
    const sequences=choice.id==='party'?[[0,2,1],[1,0,2,1]]:[[1,0,2],[2,1,0,2]];
    actMission(m,'memory',(sequences[0][0]+1)%3);assert.equal(m.index,0);
    for(const seq of sequences)for(const value of seq)actMission(m,'memory',value);
  }else if(m.kind==='sort'){
    actMission(m,'light',0);assert(m.lights[0],'Lights are the second task.');
    actMission(m,'sort',0,'plastic');assert.equal(m.marks[0],0,'Wrong bins do not collect an item.');
    ['cup','paper','plastic','cup','paper','plastic'].forEach((bin,i)=>actMission(m,'sort',i,bin));
    assert(!m.done,'Returning items alone does not finish the lighting task.');
    for(let i=0;i<3;i++)actMission(m,'light',i);
  }
  assert(m.done,`${stage}:${choice.id} must be achievable`);
  const [done,total]=missionProgress(m);assert.equal(done,total);
  const complete=JSON.stringify(m);actMission(m,'turn',0);assert.equal(JSON.stringify(m),complete);
  tested++;
}
assert.throws(()=>createMission(0,'spray'));
// Task performance prepares the chosen plan, never rewrites its narrative outcome.
assert.equal(resolveEnding(['cut','treat','care','reuse'],false),'E08');
console.log(`Missions: ${tested} plans achievable; incomplete work, wrong inputs, sorting, memory, and story outcomes: passed`);
