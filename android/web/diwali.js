(function(){
// Diwali 2026 decoration: shows only 8-12 Nov 2026 (IST), then does nothing. Pure canvas, no network, pauses when hidden.
var START=Date.parse("2026-11-08T00:00:00+05:30"),END=Date.parse("2026-11-13T00:00:00+05:30");
function on(){var n=Date.now();return n>=START&&n<END;}
if(!on())return;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var st=document.createElement("style");
st.textContent="#diwaliFx{position:fixed;left:0;top:0;width:100%;pointer-events:none;z-index:6}#mini{box-shadow:0 0 0 1.5px rgba(255,179,0,.65),0 0 18px rgba(255,179,0,.4),0 6px 24px rgba(0,0,0,.5)!important}";
document.head.appendChild(st);
var C=document.createElement("canvas");C.id="diwaliFx";document.body.appendChild(C);
var X=C.getContext("2d"),dpr=Math.min(2,window.devicePixelRatio||1),W=0,H=0,stars=[],T=0,last=0,raf=0,top=0;
function size(){top=0;try{var p=document.createElement("div");p.style.cssText="position:fixed;top:0;padding-top:env(safe-area-inset-top);visibility:hidden";document.body.appendChild(p);top=p.getBoundingClientRect().height;p.remove();}catch(e){}
  W=window.innerWidth;H=top+86;C.width=W*dpr;C.height=H*dpr;C.style.height=H+"px";X.setTransform(dpr,0,0,dpr,0,0);
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
  X.strokeStyle="rgba(255,190,80,.55)";X.lineWidth=1.2;X.beginPath();
  for(var d=0;d<=n;d++){var x=(d+.5)*W/(n+1),y=base+10+10*Math.sin(d*1.7);if(d===0)X.moveTo(0,base);X.quadraticCurveTo(x-W/(n+1)/2,base+18,x,y);}X.stroke();
  for(var d2=0;d2<n;d2++){diya((d2+.5)*W/n,base+22+6*Math.sin(d2*1.7),.46,t+d2);}
  for(var i=0;i<stars.length;i++){var q=stars[i];star(q.x,q.y,q.r,.2+.4*Math.abs(Math.sin(t*1.6+q.ph)));}}
function frame(ts){if(!on()){stop(true);return;}
  if(ts-last>=33){T+=Math.min(.1,(ts-last)/1000);last=ts;draw(T);}raf=requestAnimationFrame(frame);}
function stop(remove){cancelAnimationFrame(raf);raf=0;if(remove){C.remove();st.remove();}}
function go(){if(reduce){draw(0);return;}if(!raf)raf=requestAnimationFrame(frame);}
document.addEventListener("visibilitychange",function(){if(document.hidden)stop(false);else{if(!on()){stop(true);return;}go();}});
window.addEventListener("resize",function(){size();if(reduce)draw(0);});
size();go();
})();
