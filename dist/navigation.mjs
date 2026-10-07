// Footpaths follow the dirt lanes and bridges in the painted village.
export const nodes = [[25,29],[24,38],[23,47],[31,56],[39,62],[43,69],[49,73],[55,71],[62,67],[64,58],[67,50],[65,45],[60,43],[55,37],[51,36],[47,35],[42,38],[35,42],[28,47],[56,28],[58,20],[66,18],[74,23],[83,25],[86,35],[90,44],[86,54],[86,62],[77,66],[71,65]];
export const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,2],[13,19],[19,20],[20,21],[21,22],[22,23],[23,24],[24,25],[25,26],[26,27],[27,28],[28,29],[29,8],[10,26]];
export const destinations = [nodes[0],nodes[15],nodes[22],nodes[27]];
export const homePoint = nodes[8];
const distance=(a,b)=>Math.hypot(a[0]-b[0],(a[1]-b[1])*.5625);
export function project(point){
  let best;
  edges.forEach(([a,b],edge)=>{const p=nodes[a],q=nodes[b],dx=q[0]-p[0],dy=(q[1]-p[1])*.5625,t=Math.max(0,Math.min(1,((point[0]-p[0])*dx+(point[1]-p[1])*.5625*dy)/(dx*dx+dy*dy))),at=[p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])],d=distance(point,at);if(!best||d<best.distance)best={point:at,edge,t,distance:d};});
  return best;
}
export function route(from,to){
  const s=project(from),t=project(to),points=[...nodes,s.point,t.point],start=nodes.length,end=start+1;
  const links=edges.map(([a,b])=>[a,b]);
  for(const [p,k] of [[s,start],[t,end]])for(const n of edges[p.edge])links.push([k,n]);
  if(s.edge===t.edge)links.push([start,end]);
  const dist=points.map(()=>Infinity),prev=[];dist[start]=0;const todo=new Set(points.map((_,i)=>i));
  while(todo.size){const at=[...todo].reduce((a,b)=>dist[a]<dist[b]?a:b);todo.delete(at);if(at===end||!Number.isFinite(dist[at]))break;for(const [a,b] of links){const next=a===at?b:b===at?a:null;if(next===null||!todo.has(next))continue;const d=dist[at]+distance(points[at],points[next]);if(d<dist[next]){dist[next]=d;prev[next]=at;}}}
  const out=[end];while(out[0]!==start){const p=prev[out[0]];if(p===undefined)return [s.point];out.unshift(p);}return out.map(i=>points[i]).filter((p,i,a)=>!i||distance(p,a[i-1])>.001);
}
export function directionalTarget(from,direction){
  const v=({left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]})[direction];if(!v)return from;
  const candidates=nodes.filter(p=>distance(p,from)>.3).map(p=>{const r=route(from,p),next=r[1]||p,dx=next[0]-from[0],dy=(next[1]-from[1])*.5625,len=Math.hypot(dx,dy);return {r,score:(dx*v[0]+dy*v[1])/len};}).filter(c=>c.score>.15).sort((a,b)=>b.score-a.score);
  const chosen=candidates[0];if(!chosen)return from;const next=chosen.r[1],d=distance(from,next),t=Math.min(1,4/d);return [from[0]+(next[0]-from[0])*t,from[1]+(next[1]-from[1])*t];
}
export function pathSVG(){return `<svg class="walking-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="path-soft"><feGaussianBlur stdDeviation=".3"/></filter></defs><g fill="none" stroke-linecap="round" stroke-linejoin="round">${edges.map(([a,b])=>`<path d="M${nodes[a]}L${nodes[b]}"/>`).join('')}</g><path id="walk-route" d=""/></svg>`;}
export {distance};
