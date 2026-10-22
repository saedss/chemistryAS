"use strict";
/* ================= 3D kit: one shared WebGL renderer drawing into many 2D canvases ================= */
const PR=Math.min(window.devicePixelRatio||1,2);
let SR=null;
function sharedRenderer(){if(SR)return SR;SR=new THREE.WebGLRenderer({antialias:true,alpha:true});SR.setPixelRatio(PR);SR.setClearColor(0x000000,0);SR.userData={w:0,h:0};return SR;}
const HAS3D=(()=>{try{if(!window.THREE)return false;sharedRenderer();return !!SR.getContext();}catch(e){SR=null;return false;}})();
const VIEWERS=[];const GEO={};
let V3,N3,TET,TRI,LIN,PDIR,UPV;
if(HAS3D){
  V3=(x,y,z)=>new THREE.Vector3(x,y,z);N3=(x,y,z)=>new THREE.Vector3(x,y,z).normalize();UPV=new THREE.Vector3(0,1,0);
  TET=[N3(0,1,0),N3(.9428,-.3333,0),N3(-.4714,-.3333,.8165),N3(-.4714,-.3333,-.8165)];
  TRI=[N3(1,0,0),N3(-.5,0,.866),N3(-.5,0,-.866)];LIN=[N3(1,0,0),N3(-1,0,0)];
  PDIR={p1:N3(1,0,0),p2:N3(0,0,1),p3:N3(0,1,0)};
  const lathe=(fn,n,segs)=>{const pts=[];for(let i=0;i<=n;i++){const u=i/n,t=1-Math.pow(1-u,1.5);pts.push(new THREE.Vector2(Math.max(fn(t),1e-4),t));}const g=new THREE.LatheGeometry(pts,segs);g.userData.shared=true;return g;};
  const fh=t=>.74*Math.pow(t,.75)*Math.sqrt(Math.max(0,1-t)),fp=t=>.62*Math.pow(t,.6)*Math.sqrt(Math.max(0,1-t));
  GEO.hyb=lathe(fh,44,36);GEO.p=lathe(fp,44,36);GEO.pw=lathe(fp,12,12);
  GEO.sph=new THREE.SphereGeometry(1,32,24);GEO.sph.userData.shared=true;
  GEO.es=new THREE.SphereGeometry(1,12,10);GEO.es.userData.shared=true;
  GEO.cyl=new THREE.CylinderGeometry(1,1,1,10,1);GEO.cyl.userData.shared=true;
}
const ELC={C:'#4b586c',H:'#eef2f6',Cl:'#9fb6cc',B:'#e3a07a',Be:'#a6b89c',N:'#4f74d9',O:'#e0574d',F:'#c9d36a',Si:'#c7ad84',S:'#e2c341',P:'#e8913a',I:'#9b6bd0',Xe:'#5fb6c9',Al:'#b9c2cf',Br:'#b0603f'};
function phong(col,op,extra){return new THREE.MeshPhongMaterial(Object.assign({color:new THREE.Color(col),transparent:op<1,opacity:op,shininess:70,specular:new THREE.Color(0x3a3a3a),depthWrite:op>=1},extra||{}));}
function orient(o,d){o.quaternion.setFromUnitVectors(UPV,d.clone().normalize());return o;}
function basis(d){const a=Math.abs(d.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);const u=new THREE.Vector3().crossVectors(d,a).normalize();const v=new THREE.Vector3().crossVectors(d,u).normalize();return [u,v];}
function textSprite(txt,o){
  o=Object.assign({size:64,color:'#ffffff',stroke:null,bg:null,border:null,h:.4,weight:800,font:'Manrope, system-ui, sans-serif'},o||{});
  const c=document.createElement('canvas'),x=c.getContext('2d'),f=`${o.weight} ${o.size}px ${o.font}`;x.font=f;const tw=x.measureText(txt).width,pad=o.bg?o.size*.6:o.size*.3;
  c.width=Math.ceil(tw+pad*2);c.height=Math.ceil(o.size*1.5);x.font=f;x.textAlign='center';x.textBaseline='middle';
  if(o.bg){const r=c.height/2-4,w=c.width-8,hh=c.height-8;x.beginPath();x.moveTo(4+r,4);x.lineTo(4+w-r,4);x.arc(4+w-r,4+r,r,-Math.PI/2,Math.PI/2);x.lineTo(4+r,4+hh);x.arc(4+r,4+r,r,Math.PI/2,Math.PI*1.5);x.closePath();x.fillStyle=o.bg;x.fill();x.lineWidth=5;x.strokeStyle=o.border||o.color;x.stroke();}
  if(o.stroke){x.lineJoin='round';x.lineWidth=o.size*.2;x.strokeStyle=o.stroke;x.strokeText(txt,c.width/2,c.height/2+o.size*.05);}
  x.fillStyle=o.color;x.fillText(txt,c.width/2,c.height/2+o.size*.05);
  const tex=new THREE.CanvasTexture(c);tex.minFilter=THREE.LinearFilter;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false}));s.scale.set(o.h*c.width/c.height,o.h,1);s.renderOrder=12;return s;
}
const label=(t,o)=>textSprite(t,Object.assign({color:TOK.muted,weight:600,font:'"IBM Plex Mono", ui-monospace, monospace',size:46,h:.3},o||{}));
const pill=(t,border,h)=>textSprite(t,{size:50,color:TOK.ink,bg:TOK.card,border:border||TOK.sigma,h:h||.34});
function atomMesh(el,r){const g=new THREE.Group();const s=new THREE.Mesh(GEO.sph,new THREE.MeshPhongMaterial({color:new THREE.Color(ELC[el]||'#9aa3b0'),shininess:90,specular:new THREE.Color(0x666666)}));s.scale.setScalar(r);g.add(s);g.add(textSprite(el,{size:56,stroke:'rgba(10,16,28,.85)',h:Math.max(.26,r*1.3)}));return g;}
function electron(){const e=new THREE.Mesh(GEO.es,new THREE.MeshBasicMaterial({color:new THREE.Color(TOK.ink)}));e.scale.setScalar(.075);return e;}
function ball(col,r){const m=new THREE.Mesh(GEO.sph,new THREE.MeshPhongMaterial({color:new THREE.Color(col),shininess:80,specular:new THREE.Color(0x555555)}));m.scale.setScalar(r);return m;}
function stick(a,b,r,col,op){const d=b.clone().sub(a),L=d.length();const mat=op!=null&&op<1?phong(col,op):new THREE.MeshPhongMaterial({color:new THREE.Color(col),shininess:40});const m=new THREE.Mesh(GEO.cyl,mat);m.scale.set(r,L,r);m.position.copy(a).add(b).multiplyScalar(.5);orient(m,d);return m;}
function orbP(dir,L,col,fill){
  const g=new THREE.Group(),mf=phong(col,.7),mw=new THREE.MeshBasicMaterial({color:new THREE.Color(col),wireframe:true,transparent:true,opacity:.3,depthWrite:false});
  [1,-1].forEach(s=>{const d=dir.clone().multiplyScalar(s);const a=new THREE.Mesh(GEO.p,mf);a.scale.setScalar(L);orient(a,d);g.add(a);const w=new THREE.Mesh(GEO.pw,mw);w.scale.setScalar(L);orient(w,d);g.add(w);});
  let k=fill,al=1;const ap=()=>{mf.opacity=(.07+.63*k)*al;mw.opacity=.34*(1-k)*al;mw.visible=k<.99&&al>.01;};ap();
  return {g,fill(v){k=v;ap();},alpha(v){al=v;ap();},glow(v){mf.emissive.set(col);mf.emissive.multiplyScalar(v);}};
}
function orbS(R,col){const m=phong(col,.55),s=new THREE.Mesh(GEO.sph,m);s.scale.setScalar(R);const g=new THREE.Group();g.add(s);return {g,alpha(v){m.opacity=.55*v;},glow(v){m.emissive.set(col);m.emissive.multiplyScalar(v);}};}
function orbH(dir,L,col){const m=phong(col,.78),g=new THREE.Group();const a=new THREE.Mesh(GEO.hyb,m);a.scale.setScalar(L);orient(a,dir);g.add(a);const b=new THREE.Mesh(GEO.hyb,m);b.scale.setScalar(L*.3);orient(b,dir.clone().negate());g.add(b);return {g,alpha(v){m.opacity=.78*v;},glow(v){m.emissive.set(col);m.emissive.multiplyScalar(v);}};}
function ovMesh(d){const m=new THREE.Mesh(GEO.sph,phong(TOK.sigma,.6,{emissive:new THREE.Color(TOK.sigma),emissiveIntensity:.35}));m.scale.set(.2,.3,.2);orient(m,d);const g=new THREE.Group();g.add(m);g.userData.m=m;return g;}
function orbitFn(kind,dir,L,ph){
  const d=(dir||new THREE.Vector3(0,1,0)).clone().normalize(),[u,v]=basis(d);
  return t=>{const r=new THREE.Vector3();let a;
    if(kind==='s'){a=t*2.2+ph;return r.addScaledVector(u,Math.cos(a)*L*.55).addScaledVector(v,Math.sin(a)*L*.55).addScaledVector(d,Math.sin(a*.7+ph)*L*.35);}
    if(kind==='p'){const s=Math.sin(t*2.1+ph);a=t*3.3+ph;const w=(.08+.1*Math.abs(s))*L/.8;return r.addScaledVector(d,s*L*.62).addScaledVector(u,Math.cos(a)*w).addScaledVector(v,Math.sin(a)*w);}
    if(kind==='h'){a=t*3+ph;return r.addScaledVector(d,L*(.55+.15*Math.sin(t*2.1+ph))).addScaledVector(u,Math.cos(a)*.12*L).addScaledVector(v,Math.sin(a)*.12*L);}
    a=t*3.4+ph;return r.addScaledVector(d,L+.1*Math.sin(a*.7)).addScaledVector(u,Math.cos(a)*.12).addScaledVector(v,Math.sin(a)*.12);};
}
function addArc(v,A,B,txt,t0,at){
  const R=.62,a=A.clone().normalize(),b=B.clone().normalize(),th=a.angleTo(b);let w;
  if(th>3.1){w=new THREE.Vector3(0,1,0).sub(a.clone().multiplyScalar(a.y));if(w.length()<.1)w=new THREE.Vector3(0,0,1);w.normalize();}else w=b.clone().sub(a.clone().multiplyScalar(a.dot(b))).normalize();
  const pt=t=>a.clone().multiplyScalar(Math.cos(th*t)).add(w.clone().multiplyScalar(Math.sin(th*t))).multiplyScalar(R);
  class Arc extends THREE.Curve{getPoint(t,target){return (target||new THREE.Vector3()).copy(pt(t));}}
  const segs=48,rad=8,geo=new THREE.TubeGeometry(new Arc(),segs,.024,rad,false);
  const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:new THREE.Color(TOK.sigma),transparent:true,opacity:.95,depthTest:false}));mesh.renderOrder=9;v.add(mesh);
  const lab=pill(txt);lab.position.copy(pt(.5).normalize().multiplyScalar(R+.45));v.add(lab);
  if(at){mesh.position.copy(at);lab.position.add(at);}
  v.tick(t=>{const k=ease(seg(t,t0,t0+.8));geo.setDrawRange(0,Math.floor(k*segs)*rad*6);mesh.visible=k>0;lab.material.opacity=seg(t,t0+.4,t0+.9);lab.visible=k>0;});
}
class Viewer{
  constructor(host,o){
    o=Object.assign({dist:8.4,pitch:.32,yaw:-.4,fov:34,mode:'spin'},o||{});
    Object.assign(this,{host,mode:o.mode,basePitch:o.pitch,baseYaw:o.yaw,userYaw:0,userPitch:0,autoYaw:0,time:0,st:0,ticks:[],on:false,vis:false,last:0,builder:null,drag:false,w:0,h:0});
    const cv=this.cv=document.createElement('canvas');host.insertBefore(cv,host.firstChild);this.ctx=cv.getContext('2d');
    this.scene=new THREE.Scene();this.cam=new THREE.PerspectiveCamera(o.fov,1,.1,100);this.cam.position.set(0,0,o.dist);
    this.scene.add(new THREE.AmbientLight(0xffffff,.62));const l1=new THREE.DirectionalLight(0xffffff,.78);l1.position.set(3,5,6);this.scene.add(l1);const l2=new THREE.DirectionalLight(0xffffff,.3);l2.position.set(-5,-3,2);this.scene.add(l2);
    this.root=new THREE.Group();this.scene.add(this.root);this.content=new THREE.Group();this.root.add(this.content);
    this.loop=this.loop.bind(this);
    cv.addEventListener('pointerdown',e=>{this.drag=true;this.px=e.clientX;this.py=e.clientY;try{cv.setPointerCapture(e.pointerId);}catch(_){}cv.classList.add('grabbing');const h=host.querySelector('.hint');if(h)h.style.opacity=0;});
    cv.addEventListener('pointermove',e=>{if(!this.drag)return;this.userYaw+=(e.clientX-this.px)*.011;this.userPitch=clamp(this.userPitch+(e.clientY-this.py)*.011,-1.3,1.3);this.px=e.clientX;this.py=e.clientY;if(!this.on)this.frame(0);});
    const end=()=>{this.drag=false;cv.classList.remove('grabbing');};['pointerup','pointercancel','lostpointercapture'].forEach(n=>cv.addEventListener(n,end));
    new ResizeObserver(()=>this.fit()).observe(host);
    new IntersectionObserver(es=>{this.vis=es[0].isIntersecting;if(this.vis)this.start();else this.on=false;},{rootMargin:'60px'}).observe(host);
    this.fit();VIEWERS.push(this);
  }
  setDist(d){this.cam.position.z=d;}
  fit(){const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.w=w;this.h=h;const W=Math.floor(w*PR),H=Math.floor(h*PR);if(this.cv.width!==W||this.cv.height!==H){this.cv.width=W;this.cv.height=H;}this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.frame(0);}
  start(){if(this.on||REDUCED||!this.vis)return;this.on=true;this.last=0;requestAnimationFrame(this.loop);}
  loop(now){if(!this.on)return;const dt=this.last?Math.min((now-this.last)/1000,.05):0;this.last=now;this.frame(dt);requestAnimationFrame(this.loop);}
  frame(dt){this.st+=dt;this.time+=dt;if(this.mode==='spin'&&!this.drag)this.autoYaw+=dt*.38;const sw=this.mode==='sway'?.42*Math.sin(this.time*.6):0;this.root.rotation.set(this.basePitch+this.userPitch,this.baseYaw+this.userYaw+this.autoYaw+sw,0);for(const f of this.ticks)f(this.st,dt);this.draw();}
  draw(){if(!this.w||!SR)return;const r=SR,u=r.userData;if(u.w<this.w||u.h<this.h){u.w=Math.max(u.w,this.w);u.h=Math.max(u.h,this.h);r.setSize(u.w,u.h,false);}r.setScissorTest(true);r.setViewport(0,0,this.w,this.h);r.setScissor(0,0,this.w,this.h);r.render(this.scene,this.cam);const src=r.domElement,W=this.cv.width,H=this.cv.height;this.ctx.clearRect(0,0,W,H);this.ctx.drawImage(src,0,src.height-H,W,H,0,0,W,H);}
  add(o){this.content.add(o);return o;}
  tick(f){this.ticks.push(f);}
  clear(){const c=this.content;c.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}if(o.geometry&&!o.isSprite&&!o.geometry.userData.shared)o.geometry.dispose();});for(let i=c.children.length-1;i>=0;i--)c.remove(c.children[i]);this.ticks=[];this.st=0;}
  build(fn){this.builder=fn;this.clear();fn(this);if(REDUCED)this.st=99;this.frame(0);}
  rebuild(){if(!this.builder)return;const s=this.st;this.clear();this.builder(this);this.st=s;this.frame(0);}
}
if(HAS3D){onTheme(()=>VIEWERS.forEach(v=>v.rebuild()));if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>VIEWERS.forEach(v=>v.rebuild()));}

/* ---------- molecules (hero, lab step 3, predictor, pair counter) ---------- */
function buildMolecule(v,sp){
  v.mode='spin';const L=sp.L||1.4,D=L+.38,I=sp.intro!==false;
  v.add(atomMesh(sp.center,.27));
  const lobes=[],extraE=[],pOrbs=[];
  sp.bonds.forEach(d=>{const o=orbH(d,L,TOK.hyb);v.add(o.g);lobes.push(o);});
  (sp.lps||[]).forEach((d,i)=>{const o=orbH(d,L*.88,TOK.lp);v.add(o.g);lobes.push(o);[0,Math.PI].forEach(ph=>{const e=electron();v.add(e);extraE.push({e,f:orbitFn('h',d,L*.88,ph+i)});});});
  (sp.pDirs||[]).forEach((d,i)=>{const o=orbP(d,L*.78,TOK.p,sp.pFilled?1:0);v.add(o.g);pOrbs.push(o);if(sp.pFilled){const e=electron();v.add(e);extraE.push({e,f:orbitFn('p',d,L*.78,i*2)});}});
  const tL=I?.55+.09*lobes.length:0;
  v.tick(t=>{lobes.forEach((o,i)=>{const k=I?easeBack(seg(t,.05+i*.08,.6+i*.08)):1;o.g.scale.setScalar(Math.max(.001,k));});pOrbs.forEach(o=>{const k=I?easeBack(seg(t,.3,.9)):1;o.g.scale.setScalar(Math.max(.001,k));});extraE.forEach(x=>{x.e.position.copy(x.f(t));x.e.visible=!I||t>.7;});});
  sp.bonds.forEach((d,i)=>{
    const el=sp.ligs[i]||'H',isH=el==='H',lg=new THREE.Group();lg.add(atomMesh(el,isH?.17:.24));
    const lo=isH?orbS(.4,TOK.s):orbP(d,.62,TOK.p,1);lg.add(lo.g);v.add(lg);
    const ov=ovMesh(d);ov.position.copy(d).multiplyScalar(L-.08);v.add(ov);
    const eC=electron(),eL=electron();v.add(eC);v.add(eL);
    const fC=orbitFn('h',d,L,i*1.3),fL=isH?orbitFn('s',d,.4,i):orbitFn('p',d,.62,i),fb1=orbitFn('b',d,L-.08,0),fb2=orbitFn('b',d,L-.08,Math.PI);
    const t0=I?tL+i*.2:0,t1=t0+.8;
    v.tick(t=>{
      const k=easeOut(seg(t,t0,t1)),pos=d.clone().multiplyScalar(lerp(5.5,D,k));lg.position.copy(pos);lg.visible=!I||t>=t0;
      const b=ease(seg(t,t1-.05,t1+.45));ov.scale.setScalar(Math.max(.001,b*(1+.1*Math.sin(t*4+i))));ov.userData.m.material.opacity=.6*b;ov.visible=b>0;
      eC.position.copy(fC(t).lerp(fb1(t),b));eC.visible=!I||t>.6;eL.position.copy(fL(t).add(pos).lerp(fb2(t),b));eL.visible=lg.visible;
    });
  });
  const arcs=sp.arcs||(sp.angle?[[0,1,sp.angle]]:[]),ta=I?tL+sp.bonds.length*.2+1:0;
  if(sp.bonds.length>1)arcs.forEach(([i,j,lab],k)=>{if(lab&&sp.bonds[i]&&sp.bonds[j])addArc(v,sp.bonds[i],sp.bonds[j],lab,ta+k*.35);});
}
/* electron-pair geometry for any bonding/lone pair count (pair counter) */
function vsepr(bp,lp){
  const X=N3(1,0,0),Y=N3(0,1,0),Z=N3(0,0,1),nX=N3(-1,0,0),nY=N3(0,-1,0),nZ=N3(0,0,-1),EQ=[X,N3(-.5,0,.866),N3(-.5,0,-.866)];
  const t=bp+lp;let bonds=[],lps=[],arcs=[];
  if(bp===1){bonds=[X];lps=lp===1?[nX]:lp===2?[N3(-.5,.866,0),N3(-.5,-.866,0)]:lp===3?[90,210,330].map(f=>{const r=f*Math.PI/180;return N3(-.333,.943*Math.cos(r),.943*Math.sin(r));}):[];}
  else if(t===2){bonds=[X,nX];arcs=[[0,1,'180°']];}
  else if(t===3){if(lp===0){bonds=TRI;arcs=[[0,1,'120°']];}else{lps=[TRI[0]];bonds=[TRI[1],TRI[2]];arcs=[[0,1,'~118°']];}}
  else if(t===4){if(lp===0){bonds=TET;arcs=[[0,1,'109.5°']];}
    else if(lp===1){lps=[Y];bonds=[0,120,240].map(f=>{const r=f*Math.PI/180;return N3(.928*Math.cos(r),-.372,.928*Math.sin(r));});arcs=[[0,1,'107°']];}
    else{bonds=[N3(.791,-.612,0),N3(-.791,-.612,0)];lps=[N3(0,.55,.835),N3(0,.55,-.835)];arcs=[[0,1,'104.5°']];}}
  else if(t===5){lps=EQ.slice(0,lp);const rest=EQ.slice(lp).concat(lp<=3?[Y,nY]:[]);bonds=rest;
    arcs=lp===0?[[0,1,'120°'],[0,3,'90°']]:lp===1?[[0,1,'~119°'],[0,2,'~89°']]:lp===2?[[0,1,'~89°']]:[[0,1,'180°']];}
  else if(t===6){if(lp===0){bonds=[X,nX,Y,nY,Z,nZ];arcs=[[0,2,'90°']];}else if(lp===1){lps=[nY];bonds=[Y,X,nX,Z,nZ];arcs=[[1,3,'~89°']];}else{lps=[Y,nY];bonds=[X,Z,nX,nZ];arcs=[[0,1,'90°']];}}
  return {bonds,lps,arcs};
}

/* ---------- lab helpers ---------- */
function hybridIds(n){return n===4?['s2','p1','p2','p3']:n===3?['s2','p1','p2']:['s2','p1'];}
function electronsOf(a,st){const list=[{id:'e1',box:'s1',spin:'up'},{id:'e2',box:'s1',spin:'down'},{id:'e3',box:'s2',spin:'up'}];const np=a.Z-4;list.push(st>=1?{id:'e4',box:'p'+(np+1),spin:'up'}:{id:'e4',box:'s2',spin:'down'});for(let i=1;i<=np;i++)list.push({id:'e'+(4+i),box:'p'+i,spin:'up'});return list;}
function occ(a,st){const c={s2:0,p1:0,p2:0,p3:0};electronsOf(a,st).forEach(e=>{if(e.box!=='s1')c[e.box]++;});return c;}
const ROWX={s2:-2.25,p1:-.75,p2:.75,p3:2.25},RL=.72,SR_=.58,IDS=['s2','p1','p2','p3'];
function rowOrbs(v,counts){const orbs={};IDS.forEach(id=>{const o=id==='s2'?orbS(SR_,TOK.s):orbP(PDIR[id],RL,TOK.p,counts[id]>0?1:0);o.g.position.set(ROWX[id],0,0);v.add(o.g);orbs[id]=o;});return orbs;}
function rowElectrons(v,counts){const els=[];IDS.forEach(id=>{for(let j=0;j<counts[id];j++){const e=electron();v.add(e);els.push({e,id,j,f:orbitFn(id==='s2'?'s':'p',id==='s2'?N3(.3,1,.2):PDIR[id],id==='s2'?SR_:RL,j*Math.PI+IDS.indexOf(id)*.9)});}});return els;}
function buildRow(v,a,promote){
  v.mode='sway';const c0=occ(a,0),c1=occ(a,1),target=promote?IDS.find(id=>id!=='s2'&&c1[id]>c0[id]):null;
  const orbs=rowOrbs(v,c0);
  IDS.forEach(id=>{const l=label(id==='s2'?'2s':'2p');l.position.set(ROWX[id],-1.2,0);v.add(l);});
  const cl=label('1s² inner pair not shown',{size:40,h:.26});cl.position.set(0,-1.72,0);v.add(cl);
  const els=rowElectrons(v,c0),mover=promote?els.find(x=>x.id==='s2'&&x.j===1):null,tf=target?orbitFn('p',PDIR[target],RL,.4):null,tA=.8,tB=2;
  let en=null;if(promote){en=label('+ energy',{color:TOK.accent,size:52,h:.34});v.add(en);}
  v.tick(t=>{
    IDS.forEach((id,i)=>{const k=promote?1:easeBack(seg(t,.05+i*.12,.55+i*.12));orbs[id].g.scale.setScalar(Math.max(k,.001));});
    const cnt=promote&&t>=tB?c1:c0;IDS.forEach(id=>orbs[id].glow(cnt[id]===1?.2+.2*Math.sin(t*4.2):0));
    if(target)orbs[target].fill(ease(seg(t,tB-.35,tB+.15)));
    els.forEach(x=>{const base=V3(ROWX[x.id],0,0);let p;
      if(x===mover){const k=seg(t,tA,tB);
        if(k<=0)p=base.clone().add(x.f(t));
        else if(k<1){const s0=base.clone().add(x.f(tA)),s2=V3(ROWX[target],0,0).add(tf(tB)),m=s0.clone().add(s2).multiplyScalar(.5);m.y+=1.9;const e=ease(k);p=s0.multiplyScalar((1-e)*(1-e)).add(m.multiplyScalar(2*e*(1-e))).add(s2.multiplyScalar(e*e));}
        else p=V3(ROWX[target],0,0).add(tf(t));
        const fly=k>0&&k<1;x.e.material.color.set(fly?TOK.accent:TOK.ink);x.e.scale.setScalar(fly?.12:.075);
      }else p=base.clone().add(x.f(t));
      x.e.position.copy(p);x.e.visible=promote||t>.5+IDS.indexOf(x.id)*.12;});
    if(en){const k=seg(t,tA,tB+.5);en.position.set(lerp(ROWX.s2,ROWX[target],.5),.9+k*.9,0);en.material.opacity=Math.sin(Math.PI*k);en.visible=k>0&&k<1;}
  });
}
function buildMix(v,a){
  v.mode='sway';const L=1.35,c1=occ(a,1),mixed=hybridIds(a.nHyb),left=IDS.filter(id=>!mixed.includes(id)),dirs=a.nHyb===4?TET:a.nHyb===3?TRI:LIN;
  const orbs=rowOrbs(v,c1),labs=IDS.map(id=>{const l=label(id==='s2'?'2s':'2p');l.position.set(ROWX[id],-1.2,0);v.add(l);return l;}),els=rowElectrons(v,c1);
  const flash=new THREE.Mesh(GEO.sph,phong(TOK.hyb,.5,{emissive:new THREE.Color(TOK.hyb),emissiveIntensity:.6}));flash.visible=false;v.add(flash);
  const hy=dirs.map((d,i)=>{const o=orbH(d,L,TOK.hyb);o.g.scale.setScalar(.001);v.add(o.g);const e=electron();v.add(e);return {o,e,f:orbitFn('h',d,L,i*1.7)};});
  const tag=label(a.nHyb+' × '+a.hybTxt+(left.length?'  +  '+left.length+' × 2p':''),{color:TOK.ink,size:52,h:.34});tag.position.set(0,-2.05,0);v.add(tag);
  v.tick(t=>{
    const k1=ease(seg(t,.35,1.25)),k2=seg(t,1.25,1.9),k3=seg(t,1.3,2.1),kL=ease(seg(t,1.6,2.3));
    IDS.forEach(id=>{const o=orbs[id];o.g.position.x=lerp(ROWX[id],0,k1);if(mixed.includes(id)){o.g.scale.setScalar(Math.max(.001,lerp(1,.25,k2)));o.g.rotation.y=k2*5;o.alpha(1-k2);o.g.visible=k2<1;}else o.g.scale.setScalar(lerp(1,L*.8/RL,kL));});
    labs.forEach(l=>{l.material.opacity=1-k1;l.visible=k1<1;});
    els.forEach(x=>{const o=orbs[x.id],sc=o.g.scale.x;x.e.position.copy(o.g.position.clone().add(x.f(t).multiplyScalar(sc)));if(mixed.includes(x.id))x.e.visible=k2<.9;});
    flash.visible=k3>0&&k3<1;flash.scale.setScalar(lerp(.2,1.9,easeOut(k3)));flash.material.opacity=.45*(1-k3);
    hy.forEach((h,i)=>{const k=easeBack(seg(t,1.55+i*.1,2.3+i*.1));h.o.g.scale.setScalar(Math.max(.001,k));h.e.visible=k>.3;h.e.position.copy(h.f(t).multiplyScalar(Math.min(1,Math.max(k,0))));});
    tag.material.opacity=seg(t,2.3,2.8);tag.visible=t>2.3;
  });
}
function labSpec(a,isEth){const n=a.nHyb,bonds=n===4?TET:n===3?TRI:LIN,left=['p1','p2','p3'].filter(id=>!hybridIds(n).includes(id)),ligs=Array(n).fill(a.lig);if(isEth)ligs[0]='C';return {center:a.el,bonds,ligs,pDirs:left.map(id=>PDIR[id]),pFilled:a.pExtra==='filled',angle:a.angle,L:1.4};}

/* ---------- balloons: hybrids pushing apart ---------- */
function buildBalloons(v,n){
  v.mode='spin';const fin=n===2?LIN:n===3?TRI:TET,lab=n===2?'180°':n===3?'120°':'109.5°';
  v.add(atomMesh('C',.2));
  const L=1.5,lobes=fin.map((d,i)=>{const o=orbH(UPV,L,TOK.hyb);v.add(o.g);const init=N3(.28*Math.cos(i*2.3)+.08,1,.28*Math.sin(i*2.3));return {o,init,fin:d,i};});
  const word=label(n+' hybrids push apart',{color:TOK.ink,size:48,h:.3});word.position.set(0,-2.05,0);v.add(word);
  v.tick(t=>{const k=easeOut(seg(t,.5,2.1));lobes.forEach(L_=>{const wob=(1-k)*.07*Math.sin(t*10+L_.i*2);const d=L_.init.clone().lerp(L_.fin,k).add(new THREE.Vector3(wob,0,-wob)).normalize();L_.o.g.quaternion.setFromUnitVectors(UPV,d);L_.o.glow(k<1?.25*(1-k):0);});word.material.opacity=seg(t,.2,.6)*(1-seg(t,2.2,2.6));word.visible=t<2.6;});
  addArc(v,fin[0],fin[1],lab,2.2);
}

/* ---------- ethene (sigma + pi, twist) ---------- */
function buildEthene(v){
  v.mode='sway';const cc=.7,L=.95,Lcc=.78,D=L+.32;
  const g1=new THREE.Group(),g2=new THREE.Group();v.add(g1);v.add(g2);const sig=[],pO=[],els=[];
  g1.add(atomMesh('C',.22));g2.add(atomMesh('C',.22));
  const d1=[N3(1,0,0),N3(-.5,0,.866),N3(-.5,0,-.866)],d2=[N3(-1,0,0),N3(.5,0,.866),N3(.5,0,-.866)];
  [[g1,d1],[g2,d2]].forEach(([g,ds])=>{ds.forEach((d,i)=>{const o=orbH(d,i===0?Lcc:L,TOK.hyb);g.add(o.g);sig.push(o.g);
      if(i>0){const hh=new THREE.Group();hh.position.copy(d).multiplyScalar(D);hh.add(atomMesh('H',.15));const s=orbS(.36,TOK.s);hh.add(s.g);sig.push(s.g);g.add(hh);const om=ovMesh(d);om.position.copy(d).multiplyScalar(L-.04);g.add(om);sig.push(om);[0,Math.PI].forEach(ph=>{const e=electron();g.add(e);els.push({e,f:orbitFn('b',d,L-.04,ph+i)});});}});
    const p=orbP(N3(0,1,0),.95,TOK.p,1);g.add(p.g);pO.push(p.g);});
  const ccOv=ovMesh(N3(1,0,0));v.add(ccOv);sig.push(ccOv);const ccE=[0,Math.PI].map(ph=>{const e=electron();v.add(e);return {e,f:orbitFn('b',N3(1,0,0),0,ph)};});
  const piM=[.8,-.8].map(y=>{const m=new THREE.Mesh(GEO.sph,phong(TOK.pi,.5,{emissive:new THREE.Color(TOK.pi),emissiveIntensity:.25}));m.position.set(0,y,0);v.add(m);return m;});
  const pe=[0,1].map(()=>{const e=electron();v.add(e);return e;}),pf=orbitFn('p',N3(0,1,0),.95,0),pf2=orbitFn('p',N3(0,1,0),.95,Math.PI),X=new THREE.Vector3(1,0,0);
  v.tick((t,dt)=>{
    const ki=ease(seg(t,.1,1.3));g1.position.x=lerp(-2.7,-cc,ki);g2.position.x=lerp(2.7,cc,ki);
    const ks=ease(seg(t,1.2,1.7)),kp=ease(seg(t,1.8,2.7));
    if(PIS.auto&&dt>0){PIS.at+=dt*1.1;PIS.theta=45*(1-Math.cos(PIS.at));$('twist').value=Math.round(PIS.theta);piReadout();}
    const th=PIS.theta*Math.PI/180,c=Math.cos(th),pk=kp*c;g2.rotation.x=th;
    ccOv.scale.setScalar(Math.max(.001,ks*(1+.08*Math.sin(t*4))));ccOv.userData.m.material.opacity=.6*ks;
    piM.forEach(m=>{m.scale.set(.85,.24*(.4+.6*kp),.34);m.material.opacity=.5*pk;m.visible=PIS.pi&&pk>.01;});
    sig.forEach(o=>o.visible=PIS.sig);pO.forEach(o=>o.visible=PIS.p);
    els.forEach(x=>x.e.position.copy(x.f(t)));ccE.forEach(x=>{x.e.position.copy(x.f(t));x.e.visible=ks>.5;});
    const own1=pf(t).add(g1.position),own2=pf2(t).applyAxisAngle(X,th).add(g2.position),sh1=V3(.8*Math.sin(t*1.6),.8,0),sh2=V3(.8*Math.sin(t*1.6+Math.PI),-.8,0);
    pe[0].position.copy(own1.lerp(sh1,pk));pe[1].position.copy(own2.lerp(sh2,pk));
  });
}

/* ---------- solid structures ---------- */
const NA_COL='#f0a030',CL_COL='#5fbfe0',MET_COL='#9db0cf',C_COL='#6b7a90',I_COL='#9065cc';
function buildNaCl(v,fill){
  v.mode='spin';v.setDist(7.4);const s=1,rNa=fill?.36:.16,rCl=fill?.62:.27,pts=[];
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++){const p=V3((i-1)*s,(j-1)*s,(k-1)*s);pts.push({p,na:(i+j+k)%2===1,c:i===1&&j===1&&k===1,nb:Math.abs(i-1)+Math.abs(j-1)+Math.abs(k-1)===1,ijk:[i,j,k]});}
  const items=pts.map((pt,n)=>{const m=ball(pt.na?NA_COL:CL_COL,pt.na?rNa:rCl);v.add(m);const dir=pt.p.length()?pt.p.clone().normalize():V3(0,1,0);const from=pt.p.clone().add(dir.multiplyScalar(4)).add(V3(Math.sin(n*7.1),Math.cos(n*3.7),Math.sin(n*1.3)).multiplyScalar(1.2));m.position.copy(from);return {m,pt,from,d:.1+pt.p.length()*.35};});
  const sticks=[];
  if(!fill)for(let a=0;a<pts.length;a++)for(let b=a+1;b<pts.length;b++){if(Math.abs(pts[a].p.distanceTo(pts[b].p)-s)<.01){const hl=(pts[a].c||pts[b].c);const m=stick(pts[a].p,pts[b].p,hl?.05:.035,hl?TOK.sigma:'#9aa6b6');m.visible=false;v.add(m);sticks.push(m);}}
  const tags=[];[[2,2,1,'Na⁺',NA_COL],[2,2,2,'Cl⁻',CL_COL]].forEach(([i,j,k,t,col])=>{const pt=pts.find(q=>q.ijk[0]===i&&q.ijk[1]===j&&q.ijk[2]===k);const sp=pill(t,col,.32);sp.position.copy(pt.p).add(V3(0,(pt.na?rNa:rCl)+.28,0));sp.visible=false;v.add(sp);tags.push(sp);});
  const six=pill('6 Cl⁻ around each Na⁺',TOK.sigma,.3);six.position.set(0,-2.05,0);six.visible=false;v.add(six);
  v.tick(t=>{items.forEach(it=>{const k=easeOut(seg(t,it.d,it.d+.9));it.m.position.copy(it.from).lerp(it.pt.p,k);});
    sticks.forEach(m=>{m.visible=t>1.8;});
    const pulse=t>2?.22+.22*Math.sin(t*4):0;items.forEach(it=>{if(it.pt.c||it.pt.nb){const col=it.pt.na?NA_COL:CL_COL;it.m.material.emissive.set(col);it.m.material.emissive.multiplyScalar(pulse);}});
    tags.forEach(s=>{s.visible=t>2;s.material.opacity=seg(t,2,2.5);});six.visible=t>2.3;six.material.opacity=seg(t,2.3,2.8);});
}
function buildMetal(v){
  v.mode='spin';v.setDist(7.2);const a1=V3(.64,0,0),a2=V3(.32,0,.554),ions=[];
  for(let L=0;L<3;L++){const off=L===1?V3(.32,0,.185):V3(0,0,0);for(let i=0;i<4;i++)for(let j=0;j<4;j++){const p=a1.clone().multiplyScalar(i).add(a2.clone().multiplyScalar(j)).add(off);p.y=(L-1)*.52;ions.push({p,L,i,j});}}
  const cen=ions.reduce((s,o)=>s.add(o.p),V3(0,0,0)).multiplyScalar(1/ions.length);ions.forEach(o=>o.p.sub(cen));
  const mn=V3(9,9,9),mx=V3(-9,-9,-9);ions.forEach(o=>{mn.min(o.p);mx.max(o.p);});mn.addScalar(-.3);mx.addScalar(.3);
  const ms=ions.map(o=>{const m=ball(MET_COL,.31);v.add(m);return m;});
  const es=Array.from({length:36},(_,n)=>{const e=electron();e.scale.setScalar(.06);v.add(e);const p=V3(lerp(mn.x,mx.x,Math.random()),lerp(mn.y,mx.y,Math.random()),lerp(mn.z,mx.z,Math.random()));const vel=V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(.7);return {e,p,vel};});
  const tag=pill('Mg²⁺ ions + sea of electrons',TOK.accent,.3);tag.position.set(0,-1.75,0);v.add(tag);
  v.tick((t,dt)=>{ions.forEach((o,n)=>{const d=o.L*.35+(o.i+o.j)*.03,k=easeOut(seg(t,d,d+.8));ms[n].position.copy(o.p).add(V3(0,(1-k)*3.5,0));});
    es.forEach(x=>{if(dt>0){x.vel.add(V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(dt*2));x.vel.clampLength(.4,.9);x.p.addScaledVector(x.vel,dt);['x','y','z'].forEach(ax=>{if(x.p[ax]<mn[ax]){x.p[ax]=mn[ax];x.vel[ax]*=-1;}if(x.p[ax]>mx[ax]){x.p[ax]=mx[ax];x.vel[ax]*=-1;}});}x.e.position.copy(x.p);x.e.visible=t>1.2;});
    tag.material.opacity=seg(t,1.4,1.9);tag.visible=t>1.4;});
}
function buildIodine(v){
  v.mode='spin';v.setDist(7.8);const mols=[];
  for(let i=-1;i<=1;i++)for(let j=0;j<=1;j++)for(let k=-1;k<=1;k++){const c=V3(i*1.15,(j-.5)*1.3,k*1.15),par=(((i+j+k)%2)+2)%2,d=par?N3(.75,.45,.35):N3(-.75,.45,-.35);
    const g=new THREE.Group();g.add(stick(d.clone().multiplyScalar(-.27),d.clone().multiplyScalar(.27),.09,'#6d4aa3'));const a=ball(I_COL,.27);a.position.copy(d).multiplyScalar(.27);const b=ball(I_COL,.27);b.position.copy(d).multiplyScalar(-.27);g.add(a);g.add(b);v.add(g);mols.push({g,c,n:mols.length});}
  const tag=pill('I₂ molecules, weak forces between',I_COL,.3);tag.position.set(0,-1.95,0);v.add(tag);
  v.tick(t=>{mols.forEach(m=>{const d=m.n*.05,k=easeOut(seg(t,d,d+.8));m.g.position.copy(m.c).add(V3(0,(1-k)*4,0)).add(V3(Math.sin(t*3+m.n)*.03,Math.cos(t*2.6+m.n*2)*.03,0));});tag.material.opacity=seg(t,1.5,2);tag.visible=t>1.5;});
}
function buildDiamond(v){
  v.mode='spin';v.setDist(7.2);const a=2.5,B=[[0,0,0],[0,.5,.5],[.5,0,.5],[.5,.5,0]],seen=new Set(),raw=[];
  for(let n1=-1;n1<=1;n1++)for(let n2=-1;n2<=1;n2++)for(let n3=-1;n3<=1;n3++)B.forEach(b=>[[0,0,0],[.25,.25,.25]].forEach(o=>{const p=[n1+b[0]+o[0],n2+b[1]+o[1],n3+b[2]+o[2]];if(p.every(c=>c>-.01&&c<1.01)){const key=p.map(c=>c.toFixed(2)).join(',');if(!seen.has(key)){seen.add(key);raw.push(p);}}}));
  const pts=raw.map(p=>V3((p[0]-.5)*a,(p[1]-.5)*a,(p[2]-.5)*a)),hlI=raw.findIndex(p=>Math.abs(p[0]-.25)<.01&&Math.abs(p[1]-.25)<.01&&Math.abs(p[2]-.25)<.01),hl=pts[hlI];
  const atoms=pts.map((p,n)=>{const m=ball(n===hlI?TOK.hyb:C_COL,n===hlI?.2:.17);m.position.copy(p);v.add(m);return {m,d:p.distanceTo(hl)*.25};});
  const bl=a*.433,sticks=[],hlDirs=[];
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){if(Math.abs(pts[i].distanceTo(pts[j])-bl)<.05){const on=i===hlI||j===hlI;const m=stick(pts[i],pts[j],on?.07:.05,on?TOK.hyb:'#9aa6b6');v.add(m);sticks.push({m,d:Math.max(atoms[i].d,atoms[j].d)+.3});if(on)hlDirs.push((i===hlI?pts[j]:pts[i]).clone().sub(hl).normalize());}}
  v.tick(t=>{atoms.forEach(o=>{const k=easeBack(seg(t,o.d,o.d+.5));o.m.visible=k>0;o.m.scale.setScalar((o.m===atoms[hlI].m?.2:.17)*Math.max(k,.001));});sticks.forEach(s=>{s.m.visible=t>s.d+.3;});});
  if(hlDirs.length>=2)addArc(v,hlDirs[0],hlDirs[1],'109.5°',2.2,hl);
}
function buildGraphite(v){
  v.mode='spin';v.setDist(7.6);const b=.42,a1=V3(Math.sqrt(3)*b,0,0),a2=V3(Math.sqrt(3)/2*b,0,1.5*b),R=1.62,layers=[];
  for(let L=0;L<3;L++){const y=(L-1)*1.0,pts=[];for(let i=-7;i<=7;i++)for(let j=-7;j<=7;j++)[0,b].forEach(o=>{const p=a1.clone().multiplyScalar(i).add(a2.clone().multiplyScalar(j)).add(V3(0,0,o+(L===1?b:0)));if(p.x*p.x+p.z*p.z<R*R)pts.push(V3(p.x,y,p.z));});
    const g=new THREE.Group();pts.forEach(p=>{const m=ball(C_COL,.1);m.position.copy(p);g.add(m);});
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++)if(Math.abs(pts[i].distanceTo(pts[j])-b)<.02)g.add(stick(pts[i],pts[j],.035,'#9aa6b6'));
    v.add(g);const es=Array.from({length:8},()=>{const e=electron();e.scale.setScalar(.06);g.add(e);const ang=Math.random()*6.28,r=Math.random()*R*.8;return {e,p:V3(Math.cos(ang)*r,y,Math.sin(ang)*r),vel:V3(Math.random()-.5,0,Math.random()-.5).normalize().multiplyScalar(.6)};});
    layers.push({g,pts,es,L});}
  for(let L=0;L<2;L++)layers[L].pts.forEach(p=>{const q=layers[L+1].pts.find(q=>Math.abs(q.x-p.x)<.02&&Math.abs(q.z-p.z)<.02);if(q)v.add(stick(p,q,.012,TOK.muted,.35));});
  const tag=pill('weak forces between layers',TOK.accent,.28);tag.position.set(R+.2,.5,0);v.add(tag);
  v.tick((t,dt)=>{layers.forEach(l=>{const d=l.L*.35,k=easeOut(seg(t,d,d+.9));l.g.position.x=(1-k)*(l.L%2?-5:5);
    l.es.forEach(x=>{if(dt>0){x.vel.add(V3(Math.random()-.5,0,Math.random()-.5).multiplyScalar(dt*2));x.vel.clampLength(.3,.7);x.p.addScaledVector(x.vel,dt);const r=Math.hypot(x.p.x,x.p.z);if(r>R*.9){x.p.x*=R*.9/r;x.p.z*=R*.9/r;x.vel.x*=-1;x.vel.z*=-1;}}x.e.position.copy(x.p);x.e.visible=t>1.6;});});
    tag.material.opacity=seg(t,1.8,2.3);tag.visible=t>1.8;});
}
const STRUCT_BUILD={nacl:v=>buildNaCl(v,false),metal:buildMetal,iodine:buildIodine,diamond:buildDiamond,graphite:buildGraphite};
