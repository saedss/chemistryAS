"use strict";
/* ============ Edexcel spec additions: density maps (3.1, 3.10), migration of ions (3.1), polarization (3.8, 3.9) ============ */

/* ---- electron density maps ---- */
const MAPS={
  nacl:{span:6.4,atoms:[{x:-1.3,A:10,a:.2,col:'s',lab:'Na⁺'},{x:1.15,A:16,a:.27,col:'p',lab:'Cl⁻'}],bond:0,gap:.35,
    note:'Separate rings. Almost no electrons between the ions.'},
  cl2:{span:6.4,atoms:[{x:-1,A:16,a:.27,col:'p',lab:'Cl'},{x:1,A:16,a:.27,col:'p',lab:'Cl'}],bond:2.4,gap:-1.7,
    note:'Outer rings go around both nuclei. High density between them: the shared pair.'}
};
function mapField(m,gw,gh){
  const L=new Float32Array(gw*gh),own=new Uint8Array(gw*gh),sc=m.span/gw;
  const rho=(x,y)=>{let s=0,best=0,bi=0;m.atoms.forEach((A,i)=>{const r=Math.hypot(x-A.x,y),v=A.A*Math.exp(-r/A.a);s+=v;if(v>best){best=v;bi=i;}});if(m.bond)s+=m.bond*Math.exp(-(x*x)/.5-(y*y)/.12);return [s,bi];};
  let mn=1e9;for(let x=m.atoms[0].x;x<=m.atoms[1].x;x+=.01)mn=Math.min(mn,rho(x,0)[0]);
  for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const [v,bi]=rho((i-gw/2)*sc,(j-gh/2)*sc);L[j*gw+i]=Math.log(v);own[j*gw+i]=bi;}
  return {L,own,lo:Math.log(mn)+m.gap,hi:Math.log(14),sc};
}
function hexRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];}
function mapPainter(cv,getMode){
  const off=document.createElement('canvas');let key='',F=null,img=null,last='';
  return anim2d(cv,W=>W<520?.62:.5,(c,w,h,t)=>{
    const m=MAPS[getMode()],gw=Math.min(560,Math.round(w)),gh=Math.round(gw*h/w),k=getMode()+gw+'x'+gh;
    if(k!==key){key=k;off.width=gw;off.height=gh;F=mapField(m,gw,gh);img=off.getContext('2d').createImageData(gw,gh);}
    const step=.55,nLev=Math.ceil((F.hi-F.lo)/step),shown=nLev*ease(seg(t,.2,2.6)),ink=hexRgb(TOK.ink),cols=m.atoms.map(A=>hexRgb(TOK[A.col])),d=img.data;
    const sig=key+'|'+shown.toFixed(2)+'|'+TOK.ink+TOK.p+TOK.s;
    if(sig!==last){last=sig;
    const LV=i=>Math.floor((Math.min(F.L[i],F.hi)-F.lo)/step);
    for(let p=0;p<F.L.length;p++){const v=(Math.min(F.L[p],F.hi)-F.lo)/step,lev=Math.floor(v),o=p*4;
      if(v<0||lev<nLev-shown){d[o+3]=0;continue;}
      const x=p%gw,edge=(x<gw-1&&LV(p+1)!==lev)||(p+gw<F.L.length&&LV(p+gw)!==lev),col=cols[F.own[p]];
      if(edge){d[o]=ink[0];d[o+1]=ink[1];d[o+2]=ink[2];d[o+3]=210;}
      else{d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=Math.round(30+150*clamp(v/nLev,0,1));}}
    off.getContext('2d').putImageData(img,0,0);}c.imageSmoothingEnabled=true;c.drawImage(off,0,0,w,h);
    const px=x=>w/2+x/F.sc*w/gw;
    m.atoms.forEach(A=>{c.fillStyle=TOK.ink;circ(c,px(A.x),h/2,3.5);c.fill();ctext(c,A.lab,px(A.x),h/2-22,{font:DISP(15),color:TOK.ink});});
    c.save();c.globalAlpha=seg(t,2.4,3);const mx=px((m.atoms[0].x+m.atoms[1].x)/2+(getMode()==='nacl'?-.2:0));
    c.strokeStyle=TOK.sigma;c.fillStyle=TOK.sigma;c.lineWidth=2;arrow(c,mx,h*.86,mx,h/2+8,8);
    ctext(c,m.note,w/2,h-12,{font:SANS,color:TOK.ink});c.restore();
  },4);
}
let MAPMODE='cl2';
const covMap=$('cvMapCov')&&mapPainter($('cvMapCov'),()=>MAPMODE);
$('cvMapNaCl')&&mapPainter($('cvMapNaCl'),()=>'nacl');
$('mapBtns')&&$('mapBtns').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;MAPMODE=b.dataset.m;
  $('mapBtns').querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
  $('cvMapCov').setAttribute('aria-label',MAPMODE==='cl2'?'Electron density map of chlorine, with contours that surround both nuclei':'Electron density map of sodium chloride, with separate rings around each ion');
  covMap.t=0;covMap.paint();covMap.start();});

/* ---- migration of ions ---- */
$('cvMig')&&anim2d($('cvMig'),W=>W<520?.62:.5,(c,w,h,t)=>{
  const T=9,k=t%T,run=ease(seg(k,1,7)),fade=1-seg(k,8.3,9);c.globalAlpha=1;
  const x0=w*.1,x1=w*.9,cy=h*.56,ph=h*.3,cx=(x0+x1)/2;
  c.fillStyle=rgba(TOK.line,.55);rrect(c,x0,cy-ph/2,x1-x0,ph,8);c.fill();c.strokeStyle=TOK.line;c.lineWidth=1.5;c.stroke();
  [[x0,'−','negative'],[x1,'+','positive']].forEach(([x,sg,nm],i)=>{c.fillStyle=TOK.ink;rrect(c,x-7,cy-ph/2-10,14,ph+20,4);c.fill();
    c.strokeStyle=TOK.muted;c.lineWidth=2;c.beginPath();c.moveTo(x,cy-ph/2-10);c.lineTo(x,h*.13);c.lineTo(i?cx+18:cx-18,h*.13);c.stroke();
    ctext(c,sg,x+(i?-22:22),cy-ph/2-18,{font:DISP(20),color:TOK.ink});ctext(c,nm,x,cy+ph/2+24,{font:MONO(11,600),color:TOK.muted});});
  c.strokeStyle=TOK.ink;c.lineWidth=3;c.beginPath();c.moveTo(cx-18,h*.13-12);c.lineTo(cx-18,h*.13+12);c.stroke();c.lineWidth=6;c.beginPath();c.moveTo(cx+18,h*.13-7);c.lineTo(cx+18,h*.13+7);c.stroke();
  ctext(c,'DC supply',cx,h*.13-20,{font:MONO(11,600),color:TOK.muted});
  const blob=(x,col,a,sx)=>{c.save();c.translate(x,cy);c.scale(sx,1);const g=c.createRadialGradient(0,0,0,0,0,ph*.42);g.addColorStop(0,rgba(col,.85*a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;circ(c,0,0,ph*.42);c.fill();c.restore();};
  const travel=(cx-x0)*.62*run;c.globalAlpha=fade;
  if(run<.08)blob(cx,'#3f9f55',1,1);
  blob(cx-travel,'#2f7fe0',seg(run,0,.08),1+run*.8);blob(cx+travel,'#e8b912',seg(run,0,.08),1+run*.8);
  c.globalAlpha=fade*seg(k,4,5);ctext(c,'Cu²⁺ (blue)',cx-travel,cy-ph*.62,{font:MONO(12,600),color:TOK.ink});ctext(c,'CrO₄²⁻ (yellow)',cx+travel,cy-ph*.62,{font:MONO(12,600),color:TOK.ink});
  c.globalAlpha=fade;ctext(c,k<1?'Green copper(II) chromate(VI) spot':k<4?'The current is on. The colors start to split…':'Each ion moves toward the opposite charge',w/2,h-10,{font:SANS,color:TOK.ink});c.globalAlpha=1;
},7.5);

/* ---- polarization ---- */
(function(){
  if(!$('cvPol'))return;
  const CAT=[['Na⁺',102,1],['Mg²⁺',72,2],['Al³⁺',53,3]],AN=[['F⁻',133],['Cl⁻',181],['I⁻',220]],P={c:2,a:1,d:0};
  const target=()=>clamp(CAT[P.c][2]/CAT[P.c][1]*100*AN[P.a][1]/100/12.5,0,1);
  const chips=(id,arr,key)=>{const r=$(id);r.innerHTML=arr.map((x,i)=>`<button class="chip" type="button" data-i="${i}" aria-pressed="${i===P[key]}">${x[0]}</button>`).join('');
    r.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;P[key]=+b.dataset.i;r.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));msg();st.paint();st.start();});};
  function msg(){const D=target(),c=CAT[P.c],a=AN[P.a];$('polMsg').innerHTML=`<b>${c[0]} with ${a[0]}:</b> ${D<.25?'almost purely ionic. The cation is weak at distorting, or the anion is hard to distort.':D<.6?'some covalent character. The anion\'s cloud is pulled noticeably toward the cation.':'a lot of covalent character. A small, highly charged cation meets a large anion, so the cloud is pulled far toward it.'}`;}
  chips('polC',CAT,'c');chips('polA',AN,'a');msg();
  const st=anim2d($('cvPol'),W=>W<520?.6:.42,(c,w,h,t,dt)=>{
    const D=target();P.d=dt>0?P.d+(D-P.d)*Math.min(1,dt*3):D;
    const s=Math.min(w*.7/(2*102+12+2*220*1.2),h*.72/(2*220)),rc=CAT[P.c][1]*s,ra=AN[P.a][1]*s,gap=12*s,x1=w/2-(2*rc+gap+2*ra)/2+rc,x2=x1+rc+gap+ra,cy=h*.43,d=P.d;
    c.beginPath();for(let i=0;i<=120;i++){const th=i/120*Math.PI*2,cs=Math.cos(th-Math.PI),r=ra*(1+.62*d*Math.pow(Math.max(0,cs),3)-.1*d*Math.max(0,-cs));const x=x2+Math.cos(th)*r,y=cy+Math.sin(th)*r*(1-.12*d*Math.max(0,cs));i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();
    const g=c.createRadialGradient(x2,cy,0,x2,cy,ra*1.5);g.addColorStop(0,rgba(TOK.p,.55));g.addColorStop(1,rgba(TOK.p,.18));c.fillStyle=g;c.fill();c.strokeStyle=TOK.p;c.lineWidth=2;c.stroke();
    if(d>.2){c.save();c.globalAlpha=seg(d,.2,.5);const mx=x1+rc+gap*.5;c.fillStyle=rgba(TOK.sigma,.4);c.beginPath();c.ellipse(mx,cy,rc*.35*d+4,Math.min(rc,ra)*.75,0,0,Math.PI*2);c.fill();
      ctext(c,'electron density pulled between the ions',w/2,cy+ra+16,{font:MONO(11,600),color:TOK.sigma});c.restore();}
    c.fillStyle=rgba(TOK.s,.9);circ(c,x1,cy,rc);c.fill();c.strokeStyle=TOK.ink;c.lineWidth=1.5;c.stroke();
    ctext(c,CAT[P.c][0],x1,cy,{font:DISP(Math.max(12,rc*.55)),color:'#1b1b1b'});ctext(c,AN[P.a][0],x2+ra*.15,cy,{font:DISP(20),color:TOK.ink});
    const bar=(y,lab,v,col)=>{const bx=w*.08,bw=w*.38;ctext(c,lab,bx,y-9,{font:MONO(11,600),color:TOK.muted,align:'left'});c.fillStyle=rgba(TOK.line,.7);rrect(c,bx,y,bw,8,4);c.fill();c.fillStyle=col;rrect(c,bx,y,Math.max(8,bw*v),8,4);c.fill();};
    bar(h-38,'polarizing power of '+CAT[P.c][0],CAT[P.c][2]/CAT[P.c][1]*100/5.7,TOK.s);
    const bx2=w*.54,bw2=w*.38;ctext(c,'how easily '+AN[P.a][0]+' distorts',bx2,h-47,{font:MONO(11,600),color:TOK.muted,align:'left'});c.fillStyle=rgba(TOK.line,.7);rrect(c,bx2,h-38,bw2,8,4);c.fill();c.fillStyle=TOK.p;rrect(c,bx2,h-38,bw2*AN[P.a][1]/230,8,4);c.fill();
    ctext(c,'covalent character: '+(d<.25?'very little':d<.6?'some':'a lot'),w/2,h-12,{font:SANS,color:TOK.ink});
  },3);
})();
