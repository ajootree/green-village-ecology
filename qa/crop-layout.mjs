// Record movement throughout a real press/drag, including the release animation.
const label=document.querySelector('.review-toolbar b');
document.addEventListener('pointerdown',e=>{
  if(!e.target.closest('.crop-observation-field'))return;
  const crops=[...document.querySelectorAll('.crop-subject')];
  const before=crops.map(el=>el.getBoundingClientRect());
  let released=false,framesAfterRelease=0,drift=0;
  const release=()=>{released=true;document.removeEventListener('pointerup',release,true);document.removeEventListener('pointercancel',release,true);};
  document.addEventListener('pointerup',release,true);
  document.addEventListener('pointercancel',release,true);
  function sample(){
    crops.forEach((el,i)=>{
      const r=el.getBoundingClientRect(),b=before[i];
      drift=Math.max(drift,Math.abs(r.x-b.x),Math.abs(r.y-b.y),Math.abs(r.width-b.width),Math.abs(r.height-b.height));
    });
    if(released&&++framesAfterRelease===15){
      label.textContent=`새싹 이동: ${drift.toFixed(2)}px`;
      label.dataset.cropDrift=String(drift);
    }else requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
},true);
