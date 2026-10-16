import {seasons,endings,resolveEnding} from './model.mjs';
import {cleanState} from './state.mjs';

const paths=seasons.reduce((paths,season)=>paths.flatMap(path=>season.choices.map(c=>[...path,c.id])),[[]]);
const routes=paths.flatMap(choices=>[false,true].flatMap(repair=>{
  const id=resolveEnding(choices,repair);
  return repair&&id!=='E10'?[]:[{id,choices,repair}];
})).sort((a,b)=>endings.findIndex(e=>e.id===a.id)-endings.findIndex(e=>e.id===b.id));

// Only completed seasonal choices constrain a route. A proposed mission can still change.
export function recommendEnding(raw){
  const state=cleanState(raw),game=state.game;
  const stage=game?Math.min(4,game.stage+(game.phase==='result'?1:0)):0;
  const prefix=game?game.choices.slice(0,stage):[];
  const route=routes.find(r=>!state.album[r.id]&&(!r.repair||!state.album.E10)&&prefix.every((id,i)=>r.choices[i]===id));
  return route?{id:route.id,choices:[...route.choices],repair:route.repair,stage,choice:stage<4?route.choices[stage]:route.repair?'repair':'keep'}:null;
}
