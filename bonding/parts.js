"use strict";
/* ================= page wiring, part by part ================= */
initTerms(WORDS);initNav();
document.querySelectorAll('.check[data-q]').forEach(el=>{const q=CHECKS[el.dataset.q];if(!q)return;el.innerHTML='<p class="kicker">Quick check</p><div class="qin"></div>';mcq(el.querySelector('.qin'),q);});

/* ---------- hero ---------- */
if(HAS3D)new Viewer($('heroViz'),{dist:8.2,pitch:.3,yaw:.3}).build(v=>buildMolecule(v,{center:'C',bonds:TET,ligs:['H','H','H','H'],angle:'109.5°',L:1.45}));
else fbSet($('heroViz'),shapeSVG({n:4,lp:0,ligs:['H','H','H','H'],center:'C',angle:'109.5°',pExtra:'none'}));

/* ================= PART 0: build any atom ================= */
(function configBuilder(){
  const EL=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar'];
  const NM=['hydrogen','helium','lithium','beryllium','boron','carbon','nitrogen','oxygen','fluorine','neon','sodium','magnesium','aluminium','silicon','phosphorus','sulfur','chlorine','argon'];
  const SUBS=[{id:'1s',f:1,t:'s',nb:1,y:200},{id:'2s',f:2,t:'s',nb:1,y:128},{id:'2p',f:2,t:'p',nb:3,y:128},{id:'3s',f:3,t:'s',nb:1,y:56},{id:'3p',f:3,t:'p',nb:3,y:56}];
  const SP='⁰¹²³⁴⁵⁶',BW=34,bx=(sb,b)=>sb.t==='s'?142:224+b*(BW+8);
  $('elPick').innerHTML=EL.map((s,i)=>`<button class="chip" type="button" data-z="${i+1}" aria-pressed="false">${s}</button>`).join('');
  function render(Z){
    $('zR').value=Z;$('elPick').querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.z===Z?'true':'false'));
    let rem=Z,ord=0,s='',parts=[],top=1;
    s+=`<line x1="22" y1="228" x2="22" y2="18" stroke="var(--muted)" stroke-width="1.5"/><path d="M17 26L22 16L27 26Z" fill="var(--muted)"/><text x="12" y="130" transform="rotate(-90 12 130)" text-anchor="middle" font-size="10" font-family="var(--mono)" fill="var(--muted)" letter-spacing="2">ENERGY</text>`;
    const fill=SUBS.map(sb=>{const k=Math.min(rem,2*sb.nb);rem-=k;if(k>0)top=Math.max(top,sb.f);return k;});
    [1,2,3].forEach(f=>{const y=SUBS.find(x=>x.f===f).y,outer=f===top;s+=`<rect x="34" y="${y-30}" width="340" height="60" rx="10" fill="${outer?'var(--hyb)':'var(--card)'}" fill-opacity="${outer?.14:.6}" stroke="${outer?'var(--hyb)':'none'}"/><text x="44" y="${y-14}" font-size="10" font-family="var(--mono)" fill="var(--muted)">FLOOR ${f}</text><text x="44" y="${y+2}" font-size="10" font-family="var(--mono)" fill="var(--muted)">shell ${f}</text>${outer?`<text x="368" y="${y-16}" text-anchor="end" font-size="10" font-weight="600" font-family="var(--mono)" fill="var(--hyb)">outer shell</text>`:''}`;});
    SUBS.forEach((sb,si)=>{const k=fill[si];
      s+=`<text x="${bx(sb,0)-8-BW/2}" y="${sb.y+5}" text-anchor="end" font-size="14" font-weight="800" font-family="var(--display)"><tspan fill="var(--accent)">${sb.f}</tspan><tspan fill="var(--p)">${sb.t}</tspan></text>`;
      for(let b=0;b<sb.nb;b++)s+=`<rect x="${bx(sb,b)-BW/2}" y="${sb.y-BW/2}" width="${BW}" height="${BW}" rx="5" fill="var(--card)" stroke="var(--ink)" stroke-width="1.5" opacity="${k>0||sb.f<=top?1:.45}"/>`;
      for(let i=0;i<k;i++){const b=i<sb.nb?i:i-sb.nb,up=i<sb.nb,two=k>sb.nb+b,x=bx(sb,b)+(two?(up?-7:7):0),y=sb.y;
        const d=up?`M${x} ${y+11}V${y-10}M${x-4.5} ${y-5}L${x} ${y-11}L${x+4.5} ${y-5}`:`M${x} ${y-11}V${y+10}M${x-4.5} ${y+5}L${x} ${y+11}L${x+4.5} ${y+5}`;
        s+=`<g class="pop" style="animation-delay:${(ord++)*.16}s"><path d="${d}" fill="none" stroke="var(--sigma)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
      if(k>0)parts.push([sb,k]);});
    const svg=$('hotelSvg');svg.innerHTML=s;const box=$('hotelBox');box.classList.remove('go');void box.offsetWidth;if(!REDUCED)box.classList.add('go');
    const outerE=parts.filter(([sb])=>sb.f===top).reduce((a,[,k])=>a+k,0),single=parts.reduce((a,[sb,k])=>a+(k<=sb.nb?k:2*sb.nb-k),0);
    $('cfgRead').innerHTML=`<p><b>${NM[Z-1][0].toUpperCase()+NM[Z-1].slice(1)}</b> is element ${Z}, so it has <b>${Z} electron${Z>1?'s':''}</b>.</p>
      <div class="cfgout">${parts.map(([sb,k])=>`<span><span class="a1">${sb.f}</span><span class="a2">${sb.t}</span><sup class="a3">${SP[k]}</sup></span>`).join('')}</div>
      <ul class="readlist">${parts.map(([sb,k])=>`<li><b><span class="a1">${sb.f}</span><span class="a2">${sb.t}</span><span class="a3">${SP[k]}</span></b> = floor ${sb.f}, ${sb.t==='s'?'the s room':'the p rooms'}, ${k} electron${k>1?'s':''}</li>`).join('')}</ul>
      <p class="cap">Check: ${parts.map(([,k])=>k).join(' + ')} = ${Z}. Outer shell: floor ${top}, with ${outerE} electron${outerE>1?'s':''}. Rooms with a single electron: <b>${single}</b>.</p>`;
  }
  $('elPick').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)render(+b.dataset.z);});
  $('zR').addEventListener('input',e=>render(+e.target.value));render(6);
})();

/* ================= PART 1 ================= */
anim2d($('cvIonic'),.62,(c,w,h,t)=>{
  const T=7.5,k=t%T,fin=t<T?1:seg(k,0,.35),fout=1-seg(k,6.9,7.5);c.globalAlpha=fin*fout;
  const R=Math.min(w*.15,h*.27),cy=h*.45,mv=ease(seg(k,3.6,4.8)),ion=ease(seg(k,2.7,3.4));
  const Rm=lerp(R,R*.72,ion),Ro=lerp(R,R*1.12,ion),sep=lerp(w*.46,Rm+Ro+26,mv),mx=w/2-sep/2,ox=w/2+sep/2,rot=t*.35,d2r=Math.PI/180;
  if(mv>0){c.save();c.globalAlpha*=mv;c.strokeStyle=rgba(TOK.sigma,.75);c.fillStyle=TOK.sigma;c.lineWidth=2;c.setLineDash([4,4]);c.lineDashOffset=-t*18;c.beginPath();c.moveTo(mx+Rm+8,cy);c.lineTo(ox-Ro-8,cy);c.stroke();c.setLineDash([]);const p=Math.sin(t*6)*2;arrow(c,mx+Rm+10,cy-12,w/2-4+p,cy-12);arrow(c,ox-Ro-10,cy-12,w/2+4-p,cy-12);c.restore();}
  c.lineWidth=2.5;c.strokeStyle=TOK.accent;circ(c,mx,cy,Rm);c.stroke();circ(c,ox,cy,Ro);c.stroke();
  if(ion>0){c.save();c.globalAlpha*=ion;c.strokeStyle=TOK.ink;c.lineWidth=1.6;[[mx,Rm],[ox,Ro]].forEach(([x,r])=>{c.beginPath();c.arc(x,cy,r+8,Math.PI*.78,Math.PI*1.22);c.stroke();c.beginPath();c.arc(x,cy,r+8,-Math.PI*.22,Math.PI*.22);c.stroke();});ctext(c,'2+',mx+Rm+14,cy-Rm-8,{color:TOK.ink,font:DISP(13)});ctext(c,'2−',ox+Ro+14,cy-Ro-8,{color:TOK.ink,font:DISP(13)});c.restore();}
  ctext(c,'Mg',mx,cy,{color:TOK.ink,font:DISP(15)});ctext(c,'O',ox,cy,{color:TOK.ink,font:DISP(15)});
  c.strokeStyle=TOK.ink;c.lineWidth=2;
  [-104,-76,-14,14,76,104].forEach((a,i)=>{const r=a*d2r+rot;cross(c,ox+Math.cos(r)*Ro,cy+Math.sin(r)*Ro+Math.sin(t*3+i)*.8,4);});
  const e=ease(seg(k,1.4,2.6));
  [-14,14].forEach((a,i)=>{const s={x:mx+Math.cos(a*d2r+rot)*Rm,y:cy+Math.sin(a*d2r+rot)*Rm},f=(180+a)*d2r+rot,g={x:ox+Math.cos(f)*Ro,y:cy+Math.sin(f)*Ro};let x,y;
    if(e<=0){x=s.x;y=s.y;}else if(e>=1){x=g.x;y=g.y;}else{const qx=(s.x+g.x)/2,qy=Math.min(s.y,g.y)-h*.36+i*10;x=(1-e)*(1-e)*s.x+2*e*(1-e)*qx+e*e*g.x;y=(1-e)*(1-e)*s.y+2*e*(1-e)*qy+e*e*g.y;c.fillStyle=rgba(TOK.sigma,.25);circ(c,x,y,10);c.fill();}
    c.fillStyle=TOK.sigma;circ(c,x,y,4.8);c.fill();});
  const msg=k<1.4?'Mg has 2 outer electrons. O has 6.':k<2.7?'Mg passes 2 electrons to O':k<3.6?'Mg²⁺ and O²⁻ form, both with full shells':'Opposite charges attract: an ionic bond';
  ctext(c,msg,w/2,h-14,{font:SANS,color:TOK.ink});c.globalAlpha=1;
},5.5);
anim2d($('cvCov'),.62,(c,w,h,t)=>{
  const T=7.5,k=t%T,fin=t<T?1:seg(k,0,.35),fout=1-seg(k,6.9,7.5);c.globalAlpha=fin*fout;
  const R=Math.min(w*.15,h*.27),cy=h*.45,app=ease(seg(k,1,2.4)),sep=lerp(w*.48,R*1.3,app),ax=w/2-sep/2,bx=w/2+sep/2,sh=ease(seg(k,2.4,3.2)),d2r=Math.PI/180;
  if(sh>0){const g=c.createRadialGradient(w/2,cy,0,w/2,cy,R*.6);g.addColorStop(0,rgba(TOK.sigma,.45*sh*(.8+.2*Math.sin(t*5))));g.addColorStop(1,rgba(TOK.sigma,0));c.fillStyle=g;circ(c,w/2,cy,R*.6);c.fill();}
  const ha=(k>3.5&&k<6.6)?(Math.floor((k-3.5)/1.0)%2):-1;
  [[ax,0],[bx,1]].forEach(([x,i])=>{c.lineWidth=ha===i?4:2.5;c.strokeStyle=ha===i?TOK.sigma:TOK.accent;circ(c,x,cy,R);c.stroke();ctext(c,'Cl',x,cy,{color:TOK.ink,font:DISP(15)});if(ha===i)ctext(c,'8 electrons',x,cy-R-12,{color:TOK.sigma,font:MONO(11,600)});});
  const bob=i=>Math.sin(t*3+i)*.9;
  c.fillStyle=TOK.sigma;[90,180,270].forEach((a,j)=>[-13,13].forEach((o,m)=>{const r=(a+o)*d2r;circ(c,ax+Math.cos(r)*R,cy+Math.sin(r)*R+bob(j*2+m),4.4);c.fill();}));
  c.strokeStyle=TOK.ink;c.lineWidth=2;[-90,0,90].forEach((a,j)=>[-13,13].forEach((o,m)=>{const r=(a+o)*d2r;cross(c,bx+Math.cos(r)*R,cy+Math.sin(r)*R+bob(j*2+m+6),4);}));
  const sa={x:lerp(ax+R,w/2,sh),y:lerp(cy,cy-7,sh)},sb={x:lerp(bx-R,w/2,sh),y:lerp(cy,cy+7,sh)};
  c.fillStyle=TOK.sigma;circ(c,sa.x,sa.y,4.6);c.fill();c.strokeStyle=TOK.ink;cross(c,sb.x,sb.y,4);
  const msg=k<1?'Each Cl atom has 7 outer electrons':k<2.4?'The two atoms move together':k<3.5?'Each puts 1 electron into a shared pair':'Cl₂: each atom now has 8 outer electrons';
  ctext(c,msg,w/2,h-14,{font:SANS,color:TOK.ink});c.globalAlpha=1;
},5);
const METALS={Na:{q:1,r:1,mp:'98 °C',bp:'883 °C',name:'Sodium',ion:'Na⁺'},Mg:{q:2,r:.8,mp:'650 °C',bp:'1090 °C',name:'Magnesium',ion:'Mg²⁺'},Al:{q:3,r:.64,mp:'660 °C',bp:'about 2500 °C',name:'Aluminium',ion:'Al³⁺'}};
function metalAnim(cv,S){
  const els=Array.from({length:45},()=>{const a=Math.random()*Math.PI*2,s=.06+Math.random()*.1;return {x:Math.random(),y:Math.random(),vx:Math.cos(a)*s,vy:Math.sin(a)*s};});
  return anim2d(cv,W=>W<480?.7:.58,(c,w,h,t,dt)=>{
    const M=METALS[S.m],H=h-28,cols=5,rows=3,px=w*.13,py=H*.2,base=Math.min(w/(cols*3.1),H/(rows*3)),r=base*M.r,lab=(M.q>1?M.q:'')+'+';
    if(S.volt){c.fillStyle=TOK.ink;rrect(c,2,8,10,H-16,3);c.fill();rrect(c,w-12,8,10,H-16,3);c.fill();ctext(c,'−',22,14,{color:TOK.ink,font:DISP(16)});ctext(c,'+',w-22,14,{color:TOK.ink,font:DISP(16)});c.strokeStyle=TOK.sigma;c.fillStyle=TOK.sigma;c.lineWidth=2;arrow(c,w*.36,12,w*.64,12);ctext(c,'electron flow',w/2,26,{color:TOK.sigma,font:MONO(10,600)});}
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const n=j*cols+i,x=px+i*(w-2*px)/(cols-1)+Math.sin(t*4+n*1.7)*1.5,y=py+j*(H-2*py)/(rows-1)+Math.cos(t*3.3+n)*1.5+(S.volt?8:0);c.fillStyle=rgba(TOK.accent,.16);circ(c,x,y,r);c.fill();c.lineWidth=2;c.strokeStyle=TOK.accent;c.stroke();ctext(c,lab,x,y,{color:TOK.ink,font:DISP(Math.max(9,Math.round(r*.62)))});}
    const nE=15*M.q;
    els.forEach((e,idx)=>{if(idx>=nE)return;if(dt>0){e.vx+=(Math.random()-.5)*dt*.5+(S.volt?(.16-e.vx)*dt*1.4:0);e.vy+=(Math.random()-.5)*dt*.5;const s=Math.hypot(e.vx,e.vy)||1,m=clamp(s,.05,.19);e.vx*=m/s;e.vy*=m/s;e.x=(e.x+e.vx*dt+1)%1;e.y=(e.y+e.vy*dt+1)%1;}
      const x=e.x*w,y=e.y*H+(S.volt?4:0);c.fillStyle=rgba(TOK.sigma,.22);circ(c,x,y,6.5);c.fill();c.fillStyle=TOK.sigma;circ(c,x,y,3.2);c.fill();});
    ctext(c,S.cap||`${M.ion} ions with ${M.q} electron${M.q>1?'s':''} each in the sea`,w/2,h-12,{font:SANS,color:TOK.ink});
  },2);
}
metalAnim($('cvMet'),{m:'Mg',volt:false,cap:'Mg²⁺ ions in a sea of delocalized electrons'});

/* ================= PART 2 ================= */
(function ionTable(){
  const box=$('ionTable'),det=$('ionDetail');
  box.innerHTML=GROUPS.map((g,i)=>`<button type="button" class="gcell ${g.act==='lose'?'pos':g.act==='gain'?'neg':''}" data-i="${i}" aria-pressed="false"><small>Group ${g.g==='0'?'0':g.g}</small><strong>${g.q}</strong><em>${g.el}</em></button>`).join('');
  function show(i){const g=GROUPS[i];box.querySelectorAll('.gcell').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===i?'true':'false'));
    const R=62;let s=`<circle cx="0" cy="0" r="${R}" fill="none" stroke="var(--accent)" stroke-width="2.5"${g.act==='lose'?' class="eout" style="--dx:0px;--dy:0px"':''}/>`;
    s+=`<circle cx="0" cy="0" r="22" fill="var(--ink)"/><text x="0" y="5" text-anchor="middle" font-size="15" font-weight="800" font-family="var(--display)" fill="var(--paper)">${g.s}</text>`;
    if(g.act==='lose')s+=`<circle cx="0" cy="0" r="40" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3" class="late"/>`;
    const slot=k=>{const a=(-90+k*45)*Math.PI/180;return [Math.cos(a)*R,Math.sin(a)*R,a];};
    const n=Math.min(g.n,8);
    for(let k=0;k<n;k++){const [x,y,a]=slot(k);const out=g.act==='lose';s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="var(--sigma)"${out?` class="eout" style="--dx:${(Math.cos(a)*70).toFixed(0)}px;--dy:${(Math.sin(a)*70).toFixed(0)}px"`:''}/>`;}
    if(g.act==='gain')for(let k=n;k<8;k++){const [x,y,a]=slot(k);s+=`<g class="ein" style="--dx:${(Math.cos(a)*70).toFixed(0)}px;--dy:${(Math.sin(a)*70).toFixed(0)}px">${xmark(x,y,5,'var(--accent)')}</g>`;}
    const ionTxt=g.act==='none'?'':g.s+chargeStr(g.act==='lose'?g.n:-(8-g.n));
    if(ionTxt)s+=`<text x="0" y="96" text-anchor="middle" font-size="18" font-weight="800" font-family="var(--display)" fill="var(--ink)" class="late">${ionTxt}</text>`;
    det.innerHTML=`<svg viewBox="-100 -100 200 210" role="img" aria-label="${g.s} ${g.act==='lose'?'losing':g.act==='gain'?'gaining':'keeping'} electrons">${s}</svg><div class="prose"><h4>Group ${g.g}: ${g.q==='none'?'no ion':g.q+' ions'}</h4><p>${g.why}</p><p><span class="cfg">${g.ex}</span></p>${g.act==='gain'?'<p class="cap">Blue crosses are the electrons gained.</p>':g.act==='lose'?'<p class="cap">The outer shell is lost completely. The full inner shell (dashed) is left.</p>':''}</div>`;}
  box.addEventListener('click',e=>{const b=e.target.closest('.gcell');if(b)show(+b.dataset.i);});show(1);
})();
(function formula(){
  const S={c:10,a:4};const gcd=(x,y)=>y?gcd(y,x%y):x;
  const chip=(ion,i,k)=>`<button class="chip" type="button" data-k="${k}" data-i="${i}" aria-pressed="false">${ion.f}${chargeStr(ion.q)}</button>`;
  $('fxC').innerHTML=CATIONS.map((x,i)=>chip(x,i,'c')).join('');$('fxA').innerHTML=ANIONS.map((x,i)=>chip(x,i,'a')).join('');
  function part(ion,n){return n===1?ion.f:ion.poly?`(${ion.f})${sub(n)}`:ion.f+sub(n);}
  function render(){
    const C=CATIONS[S.c],A=ANIONS[S.a],qc=C.q,qa=-A.q,L=qc*qa/gcd(qc,qa),n=L/qc,m=L/qa;
    document.querySelectorAll('#fxC .chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===S.c?'true':'false'));
    document.querySelectorAll('#fxA .chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===S.a?'true':'false'));
    let tk='';for(let i=0;i<n;i++)tk+=`<span class="tok c" style="animation-delay:${i*.12}s">${C.f}${chargeStr(qc)}</span>`;for(let i=0;i<m;i++)tk+=`<span class="tok a" style="animation-delay:${(n+i)*.12}s">${A.f}${chargeStr(-qa)}</span>`;
    $('fxTok').innerHTML=tk;
    $('fxBal').innerHTML=`<span>${n} × (+${qc}) = +${L}</span><span>${m} × (−${qa}) = −${L}</span><span class="ok">total charge 0 ✓</span>`;
    const f=part(C,n)+part(A,m);const el=$('fxF');el.innerHTML=`${f}<small>${C.n} ${A.n}</small>`;el.style.animation='none';void el.offsetWidth;el.style.animation='';
    let why=n===1&&m===1?`The charges already cancel: +${qc} and −${qa}.`:`The smallest number that both ${qc} and ${qa} go into is ${L}. So you need ${n} of the positive ion and ${m} of the negative ion.`;
    if((C.poly&&n>1)||(A.poly&&m>1))why+=' Put brackets round a compound ion when there is more than one of it.';
    if(qc!==qa)why+=` Shortcut: swap the charge numbers and use them as the small numbers (${C.f}${chargeStr(qc)} ${A.f}${chargeStr(-qa)} → ${part(C,qa)}${part(A,qc)}), then cancel down if you can.`;
    $('fxWhy').textContent=why;}
  $('fx').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;S[b.dataset.k]=+b.dataset.i;render();});render();
})();
(function nacl(){
  if(!HAS3D){fbSet($('naclViz'),(()=>{let h='';for(let i=0;i<4;i++)for(let j=0;j<4;j++){const na=(i+j)%2;h+=`<circle cx="${-75+i*50}" cy="${-75+j*50}" r="${na?12:20}" fill="${na?NA_COL:CL_COL}"/>`;}return h;})(),'-110 -110 220 220');['naclBall','naclFill','naclAgain'].forEach(id=>$(id).hidden=true);return;}
  const v=new Viewer($('naclViz'),{dist:7.4,pitch:.45,yaw:.5});let fill=false;const go=()=>v.build(x=>buildNaCl(x,fill));go();
  $('naclBall').onclick=()=>{fill=false;$('naclBall').setAttribute('aria-pressed','true');$('naclFill').setAttribute('aria-pressed','false');go();};
  $('naclFill').onclick=()=>{fill=true;$('naclFill').setAttribute('aria-pressed','true');$('naclBall').setAttribute('aria-pressed','false');go();};
  $('naclAgain').onclick=go;
})();
function hitAnim(cv,type){
  const els=Array.from({length:22},()=>({x:Math.random(),y:Math.random(),p:Math.random()*6}));
  anim2d(cv,W=>W<520?.6:.36,(c,w,h,t)=>{
    const T=7,k=t%T,fin=t<T?1:seg(k,0,.3),fout=1-seg(k,6.5,7);c.globalAlpha=fin*fout;
    const cols=9,s=Math.min(w*.8/cols,h*.24),x0=(w-s*(cols-1))/2,yB=h*.6,yT=yB-s,push=ease(seg(k,1,1.8))*s,crack=type==='ionic'?ease(seg(k,2.6,3.5)):0;
    if(k>.5&&k<2){c.strokeStyle=TOK.ink;c.fillStyle=TOK.ink;c.lineWidth=3;const ax=lerp(x0-s*1.6,x0-s*.9,ease(seg(k,.6,1.2)));arrow(c,ax-s*.9,yT,ax,yT,10);ctext(c,'force',ax-s*.5,yT-16,{color:TOK.ink,font:MONO(11,600)});}
    if(type==='metal'){c.save();c.beginPath();c.rect(0,yT-s*.8,w,s*2.6);c.clip();els.forEach(e=>{const x=((e.x+t*.04*(e.p>3?1:-1))%1+1)%1*w,y=yT-s*.6+e.y*s*2.2;c.fillStyle=rgba(TOK.sigma,.25);circ(c,x,y,6);c.fill();c.fillStyle=TOK.sigma;circ(c,x,y,3);c.fill();});c.restore();}
    for(let row=0;row<2;row++)for(let i=-1;i<=cols;i++){
      const top=row===1,x=x0+i*s+(top?push:0),y=(top?yT:yB)-(top?crack*h*.16:0)+(top?Math.sin(i*1.3)*crack*6:0);
      if(x<-s||x>w+s)continue;
      if(type==='ionic'){const plus=(i+row)%2===0,r=plus?s*.3:s*.44;c.fillStyle=plus?rgba(TOK.bad,.85):rgba(TOK.hyb,.85);circ(c,x,y,r);c.fill();ctext(c,plus?'+':'−',x,y+1,{color:'#ffffff',font:DISP(Math.round(s*.34))});}
      else{c.fillStyle=rgba(TOK.accent,.2);circ(c,x,y,s*.4);c.fill();c.strokeStyle=TOK.accent;c.lineWidth=2;c.stroke();ctext(c,'+',x,y+1,{color:TOK.ink,font:DISP(Math.round(s*.34))});}
    }
    if(type==='ionic'&&k>1.8&&k<3.6){const a=seg(k,1.8,2.1)*(1-seg(k,3.3,3.6));c.save();c.globalAlpha*=a;c.strokeStyle=TOK.bad;c.fillStyle=TOK.bad;c.lineWidth=2.4;for(let i=1;i<cols-1;i+=2){const x=x0+i*s+s*.5;arrow(c,x,yB-s*.35,x,yB-s*.62-crack*h*.1,7);arrow(c,x,yB-s*.62-crack*h*.1,x,yB-s*.35,7);}c.restore();}
    const msg=type==='ionic'?(k<1?'An ionic lattice: + and − alternate':k<1.9?'A force pushes the top layer along':k<3?'Now + sits on + and − sits on −':'They repel and the crystal splits: brittle'):(k<1?'Metal ions in a sea of electrons':k<1.9?'A force pushes the top layer along':'The layer slides. The sea still holds every ion: the metal bends');
    ctext(c,msg,w/2,h-14,{font:SANS,color:TOK.ink});c.globalAlpha=1;
  },5);
}
hitAnim($('hitIonic'),'ionic');
(function radii(){
  const D=[['N³⁻',146,7,'neg'],['O²⁻',140,8,'neg'],['F⁻',133,9,'neg'],['Na⁺',102,11,'pos'],['Mg²⁺',72,12,'pos'],['Al³⁺',54,13,'pos']],xs=[45,122,196,292,364,432];let s='';
  s+=`<line x1="244" y1="20" x2="244" y2="190" stroke="var(--line)" stroke-dasharray="4 4"/><text x="244" y="14" text-anchor="middle" font-size="10" font-family="var(--mono)" fill="var(--muted)">(Ne)</text>`;
  D.forEach(([n,r,p,k],i)=>{const R=r*.26;s+=`<g class="pop" style="animation-delay:${i*.12}s"><circle cx="${xs[i]}" cy="88" r="${R}" fill="${k==='neg'?'var(--sigma)':'var(--accent)'}" fill-opacity=".22" stroke="${k==='neg'?'var(--sigma)':'var(--accent)'}" stroke-width="2"/></g>`;
    s+=txt(xs[i],150,n,15,'middle','var(--ink)','800').replace('font-family="var(--mono)"','font-family="var(--display)"')+txt(xs[i],168,`${p}p, 10e`,11)+txt(xs[i],185,`${r} pm`,11);});
  $('radii').innerHTML=s;onceInView($('radiiBox'),()=>$('radiiBox').classList.add('go'));
})();

/* ================= PART 3 ================= */
(function nh3(){
  let s='';const N=[100,92],Hs=[[52,92],[148,92],[100,140]];
  Hs.forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="26" fill="none" stroke="var(--accent)" stroke-width="2"/>`);
  s+=`<circle cx="${N[0]}" cy="${N[1]}" r="36" fill="none" stroke="var(--accent)" stroke-width="2"/>`;
  s+=`<text x="100" y="97" text-anchor="middle" font-size="15" font-weight="800" font-family="var(--display)" fill="var(--ink)">N</text>`;
  Hs.forEach(([x,y],i)=>s+=`<text x="${i===0?x-10:i===1?x+10:x}" y="${i===2?y+14:y+5}" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--display)" fill="var(--ink)">H</text>`);
  s+=xmark(74,84)+dot(74,100,'var(--sigma)')+xmark(126,84)+dot(126,100,'var(--sigma)')+xmark(93,118)+dot(107,118,'var(--sigma)')+xmark(93,60)+xmark(107,60);
  s+=txt(100,196,'Dot and cross',12,'middle','var(--ink)','600');
  const lx=300;s+=`<text x="${lx}" y="98" text-anchor="middle" font-size="18" font-weight="800" font-family="var(--display)" fill="var(--ink)">N</text>`;
  [[lx-48,98],[lx+48,98],[lx,148]].forEach(([x,y])=>s+=`<text x="${x}" y="${y}" text-anchor="middle" font-size="18" font-weight="800" font-family="var(--display)" fill="var(--ink)">H</text>`);
  s+=dot(lx-24,86,'var(--sigma)')+dot(lx-24,98,'var(--accent)')+dot(lx+24,86,'var(--sigma)')+dot(lx+24,98,'var(--accent)')+dot(lx-6,118,'var(--sigma)')+dot(lx+6,118,'var(--accent)')+dot(lx-6,70,'var(--accent)')+dot(lx+6,70,'var(--accent)');
  s+=txt(lx,196,'Lewis',12,'middle','var(--ink)','600');
  const ox=500,oy=92;s+=`<line x1="${ox}" y1="${oy}" x2="${ox-46}" y2="${oy+42}" stroke="var(--ink)" stroke-width="2.5"/><line x1="${ox}" y1="${oy}" x2="${ox+46}" y2="${oy+42}" stroke="var(--ink)" stroke-width="2.5"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy+56}" stroke="var(--ink)" stroke-width="2.5"/>`;
  s+=`<circle cx="${ox}" cy="${oy}" r="13" fill="var(--card)"/><text x="${ox}" y="${oy+6}" text-anchor="middle" font-size="17" font-weight="800" font-family="var(--display)" fill="var(--ink)">N</text>`;
  [[ox-54,oy+52],[ox+54,oy+52],[ox,oy+72]].forEach(([x,y])=>s+=`<text x="${x}" y="${y}" text-anchor="middle" font-size="16" font-weight="800" font-family="var(--display)" fill="var(--ink)">H</text>`);
  s+=dot(ox-6,oy-20)+dot(ox+6,oy-20)+txt(ox,196,'Line diagram',12,'middle','var(--ink)','600');
  s+=`<text x="128" y="50" font-size="10" font-family="var(--mono)" fill="var(--muted)">lone pair</text><path d="M126 50 L110 58" stroke="var(--muted)"/>`;
  $('nh3ways').innerHTML=s;
})();
anim2d($('cvDative'),W=>W<420?.75:.58,(c,w,h,t)=>{
  const T=7.5,k=t%T,fin=t<T?1:seg(k,0,.3),fout=1-seg(k,7,7.5);c.globalAlpha=fin*fout;
  const nx=w*.36,ny=h*.46,L=Math.min(w*.2,h*.32),hp=ease(seg(k,.3,1.4)),lp=ease(seg(k,1.5,2.3)),ar=seg(k,2.2,3),nm=seg(k,3.6,4.4);
  const hx=lerp(w*.92,nx+L,hp);
  c.strokeStyle=TOK.ink;c.lineWidth=2.5;[150,210,90].forEach(d=>{const r=d*Math.PI/180;c.beginPath();c.moveTo(nx,ny);c.lineTo(nx+Math.cos(r)*L,ny+Math.sin(r)*L);c.stroke();});
  [150,210,90].forEach(d=>{const r=d*Math.PI/180;c.fillStyle=TOK.card;circ(c,nx+Math.cos(r)*L,ny+Math.sin(r)*L,12);c.fill();c.strokeStyle=TOK.ink;c.lineWidth=1.5;c.stroke();ctext(c,'H',nx+Math.cos(r)*L,ny+Math.sin(r)*L+1,{color:TOK.ink,font:DISP(12)});});
  if(ar>0){c.save();const col=nm>0?TOK.ink:TOK.accent;c.strokeStyle=col;c.fillStyle=col;c.lineWidth=2.5;const x2=lerp(nx+16,hx-14,ar);if(nm>.5){c.beginPath();c.moveTo(nx,ny);c.lineTo(hx,ny);c.stroke();}else arrow(c,nx+16,ny,x2,ny,9);c.restore();}
  const px=lerp(nx+20,(nx+hx)/2,lp);c.fillStyle=TOK.sigma;circ(c,px,ny-6,3.6);c.fill();circ(c,px,ny+6,3.6);c.fill();
  c.fillStyle=TOK.ink;circ(c,nx,ny,15);c.fill();ctext(c,'N',nx,ny+1,{color:TOK.paper,font:DISP(14)});
  c.fillStyle=TOK.card;circ(c,hx,ny,12);c.fill();c.strokeStyle=TOK.ink;c.lineWidth=1.5;c.stroke();ctext(c,'H',hx,ny+1,{color:TOK.ink,font:DISP(12)});
  if(nm<.5)ctext(c,'+',hx+15,ny-13,{color:TOK.bad,font:DISP(15)});
  if(nm>0){c.save();c.globalAlpha*=nm;c.strokeStyle=TOK.ink;c.lineWidth=1.8;const bx0=nx-L-24,bx1=hx+22,by0=ny-L-18,by1=ny+L*.6+20;c.beginPath();c.moveTo(bx0+8,by0);c.lineTo(bx0,by0);c.lineTo(bx0,by1);c.lineTo(bx0+8,by1);c.moveTo(bx1-8,by0);c.lineTo(bx1,by0);c.lineTo(bx1,by1);c.lineTo(bx1-8,by1);c.stroke();ctext(c,'+',bx1+10,by0+4,{color:TOK.ink,font:DISP(16)});c.restore();}
  const msg=k<1.5?'NH₃ has a lone pair. H⁺ has no electrons at all.':k<3.4?'The lone pair is shared with H⁺: a dative bond (arrow from the giver)':'NH₄⁺: all four N–H bonds are now the same';
  ctext(c,msg,w/2,h-14,{font:SANS,color:TOK.ink});c.globalAlpha=1;
},5);

/* ================= PART 4 ================= */
const H2={r:REDUCED?74:250,auto:!REDUCED,t:0,trail:[],msg:''};
const MORSE=r=>436*(Math.pow(1-Math.exp(-.0194*(r-74)),2)-1);
const H2SEG=[[2.6,'mv',250,74],[2.4,'vib'],[.7,'mv',74,33],[.9,'mv',33,74],[1,'vib'],[2.6,'mv',74,250],[.9,'hold',250]];
const H2T=H2SEG.reduce((s,x)=>s+x[0],0);
function autoR(t){let k=t%H2T;for(const s of H2SEG){if(k<s[0]){const u=k/s[0];if(s[1]==='mv')return lerp(s[2],s[3],ease(u));if(s[1]==='vib')return 74+8*Math.sin(u*Math.PI*6)*(1-u*.5);return s[2];}k-=s[0];}return 250;}
function h2Msg(r){return r>170?'Far apart. The 1s orbitals do not overlap yet, so there is no bond.':r>95?'The orbitals start to overlap. Both nuclei pull on the electrons between them, so the energy drops.':r>=56?'Bond length, 74 pm. The energy is at its lowest, 436 kJ mol⁻¹ below the separate atoms. This is the H–H bond.':'Too close. The two positive nuclei repel each other and the energy shoots up.';}
const fmtE=e=>(e<0?'−':'')+Math.abs(Math.round(e));
const h2st=anim2d($('cvH2'),W=>W>=620?.42:1.15,(c,w,h,t,dt)=>{
  if(dt>0&&H2.auto){H2.t+=dt;H2.r=autoR(H2.t);$('h2R').value=Math.round(H2.r);}
  if(dt>0){H2.trail.push(H2.r);if(H2.trail.length>26)H2.trail.shift();}
  const wide=w>=620,A=wide?{x:0,y:0,w:w*.47,h:h}:{x:0,y:0,w:w,h:h*.44},P=wide?{x:w*.5,y:0,w:w*.5,h:h}:{x:0,y:h*.46,w:w,h:h*.54};
  const cx=A.x+A.w/2,cy=A.y+A.h*.46,k=Math.min(A.w*.9/(250+120),A.h*.4/60),Rc=60*k,sep=H2.r*k,xa=cx-sep/2,xb=cx+sep/2;
  [xa,xb].forEach(x=>{const g=c.createRadialGradient(x,cy,0,x,cy,Rc);g.addColorStop(0,rgba(TOK.s,.62));g.addColorStop(.7,rgba(TOK.s,.25));g.addColorStop(1,rgba(TOK.s,0));c.fillStyle=g;circ(c,x,cy,Rc);c.fill();});
  const Rl=Rc*.8,ov=clamp((2*Rl-sep)/(2*Rl),0,1);
  if(ov>0){c.save();circ(c,xa,cy,Rl);c.clip();c.fillStyle=rgba(TOK.sigma,.2+.5*ov);circ(c,xb,cy,Rl);c.fill();c.restore();}
  if(H2.r<56){c.save();c.globalAlpha=seg(56-H2.r,0,14);c.strokeStyle=TOK.bad;c.fillStyle=TOK.bad;c.lineWidth=2.4;arrow(c,xa-14,cy,xa-40,cy);arrow(c,xb+14,cy,xb+40,cy);ctext(c,'repulsion',cx,cy-Rc*.95,{color:TOK.bad,font:MONO(11,600)});c.restore();}
  const b=ease(clamp((150-H2.r)/70,0,1));
  for(let i=0;i<2;i++){const a=t*3.2+i*Math.PI,dir=i?-1:1,own={x:(i?xb:xa)+Math.cos(a*dir)*Rc*.42,y:cy+Math.sin(a*dir)*Rc*.42},rx=sep/2+Rc*.3,ry=Rc*.3,shd={x:cx+Math.cos(a)*rx,y:cy+Math.sin(a)*ry};c.fillStyle=TOK.ink;circ(c,lerp(own.x,shd.x,b),lerp(own.y,shd.y,b),3.6);c.fill();}
  [xa,xb].forEach(x=>{c.fillStyle=TOK.card;c.strokeStyle=TOK.ink;c.lineWidth=1.6;circ(c,x,cy,9);c.fill();c.stroke();ctext(c,'H',x,cy+.5,{color:TOK.ink,font:DISP(10)});});
  const by=Math.min(cy+Rc*.95,A.y+A.h-26);c.strokeStyle=TOK.muted;c.lineWidth=1.2;c.beginPath();c.moveTo(xa,by-5);c.lineTo(xa,by+5);c.moveTo(xa,by);c.lineTo(xb,by);c.moveTo(xb,by-5);c.lineTo(xb,by+5);c.stroke();
  ctext(c,`r = ${Math.round(H2.r)} pm`,cx,by+15,{color:TOK.ink,font:MONO(12,600)});
  const m={l:50,r:12,t:16,b:34},X0=P.x+m.l,X1=P.x+P.w-m.r,Y0=P.y+m.t,Y1=P.y+P.h-m.b,rx=r=>X0+(r-25)/(260-25)*(X1-X0),ey=e=>Y0+(400-e)/880*(Y1-Y0);
  c.lineWidth=1;[-400,-200,0,200,400].forEach(e=>{c.strokeStyle=e===0?rgba(TOK.muted,.6):TOK.line;c.beginPath();c.moveTo(X0,ey(e));c.lineTo(X1,ey(e));c.stroke();ctext(c,fmtE(e),X0-6,ey(e),{align:'right',font:MONO(10)});});
  [100,150,200,250].forEach(r=>ctext(c,r,rx(r),Y1+11,{font:MONO(10)}));ctext(c,'74',rx(74),Y1+11,{color:TOK.sigma,font:MONO(10,700)});
  ctext(c,'distance between nuclei / pm',(X0+X1)/2,Y1+26,{font:MONO(10.5)});
  c.save();c.translate(P.x+11,(Y0+Y1)/2);c.rotate(-Math.PI/2);ctext(c,'energy / kJ mol⁻¹',0,0,{font:MONO(10.5)});c.restore();
  c.save();c.setLineDash([4,4]);c.strokeStyle=rgba(TOK.sigma,.8);c.lineWidth=1.3;c.beginPath();c.moveTo(rx(74),ey(-436));c.lineTo(rx(74),Y1);c.moveTo(X0,ey(-436));c.lineTo(rx(74),ey(-436));c.stroke();c.restore();
  ctext(c,'bond energy 436 kJ mol⁻¹',rx(74)+18,ey(-436)+12,{align:'left',color:TOK.sigma,font:MONO(10.5,600)});
  c.save();c.beginPath();c.rect(X0,Y0-8,X1-X0,Y1-Y0+8);c.clip();
  c.strokeStyle=TOK.accent;c.lineWidth=2.6;c.beginPath();for(let r=25;r<=260;r++){const x=rx(r),y=ey(MORSE(r));r===25?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  H2.trail.forEach((r,i)=>{c.fillStyle=rgba(TOK.sigma,(i+1)/H2.trail.length*.35);circ(c,rx(r),ey(MORSE(r)),3);c.fill();});
  const dx=rx(H2.r),dy=ey(MORSE(H2.r));c.fillStyle=rgba(TOK.sigma,.25);circ(c,dx,dy,11+Math.sin(t*5)*1.5);c.fill();c.fillStyle=TOK.sigma;circ(c,dx,dy,6);c.fill();c.restore();
  $('h2Read').textContent=`r = ${Math.round(H2.r)} pm · E = ${fmtE(MORSE(H2.r))} kJ mol⁻¹`;
  const msg=h2Msg(H2.r);if(msg!==H2.msg){H2.msg=msg;$('h2Cap').textContent=msg;}
},3);
$('h2Play').textContent=H2.auto?'Pause':'Play';
if(REDUCED){$('h2R').value=74;$('h2Play').hidden=true;}
$('h2Play').addEventListener('click',()=>{H2.auto=!H2.auto;if(H2.auto)H2.t=0;$('h2Play').textContent=H2.auto?'Pause':'Play';});
$('h2R').addEventListener('input',e=>{H2.auto=false;H2.r=+e.target.value;$('h2Play').textContent='Play';h2st.paint();});
(function bondChart(){
  const D=[['C–C',154,348],['C=C',134,612],['C≡C',120,838]];let s='';
  s+=txt(70,16,'bond length / pm',11,'start','var(--muted)')+txt(316,16,'bond energy / kJ mol⁻¹',11,'start','var(--muted)');
  D.forEach(([n,l,e],i)=>{const y=40+i*44;s+=`<text x="56" y="${y+15}" text-anchor="end" font-size="15" font-weight="800" font-family="var(--display)" fill="var(--ink)">${n}</text>`;
    s+=`<rect class="grow" style="animation-delay:${i*.15}s" x="70" y="${y}" width="${l*.95}" height="22" rx="4" fill="var(--accent)" fill-opacity=".75"/>`+txt(70+l*.95+6,y+15,l,12,'start','var(--ink)','600');
    s+=`<rect class="grow" style="animation-delay:${.45+i*.15}s" x="316" y="${y}" width="${e*.19}" height="22" rx="4" fill="var(--sigma)" fill-opacity=".75"/>`+txt(316+e*.19+6,y+15,e,12,'start','var(--ink)','600');});
  $('bondChart').innerHTML=s;onceInView($('bondBox'),()=>$('bondBox').classList.add('go'));
})();

/* ================= PART 5 ================= */
(function ideas(){
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
(function puzzle(){
  let l=`<g class="pop" style="animation-delay:.1s">${pOrb(0,0,0,58,.85)}</g><g class="pop" style="animation-delay:.3s">${pOrb(0,0,-90,58,.85)}</g>`;
  l+=`<g class="pop" style="animation-delay:.6s">${sOrb(84,0,20,.8)}${atom(84,0,'H',11)}</g><g class="pop" style="animation-delay:.75s">${sOrb(0,-84,20,.8)}${atom(0,-84,'H',11)}</g>`;
  l+=atom(0,0,'C',14,true)+`<path d="M30 0 A30 30 0 0 0 0 -30" fill="none" stroke="var(--sigma)" stroke-width="2"/><text x="32" y="-28" font-size="12" font-weight="700" font-family="var(--mono)" fill="var(--sigma)">90°</text>`;
  l+=`<g class="stamp" style="animation-delay:1.2s"><rect x="-98" y="76" width="196" height="28" rx="14" fill="var(--card)" stroke="var(--bad)" stroke-width="2"/><text x="0" y="95" text-anchor="middle" font-size="13" font-weight="800" font-family="var(--display)" fill="var(--bad)">✗ Only 2 bonds, at 90°</text></g>`;
  $('pzL').innerHTML=l;
  let r=`<g class="pop" style="animation-delay:.2s">${shapeSVG({n:4,lp:0,ligs:['H','H','H','H'],center:'C',angle:'109.5°',pExtra:'none'})}</g>`;
  r+=`<g class="stamp" style="animation-delay:1.5s"><rect x="-108" y="76" width="216" height="28" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="0" y="95" text-anchor="middle" font-size="13" font-weight="800" font-family="var(--display)" fill="var(--ok)">✓ 4 identical bonds, 109.5°</text></g>`;
  $('pzR').innerHTML=r;onceInView($('puzzleFig'),()=>$('puzzleFig').classList.add('go'),.4);
})();
anim2d($('cvPromo'),W=>W<420?.8:.62,(c,w,h,t)=>{
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
const mixSt=anim2d($('cvMix'),W=>W<520?.78:.42,(c,w,h,t)=>{
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
$('mixBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;MIX.n=+b.dataset.n;MIX.start=mixSt.t;mixRender();mixSt.paint();});mixRender();
(function balloons(){
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
(function initLab(){
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
function piReadout(){const th=Math.round(PIS.theta),c=Math.cos(PIS.theta*Math.PI/180);$('twistDeg').textContent=`θ = ${th}°`;$('twistOv').textContent=`π overlap ∝ cos θ = ${c.toFixed(2)}`;const m=$('twistMsg');m.textContent=th>=88?'π bond broken':th>=45?'π bond weakening':'';m.className=th>=88?'broken':'';}
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
(function initPi(){
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
(function predictor(){
  const row=$('mols'),pv=HAS3D?new Viewer($('predViz'),{dist:8.4,pitch:.32,yaw:.2}):null;
  row.innerHTML=MOLS.map((m,i)=>`<button class="chip" type="button" data-i="${i}" aria-pressed="${i===0}">${m.f}</button>`).join('');
  function show(i){const m=MOLS[i],n=m.sig+m.lp,hy=n===2?'sp':n===3?'sp²':'sp³';
    row.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===i?'true':'false'));
    $('predOut').innerHTML=`<p class="kicker">${m.name} · central atom ${m.c}</p>
      <div class="count"><div><small>σ bonds</small><b data-n="${m.sig}">${m.sig}</b></div><div><small>lone pairs</small><b data-n="${m.lp}">${m.lp}</b></div><div><small>regions</small><b data-n="${n}">${n}</b></div></div>
      <div class="result"><div class="hy"><small>hybridization</small><b>${hy}</b></div><div><small>shape</small><b>${m.shape}</b></div><div><small>bond angle</small><b>${m.angle}</b></div></div>
      <p class="cap">${m.why}${m.pi?` π bonds on ${m.c}: <strong>${m.pi}</strong>, made from the leftover 2p orbital${n===2?'s':''}.`:''}</p>`;
    $('predOut').querySelectorAll('.count b').forEach(b=>countUp(b,+b.dataset.n));
    if(pv){const g=vsepr(m.sig,m.lp);pv.build(v=>buildMolecule(v,{center:m.c,bonds:g.bonds,lps:g.lps,ligs:m.lig,pDirs:n===3?[N3(0,1,0)]:n===2?[N3(0,1,0),N3(0,0,1)]:[],pFilled:m.pi>0,arcs:g.arcs.map(a=>[a[0],a[1],m.angle]),L:1.4}));}
    else fbSet($('predViz'),shapeSVG({n,lp:m.lp,ligs:m.lig,center:m.c,angle:m.angle,view:n===3?'top':'',pExtra:'none'}));
    $('predCap').textContent=`${m.f}: ${m.shape.toLowerCase()}. ${m.lp?'Purple lobes are lone pairs. ':''}${m.pi?'The cyan p orbitals make the π bonds. ':''}Pink spots are σ bonds.`;}
  row.addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)show(+b.dataset.i);});show(0);
})();

/* ---- 5.9 order game ---- */
(function order(){
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
$('myths').innerHTML=MYTHS.map(([m,f],i)=>`<button type="button" class="myth" aria-pressed="false"><span class="in"><span class="fr"><small>✗ Mistake</small><span>${m}</span><small style="color:var(--muted);text-transform:none;letter-spacing:0">Tap to see the truth</small></span><span class="bk"><small>✓ Truth</small><span>${f}</span></span></span></button>`).join('');
$('myths').addEventListener('click',e=>{const b=e.target.closest('.myth');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');});

/* ================= PART 6 ================= */
$('shapes5').innerHTML=[[2,'Linear','180°',['Cl','Cl'],'Be'],[3,'Trigonal planar','120°',['Cl','Cl','Cl'],'B'],[4,'Tetrahedral','109.5°',['H','H','H','H'],'C'],[5,'Trigonal bipyramidal','120° and 90°',['F','F','F','F','F'],'P'],[6,'Octahedral','90°',['F','F','F','F','F','F'],'S']].map(([n,nm,ang,ligs,c])=>`<figure><svg viewBox="-110 -105 220 210" aria-hidden="true">${shapeSVG({n,ligs,center:c,lp:0,pExtra:'none'})}</svg><b>${nm}</b><span>${n} pairs · ${ang}</span></figure>`).join('');
(function pairCounter(){
  const pv=HAS3D?new Viewer($('pcViz'),{dist:8.6,pitch:.32,yaw:.35}):null;
  $('pcAtom').innerHTML=PC_ATOMS.map(([s,g])=>`<option value="${s}">${s} (group ${g===8?'0':g})</option>`).join('');
  $('pcPre').innerHTML=PC_PRESETS.map((p,i)=>`<button class="chip" type="button" data-i="${i}" aria-pressed="false">${p.f}</button>`).join('');
  let preset=2;
  function setPreset(i){const p=PC_PRESETS[i];preset=i;$('pcAtom').value=p.c;$('pcN').value=p.n;$('pcLig').value=p.l;$('pcQ').value=p.q;calc(true);}
  function calc(fromPreset){
    if(!fromPreset)preset=-1;
    $('pcPre').querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===preset?'true':'false'));
    const c=$('pcAtom').value,g=PC_ATOMS.find(a=>a[0]===c)[1],n=+$('pcN').value,lig=$('pcLig').value,q=+$('pcQ').value,tot=g+n-q,pairs=tot/2,lp=pairs-n;
    const name=preset>=0?PC_PRESETS[preset].f:c+lig+(n>1?sub(n):'')+chargeStr(q);
    const rows=[[`Electrons on the central atom (${c} is in group ${g===8?'0, counts as 8':g})`,g],['Add 1 for each atom bonded to it','+'+n],[q===0?'Charge: none':q<0?`Charge is ${Math.abs(q)}−: add ${Math.abs(q)}`:`Charge is ${q}+: take away ${q}`,q===0?'0':(q<0?'+':'−')+Math.abs(q)],['Total electrons',tot,'hl'],['Total pairs (divide by 2)',Number.isInteger(pairs)?pairs:'?'],['Bonding pairs (= atoms bonded)',n,'k'],['Lone pairs (total − bonding)',Number.isInteger(lp)?lp:'?','k']];
    $('pcTable').innerHTML=rows.map(r=>`<tr class="${r[2]||''}"><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
    $('pcTable').classList.remove('flash');void $('pcTable').offsetWidth;$('pcTable').classList.add('flash');
    const out=$('pcOut');let msg='',ok=false;
    if(!Number.isInteger(pairs))msg=`<b>Odd number of electrons</b><span class="cap">This method needs an even total. Check the charge.</span>`;
    else if(lp<0)msg=`<b>Not possible</b><span class="cap">There are more bonds than electron pairs. ${c} cannot bond to ${n} atoms like this.</span>`;
    else if(pairs>6)msg=`<b>More than 6 pairs</b><span class="cap">That is beyond this course.</span>`;
    else{const S=SHAPES[`${n}-${lp}`];if(!S)msg=`<b>Not covered here</b>`;else{ok=true;const hy=pairs===2?'sp':pairs===3?'sp²':pairs===4?'sp³':'uses d orbitals too (not needed for AS)';
      msg=`<span class="kicker">${name} · ${n} bonding, ${lp} lone</span><b>${S.name}</b><span>Bond angle: ${S.angle}</span><span class="cap">${S.note?S.note+' ':''}${pairs} pairs in total, so hybridization: ${hy}.${pairs>4&&['C','N','O','B','Be'].includes(c)?' But a period 2 atom cannot really expand its octet.':''}</span>`;}}
    out.innerHTML=msg;
    if(pv&&ok){const G=vsepr(n,lp);pv.build(v=>buildMolecule(v,{center:c,bonds:G.bonds,lps:G.lps,ligs:Array(n).fill(lig),arcs:G.arcs,L:1.35}));}
    else if(!pv&&ok&&pairs<=4&&n>1)fbSet($('pcViz'),shapeSVG({n:pairs,lp,ligs:Array(n).fill(lig),center:c,angle:SHAPES[`${n}-${lp}`].angle,view:pairs===3?'top':'',pExtra:'none'}));
  }
  $('pcPre').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)setPreset(+b.dataset.i);});
  ['pcAtom','pcN','pcLig','pcQ'].forEach(id=>$(id).addEventListener('change',()=>calc(false)));
  setPreset(10);
})();
$('squeeze').innerHTML=[[0,'CH₄','109.5°',['H','H','H','H'],'C'],[1,'NH₃','107°',['H','H','H'],'N'],[2,'H₂O','104.5°',['H','H'],'O']].map(([lp,f,a,ligs,c])=>`<figure><figcaption>${f} · ${lp} lone pair${lp===1?'':'s'}</figcaption><svg viewBox="-110 -105 220 210" role="img" aria-label="${f}, ${a}">${shapeSVG({n:4,lp,ligs,center:c,angle:a,pExtra:'none'})}</svg></figure>`).join('');
$('shapeTable').querySelector('tbody').innerHTML=SUMMARY.map(r=>`<tr><td class="ico"><svg viewBox="-110 -105 220 210" aria-hidden="true">${shapeSVG(Object.assign({lp:0,pExtra:'none'},r.ico))}</svg></td><td class="hx">${r.n}</td><td class="num">${r.bp}</td><td class="num">${r.lp}</td><td class="num">${r.ang}</td><td>${r.ex}</td></tr>`).join('');

/* ================= PART 7 ================= */
const ENV={};EN.flat().filter(Boolean).forEach(([s,v])=>ENV[s]=v);
const TUG={a:'H',b:'Cl',pos:0,pick:0};
function enRender(){const box=$('enGrid');box.innerHTML=EN.map(row=>row.map(c=>{if(!c)return '<span class="ecell empty" aria-hidden="true"></span>';const [s,v]=c,P=Math.round(8+(v-.7)/3.3*82);return `<button type="button" class="ecell${P>55?' hot':''}${s===TUG.a||s===TUG.b?' sel':''}" data-s="${s}" style="background:color-mix(in srgb,var(--sigma) ${P}%,var(--card))" aria-label="${s}, ${v.toFixed(1)}"><b>${s}</b><span>${v.toFixed(1)}</span></button>`;}).join('')).join('');}
function tugSet(a,b){TUG.a=a;TUG.b=b;enRender();const d=ENV[b]-ENV[a],ad=Math.abs(d),hi=d>0?b:a,lo=d>0?a:b;
  let v=ad<.05?`Equal pull: the electrons are shared evenly. <b>Non-polar bond.</b>`:ad<2?`${hi} pulls harder, so the shared pair sits closer to ${hi}. ${hi} is δ−, ${lo} is δ+. <b>Polar covalent bond.</b>`:`The difference is huge. ${hi} pulls the electron right over: ${lo} becomes ${lo}⁺ and ${hi} becomes ${hi}⁻. <b>Ionic bonding.</b>`;
  $('tugMsg').innerHTML=`<b>${a}–${b}</b>: ${a} ${ENV[a].toFixed(1)}, ${b} ${ENV[b].toFixed(1)}, difference ${ad.toFixed(1)}. ${v}`;
  $('tugPre').querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x.dataset.a===a&&x.dataset.b===b?'true':'false'));if(tugSt)tugSt.paint();}
$('tugPre').innerHTML=TUGS.map(([a,b])=>`<button class="chip" type="button" data-a="${a}" data-b="${b}" aria-pressed="false">${a}–${b}</button>`).join('');
$('tugPre').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)tugSet(b.dataset.a,b.dataset.b);});
$('enGrid').addEventListener('click',e=>{const c=e.target.closest('.ecell');if(!c||!c.dataset.s)return;const s=c.dataset.s;if(TUG.pick===0)tugSet(s,TUG.b);else tugSet(TUG.a,s);TUG.pick=1-TUG.pick;});
let tugSt=null;
tugSt=anim2d($('cvTug'),W=>W<520?.55:.34,(c,w,h,t,dt)=>{
  const d=ENV[TUG.b]-ENV[TUG.a],tgt=clamp(d/2.4,-1,1);if(dt>0)TUG.pos+=(tgt-TUG.pos)*Math.min(1,dt*3);else if(REDUCED||t===0)TUG.pos=tgt;
  const ax=w*.18,bx=w*.82,cy=h*.5,R=Math.min(h*.2,36),wig=Math.sin(t*7)*.025*(1-Math.abs(tgt)),pos=TUG.pos+wig,cx=w/2+pos*(bx-ax)*.36,ionic=Math.abs(d)>=2;
  c.strokeStyle=TOK.line;c.lineWidth=5;c.beginPath();c.moveTo(ax,cy);c.lineTo(bx,cy);c.stroke();
  const g=c.createRadialGradient(cx,cy,0,cx,cy,(bx-ax)*.24);g.addColorStop(0,rgba(TOK.sigma,.5));g.addColorStop(1,rgba(TOK.sigma,0));c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,(bx-ax)*.24,R*.95,0,0,Math.PI*2);c.fill();
  c.fillStyle=TOK.ink;circ(c,cx,cy-6,3.8);c.fill();circ(c,cx,cy+6,3.8);c.fill();
  [[ax,TUG.a,-1],[bx,TUG.b,1]].forEach(([x,s,side])=>{const en=ENV[s];c.strokeStyle=TOK.accent;c.fillStyle=TOK.accent;c.lineWidth=3;const L=en*14+Math.sin(t*7+side)*2;arrow(c,x+side*(R+6),cy,x+side*(R+6+L),cy,9);
    c.fillStyle=TOK.card;circ(c,x,cy,R);c.fill();c.strokeStyle=TOK.ink;c.lineWidth=2;c.stroke();ctext(c,s,x,cy+1,{color:TOK.ink,font:DISP(Math.round(R*.62))});ctext(c,en.toFixed(1),x,cy+R+16,{color:TOK.muted,font:MONO(12,600)});});
  if(Math.abs(d)>=.05){const hiA=d>0?bx:ax,loA=d>0?ax:bx;ctext(c,ionic?'−':'δ−',hiA,cy-R-14,{color:TOK.sigma,font:DISP(16)});ctext(c,ionic?'+':'δ+',loA,cy-R-14,{color:TOK.accent,font:DISP(16)});}
  ctext(c,'shared pair',cx,cy-R*1.25,{color:TOK.muted,font:MONO(10)});
},0);
tugSet('H','Cl');
const DIPS={
  'CO₂':{at:[['O',-95,0,'δ−',-95,-28],['C',0,0,'δ+',0,-30],['O',95,0,'δ−',95,-28]],bd:[[1,0,2],[1,2,2]],dp:[[1,0],[1,2]],net:null,lp:[],msg:'Straight line, two identical C=O bonds. The two pulls are equal and opposite, so they cancel. <b>Non-polar.</b>'},
  'H₂O':{at:[['O',0,-22,'δ−',34,-38],['H',-75,36,'δ+',-75,66],['H',75,36,'δ+',75,66]],bd:[[0,1,1],[0,2,1]],dp:[[1,0],[2,0]],net:[122,62,122,-62],lp:[[-21,-44],[-13,-49],[13,-49],[21,-44]],msg:'Bent, with two lone pairs. Both O–H pulls lean up toward O, so they add together. <b>Polar.</b>'},
  'BF₃':{at:[['B',0,0,'δ+',28,-20],['F',0,-90,'δ−',30,-94],['F',78,45,'δ−',78,76],['F',-78,45,'δ−',-78,76]],bd:[[0,1,1],[0,2,1],[0,3,1]],dp:[[0,1],[0,2],[0,3]],net:null,lp:[],msg:'Flat triangle, three identical B–F bonds. Three equal pulls at 120° cancel. <b>Non-polar.</b>'},
  'NH₃':{at:[['N',0,-22,'δ−',34,-38],['H',-78,30,'δ+',-78,60],['H',78,30,'δ+',78,60],['H',0,62,'δ+',0,92]],bd:[[0,1,1],[0,2,1],[0,3,1]],dp:[[1,0],[2,0],[3,0]],net:[122,62,122,-62],lp:[[-5,-48],[5,-48]],msg:'Pyramid with a lone pair on top. The N–H pulls all lean toward N, so they do not cancel. <b>Polar.</b>'},
  'CCl₄':{at:[['C',0,0,'δ+',26,-22],['Cl',0,-90,'δ−',32,-94],['Cl',85,32,'δ−',85,62],['Cl',-58,62,'δ−',-58,92],['Cl',-72,-30,'δ−',-72,-58]],bd:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],dp:[[0,1],[0,2],[0,3],[0,4]],net:null,lp:[],msg:'Tetrahedral, four identical C–Cl bonds pointing to the corners. The pulls cancel. <b>Non-polar.</b>'},
  'CH₃Cl':{at:[['C',0,12,'δ+',28,-6],['Cl',0,-82,'δ−',32,-88],['H',82,40,''],['H',-52,72,''],['H',-66,0,'']],bd:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],dp:[[0,1]],net:[122,62,122,-62],lp:[],msg:'One C–Cl bond is much more polar than the C–H bonds. Nothing balances it. <b>Polar</b>, with Cl as the δ− end.'}
};
function dipRender(k){const D=DIPS[k],A=D.at;let s='';
  D.bd.forEach(([i,j,o])=>{const [,x1,y1]=A[i],[,x2,y2]=A[j];if(o===2){const dx=y2-y1,dy=x1-x2,L=Math.hypot(dx,dy),ox=dx/L*4,oy=dy/L*4;s+=`<line x1="${x1+ox}" y1="${y1+oy}" x2="${x2+ox}" y2="${y2+oy}" stroke="var(--ink)" stroke-width="2.5"/><line x1="${x1-ox}" y1="${y1-oy}" x2="${x2-ox}" y2="${y2-oy}" stroke="var(--ink)" stroke-width="2.5"/>`;}else s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ink)" stroke-width="2.5"/>`;});
  (D.lp||[]).forEach(([x,y])=>s+=dot(x,y));
  A.forEach(([el,x,y,dl,lx,ly])=>{s+=`<circle cx="${x}" cy="${y}" r="17" fill="var(--card)" stroke="var(--ink)" stroke-width="1.5"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="${el.length>1?12:14}" font-weight="800" font-family="var(--display)" fill="var(--ink)">${el}</text>`;if(dl)s+=`<text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="12" font-weight="700" font-family="var(--mono)" fill="${dl==='δ−'?'var(--sigma)':'var(--accent)'}">${dl}</text>`;});
  D.dp.forEach(([i,j],n)=>{const [,x1,y1]=A[i],[,x2,y2]=A[j],dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,px=-uy*15,py=ux*15,sx=x1+ux*L*.22+px,sy=y1+uy*L*.22+py,ex=x1+ux*L*.78+px,ey=y1+uy*L*.78+py,hx=ex-ux*9,hy=ey-uy*9;
    s+=`<path class="dline" pathLength="1" d="M${sx.toFixed(1)} ${sy.toFixed(1)}L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="var(--accent)" stroke-width="2.5" fill="none" style="animation-delay:${n*.15}s"/><path class="pop" style="animation-delay:${.5+n*.15}s" d="M${ex} ${ey}L${hx-uy*5} ${hy+ux*5}L${hx+uy*5} ${hy-ux*5}Z" fill="var(--accent)"/>`;});
  if(D.net){const [x1,y1,x2,y2]=D.net;s+=`<path class="dline dnet" pathLength="1" d="M${x1} ${y1}L${x2} ${y2+14}" stroke="var(--sigma)" stroke-width="6" stroke-linecap="round" fill="none"/><path class="pop" style="animation-delay:1.4s" d="M${x2} ${y2-6}L${x2-11} ${y2+14}L${x2+11} ${y2+14}Z" fill="var(--sigma)"/><text x="${x2}" y="${y1+22}" text-anchor="middle" font-size="10" font-family="var(--mono)" fill="var(--sigma)">overall</text>`;}
  else s+=`<g class="stamp" style="animation-delay:1.2s"><rect x="-82" y="88" width="164" height="24" rx="12" fill="var(--card)" stroke="var(--ok)" stroke-width="2"/><text x="0" y="104" text-anchor="middle" font-size="12" font-weight="800" font-family="var(--display)" fill="var(--ok)">pulls cancel: non-polar</text></g>`;
  const svg=$('dipSvg');svg.innerHTML=s;const fig=svg.parentElement;fig.classList.remove('go-d','go');void fig.offsetWidth;fig.classList.add('go-d','go');
  $('dipMsg').innerHTML=`<b>${k}</b>: ${D.msg}`;$('dipPre').querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k?'true':'false'));}
$('dipPre').innerHTML=Object.keys(DIPS).map(k=>`<button class="chip" type="button" data-k="${k}" aria-pressed="false">${k}</button>`).join('');
$('dipPre').addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)dipRender(b.dataset.k);});dipRender('H₂O');

/* ================= PART 8 ================= */
(function metal(){
  const S={m:'Mg',volt:false},st=metalAnim($('cvMetal'),S);
  const read=()=>{const M=METALS[S.m];$('metRead').innerHTML=`<span>${M.ion}</span><span>${M.q} electron${M.q>1?'s':''} per atom in the sea</span><span>melts ${M.mp}</span><span>boils ${M.bp}</span>`;};
  $('metPick').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;S.m=b.dataset.m;$('metPick').querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));read();st.paint();});
  $('metVolt').addEventListener('click',()=>{S.volt=!S.volt;$('metVolt').setAttribute('aria-pressed',S.volt?'true':'false');$('metVolt').textContent=S.volt?'Disconnect the battery':'Connect a battery';st.paint();});
  read();
})();
hitAnim($('hitMetal'),'metal');

/* ================= PART 9 ================= */
(function structures(){
  const keys=Object.keys(STR_INFO),v=HAS3D?new Viewer($('strViz'),{dist:7.4,pitch:.4,yaw:.4}):null;
  $('strTabs').innerHTML=keys.map(k=>`<button class="tab" type="button" data-k="${k}" aria-pressed="false">${STR_INFO[k].t}</button>`).join('');
  function show(k){const I=STR_INFO[k];$('strTabs').querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k?'true':'false'));
    $('strInfo').innerHTML=`<span class="tag">${I.k}</span><h4>${I.t}</h4><ul>${I.pts.map(p=>`<li>${p}</li>`).join('')}</ul>`;$('strInfo').classList.remove('fade');void $('strInfo').offsetWidth;$('strInfo').classList.add('fade');
    if(v)v.build(STRUCT_BUILD[k]);else fbSet($('strViz'),`<text x="0" y="0" text-anchor="middle" font-size="14" font-family="var(--body)" fill="var(--muted)">3D view not available on this device</text>`,'-140 -60 280 120');}
  $('strTabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(b)show(b.dataset.k);});show('diamond');
})();

/* ================= PART 10 + word bank ================= */
(function finalQuiz(){
  const box=$('quiz'),N=QUIZ.length;let score=0,done=0;
  function render(){score=0;done=0;$('scoreN').textContent=`0 / ${N}`;$('meter').style.width='0';box.innerHTML=QUIZ.map((q,i)=>`<div class="q" data-i="${i}"></div>`).join('');
    box.querySelectorAll('.q').forEach(el=>{const i=+el.dataset.i;mcq(el,QUIZ[i],{num:i+1,onAnswer:ok=>{done++;if(ok)score++;$('meter').style.width=(score/N*100)+'%';$('scoreN').textContent=`${score} / ${N}${done===N?(score>=18?' · excellent':score>=14?' · solid':' · go back to the parts you missed and retry'):''}`;if(done===N&&score>=14)confetti();}});});}
  $('resetQuiz').addEventListener('click',render);render();
})();
$('wordList').innerHTML=Object.entries(WORDS).filter(([k])=>k!=='term').sort((a,b)=>a[1][0].localeCompare(b[1][0])).map(([,w])=>`<div><b>${w[0]}</b><p>${w[1]}</p></div>`).join('');
