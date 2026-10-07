import {firebaseConfig} from './firebase-config.mjs';
import {cleanState,mergeAlbum,identityEmail,normalIdentity} from './state.mjs';
export const configured=!!firebaseConfig?.projectId;
export const AUTO_SAVE_MS=10*60*1000;
let sdk,auth,db,profile=null,revision=0,pending=null,timer=null,saving=false,savingTask=null,listener=()=>{},lastWrite=0,committed='',onAccountChanged=()=>{},creating=false;
function signature(state){const {updatedAt,...content}=cleanState(state);return JSON.stringify(content);}
function schedule(delay=AUTO_SAVE_MS){if(!timer)timer=setTimeout(()=>{timer=null;flushCloud().catch(()=>{});},delay);}
export const account=()=>profile;
export const version=()=>revision;
export const onCloudStatus=fn=>listener=fn;
export async function initCloud(onAccount){
  onAccountChanged=onAccount;
  if(!configured)return;
  const [app,A,F]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')]);
  sdk={...A,...F};const a=app.initializeApp(firebaseConfig);auth=A.getAuth(a);db=F.initializeFirestore(a,{experimentalAutoDetectLongPolling:true});await A.setPersistence(auth,A.browserSessionPersistence);
  A.onAuthStateChanged(auth,async user=>{if(creating)return;try{await hydrate(user);}catch(e){profile=null;listener('error',e.code);}});
}
async function hydrate(user){clearTimeout(timer);timer=null;pending=null;revision=0;committed='';lastWrite=Date.now();if(!user){profile=null;onAccountChanged(null,null);return;}const snap=await sdk.getDoc(sdk.doc(db,'ecoPlayers',user.uid));const data=snap.data();if(!data)throw new Error('계정의 초기 기록을 만들지 못했어요. 다시 가입 화면에서 시도해 주세요.');profile={uid:user.uid,school:data.school,nickname:data.nickname};revision=data.revision||0;committed=signature(data.progress);listener('online');onAccountChanged(profile,cleanState(data.progress));return profile;}
export async function signIn({school,nickname,password,create}){
  if(!configured||!auth)throw new Error('계정 저장 서버를 준비하고 있어요. 지금은 체험하기를 이용해 주세요.');
  const [s,n]=normalIdentity(school,nickname);if(password.length<8||password.length>128)throw new Error('비밀번호는 8~128자로 입력해 주세요.');const email=await identityEmail(s,n);
  creating=true;try{let r;if(create){try{r=await sdk.createUserWithEmailAndPassword(auth,email,password);}catch(e){if(e.code!=='auth/email-already-in-use')throw e;r=await sdk.signInWithEmailAndPassword(auth,email,password);const exists=await sdk.getDoc(sdk.doc(db,'ecoPlayers',r.user.uid));if(exists.exists())return await hydrate(r.user);}await sdk.setDoc(sdk.doc(db,'ecoPlayers',r.user.uid),{school:s,nickname:n,revision:0,progress:cleanState(null),updatedAt:sdk.serverTimestamp()});}else r=await sdk.signInWithEmailAndPassword(auth,email,password);return await hydrate(r.user);}finally{creating=false;}
}
export async function signOut(){await flushCloud();await sdk.signOut(auth);}
export function queueCloud(state){if(!profile)return;pending=structuredClone(state);if(!saving&&signature(pending)===committed){pending=null;clearTimeout(timer);timer=null;listener('saved');return;}listener('pending');schedule(Math.max(1000,AUTO_SAVE_MS-(Date.now()-lastWrite)));}
export async function flushCloud(options={}){if(savingTask){await savingTask;if(pending)return flushCloud(options);return;}savingTask=writeCloud(options);try{return await savingTask;}finally{savingTask=null;}}
async function writeCloud({overwrite=false}={}){
  if(!profile||!pending)return;if(saving)return;clearTimeout(timer);timer=null;saving=true;listener('saving');const snapshot=pending;const uid=profile.uid;
  let retry=true,retryDelay=AUTO_SAVE_MS;try{const result=await sdk.runTransaction(db,async tx=>{const ref=sdk.doc(db,'ecoPlayers',uid);const remote=await tx.get(ref);const data=remote.data();if(!overwrite&&(data?.revision||0)!==revision){const error=new Error('다른 기기에 더 최근 기록이 있어요. 먼저 불러오세요.');error.code='eco/conflict';throw error;}const progress=cleanState(snapshot);progress.album=mergeAlbum(data?.progress,progress);const next=(data?.revision||0)+1;tx.set(ref,{school:profile.school,nickname:profile.nickname,revision:next,progress,updatedAt:sdk.serverTimestamp()});return {revision:next,progress};});revision=result.revision;committed=signature(result.progress);lastWrite=Date.now();if(pending===snapshot||signature(pending)===committed)pending=null;listener(pending?'pending':'saved');}
  catch(e){retry=!['eco/conflict','permission-denied'].includes(e.code);if(['resource-exhausted','quota-exceeded'].includes(e.code))retryDelay=60*60*1000;listener(e.code==='eco/conflict'?'conflict':'error',e.code);throw e;}finally{saving=false;if(retry&&pending)schedule(retryDelay);}
}
export async function loadCloud(){if(!profile)return null;if(savingTask)await savingTask;clearTimeout(timer);timer=null;const snap=await sdk.getDoc(sdk.doc(db,'ecoPlayers',profile.uid));const data=snap.data();revision=data?.revision||0;pending=null;committed=signature(data?.progress);lastWrite=Date.now();listener('saved');return cleanState(data?.progress);}
export function authMessage(error){const code=error.code;return ({'auth/email-already-in-use':'이 학교·닉네임은 이미 있어요. 로그인하거나 다른 닉네임을 골라 주세요.','auth/invalid-credential':'학교·닉네임·비밀번호를 다시 확인해 주세요.','auth/wrong-password':'비밀번호를 다시 확인해 주세요.','auth/user-not-found':'아직 등록되지 않았어요. 처음 가입을 눌러 주세요.','auth/too-many-requests':'접속이 몰렸어요. 잠시 뒤 다시 시도해 주세요.','auth/operation-not-allowed':'학교 계정 로그인을 준비하고 있어요.','auth/network-request-failed':'인터넷 연결을 확인해 주세요.','permission-denied':'기록 저장 권한을 확인할 수 없어요.'})[code]||error.message||'연결이 어려워요. 잠시 뒤 다시 시도해 주세요.';}
