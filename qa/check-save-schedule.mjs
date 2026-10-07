import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

// Exercise the actual cloud module with a fake clock and Firestore; no live accounts.
async function setup(){
  let now=1_000_000,id=0,writes=0,gate=null,failure=null;
  const timers=new Map(),statuses=[];
  let remote={school:'시험 학교',nickname:'검증',revision:0,progress:{schema:2,album:{},game:null,last:null,updatedAt:0}};
  const sdk={getAuth:()=>({}),initializeFirestore:()=>({}),setPersistence:async()=>{},browserSessionPersistence:{},onAuthStateChanged:()=>{},signInWithEmailAndPassword:async()=>({user:{uid:'qa'}}),signOut:async()=>{},doc:()=>({}),getDoc:async()=>({data:()=>structuredClone(remote)}),serverTimestamp:()=>0,
    runTransaction:async(_,fn)=>{if(gate)await gate;if(failure)throw failure;let next;const result=await fn({get:async()=>({data:()=>structuredClone(remote)}),set:(_,data)=>{next=data;}});remote=next;writes++;return result;}};
  const context=vm.createContext({structuredClone,TextEncoder,crypto:globalThis.crypto,Date:class extends Date{static now(){return now;}},setTimeout:(fn,delay)=>{timers.set(++id,{fn,at:now+delay});return id;},clearTimeout:id=>timers.delete(id)});
  const modules=new Map();
  async function module(url){if(modules.has(url))return modules.get(url);let m;if(url.startsWith('https:')){const exports=url.endsWith('firebase-app.js')?{initializeApp:()=>({})}:sdk;m=new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v] of Object.entries(exports))this.setExport(k,v);},{context,identifier:url});}else m=new vm.SourceTextModule(await fs.readFile(fileURLToPath(url),'utf8'),{context,identifier:url,importModuleDynamically:async(spec,parent)=>{const child=await module(new URL(spec,parent.identifier).href);if(child.status==='unlinked')await child.link(link);if(child.status!=='evaluated')await child.evaluate();return child;}});modules.set(url,m);return m;}
  const link=(spec,parent)=>module(new URL(spec,parent.identifier).href);
  const m=await module(new URL('../dist/cloud.mjs',import.meta.url).href);await m.link(link);await m.evaluate();const cloud=m.namespace;
  cloud.onCloudStatus(s=>statuses.push(s));await cloud.initCloud(()=>{});await cloud.signIn({school:'시험 학교',nickname:'검증',password:'test-pass',create:false});
  async function settle(){for(let n=0;n<40;n++)await Promise.resolve();}
  return {cloud,statuses,get remote(){return remote;},get writes(){return writes;},get timerCount(){return timers.size;},set gate(value){gate=value;},set failure(value){failure=value;},changeRemote(){remote.revision++;},async advance(ms){const target=now+ms;while(true){const due=[...timers.entries()].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;now=due[1].at;timers.delete(due[0]);due[1].fn();await settle();}now=target;await settle();}};
}
const state=(n=0)=>({schema:2,album:{},last:null,updatedAt:7,game:{stage:0,phase:'explore',choices:[null,null,null,null],player:[10+n%80,50]}});

const classSession=await setup();
for(let n=0;n<240;n++){classSession.cloud.queueCloud(state(n));await classSession.advance(30_000);}
await classSession.cloud.signOut();
assert.equal(classSession.remote.progress.game.player[0],10+239%80);
assert.ok(classSession.writes<=13,`too many writes: ${classSession.writes}`);
const before=classSession.writes;classSession.cloud.queueCloud({...state(239),updatedAt:999});await classSession.cloud.flushCloud();assert.equal(classSession.writes,before,'timestamp-only save should not cost a write');

const concurrent=await setup();let release;concurrent.gate=new Promise(r=>release=r);
concurrent.cloud.queueCloud(state(1));const first=concurrent.cloud.flushCloud();
concurrent.cloud.queueCloud(state(2));const second=concurrent.cloud.flushCloud();release();await Promise.all([first,second]);
assert.equal(concurrent.writes,2);assert.equal(concurrent.remote.progress.game.player[0],12,'newer edits with the same timestamp must survive an in-flight write');

const offline=await setup();offline.failure=Object.assign(new Error('offline'),{code:'unavailable'});offline.cloud.queueCloud(state(3));await assert.rejects(offline.cloud.flushCloud());assert.equal(offline.writes,0);assert.equal(offline.timerCount,1);offline.failure=null;await offline.cloud.signOut();assert.equal(offline.remote.progress.game.player[0],13,'logout must save retained offline edits');

const conflict=await setup();conflict.cloud.queueCloud(state(4));conflict.changeRemote();await assert.rejects(conflict.cloud.flushCloud(),e=>e.code==='eco/conflict');assert.equal(conflict.writes,0);assert.equal(conflict.timerCount,0,'conflict must not automatically overwrite another device');
console.log(`PASS: two-hour session ${classSession.writes} writes; 800 new students including signup <= ${(classSession.writes+1)*800} writes. Deduplication, concurrent edits, offline recovery, logout and conflict protection passed.`);
