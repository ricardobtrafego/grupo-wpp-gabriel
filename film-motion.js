(() => {
  'use strict';
  const scene=document.querySelector('[data-film-scene]');
  if(!scene)return;
  const film=scene.querySelector('video');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),saveData=!!navigator.connection?.saveData;
  let visible=false,loaded=false,failed=false;
  film.controls=false;film.loop=true;film.muted=true;
  const sync=()=>{
    if(!visible||document.hidden||reduce.matches||saveData){film.pause();return;}
    if(failed)return;
    if(!loaded){loaded=true;film.load();}
    film.play().catch(()=>{}); // A browser may disallow autoplay; retain the poster.
  };
  const fail=()=>{failed=true;scene.dataset.error='true';};
  film.addEventListener('error',fail);film.querySelector('source:last-child').addEventListener('error',fail);
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(scene);}
  else{visible=true;sync();}
  document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
  const gsap=window.gsap;if(!gsap){scene.dataset.motion='fallback';return;}
  let media;
  try{
    media=gsap.matchMedia();
    media.add({mobile:'(max-width:700px)',desktop:'(min-width:701px)',reduced:'(prefers-reduced-motion:reduce)'},ctx=>{
      if(ctx.conditions.reduced){scene.dataset.motion='reduced';return;}
      scene.dataset.motion='film';
      const chars=scene.querySelectorAll('.motion-char'),mobile=ctx.conditions.mobile;
      const tl=gsap.timeline({delay:.15});
      tl.fromTo(chars,{x:i=>(i%3-1)*(mobile?8:18),y:i=>(i%2?1:-1)*(mobile?16:32),rotation:i=>(i%2?1:-1)*9,opacity:.3},{x:0,y:0,rotation:0,opacity:1,duration:2.3,stagger:{amount:.7,from:'start'},ease:'power2.out'});
      const finish=()=>tl.progress(1).pause(),form=document.querySelector('#lead-form');form.addEventListener('focusin',finish);
      return()=>form.removeEventListener('focusin',finish);
    });
  }catch{media?.revert();scene.dataset.motion='fallback';}
})();
