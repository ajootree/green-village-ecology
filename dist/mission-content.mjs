export const inspectionTargets=m=>m.id==='care'?[1,3,4]:[0,1,2];
export const inspectionLocations=m=>m.id==='wait'?[[21,31],[50,51],[79,67]]:[[16,31],[48,29],[79,33],[21,76],[53,74],[82,77]];
export const inspectionSites=m=>m.id==='wait'?[
  {name:'첫 번째 작물 구역',description:'작물 줄기와 주변 흙을 사진에 함께 남겨요.'},
  {name:'두 번째 작물 구역',description:'가운데 밭의 작물이 보이도록 카메라를 맞춰요.'},
  {name:'세 번째 작물 구역',description:'오른쪽 작물과 주변 상태를 사진에 남겨요.'}
]:[
  {name:'1번 지점',description:'잎 표면과 가장자리가 끊기지 않고 이어져 있어요.'},
  {name:'2번 지점',description:'잎 안쪽에 빈 구멍이 두 군데 보여요.'},
  {name:'3번 지점',description:'날개가 있는 작은 생물이 꽃 주변을 오가요. 잎에는 구멍이 없어요.'},
  {name:'4번 지점',description:'잎 안쪽이 비어 있고 가장자리 일부도 뜯겨 있어요.'},
  {name:'5번 지점',description:'다른 색의 잎에도 안쪽에 빈 구멍이 보여요.'},
  {name:'6번 지점',description:'잎 옆에 가는 줄이 이어져 있고 작은 생물이 앉아 있어요.'}
];
