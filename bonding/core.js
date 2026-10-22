"use strict";
/* ================= core: tokens, theme, helpers, 2D animation, SVG helpers, quiz engine, terms, nav ================= */
const $=id=>document.getElementById(id);
const ROOT=document.documentElement,TOK={};
const TN=['paper','card','soft','line','ink','muted','accent','s','p','hyb','sigma','pi','lp','ok','bad'];
function readTok(){const cs=getComputedStyle(ROOT);TN.forEach(n=>{TOK[n]=cs.getPropertyValue('--'+n).trim()||'#888888';});}
readTok();
const themeFns=[];function onTheme(f){themeFns.push(f);}
let themeT;
function themeChanged(){clearTimeout(themeT);themeT=setTimeout(()=>{readTok();themeFns.forEach(f=>{try{f();}catch(e){console.warn(e);}});},40);}
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',themeChanged);}catch(e){}
new MutationObserver(themeChanged).observe(ROOT,{attributes:true,attributeFilter:['data-theme']});
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,easeOut=t=>1-Math.pow(1-t,3);
const easeBack=t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function hexRGB(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];}
function rgba(hex,a){const [r,g,b]=hexRGB(hex);return `rgba(${r},${g},${b},${a})`;}
function mixHex(a,b,t){const A=hexRGB(a),B=hexRGB(b);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],t)).toString(16).padStart(2,'0')).join('');}
const SUBD='₀₁₂₃₄₅₆₇₈₉',SUPD='⁰¹²³⁴⁵⁶⁷⁸⁹';
const sub=n=>String(n).split('').map(d=>SUBD[+d]).join('');
function chargeStr(q){if(!q)return '';const n=Math.abs(q);return (n>1?String(n).split('').map(d=>SUPD[+d]).join(''):'')+(q>0?'⁺':'⁻');}
function onceInView(el,fn,th){if(!el||REDUCED)return;new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting){fn();ob.disconnect();}},{threshold:th||.35}).observe(el);}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ---------- 2D canvas animation helper ---------- */
function anim2d(cv,aspect,draw,stillT){
  const ctx=cv.getContext('2d');const st={w:0,h:0,t:0,last:0,on:false,vis:false};
  const asp=W=>typeof aspect==='function'?aspect(W):aspect;
  function fit(){const W=cv.clientWidth;if(!W)return;const H=Math.round(W*asp(W));const d=Math.min(window.devicePixelRatio||1,2);const pw=Math.round(W*d),ph=Math.round(H*d);if(cv.width!==pw||cv.height!==ph){cv.width=pw;cv.height=ph;}cv.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);st.w=W;st.h=H;}
  function paint(){if(!st.w)return;ctx.clearRect(0,0,st.w,st.h);ctx.globalAlpha=1;draw(ctx,st.w,st.h,REDUCED?stillT:st.t,0,st);}
  function loop(now){if(!st.on)return;const dt=st.last?Math.min((now-st.last)/1000,.05):0;st.last=now;st.t+=dt;ctx.clearRect(0,0,st.w,st.h);ctx.globalAlpha=1;draw(ctx,st.w,st.h,st.t,dt,st);requestAnimationFrame(loop);}
  st.start=()=>{if(st.on||REDUCED||!st.vis)return;st.on=true;st.last=0;requestAnimationFrame(loop);};
  st.paint=paint;
  new IntersectionObserver(es=>{st.vis=es[0].isIntersecting;if(st.vis)st.start();else st.on=false;}).observe(cv);
  new ResizeObserver(()=>{fit();paint();}).observe(cv);
  onTheme(paint);fit();paint();
  return st;
}
function circ(c,x,y,r){c.beginPath();c.arc(x,y,Math.max(r,.1),0,Math.PI*2);}
function cross(c,x,y,s){c.beginPath();c.moveTo(x-s,y-s);c.lineTo(x+s,y+s);c.moveTo(x+s,y-s);c.lineTo(x-s,y+s);c.stroke();}
function ctext(c,s,x,y,o){o=o||{};c.font=o.font||'500 11px "IBM Plex Mono", ui-monospace, monospace';c.fillStyle=o.color||TOK.muted;c.textAlign=o.align||'center';c.textBaseline=o.base||'middle';c.fillText(String(s),x,y);}
function arrow(c,x1,y1,x2,y2,hs){hs=hs||8;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();const a=Math.atan2(y2-y1,x2-x1);c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-hs*Math.cos(a-.45),y2-hs*Math.sin(a-.45));c.lineTo(x2-hs*Math.cos(a+.45),y2-hs*Math.sin(a+.45));c.closePath();c.fill();}
function rrect(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();}
function eArrow(c,x,y,up,col,s){s=s||1;c.save();c.translate(x,y);if(!up)c.rotate(Math.PI);c.strokeStyle=col;c.lineWidth=2.2*s;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(0,11*s);c.lineTo(0,-10*s);c.moveTo(-4.5*s,-5*s);c.lineTo(0,-11*s);c.lineTo(4.5*s,-5*s);c.stroke();c.restore();}
const SANS='500 12px "IBM Plex Sans", system-ui, sans-serif';
const DISP=s=>`800 ${s}px Manrope, system-ui, sans-serif`;
const MONO=(s,w)=>`${w||500} ${s}px "IBM Plex Mono", ui-monospace, monospace`;

/* ---------- SVG helpers ---------- */
const sup={sp3:'sp<tspan dy="-6" font-size="9">3</tspan>',sp2:'sp<tspan dy="-6" font-size="9">2</tspan>',sp:'sp'};
function lobePath(L){const a=L*.25,b=L*.75,w=L*.3;return `M0 0 C ${a} ${-w}, ${b} ${-w}, ${L} 0 C ${b} ${w}, ${a} ${w}, 0 0 Z`;}
function lobe(x,y,deg,L,fill,op,extra){op=op==null?1:op;return `<path d="${lobePath(L)}" transform="translate(${x} ${y}) rotate(${deg})" fill="${fill}" fill-opacity="${op}" stroke="${fill}" stroke-width="1" ${extra||''}/>`;}
function hybLobe(x,y,deg,L,op){op=op==null?1:op;return lobe(x,y,deg+180,L*.3,'var(--hyb)',op*.45)+lobe(x,y,deg,L,'var(--hyb)',op);}
function pOrb(x,y,deg,L,op){op=op==null?1:op;return lobe(x,y,deg,L,'var(--p)',op)+lobe(x,y,deg+180,L,'var(--p)',op);}
function pOrbEmpty(x,y,deg,L){const e='stroke-dasharray="4 3" stroke-width="1.5"';return lobe(x,y,deg,L,'var(--p)',0,e)+lobe(x,y,deg+180,L,'var(--p)',0,e);}
function sOrb(x,y,r,op){op=op==null?1:op;return `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--s)" fill-opacity="${op}" stroke="var(--s)"/>`;}
function dot(x,y,col){return `<circle cx="${x}" cy="${y}" r="3.2" fill="${col||'var(--ink)'}"/>`;}
function xmark(x,y,s,col){s=s||3.5;return `<path d="M${x-s} ${y-s}L${x+s} ${y+s}M${x+s} ${y-s}L${x-s} ${y+s}" stroke="${col||'var(--ink)'}" stroke-width="1.8" stroke-linecap="round"/>`;}
function atom(x,y,label,r,dark){r=r||13;return `<circle cx="${x}" cy="${y}" r="${r}" fill="${dark?'var(--ink)':'var(--card)'}" stroke="var(--ink)" stroke-width="1.5"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="${label.length>1?10:11}" font-weight="700" font-family="var(--body)" fill="${dark?'var(--paper)':'var(--ink)'}">${label}</text>`;}
function txt(x,y,s,size,anchor,col,w){return `<text x="${x}" y="${y}" text-anchor="${anchor||'middle'}" font-size="${size||12}" font-family="var(--mono)" fill="${col||'var(--muted)'}"${w?` font-weight="${w}"`:''}>${s}</text>`;}
/* projected shape drawings: dirs are [x,y,depth] with y down */
const SDIRS={
  2:[[1,0,0],[-1,0,0]],
  3:[[0,-1,0],[.866,.5,0],[-.866,.5,0]],
  3.1:[[1,0,0],[-.86,.5,1],[-.86,-.5,-1]],
  4:[[0,-1,0],[.943,.333,0],[-.72,.69,1],[-.98,.19,-1]],
  5:[[0,-1,0],[0,1,0],[1,0,0],[-.62,.38,1],[-.62,-.3,-1]],
  6:[[0,-1,0],[0,1,0],[1,0,0],[-1,0,0],[-.5,.42,1],[.5,-.42,-1]]
};
function shapeSVG(o){
  const L=o.L||62;let dirs=o.n===3?(o.view==='tilt'?SDIRS[3.1]:SDIRS[3]):SDIRS[o.n];
  const lpIdx=o.lp===1?[0]:o.lp===2?[0,3]:[];let h='';
  if(o.view==='tilt')h+=`<ellipse cx="0" cy="0" rx="92" ry="34" fill="none" stroke="var(--line)" stroke-dasharray="4 4"/>`;
  let li=0;const items=dirs.map((d,i)=>({d,i,lp:lpIdx.includes(i)}));
  [-1,0,1].forEach(dep=>{
    if(dep===0&&o.pExtra&&o.pExtra!=='none'){if(o.pExtra==='filled')h+=pOrb(0,0,-90,54,.8)+dot(0,-32);else h+=pOrbEmpty(0,0,-90,54);}
    items.filter(it=>it.d[2]===dep).forEach(it=>{const [ux,uy]=it.d,deg=Math.atan2(uy,ux)*180/Math.PI,f=dep===-1?.85:dep===1?1.05:1,op=dep===-1?.55:1;
      if(it.lp){h+=lobe(0,0,deg,L*.95*f,'var(--lp)',.85*op);const px=ux*L*.5*f,py=uy*L*.5*f,nx=-uy*4.5,ny=ux*4.5;h+=dot(px+nx,py+ny)+dot(px-nx,py-ny);}
      else{const lab=(o.ligs&&o.ligs[li++])||'';h+=hybLobe(0,0,deg,L*f,op);h+=`<ellipse cx="${ux*(L*f-2)}" cy="${uy*(L*f-2)}" rx="9" ry="9" fill="var(--sigma)" fill-opacity="${.5*op}"/>`;if(lab)h+=`<g opacity="${op}">${atom(ux*(L*f+14),uy*(L*f+14),lab,12)}</g>`;}});
    if(dep===0)h+=atom(0,0,o.center||'',15,true);
  });
  const bonds=items.filter(it=>!it.lp);const A=bonds.find(b=>b.d[2]===0),B=bonds.find(b=>b!==A&&b.d[2]===0)||bonds.find(b=>b!==A);
  if(A&&B&&o.angle){const a1=Math.atan2(A.d[1],A.d[0]),a2=Math.atan2(B.d[1],B.d[0]);let d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;const r=30,sw=d>0?1:0,x1=Math.cos(a1)*r,y1=Math.sin(a1)*r,x2=Math.cos(a1+d)*r,y2=Math.sin(a1+d)*r,mid=a1+d/2;
    h+=`<path d="M${x1} ${y1} A${r} ${r} 0 0 ${sw} ${x2} ${y2}" fill="none" stroke="var(--sigma)" stroke-width="2"/><text x="${Math.cos(mid)*50}" y="${Math.sin(mid)*50+4}" text-anchor="middle" font-size="12" font-weight="700" font-family="var(--mono)" fill="var(--sigma)">${o.angle}</text>`;}
  return h;
}
function fbSet(host,svg,vb){let fb=host.querySelector('.fb');if(!fb){fb=document.createElement('div');fb.className='fb';host.appendChild(fb);const h=host.querySelector('.hint');if(h)h.hidden=true;}fb.innerHTML=`<svg viewBox="${vb||'-140 -125 280 250'}">${svg}</svg>`;}

/* ---------- quiz engine ---------- */
function burst(card,x,y){if(REDUCED)return;const cols=[TOK.ok,TOK.s,TOK.accent,TOK.sigma];for(let i=0;i<16;i++){const s=document.createElement('span');s.className='spark';s.style.left=x+'px';s.style.top=y+'px';s.style.background=cols[i%4];card.appendChild(s);const a=Math.random()*Math.PI*2,d=30+Math.random()*60;const an=s.animate([{transform:'translate(-50%,-50%) scale(1) rotate(0deg)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px), calc(-50% + ${Math.sin(a)*d}px)) scale(.3) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:650+Math.random()*300,easing:'cubic-bezier(.2,.7,.3,1)'});an.onfinish=()=>s.remove();}}
function confetti(){if(REDUCED)return;const cv=$('confetti'),c=cv.getContext('2d'),W=innerWidth,H=innerHeight,d=Math.min(devicePixelRatio||1,2);cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0);cv.hidden=false;
  const cols=[TOK.accent,TOK.s,TOK.hyb,TOK.sigma,TOK.p,TOK.lp],ps=Array.from({length:160},()=>({x:Math.random()*W,y:-20-Math.random()*H*.5,vx:(Math.random()-.5)*90,vy:140+Math.random()*200,r:Math.random()*6,vr:(Math.random()-.5)*8,s:5+Math.random()*7,c:cols[Math.floor(Math.random()*cols.length)]}));
  let last=0,T=0;const f=now=>{const dt=last?Math.min((now-last)/1000,.05):0;last=now;T+=dt;c.clearRect(0,0,W,H);ps.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=1-seg(T,2.6,3.4);c.fillStyle=p.c;c.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);c.restore();});if(T<3.4)requestAnimationFrame(f);else{c.clearRect(0,0,W,H);cv.hidden=true;}};requestAnimationFrame(f);}
function mcq(host,q,o){
  o=o||{};
  host.innerHTML=`<p class="qt">${o.num?o.num+'. ':''}${q.q}</p><div class="opts">${q.o.map((t,j)=>`<button class="opt" type="button" data-j="${j}">${t}</button>`).join('')}</div><p class="fb" hidden></p>`;
  host.onclick=e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;const j=+b.dataset.j,ok=j===q.a;
    host.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.j===q.a)x.classList.add('right');});if(!ok)b.classList.add('wrong');
    if(ok){const card=host.closest('.q,.check')||host,cr=card.getBoundingClientRect(),br=b.getBoundingClientRect();burst(card,e.clientX?e.clientX-cr.left:br.left-cr.left+br.width/2,e.clientY?e.clientY-cr.top:br.top-cr.top+br.height/2);}
    const fb=host.querySelector('.fb');fb.hidden=false;fb.className='fb fade '+(ok?'good':'poor');fb.textContent=(ok?(o.good||'Correct. '):(o.bad||'Not quite. '))+q.x;
    if(o.onAnswer)o.onAnswer(ok);};
}

/* ---------- word popovers ---------- */
function initTerms(WORDS){
  const pop=$('pop');let cur=null,y0=0;
  function hide(){pop.hidden=true;if(cur)cur.setAttribute('aria-expanded','false');cur=null;}
  function show(btn){const w=WORDS[btn.dataset.w];if(!w)return;pop.innerHTML=`<b>${w[0]}</b><span>${w[1]}</span>`;pop.hidden=false;const pw=Math.min(300,innerWidth-24);pop.style.width=pw+'px';const r=btn.getBoundingClientRect();pop.style.left=clamp(r.left+r.width/2-pw/2,12,innerWidth-pw-12)+'px';let y=r.bottom+8;pop.style.top=y+'px';const ph=pop.offsetHeight;if(y+ph>innerHeight-12)pop.style.top=Math.max(12,r.top-ph-8)+'px';cur=btn;y0=scrollY;btn.setAttribute('aria-expanded','true');}
  document.querySelectorAll('.term').forEach(b=>{b.setAttribute('aria-expanded','false');b.setAttribute('aria-describedby','pop');});
  document.addEventListener('click',e=>{const b=e.target.closest('.term');if(b){if(cur===b)hide();else show(b);return;}if(!e.target.closest('#pop'))hide();});
  addEventListener('scroll',()=>{if(cur&&Math.abs(scrollY-y0)>60)hide();},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
}

/* ---------- chapter bar ---------- */
function initNav(){
  const box=$('tocIn'),links=[...box.querySelectorAll('a')],map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
  const setOn=id=>{const a=map.get(id);if(!a||a.classList.contains('on'))return;links.forEach(x=>x.classList.remove('on'));a.classList.add('on');box.scrollTo({left:a.offsetLeft-box.clientWidth/2+a.offsetWidth/2,behavior:REDUCED?'auto':'smooth'});};
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)setOn(e.target.id);});},{rootMargin:'-35% 0px -60% 0px'});
  ['top',...links.map(a=>a.getAttribute('href').slice(1))].forEach(id=>{const el=$(id);if(el)io.observe(el);});
  const pr=$('prog');const upd=()=>{const h=document.documentElement.scrollHeight-innerHeight;pr.style.width=(h>0?clamp(scrollY/h,0,1)*100:0)+'%';};addEventListener('scroll',upd,{passive:true});upd();
}
