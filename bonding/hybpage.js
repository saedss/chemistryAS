"use strict";
/* ================= hybridization guide page ================= */
initTerms(WORDS);initNav();
document.querySelectorAll('.check[data-q]').forEach(el=>{const q=CHECKS[el.dataset.q];if(!q)return;el.innerHTML='<p class="kicker">Quick check</p><div class="qin"></div>';mcq(el.querySelector('.qin'),q);});
const CH4=()=>({center:'C',bonds:TET,ligs:['H','H','H','H'],angle:'109.5°',L:1.45});
const noGL=(id,svg)=>fbSet($(id),svg||shapeSVG({n:4,lp:0,ligs:['H','H','H','H'],center:'C',angle:'109.5°',pExtra:'none'}));
const pressOnly=(box,btn,attr)=>box.querySelectorAll(attr).forEach(x=>x.setAttribute('aria-pressed',x===btn?'true':'false'));

/* hero */
if(HAS3D)new Viewer($('heroViz'),{dist:8.2,pitch:.3,yaw:.3}).build(v=>buildMolecule(v,CH4()));else noGL('heroViz');

/* L2: orbitals in 3D */
(function(){
  if(!HAS3D){noGL('orbViz',`${sOrb(0,0,40,.7)}${pOrb(0,0,0,70,.6)}${pOrb(0,0,-90,70,.6)}`);$('orbBtns').hidden=true;return;}
  const v=new Viewer($('orbViz'),{dist:7.2,pitch:.4,yaw:.6});v.build(buildOrbitalSet);
  $('orbBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;const k=b.dataset.k;ORB[k]=!ORB[k];b.setAttribute('aria-pressed',ORB[k]?'true':'false');if(!v.on)v.frame(0);});
})();
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

/* L9: drill */
(function(){
  const box=$('drill'),NM={1:'sp',2:'sp²',3:'sp³'};let order=shuffle(DRILL.map((_,i)=>i)),i=0,score=0,answered=false;
  function show(){
    if(i>=order.length){box.innerHTML=`<p class="kicker">Finished</p><p class="mol">${score} / ${order.length}</p><p>${score>=6?'Excellent. You have got the shortcut.':score>=5?'Good. Look again at the ones you missed.':'Read Lesson 9 again, then try once more.'}</p><div><button class="btn primary" type="button" id="drAgain">Try again</button></div>`;if(score>=6)confetti();return;}
    const d=DRILL[order[i]];answered=false;
    box.innerHTML=`<p class="kicker">Molecule ${i+1} of ${order.length} · score ${score}</p><p class="mol">${d.f}</p><p>${d.s} Look at: <b>${d.look}</b>. Count the atoms bonded to it.</p><div class="ans">${[1,2,3].map(n=>`<button class="btn" type="button" data-a="${n}">${NM[n]}</button>`).join('')}</div><p class="fb" hidden></p><div><button class="btn primary" type="button" id="drNext" hidden>Next molecule →</button></div>`;}
  box.addEventListener('click',e=>{
    if(e.target.id==='drAgain'){order=shuffle(order);i=0;score=0;show();return;}
    if(e.target.id==='drNext'){i++;show();return;}
    const b=e.target.closest('.ans .btn');if(!b||answered)return;answered=true;const d=DRILL[order[i]],ok=+b.dataset.a===d.a;if(ok)score++;
    box.querySelectorAll('.ans .btn').forEach(x=>{x.disabled=true;if(+x.dataset.a===d.a)x.classList.add('right');});if(!ok)b.classList.add('wrong');
    const fb=box.querySelector('.fb');fb.hidden=false;fb.className='fb fade '+(ok?'good':'poor');fb.textContent=(ok?'Correct. ':'Not quite. ')+d.why;$('drNext').hidden=false;
    if(ok){const r=box.getBoundingClientRect(),br=b.getBoundingClientRect();burst(box,br.left-r.left+br.width/2,br.top-r.top+br.height/2);}});
  show();
})();

/* L11: quiz */
(function(){
  const box=$('hybQuiz'),N=HYB_QUIZ.length;let score=0,done=0;
  function render(){score=0;done=0;$('scoreH').textContent=`0 / ${N}`;$('meterH').style.width='0';box.innerHTML=HYB_QUIZ.map((q,i)=>`<div class="q" data-i="${i}"></div>`).join('');
    box.querySelectorAll('.q').forEach(el=>{const i=+el.dataset.i;mcq(el,HYB_QUIZ[i],{num:i+1,onAnswer:ok=>{done++;if(ok)score++;$('meterH').style.width=(score/N*100)+'%';$('scoreH').textContent=`${score} / ${N}${done===N?(score>=9?' · excellent':score>=7?' · solid':' · go back to the lessons you missed'):''}`;if(done===N&&score>=7)confetti();}});});}
  $('resetH').addEventListener('click',render);render();
})();
