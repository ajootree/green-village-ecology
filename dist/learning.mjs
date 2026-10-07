// Learning is derived from this ending's choices, never from the ending number alone.
import {isValidChoices} from './model.mjs';
export const topics=[
 {id:'soil',icon:'🌱',name:'토양오염',definition:'흙에 해로운 물질이나 쓰레기가 쌓여, 흙에서 사는 생물과 식물이 피해를 받는 일이에요.',example:'농약을 지나치게 쓰거나 쓰레기를 함부로 버리면 생길 수 있어요.',me:'쓰레기를 알맞게 분리배출하고 일회용품을 줄여요.',together:'농약은 담당 어른과 전문가가 기준을 지켜 사용하고, 오염된 흙은 기관이 조사해 관리해요.'},
 {id:'air',icon:'🌬️',name:'대기오염',definition:'우리가 숨 쉬는 공기에 해로운 물질이 섞여 생물에게 피해를 주는 일이에요.',example:'자동차·공장의 매연이나 쓰레기를 함부로 태울 때 나오는 연기가 원인이 될 수 있어요.',me:'일회용품과 에너지 낭비를 줄여요. 쓰레기는 태우지 않고 알맞게 버려요.',together:'사회와 국가는 배출 기준을 정하고, 공장과 처리 시설이 기준을 지키는지 점검해요.'},
 {id:'water',icon:'💧',name:'수질오염',definition:'하천·바다 등의 물에 오염 물질이 들어가 물속 생물과 물을 쓰는 사람에게 피해를 주는 일이에요.',example:'처리하지 않은 생활 하수·공장 폐수, 흘러든 농약이나 플라스틱 쓰레기가 원인이 될 수 있어요.',me:'물가에 쓰레기를 버리지 않고, 일회용 플라스틱 사용을 줄여요.',together:'작업장과 담당 기관은 더러운 물을 처리하고, 배출되는 물과 하천을 계속 점검해요.'},
 {id:'habitat',icon:'🌳',name:'서식지와 먹이 관계',definition:'서식지는 생물이 살며 먹이를 구하고 새끼를 기르는 곳이에요. 생물은 먹고 먹히는 관계로 연결돼요.',example:'숲을 없애거나 길로 나누면 집과 이동로가 사라져요. 한 생물의 감소는 다른 생물에게도 영향을 줄 수 있어요.',me:'야생 생물의 집을 함부로 건드리지 않고, 관찰할 때 거리를 지켜요.',together:'사회와 국가는 생태통로와 보호 구역을 만들고 관리해요. 다양한 생물이 살 공간도 남겨요.'},
 {id:'waste',icon:'♻️',name:'쓰레기와 자원 낭비',definition:'많이 쓰고 버리면 쓰레기가 늘고, 물건을 만드는 데 쓰는 자원과 에너지도 더 필요해져요.',example:'플라스틱이 흙과 물에 남거나, 잘못 태워 공기를 오염시킬 수 있어요. 모든 쓰레기가 세 오염을 한꺼번에 일으키는 것은 아니에요.',me:'다회용 컵을 쓰고, 쓰레기를 분리배출하고, 필요 없는 조명을 꺼요.',together:'학교·가게·마을은 반납함과 수거 담당자를 정하고, 다음 행사에서도 관리를 이어 가요.'}
];
const observation=(id,level,summary,chain,extra='')=>({id,level,summary,chain,extra});
export function learningReport(choices,repair=false){
 if(!isValidChoices(choices)||choices.some(x=>x===null))throw new Error('엔딩 뒤에만 돌아볼 수 있어요.');
 const [s,w,f,l]=choices;
 const soil=f==='spray'
  ?observation('soil','remaining','과도한 농약이 흙에 남는 문제를 줄이지 못했어요.',['농장 전체에 농약을 과도하게 사용','흙에 해로운 물질이 남음','흙의 생물과 작물이 피해를 받을 수 있음','농사와 안전한 먹거리를 위해 흙을 다시 조사·관리해야 함'])
  :observation('soil','protected',f==='care'?'필요한 곳만 관리해 과도한 농약으로 인한 흙의 피해를 줄였어요.':'과도한 농약 사용을 선택하지 않았어요.',['과도한 농약을 쓰지 않음','농약으로 인한 흙의 오염 위험을 줄임','흙에서 사는 생물의 생활을 지키는 데 도움','농사를 이어 갈 건강한 흙을 지키는 데 도움'],'이 선택만으로 마을의 모든 흙이 깨끗하다고 판단할 수는 없어요.');
 const air=l==='burn'
  ?observation('air','remaining','쓰레기 연기로 인한 대기오염이 남았어요.',['쓰레기를 함부로 태움','연기와 해로운 물질이 공기에 퍼짐','사람과 다른 생물이 숨 쉬기 어려워질 수 있음','마을의 바깥 수업과 가게 영업에 지장을 줌'])
  :observation('air','protected','쓰레기를 태우지 않아 그 연기로 생길 대기오염을 피했어요.',['쓰레기를 태우지 않음','태울 때 나오는 해로운 연기를 만들지 않음','공기를 함께 쓰는 생물의 피해를 예방하는 데 도움','사람도 더 안전한 공기를 누리는 데 도움'],'자동차·공장 등 다른 오염원은 별도로 살펴야 해요. 절전만으로 모든 대기오염이 해결되지는 않아요.');
 let water;
 if(w==='treat'&&f!=='spray')water=observation('water','reduced','작업장의 더러운 물이 들어오는 원인을 줄이기 시작했어요.',['처리 시설을 고치고 계속 점검','하천으로 들어오는 오염 물질이 줄어듦','물고기 등 물속 생물이 살 환경이 나아짐','주민이 물가를 이용하고 생물을 관찰할 환경을 지킴'],'시설 관리와 수질 확인을 계속해야 해요. 맑아 보인다고 안전한 물이라고 단정하지 않아요.');
 else if(w==='treat')water=observation('water','remaining','작업장 물은 관리했지만, 농약이 물로 흘러들 문제는 남았어요.',['시설은 고쳤지만 농약을 과도하게 사용','농약이 빗물과 함께 하천으로 갈 수 있음','물속 생물도 피해를 받을 수 있음','물가 이용과 농사를 위해 두 오염원을 함께 관리해야 함'],'하나의 원인을 줄여도 다른 원인이 남으면 수질오염이 계속될 수 있어요.');
 else water=observation('water','remaining',w==='clean'?'눈에 보이는 쓰레기는 건졌지만, 더러운 물의 배출은 남았어요.':'작업장의 더러운 물이 들어오는 원인을 충분히 고치지 못했어요.',['처리 시설을 충분히 고치지 않음','더러운 물이 하천으로 계속 들어옴','물고기와 다른 물속 생물이 피해를 받음','주민의 물가 체험과 가게 활동에도 불편이 생김'],f==='spray'?'과도한 농약이 물로 흘러들 위험도 함께 남았어요.':'청소는 도움이 되지만 계속 들어오는 더러운 물의 처리도 필요해요.');
 const habitat=s==='cut'
  ?observation('habitat','remaining','빠른 도로가 동물의 이동로를 끊었어요.',['숲을 가로지르는 도로를 넓힘','동물이 안전하게 오갈 길이 끊김','먹이와 짝을 찾아 움직이기 어려워지고 충돌 위험이 커짐','주민도 사고 예방과 통로 마련을 위해 시간과 비용을 들여야 함'])
  :s==='garden'||f==='garden'
   ?observation('habitat','remaining','꽃밭은 생겼지만, 여러 생물이 살던 공간을 잃었어요.',['숲이나 다양한 풀밭을 꽃밭으로 바꿈','둥지·숨을 곳·먹이가 줄어듦','새와 작은 생물이 떠나고 먹이 관계가 달라짐','생물 관찰 기회가 줄고, 작물을 돕는 생물의 역할도 약해질 수 있음'],'새가 사라지는 것은 공기·물·흙의 오염과 구별되는 서식지 문제예요. 꽃밭 자체가 언제나 나쁘다는 뜻은 아니에요.')
   :f==='spray'
    ?observation('habitat','remaining','숲은 남겼지만, 농약이 벌·거미 등에게도 피해를 줬어요.',['농약을 과도하게 사용','작물을 먹는 벌레 외의 생물도 피해를 받음','벌의 꽃가루받이와 거미의 벌레 조절 역할이 줄 수 있음','열매가 맺히는 일과 작물 관리에도 어려움이 생길 수 있음'])
    :observation('habitat','protected','숲과 이동로를 남겨 생물이 살 공간을 지켰어요.',['숲을 남기거나 안전한 통로를 관리','동물이 집과 먹이가 있는 곳을 오갈 수 있음','여러 생물이 함께 살아갈 공간을 유지','주민도 생물 관찰과 자연의 도움을 누릴 수 있음'],f==='wait'?'다만 작물 피해를 기다리기만 해 수확 문제는 남았어요.': '통로와 서식지는 만든 뒤에도 계속 관찰하고 관리해야 해요.');
 const waste=l==='reuse'
  ?observation('waste','reduced','컵 반납·분리배출·절전으로 쓰레기와 낭비를 줄였어요.',['컵을 다시 쓰고 쓰레기를 나누며 낮 조명을 끔','버리는 물건과 에너지 낭비가 줄어듦','흙·물·공기로 갈 오염 부담을 줄이는 데 도움','주민의 처리 부담과 불필요한 자원 사용을 줄임'])
  :observation('waste','remaining',l==='once'?'바닥은 치웠지만, 다음 행사에서 생길 쓰레기는 줄이지 못했어요.':'쓰고 버리는 양을 줄일 방법이 남아 있어요.',[l==='burn'?'쓰레기를 태워 없애려 함':'일회용품 사용량을 줄이지 않음',l==='burn'?'쓰레기가 연기와 재로 바뀜':'버려야 할 물건이 다시 늘어남','잘못 처리하면 생물의 집과 흙·물·공기에 피해','주민이 뒷정리·처리 비용과 자원 낭비를 떠안음'],'쓰레기가 남았다는 이유만으로 실제 토양·수질오염이 확인됐다고 판단하지는 않아요.');
 const results=[soil,air,water,habitat,waste];
 return {results,helped:results.filter(x=>x.level!=='remaining'),remaining:results.filter(x=>x.level==='remaining'),repair,repairNote:repair?'마지막 회의에서 대책을 시작했어요. 앞으로의 피해를 줄일 수 있지만, 이전 선택으로 생긴 피해가 바로 사라진 것은 아니에요.':''};
}
export function humanConsequences(a){
 const [s,w,f,l]=a,lines=[];
 if(s==='garden'||f==='garden')lines.push('새를 보며 배우던 숲 관찰 시간도 줄었습니다. 곤충을 먹는 새가 줄면 작물을 먹는 벌레를 조절하는 힘도 약해질 수 있습니다. 주민에게는 생물 관찰의 기회와 자연의 도움이 함께 줄어든 것입니다.');
 if(s==='cut')lines.push('주민들은 또 다른 충돌을 막기 위해 운전 속도와 통로를 다시 논의했습니다. 5분 빠른 길의 대가는 동물의 생명뿐 아니라 사고를 막을 시간과 비용으로도 돌아왔습니다.');
 if(w!=='treat')lines.push('하천의 피해는 물고기에서 끝나지 않았습니다. 주민들은 물가 체험을 줄이고 물을 확인해야 했습니다. 체험 손님을 기다리던 가게도 어려워졌습니다.');
 if(f==='spray')lines.push('벌은 꽃가루받이를 돕고, 거미는 작물을 먹는 벌레를 잡아먹습니다. 이 생물들이 줄면 열매가 맺히는 일과 작물 관리도 어려워질 수 있습니다. 도윤은 흙과 물의 상태까지 다시 살펴야 했습니다.');
 if(f==='wait')lines.push('수확을 포기한 작물은 마을의 먹거리와 농장 수입의 손실로 이어졌습니다. 생물을 지키려는 마음과 필요한 작물 관리는 함께 생각해야 했습니다.');
 if(l==='burn')lines.push('같은 공기를 마시는 아이들과 가게 주민도 연기의 영향을 받았습니다. 쓰레기를 눈앞에서 없애는 것보다, 안전하게 처리하고 처음부터 줄이는 일이 필요했습니다.');
 else if(l!=='reuse')lines.push('버려진 컵을 치우고 처리하는 데 주민의 시간과 돈이 다시 들었습니다. 다음 축제에서도 같은 물건을 쓰고 버리면 이 부담은 반복됩니다.');
 if(!lines.length)lines.push('숲·하천·농장을 함께 지키는 일은 주민의 생활도 지켰습니다. 생물을 관찰할 곳과 농사를 돕는 생물, 다음 축제를 준비할 환경이 남았습니다. 이 도움을 지키려면 다음 계절에도 관리를 이어 가야 합니다.');
 return lines;
}
export const animals=[
 {id:'otter',name:'수달',icon:'🦦',grade:'멸종위기 야생생물 Ⅰ급',home:'강과 하천 등 물가에서 살아가는 동물이에요.',risk:'물가의 집과 먹이를 구할 환경을 지켜야 해요.',action:'물가에 쓰레기를 버리지 않고, 물의 오염을 줄일 방법을 함께 알려요.',source:'https://www.nie.re.kr/nie/pgm/edSearch/list.do?menuNo=200133'},
 {id:'spoonbill',name:'저어새',icon:'🪶',grade:'멸종위기 야생생물 Ⅰ급',home:'해안 갯벌과 강 하구에서 살아가는 새예요.',risk:'먹이를 찾는 갯벌과 번식할 장소를 보호해야 해요.',action:'새를 멀리서 관찰하고, 갯벌의 쓰레기와 서식지 문제를 함께 알려요.',source:'https://www.nie.re.kr/nie/bbs/BMSR00029/view.do?boardId=695963744&menuNo=200098'},
 {id:'turtle',name:'남생이',icon:'🐢',grade:'멸종위기 야생생물 Ⅱ급',home:'하천·연못과 주변 논·풀밭을 오가며 살아가요.',risk:'서식지 파괴와 외래종과의 경쟁 등이 생존을 위협해요.',action:'야생 남생이를 잡지 않고, 기르던 동물을 함부로 자연에 놓아주지 않아요.',source:'https://www.nie.re.kr/nie/pgm/edSpecies/view.do?menuNo=200133&speciesSn=86'}
];
export function cleanEffort(raw){
 if(!raw||!['campaign','letter'].includes(raw.kind))return null;
 const text=k=>String(raw[k]||'').trim().slice(0,k==='message'?260:120);
 const topic=topics.find(t=>t.id===raw.topic)?.id||'habitat',animal=animals.find(a=>a.id===raw.animal)?.id||'otter';
 return {kind:raw.kind,topic,animal,message:text('message'),reason:text('reason'),action:text('action'),partner:text('partner'),when:text('when')};
}
export function effortReady(raw){const d=cleanEffort(raw);return !!d&&['message','reason','action','partner','when'].every(k=>d[k].length>=2);}
export function effortText(raw){const d=cleanEffort(raw);if(!d)return '';const name=animals.find(a=>a.id===d.animal).name,title=topics.find(t=>t.id===d.topic).name;return [d.kind==='letter'?`${name}에게 보내는 편지`:`${title} 보전 캠페인`,d.message,`왜 필요한가요? ${d.reason}`,`내가 할 일: ${d.action}`,`함께할 사람·기관: ${d.partner}`,`언제부터? ${d.when}`].join('\n\n');}
