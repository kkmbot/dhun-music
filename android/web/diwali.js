(function(){
// Diwali 2026 decoration: shows 7-8 Nov 2026 (IST), then does nothing. Pure canvas, no network, pauses when hidden.
var START=Date.parse("2026-11-07T00:00:00+05:30"),END=Date.parse("2026-11-09T00:00:00+05:30");
function on(){var n=Date.now();return n>=START&&n<END;}
if(!on())return;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var st=document.createElement("style");
st.textContent="#diwaliFx{position:fixed;left:0;top:0;width:100%;pointer-events:none;z-index:17}#mini{box-shadow:0 0 0 1.5px rgba(255,179,0,.65),0 0 18px rgba(255,179,0,.4),0 6px 24px rgba(0,0,0,.5)!important}";
document.head.appendChild(st);
var C=document.createElement("canvas");C.id="diwaliFx";document.body.appendChild(C);
var X=C.getContext("2d"),dpr=Math.min(2,window.devicePixelRatio||1),W=0,H=0,stars=[],T=0,last=0,raf=0,top=0;
function size(){top=0;try{var p=document.createElement("div");p.style.cssText="position:fixed;top:0;padding-top:env(safe-area-inset-top);visibility:hidden";document.body.appendChild(p);top=p.getBoundingClientRect().height;p.remove();}catch(e){}
  W=window.innerWidth;H=top+120;C.width=W*dpr;C.height=H*dpr;C.style.height=H+"px";X.setTransform(dpr,0,0,dpr,0,0);
  stars=[];for(var i=0;i<14;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:2+Math.random()*3.5,ph:Math.random()*6});}
function diya(x,y,s,t){var f=.85+.15*Math.sin(t*7+x)+.08*Math.sin(t*13+y);
  X.save();X.translate(x,y);X.scale(s,s);
  var g=X.createRadialGradient(0,-10,1,0,-10,38*f);g.addColorStop(0,"rgba(255,200,90,.55)");g.addColorStop(1,"rgba(255,140,0,0)");X.fillStyle=g;X.fillRect(-45,-55,90,90);
  X.fillStyle="#b5531c";X.beginPath();X.moveTo(-16,-4);X.quadraticCurveTo(0,16,16,-4);X.quadraticCurveTo(0,-1,-16,-4);X.fill();
  X.fillStyle="#d9742a";X.beginPath();X.ellipse(0,-4,16,4,0,0,Math.PI*2);X.fill();
  X.fillStyle="#ffd27a";X.beginPath();X.moveTo(0,-26*f);X.bezierCurveTo(8,-14,6,-8,0,-6);X.bezierCurveTo(-6,-8,-8,-14,0,-26*f);X.fill();
  X.fillStyle="#fff3c4";X.beginPath();X.ellipse(0,-11,2.2,5*f,0,0,Math.PI*2);X.fill();X.restore();}
function star(x,y,r,a){X.save();X.globalAlpha=a;X.fillStyle="#ffe9a8";X.beginPath();for(var i=0;i<8;i++){var rr=i%2?r*.35:r,an=i*Math.PI/4;X.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr);}X.fill();X.restore();}
function draw(t){X.clearRect(0,0,W,H);var n=Math.max(5,Math.round(W/62)),base=top-6;
  for(var i=0;i<stars.length;i++){var q=stars[i];star(q.x,q.y,q.r,.2+.4*Math.abs(Math.sin(t*1.6+q.ph)));}}
function frame(ts){if(!on()){stop(true);return;}
  if(ts-last>=33){T+=Math.min(.1,(ts-last)/1000);last=ts;draw(T);}raf=requestAnimationFrame(frame);}
function stop(remove){cancelAnimationFrame(raf);raf=0;if(remove){C.remove();st.remove();var s_=document.getElementById("dwStrip");if(s_)s_.remove();}}
function go(){if(reduce){draw(0);return;}if(!raf)raf=requestAnimationFrame(frame);}
document.addEventListener("visibilitychange",function(){if(document.hidden)stop(false);else{if(!on()){stop(true);return;}go();}});
window.addEventListener("resize",function(){size();if(reduce)draw(0);});
size();go();

// --- in-flow diya string under the Dhun logo (Home only) ---
(function(){
var n=7,vw=360,vh=58,h='';
h+='<svg viewBox="0 0 '+vw+' '+vh+'" width="100%" aria-hidden="true" focusable="false"><defs><radialGradient id="dwG"><stop offset="0" stop-color="#ffc04d" stop-opacity=".75"/><stop offset="1" stop-color="#ff8c00" stop-opacity="0"/></radialGradient><linearGradient id="dwC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0792e"/><stop offset="1" stop-color="#8f3a12"/></linearGradient></defs>';
h+='<path d="M0 6 Q'+(vw/2)+' 24 '+vw+' 6" fill="none" stroke="rgba(255,196,90,.55)" stroke-width="1.2"/>';
for(var i=0;i<n;i++){var t=(i+.5)/n,x=t*vw,y=6+ (1-Math.pow(2*t-1,2))*9 + 6;
 h+='<g transform="translate('+x.toFixed(1)+' '+(y+10).toFixed(1)+')"><line x1="0" y1="-16" x2="0" y2="-8" stroke="rgba(255,196,90,.5)" stroke-width="1"/>'
  +'<circle class="dwGl" cy="-3" r="17" fill="url(#dwG)" style="animation-delay:-'+(i*.43).toFixed(2)+'s"/>'
  +'<path d="M-11 0 Q0 13 11 0 Q0 3 -11 0Z" fill="url(#dwC)"/><ellipse cx="0" cy="0" rx="11" ry="2.6" fill="#f0a35c"/>'
  +'<g class="dwFl" style="animation-delay:-'+(i*.31).toFixed(2)+'s"><path d="M0 -17 C5 -10 4.5 -5 0 -2.5 C-4.5 -5 -5 -10 0 -17Z" fill="#ffcf5a"/><ellipse cx="0" cy="-6.5" rx="1.5" ry="3.4" fill="#fff4c8"/></g></g>';}
h+='</svg>';
var css=document.createElement('style');
css.id='dwStripCss';
css.textContent='#dwStrip{margin:-2px 0 4px;pointer-events:none;overflow:hidden}#dwStrip svg{display:block}.dwFl{transform-box:fill-box;transform-origin:50% 100%;animation:dwFl 1.1s ease-in-out infinite alternate}.dwGl{animation:dwGl 1.6s ease-in-out infinite alternate}@keyframes dwFl{from{transform:scale(.9,.92) rotate(-3deg)}to{transform:scale(1.08,1.12) rotate(3deg)}}@keyframes dwGl{from{opacity:.55}to{opacity:1}}@media (prefers-reduced-motion:reduce){.dwFl,.dwGl{animation:none}}';
document.head.appendChild(css);
function now(){var t=Date.now();return t>=START&&t<END;}
function ensure(){
 var v=document.getElementById('view'); if(!v)return;
 var ex=document.getElementById('dwStrip'), hd=v.querySelector(':scope > h1.hrow');
 if(!now()){if(ex)ex.remove();css.remove();return;}
 if(!hd){if(ex)ex.remove();return;}
 if(ex&&ex.previousElementSibling===hd)return;
 if(ex)ex.remove();
 var el=document.createElement('div');el.id='dwStrip';el.innerHTML=h;hd.after(el);
}
function boot(){var v=document.getElementById('view');ensure();if(v)new MutationObserver(ensure).observe(v,{childList:true});setInterval(ensure,4000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
})();
