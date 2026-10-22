"use strict";
/* ================= hybridization guide page ================= */
initTerms(WORDS);initNav();
document.querySelectorAll('.check[data-q]').forEach(el=>{const q=CHECKS[el.dataset.q];if(!q)return;el.innerHTML='<p class="kicker">Quick check</p><div class="qin"></div>';mcq(el.querySelector('.qin'),q);});
const CH4=()=>({center:'C',bonds:TET,ligs:['H','H','H','H'],angle:'109.5°',L:1.45});
const noGL=(id,svg)=>fbSet($(id),svg||shapeSVG({n:4,lp:0,ligs:['H','H','H','H'],center:'C',angle:'109.5°',pExtra:'none'}));
const pressOnly=(box,btn,attr)=>box.querySelectorAll(attr).forEach(x=>x.setAttribute('aria-pressed',x===btn?'true':'false'));

/* hero */
if(HAS3D)new Viewer($('heroViz'),{dist:8.2,pitch:.3,yaw:.3}).build(v=>buildMolecule(v,CH4()));else noGL('heroViz');

/* L2: orbitals in 3D, and the no-mix model */
(function(){
  if(!HAS3D){noGL('orbViz',`${sOrb(0,0,40,.7)}${pOrb(0,0,0,70,.6)}${pOrb(0,0,-90,70,.6)}`);$('orbBtns').hidden=true;return;}
  const v=new Viewer($('orbViz'),{dist:7.2,pitch:.4,yaw:.6});v.build(buildOrbitalSet);
  $('orbBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;const k=b.dataset.k;ORB[k]=!ORB[k];b.setAttribute('aria-pressed',ORB[k]?'true':'false');if(!v.on)v.frame(0);});
})();
(function(){
  if(!HAS3D){noGL('nomixViz');$('nomixBtns').hidden=true;return;}
  const v=new Viewer($('nomixViz'),{dist:7.8,pitch:.35,yaw:.7});const go=m=>v.build(m==='no'?buildNoMix:x=>buildMolecule(x,CH4()));go('no');
  $('nomixBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;pressOnly($('nomixBtns'),b,'.chip');go(b.dataset.m);});
})();

/* L3: energy chart */
(function(){
  const k=.3,x0=170,rows=[['Cost: promote 1 electron',400,'var(--bad)','about 400'],['Gain: 2 extra C–H bonds',826,'var(--ok)','about 826'],['Overall',426,'var(--accent)','about 420 better off']];let s='';
  rows.forEach(([n,val,col,lab],i)=>{const y=22+i*52;s+=`<text x="${x0-10}" y="${y+18}" text-anchor="end" font-size="13" font-weight="700" font-family="var(--display)" fill="var(--ink)">${n}</text><rect class="grow" style="animation-delay:${i*.35}s" x="${x0}" y="${y}" width="${val*k}" height="26" rx="5" fill="${col}" fill-opacity=".8"/>`+txt(x0+val*k+8,y+18,lab,12,'start','var(--ink)','600');});
  $('enChart').innerHTML=s;onceInView($('enBox'),()=>$('enBox').classList.add('go'));
})();

/* L4: why the hybrid is lopsided */
function wlobe(c,x,y,ang,L,W,fill,stroke,dash){c.save();c.translate(x,y);c.rotate(ang);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(L*.12,-W,L*.95,-W*1.15,L,0);c.bezierCurveTo(L*.95,W*1.15,L*.12,W,0,0);c.closePath();c.fillStyle=fill;c.fill();c.lineWidth=2;c.strokeStyle=stroke;if(dash)c.setLineDash([5,4]);c.stroke();c.restore();}
anim2d($('cvWave'),W=>W<420?.8:.62,(c,w,h,t)=>{
  const T=8.5,k=t%T,fin=t<T?1:seg(k,0,.3),fout=1-seg(k,8,8.5);c.globalAlpha=fin*fout;
  const cx=w*.5,cy=h*.47,L=Math.min(w*.27,h*.36),drop=ease(seg(k,.9,2.1)),mix=ease(seg(k,2.6,4.3));
  const pc=mixHex(TOK.p,TOK.hyb,mix),Lr=L*(1+.42*mix),Ll=L*(1-.66*mix),Wr=L*.36*(1+.3*mix),Wl=L*.36*(1-.45*mix);
  wlobe(c,cx,cy,Math.PI,Ll,Wl,rgba(pc,.28+.3*mix),pc,mix<.5);
  wlobe(c,cx,cy,0,Lr,Wr,rgba(pc,.7),pc,false);
  const sy=lerp(cy-h*.33,cy,drop),sr=L*.5;if(mix<1){c.save();c.globalAlpha*=1-mix;c.fillStyle=rgba(TOK.s,.55);circ(c,cx,sy,sr);c.fill();c.strokeStyle=TOK.s;c.lineWidth=2;c.stroke();ctext(c,'+',cx,sy-sr*.45,{color:TOK.ink,font:DISP(16)});ctext(c,'s',cx,sy+sr*.3,{color:TOK.ink,font:MONO(12,600)});c.restore();}
  c.fillStyle=TOK.ink;circ(c,cx,cy,4);c.fill();
  ctext(c,'+',cx+Lr*.62,cy,{color:TOK.ink,font:DISP(18)});if(Ll>L*.45)ctext(c,'−',cx-Ll*.62,cy,{color:TOK.ink,font:DISP(18)});
  if(mix>.15){c.save();c.globalAlpha*=seg(k,2.8,3.4);ctext(c,'+ and + add up: bigger',cx+L*.75,cy-L*.62,{color:TOK.ok,font:MONO(11,600)});ctext(c,'− and + cancel: smaller',cx-L*.75,cy+L*.62,{color:TOK.bad,font:MONO(11,600)});c.restore();}
  const msg=k<2.6?'A p orbital (one + lobe, one − lobe) and an s orbital (all +)':k<4.3?'Mixing: the s orbital adds to the + lobe and cancels part of the − lobe':'Result: a hybrid orbital with one big lobe and one small lobe';
  ctext(c,msg,w/2,h-14,{font:SANS,color:TOK.ink});c.globalAlpha=1;
},6);

/* L5: flat cross vs tetrahedron */
(function(){
  if(!HAS3D){noGL('flatViz');$('flatBtns').hidden=true;return;}
  const FLAT=[N3(0,1,0),N3(1,0,0),N3(0,-1,0),N3(-1,0,0)],v=new Viewer($('flatViz'),{dist:7.6,pitch:.15,yaw:0});
  const go=m=>v.build(x=>m==='flat'?buildLobes(x,TET,FLAT,'90°'):buildLobes(x,FLAT,TET,'109.5°'));go('tet');
  $('flatBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;pressOnly($('flatBtns'),b,'.chip');go(b.dataset.m);});
})();

/* L6: bonding */
(function(){
  if(!HAS3D){noGL('bondViz');$('bondAgain').hidden=true;return;}
  const v=new Viewer($('bondViz'),{dist:8.2,pitch:.3,yaw:-.3});const go=()=>v.build(x=>buildMolecule(x,CH4()));go();$('bondAgain').onclick=go;
})();

/* L8: ethyne */
(function(){
  if(!HAS3D){noGL('ynViz',`${atom(-40,0,'C',14,true)}${atom(40,0,'C',14,true)}${atom(-110,0,'H')}${atom(110,0,'H')}<line x1="-26" y1="-6" x2="26" y2="-6" stroke="var(--ink)" stroke-width="2"/><line x1="-26" y1="0" x2="26" y2="0" stroke="var(--ink)" stroke-width="2"/><line x1="-26" y1="6" x2="26" y2="6" stroke="var(--ink)" stroke-width="2"/>`);return;}
  const v=new Viewer($('ynViz'),{dist:6,pitch:.45,yaw:-.5,mode:'sway'});const go=()=>v.build(buildEthyne);go();
  $('ynAgain').onclick=go;$('ynP').onchange=e=>{YN.p=e.target.checked;if(!v.on)v.frame(0);};$('ynPi').onchange=e=>{YN.pi=e.target.checked;if(!v.on)v.frame(0);};
})();

/* L9: lone pairs */
(function(){
  const D={N:{f:'NH₃',el:'N',g:[2,1,1,1],cfg:'1s² 2s² 2p³',bp:3,lp:1,ang:'107°',shape:'trigonal pyramidal',txt:'Nitrogen has 5 outer electrons. Its 2p orbitals already hold 3 single electrons, so <b>no promotion is needed</b>. It mixes 2s and all three 2p into four sp³ orbitals. 5 electrons go into 4 orbitals: one gets a pair (the <b>lone pair</b>), three get one electron each and make the <b>3 N–H bonds</b>.'},
           O:{f:'H₂O',el:'O',g:[2,2,1,1],cfg:'1s² 2s² 2p⁴',bp:2,lp:2,ang:'104.5°',shape:'bent',txt:'Oxygen has 6 outer electrons and already 2 single ones, so <b>no promotion</b>. It mixes into four sp³ orbitals. 6 electrons in 4 orbitals: two get a pair (<b>2 lone pairs</b>), two get one electron and make the <b>2 O–H bonds</b>.'}};
  const v=HAS3D?new Viewer($('lpViz'),{dist:8.2,pitch:.3,yaw:.3}):null;
  const arw=(x,y,up,col)=>up?`<path d="M${x} ${y+10}V${y-10}M${x-4} ${y-5}L${x} ${y-10}L${x+4} ${y-5}" stroke="${col}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`:`<path d="M${x} ${y-10}V${y+10}M${x-4} ${y+5}L${x} ${y+10}L${x+4} ${y+5}" stroke="${col}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const boxE=(x,y,n,fill,d)=>`<g class="pop" style="animation-delay:${d}s"><rect x="${x-16}" y="${y-16}" width="32" height="32" rx="5" fill="${fill}" stroke="var(--ink)" stroke-width="1.5"/>${n===2?arw(x-6,y,true,'var(--sigma)')+arw(x+6,y,false,'var(--sigma)'):n===1?arw(x,y,true,'var(--sigma)'):''}</g>`;
  function show(k){const d=D[k];pressOnly($('lpTabs'),$('lpTabs').querySelector(`[data-k="${k}"]`),'.tab');
    let s=txt(14,24,'BEFORE · '+d.cfg,11,'start','var(--muted)','600');
    s+=txt(60,74,'2s',11,'middle','var(--ink)','600')+txt(176,74,'2p',11,'middle','var(--ink)','600');
    s+=boxE(60,46,d.g[0],'var(--card)',0);[0,1,2].forEach(i=>s+=boxE(136+i*40,46,d.g[i+1],'var(--card)',.1+i*.1));
    s+=`<g class="stamp" style="animation-delay:.5s"><rect x="250" y="32" width="122" height="26" rx="13" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="311" y="50" text-anchor="middle" font-size="11" font-weight="800" font-family="var(--display)" fill="var(--ok)">no promotion needed</text></g>`;
    s+=`<path d="M120 86 V112" stroke="var(--muted)" stroke-width="2"/><path d="M114 106 L120 116 L126 106" fill="none" stroke="var(--muted)" stroke-width="2"/>`+txt(132,106,'mix all four',11,'start','var(--muted)');
    s+=txt(14,136,'AFTER · four sp³ orbitals',11,'start','var(--muted)','600');
    const hy=d.g.slice();hy.forEach((n,i)=>{const x=55+i*82;s+=boxE(x,166,n,'color-mix(in srgb,var(--hyb) 22%,var(--card))',.9+i*.12);s+=`<text x="${x}" y="200" text-anchor="middle" font-size="11" font-weight="700" font-family="var(--mono)" fill="${n===2?'var(--lp)':'var(--hyb)'}" class="late">${n===2?'lone pair':'bond'}</text>`;});
    $('lpSvg').innerHTML=s;const box=$('lpSvg').parentElement;box.classList.remove('go');void box.offsetWidth;if(!REDUCED)box.classList.add('go');
    $('lpText').innerHTML=`<p>${d.txt}</p><p class="cap">${d.f}: ${d.bp} bonds + ${d.lp} lone pair${d.lp>1?'s':''} = 4 regions → sp³. Shape ${d.shape}, ${d.ang}.</p>`;
    if(v){const G=vsepr(d.bp,d.lp);v.build(x=>buildMolecule(x,{center:d.el,bonds:G.bonds,lps:G.lps,ligs:Array(d.bp).fill('H'),arcs:G.arcs,L:1.4}));}
    else fbSet($('lpViz'),shapeSVG({n:4,lp:d.lp,ligs:Array(d.bp).fill('H'),center:d.el,angle:d.ang,pExtra:'none'}));}
  $('lpTabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(b)show(b.dataset.k);});show('N');
})();

/* L10: drill */
(function(){
  const box=$('drill'),NM={1:'sp',2:'sp²',3:'sp³'};let order=shuffle(DRILL.map((_,i)=>i)),i=0,score=0,answered=false;
  function show(){
    if(i>=order.length){box.innerHTML=`<p class="kicker">Finished</p><p class="mol">${score} / ${order.length}</p><p>${score>=13?'Excellent. You have got the shortcut.':score>=10?'Good. Look again at the ones you missed.':'Read Lesson 10 again, then try once more.'}</p><div><button class="btn primary" type="button" id="drAgain">Try again</button></div>`;if(score>=13)confetti();return;}
    const d=DRILL[order[i]];answered=false;
    box.innerHTML=`<p class="kicker">Molecule ${i+1} of ${order.length} · score ${score}</p><p class="mol">${d.f}</p><p>${d.s} Look at: <b>${d.look}</b>. Count σ bonds + lone pairs.</p><div class="ans">${[1,2,3].map(n=>`<button class="btn" type="button" data-a="${n}">${NM[n]}</button>`).join('')}</div><p class="fb" hidden></p><div><button class="btn primary" type="button" id="drNext" hidden>Next molecule →</button></div>`;}
  box.addEventListener('click',e=>{
    if(e.target.id==='drAgain'){order=shuffle(order);i=0;score=0;show();return;}
    if(e.target.id==='drNext'){i++;show();return;}
    const b=e.target.closest('.ans .btn');if(!b||answered)return;answered=true;const d=DRILL[order[i]],ok=+b.dataset.a===d.a;if(ok)score++;
    box.querySelectorAll('.ans .btn').forEach(x=>{x.disabled=true;if(+x.dataset.a===d.a)x.classList.add('right');});if(!ok)b.classList.add('wrong');
    const fb=box.querySelector('.fb');fb.hidden=false;fb.className='fb fade '+(ok?'good':'poor');fb.textContent=(ok?'Correct. ':'Not quite. ')+d.why;$('drNext').hidden=false;
    if(ok){const r=box.getBoundingClientRect(),br=b.getBoundingClientRect();burst(box,br.left-r.left+br.width/2,br.top-r.top+br.height/2);}});
  show();
})();

/* L12: quiz */
(function(){
  const box=$('hybQuiz'),N=HYB_QUIZ.length;let score=0,done=0;
  function render(){score=0;done=0;$('scoreH').textContent=`0 / ${N}`;$('meterH').style.width='0';box.innerHTML=HYB_QUIZ.map((q,i)=>`<div class="q" data-i="${i}"></div>`).join('');
    box.querySelectorAll('.q').forEach(el=>{const i=+el.dataset.i;mcq(el,HYB_QUIZ[i],{num:i+1,onAnswer:ok=>{done++;if(ok)score++;$('meterH').style.width=(score/N*100)+'%';$('scoreH').textContent=`${score} / ${N}${done===N?(score>=9?' · excellent':score>=7?' · solid':' · go back to the lessons you missed'):''}`;if(done===N&&score>=7)confetti();}});});}
  $('resetH').addEventListener('click',render);render();
})();
