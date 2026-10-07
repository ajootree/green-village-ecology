import assert from 'node:assert/strict';
import {nodes,edges,project,route,destinations,homePoint,distance,directionalTarget} from '../dist/navigation.mjs';
const liesOnPath=p=>project(p).distance<.00001;
let routes=0;
for(const from of [homePoint,...destinations,[12,82],[88,3]])for(const to of [...destinations,[7,65],[99,90]]){
  const r=route(from,to);assert(distance(r[0],project(from).point)<.001);assert(distance(r.at(-1),project(to).point)<.001);
  for(let i=1;i<r.length;i++)for(let t=0;t<=1;t+=.1){const p=r[i-1].map((v,k)=>v+(r[i][k]-v)*t);assert(liesOnPath(p),'Every step remains on a lane, including clicks beyond the road.');}
  routes++;
}
for(const at of nodes)for(const dir of ['left','right','up','down'])assert(liesOnPath(directionalTarget(at,dir)));
assert(route(destinations[0],destinations[3]).length>4,'Across-village travel uses intermediate waypoints.');
console.log(`Navigation: ${routes} routed journeys and all keyboard directions stay on painted footpaths.`);
