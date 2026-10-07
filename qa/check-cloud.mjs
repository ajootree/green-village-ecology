import {firebaseConfig as config} from '../dist/firebase-config.mjs';
import {identityEmail,freshState} from '../dist/state.mjs';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
const root=`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
async function student(label){const email=await identityEmail('저장 검증용 학교',label+Date.now().toString().slice(-6));const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:'Eco!'+randomBytes(16).toString('hex'),returnSecureToken:true})});assert.equal(r.status,200);return r.json();}
function value(v){if(v===null)return {nullValue:null};if(typeof v==='string')return {stringValue:v};if(typeof v==='boolean')return {booleanValue:v};if(typeof v==='number')return Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v};if(Array.isArray(v))return {arrayValue:{values:v.map(value)}};return {mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,value(x)]))}};}
async function write(a,data){return fetch(root+':commit',{method:'POST',headers:{Authorization:'Bearer '+a.idToken,'Content-Type':'application/json'},body:JSON.stringify({writes:[{update:{name:`projects/${config.projectId}/databases/(default)/documents/ecoPlayers/${a.localId}`,fields:value(data).mapValue.fields},updateTransforms:[{fieldPath:'updatedAt',setToServerValue:'REQUEST_TIME'}]}]})});}
const a=await student('규칙확인A'),b=await student('규칙확인B');
const data={school:'저장 검증용 학교',nickname:'규칙확인',revision:0,progress:freshState()};
const initial=await write(a,data);assert.equal(initial.status,200,await initial.text());
const get=(token,tail)=>fetch(root+tail,{headers:token?{Authorization:'Bearer '+token}:{}});
assert.equal((await get(a.idToken,'/ecoPlayers/'+a.localId)).status,200);
assert.equal((await get(b.idToken,'/ecoPlayers/'+a.localId)).status,403);
assert.equal((await get(null,'/ecoPlayers/'+a.localId)).status,403);
assert.equal((await get(a.idToken,'/ecoPlayers')).status,403);
assert.equal((await write(a,{...data,revision:1,school:'변조한 학교'})).status,403);
assert.equal((await write(a,{...data,revision:1,progress:{...freshState(),album:{E99:{choices:[],repair:false}}}})).status,403);
assert.equal((await write(a,{...data,revision:1})).status,200);
console.log('PASS: own create/read/update; denied: other user, anonymous, collection listing, profile modification, invalid ending.');
