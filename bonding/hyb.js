"use strict";
/* ================= shared hybridization pieces (main page Part 5 and the guide page) ================= */
if($('ideaCards'))(function ideas(){
  const up=(x,y,col)=>`<path d="M${x} ${y+9}V${y-9}M${x-4} ${y-4}L${x} ${y-9}L${x+4} ${y-4}" stroke="${col||'var(--ink)'}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const dn=(x,y,col)=>`<path d="M${x} ${y-9}V${y+9}M${x-4} ${y+4}L${x} ${y+9}L${x+4} ${y+4}" stroke="${col||'var(--ink)'}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const box=(x,y)=>`<rect x="${x-14}" y="${y-14}" width="28" height="28" rx="4" fill="var(--card)" stroke="var(--ink)" stroke-width="1.5"/>`;
  const svgs=[
    `<rect x="60" y="22" width="80" height="62" rx="10" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/>${up(88,53)}${dn(112,53)}${txt(100,104,'max 2, opposite spins',11)}`,
    `${sOrb(52,58,26,.85)}${txt(52,106,'s: ball',11)}${pOrb(140,58,-90,34,.85)}${lobe(140,58,0,22,'var(--p)',.25)}${lobe(140,58,180,22,'var(--p)',.25)}${txt(140,106,'p: dumbbell',11)}`,
    `<line x1="18" y1="108" x2="18" y2="8" stroke="var(--muted)" stroke-width="1.5"/>${txt(32,103,'1s',10,'start')}${box(66,99)}${up(62,99)}${dn(70,99)}${txt(32,65,'2s',10,'start')}${box(66,61)}${up(62,61)}${dn(70,61)}${txt(100,27,'2p',10,'start')}${box(130,23)}${up(130,23)}${box(160,23)}${up(160,23)}${box(190,23)}`,
    `${lobe(60,58,0,40,'var(--hyb)',.6)}${dot(84,58)}${lobe(140,58,180,40,'var(--s)',.6)}${dot(116,58)}${txt(100,24,'1 + 1',12,'middle','var(--ink)','600')}${txt(100,104,'= a shared pair (a bond)',11)}`
  ];
  $('ideaCards').innerHTML=IDEAS.map((d,i)=>`<div class="card"><svg viewBox="0 0 ${i===2?210:200} 116" aria-hidden="true">${svgs[i]}</svg><p class="num">${'①②③④'[i]} ${d.t}</p><p>${d.p}</p></div>`).join('');
})();
if($('pzL'))(function puzzle(){
  let l=`<g class="pop" style="animation-delay:.1s">${pOrb(0,0,0,58,.85)}</g><g class="pop" style="animation-delay:.3s">${pOrb(0,0,-90,58,.85)}</g>`;
  l+=`<g class="pop" style="animation-delay:.6s">${sOrb(84,0,20,.8)}${atom(84,0,'H',11)}</g><g class="pop" style="animation-delay:.75s">${sOrb(0,-84,20,.8)}${atom(0,-84,'H',11)}</g>`;
  l+=atom(0,0,'C',14,true)+`<path d="M30 0 A30 30 0 0 0 0 -30" fill="none" stroke="var(--sigma)" stroke-width="2"/><text x="32" y="-28" font-size="12" font-weight="700" font-family="var(--mono)" fill="var(--sigma)">90°</text>`;
  l+=`<g class="stamp" style="animation-delay:1.2s"><rect x="-98" y="76" width="196" height="28" rx="14" fill="var(--card)" stroke="var(--bad)" stroke-width="2"/><text x="0" y="95" text-anchor="middle" font-size="13" font-weight="800" font-family="var(--display)" fill="var(--bad)">✗ Only 2 bonds, at 90°</text></g>`;
  $('pzL').innerHTML=l;
  let r=`<g class="pop" style="animation-delay:.2s">${shapeSVG({n:4,lp:0,ligs:['H','H','H','H'],center:'C',angle:'109.5°',pExtra:'none'})}</g>`;
  r+=`<g class="stamp" style="animation-delay:1.5s"><rect x="-108" y="76" width="216" height="28" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="0" y="95" text-anchor="middle" font-size="13" font-weight="800" font-family="var(--display)" fill="var(--ok)">✓ 4 identical bonds, 109.5°</text></g>`;
  $('pzR').innerHTML=r;onceInView($('puzzleFig'),()=>$('puzzleFig').classList.add('go'),.4);
})();
if($('cvPromo'))anim2d($('cvPromo'),W=>W<420?.8:.62,(c,w,h,t)=>{
  const T=7.5,k=t%T,fin=t<T?1:seg(k,0,.3),fout=1-seg(k,7,7.5);c.globalAlpha=fin*fout;
  const bw=Math.min(w*.11,42),y2s=h*.66,y2p=h*.3,x2s=w*.3,xp=[w*.5,w*.5+bw*1.3,w*.5+bw*2.6],jump=ease(seg(k,1.5,2.7)),after=k>=2.7;
  c.strokeStyle=TOK.muted;c.fillStyle=TOK.muted;c.lineWidth=1.5;arrow(c,w*.08,h*.84,w*.08,h*.1,7);
  c.save();c.translate(w*.08-10,h*.5);c.rotate(-Math.PI/2);ctext(c,'energy',0,0,{font:MONO(10)});c.restore();
  ctext(c,'2s',x2s-bw*.95,y2s,{color:TOK.ink,font:MONO(13,600)});ctext(c,'2p',xp[0]-bw*.95,y2p,{color:TOK.ink,font:MONO(13,600)});
  const boxes=[[x2s,y2s],[xp[0],y2p],[xp[1],y2p],[xp[2],y2p]];
  boxes.forEach(([x,y],i)=>{const single=after?true:(i===1||i===2);if(single){c.strokeStyle=rgba(TOK.hyb,.5+.4*Math.sin(t*4));c.lineWidth=3;rrect(c,x-bw/2-5,y-bw/2-5,bw+10,bw+10,8);c.stroke();}c.fillStyle=TOK.card;c.strokeStyle=TOK.ink;c.lineWidth=1.5;rrect(c,x-bw/2,y-bw/2,bw,bw,4);c.fill();c.stroke();});
  const s=bw/36;eArrow(c,x2s-(jump>0?0:bw*.18),y2s,true,TOK.ink,s);eArrow(c,xp[0],y2p,true,TOK.ink,s);eArrow(c,xp[1],y2p,true,TOK.ink,s);
  if(jump<=0)eArrow(c,x2s+bw*.18,y2s,false,TOK.ink,s);
  else{const sx=x2s+bw*.18,ex=xp[2],qx=(sx+ex)/2-bw,qy=Math.min(y2s,y2p)-bw*.6,x=(1-jump)*(1-jump)*sx+2*jump*(1-jump)*qx+jump*jump*ex,y=(1-jump)*(1-jump)*y2s+2*jump*(1-jump)*qy+jump*jump*y2p;
    c.save();c.translate(x,y);c.rotate(Math.PI*(1-jump));eArrow(c,0,0,true,jump<1?TOK.accent:TOK.ink,s);c.restore();
    if(jump<1){c.save();c.globalAlpha*=Math.sin(Math.PI*jump);ctext(c,'+ energy',qx,qy-12,{color:TOK.accent,font:MONO(12,600)});c.restore();}}
  const msg=k<1.5?'Before: only 2 single electrons, so only 2 bonds':k<2.7?'One 2s electron moves up to the empty 2p box':'After: 4 single electrons, so 4 bonds';
  ctext(c,msg,w/2,h-14,{font:SANS,color:TOK.ink});
  if(after){c.save();c.globalAlpha*=seg(k,2.7,3.2);ctext(c,'1s² 2s¹ 2p³',w*.82,y2s,{color:TOK.hyb,font:MONO(13,600)});c.restore();}else ctext(c,'1s² 2s² 2p²',w*.82,y2s,{color:TOK.muted,font:MONO(13,600)});
  c.globalAlpha=1;
},5);
const MIX={n:3,start:0};
const hybCol=n=>mixHex(TOK.hyb,TOK.s,.7/(n+1));
const mixSt=$('cvMix')&&anim2d($('cvMix'),W=>W<520?.78:.42,(c,w,h,t)=>{
  const lt=REDUCED?99:t-MIX.start,n=MIX.n,tw=Math.min(w*.1,56),th=tw*1.15,topY=h*.16,bx=w*.5,by=h*.5,bw=Math.min(w*.34,200),bh=h*.16,outY=h*.82,xs=[w*.2,w*.4,w*.6,w*.8];
  const tin=(x,y,col,lab,ang,al,sc)=>{c.save();c.globalAlpha*=al;c.translate(x,y);c.rotate(ang||0);c.scale(sc||1,sc||1);c.fillStyle=col;rrect(c,-tw/2,-th/2,tw,th,7);c.fill();c.strokeStyle=mixHex(col,'#000000',.3);c.lineWidth=2;c.stroke();c.fillStyle=mixHex(col,'#ffffff',.35);c.beginPath();c.ellipse(0,-th/2,tw/2,tw*.13,0,0,Math.PI*2);c.fill();c.stroke();c.lineWidth=4;c.strokeStyle='rgba(10,16,28,.6)';c.font=DISP(Math.round(tw*.32));c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.strokeText(lab,0,4);c.fillStyle='#ffffff';c.fillText(lab,0,4);c.restore();};
  const mixedCol=mixHex(TOK.s,TOK.p,n/(n+1)),finalCol=hybCol(n),fill=ease(seg(lt,.6,1.5)),bowlCol=mixHex(mixedCol,finalCol,ease(seg(lt,1.2,2)));
  c.save();c.fillStyle=rgba(TOK.ink,.06);c.strokeStyle=TOK.muted;c.lineWidth=2;c.beginPath();c.moveTo(bx-bw/2,by);c.quadraticCurveTo(bx-bw/2,by+bh*1.5,bx,by+bh*1.5);c.quadraticCurveTo(bx+bw/2,by+bh*1.5,bx+bw/2,by);c.closePath();c.fill();c.stroke();
  if(fill>0){c.beginPath();c.moveTo(bx-bw/2,by);c.quadraticCurveTo(bx-bw/2,by+bh*1.5,bx,by+bh*1.5);c.quadraticCurveTo(bx+bw/2,by+bh*1.5,bx+bw/2,by);c.closePath();c.clip();c.fillStyle=bowlCol;c.fillRect(bx-bw/2,by+bh*1.5*(1-fill)-2,bw,bh*1.6);
    const sw=seg(lt,1,2.3);if(sw>0&&sw<1){c.strokeStyle=rgba('#ffffff',.6*(1-sw));c.lineWidth=2;for(let i=0;i<3;i++){c.beginPath();c.ellipse(bx,by+bh*.7,bw*(.12+i*.1),bh*(.2+i*.12),0,lt*5+i,lt*5+i+2.2);c.stroke();}}}
  c.restore();c.strokeStyle=TOK.muted;c.lineWidth=2;c.beginPath();c.ellipse(bx,by,bw/2,bh*.25,0,0,Math.PI*2);c.stroke();
  for(let i=0;i<4;i++){const sel=i<=n,col=i===0?TOK.s:TOK.p,lab=i===0?'s':'p';
    if(sel){const kp=ease(seg(lt,.1+i*.1,.75+i*.1)),tx=bx+(i-n/2)*tw*.75,ty=by-bh-th*.55,x=lerp(xs[i],tx,kp),y=lerp(topY,ty,kp),ang=kp*(tx<bx-2?1.3:tx>bx+2?-1.3:1.6)*(seg(lt,.6,1.5)>0?1:kp),al=1-seg(lt,1.5,1.9);
      if(al>0)tin(x,y,col,lab,ang*.9,al,1);
      if(lt>.6&&lt<1.6){for(let j=0;j<3;j++){const f=((lt*2.4+j*.33)%1),dx=lerp(x,bx+(i-n/2)*8,f),dy=lerp(y+th*.3,by+bh*.4,f);c.fillStyle=col;circ(c,dx,dy,3.5);c.fill();}}}
    else{const kd=ease(seg(lt,2.1,2.9)),total=n+1+(3-n),slot=n+1+(i-n-1),ox=w*(slot+1)/(total+1),x=lerp(xs[i],ox,kd),y=lerp(topY,outY,kd);tin(x,y,col,lab,0,1-.45*seg(lt,0,.4)+.45*kd,1);
      ctext(c,kd<.5?'not mixed':'left over',x,y+th*.5+12,{color:TOK.muted,font:MONO(10)});}}
  const total=4,name=n===1?'sp':n===2?'sp²':'sp³';
  for(let kq=0;kq<=n;kq++){const kk=easeBack(seg(lt,2+kq*.15,2.6+kq*.15));if(kk<=0)continue;const ox=w*(kq+1)/(total+1),x=lerp(bx,ox,Math.min(1,kk)),y=lerp(by+bh*.5,outY,Math.min(1,kk));tin(x,y,finalCol,name,0,1,Math.max(.01,kk));if(kk>.6)ctext(c,'identical',x,y+th*.5+12,{color:TOK.hyb,font:MONO(10,600)});}
  if(lt<1.4){c.save();c.globalAlpha*=1-seg(lt,1,1.4);ctext(c,'1 s orbital + '+n+' p orbital'+(n>1?'s':''),w/2,h*.04+6,{color:TOK.ink,font:MONO(12,600)});c.restore();}
  if(lt>2.4){c.save();c.globalAlpha*=seg(lt,2.4,2.9);ctext(c,`${n+1} identical ${name} orbitals${n<3?` + ${3-n} p left over`:''}`,w/2,h*.16,{color:TOK.ink,font:DISP(Math.round(clamp(w*.03,15,22)))});c.restore();}
},99);
function mixRender(){const n=MIX.n,name=n===1?'sp':n===2?'sp²':'sp³',shape=n===1?'linear, 180°':n===2?'trigonal planar, 120°':'tetrahedral, 109.5°';
  $('mixRead').innerHTML=`<p class="eq">1 s + ${n} p → ${n+1} ${name}</p><p class="cap">${3-n} p orbital${3-n===1?'':'s'} left over. Next step: the ${n+1} hybrids spread out (${shape}). Notice the color: ${name} has ${n===1?'more':n===2?'a bit more':'less'} "yellow" (s) in it.</p>`;
  document.querySelectorAll('#mixBtns .chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===n?'true':'false'));}
if(mixSt){$('mixBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;MIX.n=+b.dataset.n;MIX.start=mixSt.t;mixRender();mixSt.paint();});mixRender();}
if($('balViz'))(function balloons(){
  if(!HAS3D){fbSet($('balViz'),shapeSVG({n:4,lp:0,ligs:[],center:'C',angle:'109.5°',pExtra:'none'}));return;}
  const v=new Viewer($('balViz'),{dist:7.8,pitch:.3,yaw:.2});let n=4;const go=()=>v.build(x=>buildBalloons(x,n));go();
  $('balBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;n=+b.dataset.n;document.querySelectorAll('#balBtns .chip').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));go();});
})();

/* ---- 5.6 lab ---- */
const BOXES=['s1','s2','p1','p2','p3'],BX={s1:[150,188],s2:[150,128],p1:[150,56],p2:[192,56],p3:[234,56]},HY=92;
let cur='sp3',step=0,labTimer=null,labView=null;
function boxPos(id,hyb,n){if(!hyb)return BX[id];if(id==='s1')return BX.s1;if(id==='s2')return [150,HY];if(id==='p1')return [192,HY];if(id==='p2')return n>=3?[234,HY]:BX.p2;return n>=4?[276,HY]:BX.p3;}
function buildDiagram(a){
  let h=`<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--muted)"/></marker><marker id="ahA" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>`;
  h+=`<line x1="26" y1="214" x2="26" y2="26" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ah)"/><text x="13" y="128" transform="rotate(-90 13 128)" text-anchor="middle" font-size="10.5" font-family="var(--mono)" fill="var(--muted)" letter-spacing="2">ENERGY</text>`;
  const lab=(id,y,s)=>`<text class="lbl" id="${id}" x="126" y="${y+5}" text-anchor="end" font-size="13" font-weight="600" font-family="var(--mono)" fill="var(--ink)">${s}</text>`;
  h+=lab('l1s',188,'1s')+lab('l2s',128,'2s')+lab('l2p',56,'2p')+lab('lhy',HY,sup[a.hyb]);
  BOXES.forEach(id=>h+=`<g class="bx" id="bx-${id}"><rect x="-17" y="-17" width="34" height="34" rx="4" fill="var(--card)" stroke="var(--ink)" stroke-width="1.5"/></g>`);
  h+=`<path id="promo" pathLength="100" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" marker-end="url(#ahA)" opacity="0"/><text id="promoT" font-size="11" font-weight="600" font-family="var(--mono)" fill="var(--accent)" opacity="0">+ energy</text>`;
  electronsOf(a,0).forEach(e=>h+=`<g class="e" id="${e.id}"><line x1="0" y1="11" x2="0" y2="-10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M-4.5 -5 L0 -11 L4.5 -5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  h+=`<text id="dtitle" x="330" y="226" text-anchor="end" font-size="11" font-family="var(--mono)" fill="var(--muted)"></text>`;
  $('diag').innerHTML=h;
}
function updateDiagram(){
  const a=ATOMS[cur],hyb=step>=2,hid=hybridIds(a.nHyb);
  BOXES.forEach(id=>{const [x,y]=boxPos(id,hyb,a.nHyb),g=$('bx-'+id),r=g.firstElementChild;g.style.transform=`translate(${x}px,${y}px)`;const isH=hyb&&hid.includes(id);r.setAttribute('stroke',isH?'var(--hyb)':'var(--ink)');r.setAttribute('fill',isH?'var(--hyb)':'var(--card)');r.setAttribute('fill-opacity',isH?'.18':'1');g.classList.remove('shimmer');if(isH&&step===2){void g.getBoundingClientRect();g.classList.add('shimmer');}});
  const els=electronsOf(a,step),cnt={};els.forEach(e=>cnt[e.box]=(cnt[e.box]||0)+1);
  els.forEach(e=>{const [x,y]=boxPos(e.box,hyb,a.nHyb),off=cnt[e.box]===2?(e.spin==='up'?-7:7):0,g=$(e.id);g.style.transform=`translate(${x+off}px,${y}px) rotate(${e.spin==='down'?180:0}deg)`;g.classList.toggle('hot',e.id==='e4'&&step===1);});
  $('l2s').style.opacity=hyb?0:1;$('l2p').style.opacity=(hyb&&a.nHyb===4)?0:1;$('lhy').style.opacity=hyb?1:0;
  const pr=$('promo'),pt=$('promoT');pr.classList.remove('draw');
  if(step===1){const tx=BX['p'+(a.Z-3)][0],qx=Math.max(tx,167)+40;pr.setAttribute('d',`M169 122 Q ${qx} 108 ${tx+4} 77`);pr.setAttribute('opacity',1);void pr.getBoundingClientRect();pr.classList.add('draw');pt.setAttribute('x',qx-2);pt.setAttribute('y',124);pt.setAttribute('opacity',1);}
  else{pr.setAttribute('opacity',0);pt.setAttribute('opacity',0);}
  $('dtitle').textContent=`${a.name} · ${step===0?'ground state':step===1?'after promotion':a.hybTxt+' hybridized'}`;
  $('cfg').textContent=step===0?a.ground:step===1?a.excited:a.hybCfg;
  const unp=Object.values(cnt).filter(c=>c===1).length;$('unp').textContent=`· ${unp} single electron${unp===1?'':'s'}`;
  document.querySelectorAll('.step').forEach((b,i)=>b.setAttribute('aria-current',i===step?'step':'false'));
  $('back').disabled=step===0;$('next').disabled=step===3;
}
function renderNote(){const a=ATOMS[cur],[title,cap]=a.cap[step],n=$('note');n.innerHTML=`<p class="kicker">${a.hybTxt} · step ${step+1} of 4</p><h4>${title}</h4><p>${cap}</p>`;n.classList.remove('fade');void n.offsetWidth;n.classList.add('fade');}
function orbitalRow(cnt){let h='';const pos={s2:[52,66],p1:[150,66],p2:[240,66],p3:[330,66]},ring=(x,y)=>`<circle cx="${x}" cy="${y}" r="40" fill="none" stroke="var(--hyb)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  if(cnt.s2===1)h+=ring(52,66);h+=sOrb(52,66,27,.85)+(cnt.s2===2?dot(46,66)+dot(58,66):cnt.s2?dot(52,66):'');
  ['p1','p2','p3'].forEach(id=>{const [x,y]=pos[id];if(cnt[id]===1)h+=ring(x,y);h+=cnt[id]?pOrb(x,y,-90,36,.85)+dot(x,y-18):pOrbEmpty(x,y,-90,36);});
  return h+txt(52,128,'2s')+txt(150,128,'2p')+txt(240,128,'2p')+txt(330,128,'2p');}
function labScene(v){const a=ATOMS[cur];if(step<=1)buildRow(v,a,step===1);else if(step===2)buildMix(v,a);else buildMolecule(v,labSpec(a,cur==='sp2c'));}
function labFallback(){const a=ATOMS[cur],host=$('labViz');if(step<=1)fbSet(host,orbitalRow(occ(a,step)),'0 0 380 150');else{const ligs=Array(a.nHyb).fill(a.lig);if(cur==='sp2c')ligs[0]='C';fbSet(host,shapeSVG({n:a.nHyb,lp:0,ligs,center:a.el,angle:a.angle,view:a.view,pExtra:a.pExtra==='empty2'?'empty':a.pExtra}));}}
function update(){updateDiagram();renderNote();if(labView)labView.build(labScene);else labFallback();}
function setAtom(k){cur=k;step=0;document.querySelectorAll('#lab .tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.atom===k?'true':'false'));buildDiagram(ATOMS[k]);requestAnimationFrame(()=>update());}
const DUR=[3.4,4.2,4.4,6.5];
function bar(d){const b=$('playbar');b.style.transition='none';b.style.width='0';if(d==null)return;void b.offsetWidth;b.style.transition=`width ${d}s linear`;b.style.width='100%';}
function labPlay(on){clearTimeout(labTimer);labTimer=null;$('labPlay').textContent=on?'Pause':'Play all';$('labPlay').setAttribute('aria-pressed',on?'true':'false');if(!on){bar(null);return;}
  if(step===3){step=0;update();}
  const sched=()=>{bar(DUR[step]);labTimer=setTimeout(()=>{if(step<3){step++;update();if(step<3)sched();else labPlay(false);}},DUR[step]*1000);};sched();}
if($('steps'))(function initLab(){
  $('steps').innerHTML=STEPNAMES.map((s,i)=>`<button class="step" type="button" data-i="${i}">${s[0]}<b>${s[1]}</b></button>`).join('');
  $('steps').addEventListener('click',e=>{const b=e.target.closest('.step');if(!b)return;labPlay(false);step=+b.dataset.i;update();});
  $('back').addEventListener('click',()=>{labPlay(false);if(step>0){step--;update();}});
  $('next').addEventListener('click',()=>{labPlay(false);if(step<3){step++;update();}});
  $('labPlay').addEventListener('click',()=>labPlay(!labTimer));
  document.querySelectorAll('#lab .tab').forEach(t=>t.addEventListener('click',()=>{labPlay(false);setAtom(t.dataset.atom);}));
  if(HAS3D)labView=new Viewer($('labViz'),{dist:8.8,pitch:.28,yaw:-.35,mode:'sway'});
  setAtom('sp3');
})();

/* ---- 5.7 ethene ---- */
const PIS={theta:0,auto:false,at:0,sig:true,p:true,pi:true};let piView=null,ethFB=null;
function piReadout(){const th=Math.round(PIS.theta),c=Math.cos(PIS.theta*Math.PI/180);$('twistDeg').textContent=`θ = ${th}°`;$('twistOv').textContent=`π overlap ${Math.round(c*100)}%`;const m=$('twistMsg');m.textContent=th>=88?'π bond broken':th>=45?'π bond weakening':'';m.className=th>=88?'broken':'';}
function ethFallback(){
  const host=$('piViz'),LC=[160,125],RC=[280,125];let h='';
  h+=`<g id="sigz"><ellipse cx="220" cy="125" rx="24" ry="13" fill="var(--sigma)" fill-opacity=".6"/></g><g id="piz"><ellipse cx="220" cy="86" rx="58" ry="20" fill="var(--pi)" fill-opacity=".55"/><ellipse cx="220" cy="164" rx="58" ry="20" fill="var(--pi)" fill-opacity=".55"/></g>`;
  h+=`<g id="pgrpL">${pOrb(LC[0],LC[1],-90,52,.8)}</g><g id="pgrpR" style="transform-origin:280px 125px">${pOrb(RC[0],RC[1],-90,52,.8)}</g>`;
  h+=hybLobe(LC[0],LC[1],0,50)+hybLobe(RC[0],RC[1],180,50)+hybLobe(LC[0],LC[1],150,48)+hybLobe(LC[0],LC[1],210,48)+hybLobe(RC[0],RC[1],30,48)+hybLobe(RC[0],RC[1],-30,48);
  h+=atom(LC[0],LC[1],'C',14,true)+atom(RC[0],RC[1],'C',14,true);[150,210].forEach(d=>{const r=d*Math.PI/180;h+=atom(LC[0]+Math.cos(r)*66,LC[1]+Math.sin(r)*66,'H');});[30,-30].forEach(d=>{const r=d*Math.PI/180;h+=atom(RC[0]+Math.cos(r)*66,RC[1]+Math.sin(r)*66,'H');});
  fbSet(host,h,'40 30 360 190');
  return ()=>{const c=Math.cos(PIS.theta*Math.PI/180),pr=host.querySelector('#pgrpR'),pz=host.querySelector('#piz'),s=host.querySelector('#sigz');if(pr)pr.style.transform=`scaleY(${c})`;if(pz)pz.style.opacity=PIS.pi?c:0;if(s)s.style.opacity=PIS.sig?1:0;['#pgrpL','#pgrpR'].forEach(q=>{const e=host.querySelector(q);if(e)e.style.visibility=PIS.p?'visible':'hidden';});};
}
function piChanged(){piReadout();if(piView){if(!piView.on)piView.frame(0);}else if(ethFB)ethFB();}
if($('piViz'))(function initPi(){
  if(HAS3D){piView=new Viewer($('piViz'),{dist:6,pitch:.42,yaw:-.45,mode:'sway'});piView.build(buildEthene);}else{ethFB=ethFallback();ethFB();$('piReplay').hidden=true;}
  if(REDUCED||!HAS3D)$('piAuto').hidden=true;
  $('twist').addEventListener('input',e=>{PIS.auto=false;$('piAuto').textContent='Auto-twist';PIS.theta=+e.target.value;piChanged();});
  $('piAuto').addEventListener('click',()=>{PIS.auto=!PIS.auto;if(PIS.auto)PIS.at=Math.acos(clamp(1-PIS.theta/45,-1,1));$('piAuto').textContent=PIS.auto?'Stop':'Auto-twist';});
  $('piReplay').addEventListener('click',()=>{if(piView)piView.build(buildEthene);});
  [['showSig','sig'],['showP','p'],['showPi','pi']].forEach(([id,k])=>$(id).addEventListener('change',e=>{PIS[k]=e.target.checked;piChanged();}));
  piReadout();
})();

/* ---- 5.8 predictor ---- */
function countUp(el,n){if(REDUCED){el.textContent=n;return;}const t0=performance.now();const f=now=>{const k=Math.min(1,(now-t0)/450);el.textContent=Math.round(n*easeOut(k));if(k<1)requestAnimationFrame(f);};requestAnimationFrame(f);}
if($('mols'))(function predictor(){
  const row=$('mols'),pv=HAS3D?new Viewer($('predViz'),{dist:8.4,pitch:.32,yaw:.2}):null;
  row.innerHTML=MOLS.map((m,i)=>`<button class="chip" type="button" data-i="${i}" aria-pressed="${i===0}">${m.f}</button>`).join('');
  function show(i){const m=MOLS[i],n=m.sig+m.lp,hy=n===2?'sp':n===3?'sp²':'sp³';
    row.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===i?'true':'false'));
    $('predOut').innerHTML=`<p class="kicker">${m.name} · central atom ${m.c}</p>
      <div class="count"><div><small>atoms bonded to ${m.c}</small><b data-n="${m.sig}">${m.sig}</b></div><div><small>hybrid orbitals needed</small><b data-n="${n}">${n}</b></div></div>
      <div class="result"><div class="hy"><small>hybridization</small><b>${hy}</b></div><div><small>shape</small><b>${m.shape}</b></div><div><small>bond angle</small><b>${m.angle}</b></div></div>
      <p class="cap">${m.why}</p>`;
    $('predOut').querySelectorAll('.count b').forEach(b=>countUp(b,+b.dataset.n));
    if(pv){const g=vsepr(m.sig,m.lp);pv.build(v=>buildMolecule(v,{center:m.c,bonds:g.bonds,lps:g.lps,ligs:m.lig,pDirs:n===3?[N3(0,1,0)]:n===2?[N3(0,1,0),N3(0,0,1)]:[],pFilled:m.pi>0,arcs:g.arcs.map(a=>[a[0],a[1],m.angle]),L:1.4}));}
    else fbSet($('predViz'),shapeSVG({n,lp:m.lp,ligs:m.lig,center:m.c,angle:m.angle,view:n===3?'top':'',pExtra:'none'}));
    $('predCap').textContent=`${m.f}: ${m.shape.toLowerCase()}. ${m.lp?'Purple lobes are lone pairs. ':''}${m.pi?'The cyan p orbitals make the π bond. ':''}Pink spots are σ bonds.`;}
  row.addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)show(+b.dataset.i);});show(0);
})();

/* ---- 5.9 order game ---- */
if($('order'))(function order(){
  const keys=Object.keys(ORDERS);let k='ch4',next=0,pool=[];
  $('ordTabs').innerHTML=keys.map(x=>`<button class="tab" type="button" data-k="${x}" aria-pressed="${x===k}">${ORDERS[x].label}</button>`).join('');
  const hints=['Start with the ground-state configuration.','Next comes promotion.','Then the orbitals mix (hybridize).','Then they spread out into a shape.','Then the hybrids overlap to make σ bonds.','Last: the π bond from the leftover p orbitals.'];
  function draw(){$('ordPool').innerHTML=pool.map(p=>`<button type="button" data-i="${p.i}">${p.s}</button>`).join('');}
  function reset(){const O=ORDERS[k];next=0;$('ordQ').textContent='Question: '+O.q;$('ordDone').innerHTML='';pool=shuffle(O.steps.map((s,i)=>({s,i})));draw();$('ordFb').hidden=true;
    $('ordTabs').querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k?'true':'false'));}
  $('ordTabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;k=b.dataset.k;reset();});
  $('ordPool').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const i=+b.dataset.i,O=ORDERS[k],fb=$('ordFb');
    if(i===next){const li=document.createElement('li');li.textContent=O.steps[i];$('ordDone').appendChild(li);pool=pool.filter(p=>p.i!==i);next++;draw();
      if(next===O.steps.length){fb.hidden=false;fb.className='fb good';fb.textContent='Full marks! That is the order examiners look for. Try another molecule.';const st=$('order'),r=st.getBoundingClientRect();burst(st,r.width/2,r.height-40);}else fb.hidden=true;}
    else{b.classList.remove('no');void b.offsetWidth;b.classList.add('no');fb.hidden=false;fb.className='fb poor';fb.textContent='Not yet. '+(hints[next]||'What has to happen before that?');}});
  $('ordReset').addEventListener('click',reset);reset();
})();
if($('myths')){$('myths').innerHTML=MYTHS.map(([m,f],i)=>`<button type="button" class="myth" aria-pressed="false"><span class="in"><span class="fr"><small>✗ Mistake</small><span>${m}</span><small style="color:var(--muted);text-transform:none;letter-spacing:0">Tap to see the truth</small></span><span class="bk"><small>✓ Truth</small><span>${f}</span></span></span></button>`).join('');
$('myths').addEventListener('click',e=>{const b=e.target.closest('.myth');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');});}

