(function(){
/* Dhun festival themes: picks today's festival (IST) from a built-in calendar, shows a light theme + greeting hook for app.js,
   and removes everything when the festival is over. Preview: open the app with ?fest=holi (or diwali, eid ...), ?fest=off to clear. */
var D=function(a,b){return [Date.parse(a+"T00:00:00+05:30"),Date.parse(b+"T00:00:00+05:30")+864e5];};
var F={
 diwali:{name:"Diwali",wish:"Happy Diwali 🪔",emoji:"🪔",sub:"Shubh Deepavali! Diwali ke gaane sunein? 🎆",accent:"255,179,0",deco:"diya",fx:"stars",
  songQ:["diwali hits","happy diwali songs","deepavali party songs hindi"],plQ:["diwali hindi","diwali party","diwali","deepavali songs","diwali bollywood","lakshmi pooja","lakshmi"],plRe:"diwali|deepavali|dipawali|dhanteras|laxmi|lakshmi"},
 christmas:{name:"Christmas",wish:"Merry Christmas 🎄",emoji:"🎄",sub:"Jingle bells, jingle bells! 🔔",accent:"90,200,120",deco:"🎄 ⭐ 🎁 🔔 ❄️ 🎅 🎄",fx:"snow",
  songQ:["christmas songs","jingle bells","christmas carols","merry christmas hindi"],plQ:["christmas","christmas carols","christmas hits","xmas"],plRe:"christmas|xmas|carol|santa"},
 newyear:{name:"New Year",wish:"Happy New Year 🎉",emoji:"🎉",sub:"Nayi shuruaat, naye gaane! 🥳",accent:"255,215,64",deco:"🎉 🥳 🎆 ✨ 🍾 🎊 🎉",fx:"confetti",
  songQ:["new year party songs","happy new year songs","new year hindi hits","party songs 2026"],plQ:["new year party","new year","party hits hindi","new year hindi"],plRe:"new year|party|2027|2026"},
 sankranti:{name:"Makar Sankranti",wish:"Happy Sankranti 🪁",emoji:"🪁",sub:"Patang udao, gaane sunao! ☀️",accent:"255,160,40",deco:"🪁 ☀️ 🌾 🪁 🌻 🪁 🌾",fx:"petals",
  songQ:["makar sankranti songs","patang kite songs hindi","pongal songs"],plQ:["makar sankranti","sankranti","pongal","kite songs"],plRe:"sankranti|pongal|kite|patang|harvest|lohri"},
 republic:{name:"Republic Day",wish:"Happy Republic Day 🇮🇳",emoji:"🇮🇳",sub:"Jai Hind! Desh bhakti ke gaane 🇮🇳",accent:"255,153,51",deco:"🇮🇳 🕊️ 🇮🇳 ⭐ 🇮🇳 🕊️ 🇮🇳",fx:"tricolor",
  songQ:["republic day songs","desh bhakti songs hindi","patriotic songs hindi"],plQ:["republic day","desh bhakti","patriotic","tiranga"],plRe:"republic|patriot|desh|tiranga|independence|jai hind"},
 independence:{name:"Independence Day",wish:"Happy Independence Day 🇮🇳",emoji:"🇮🇳",sub:"Jai Hind! Desh bhakti ke gaane 🇮🇳",accent:"255,153,51",deco:"🇮🇳 🕊️ 🇮🇳 ⭐ 🇮🇳 🕊️ 🇮🇳",fx:"tricolor",
  songQ:["independence day songs","desh bhakti songs hindi","patriotic songs hindi"],plQ:["independence day","desh bhakti","patriotic","tiranga"],plRe:"independence|patriot|desh|tiranga|republic|jai hind"},
 holi:{name:"Holi",wish:"Happy Holi 🎨",emoji:"🎨",sub:"Bura na mano, Holi hai! 🌈",accent:"236,64,122",deco:"🎨 🌈 💦 🌸 🎨 💦 🌈",fx:"color",
  songQ:["holi songs","holi hindi hits","rang barse holi"],plQ:["holi","holi party","holi hits","rang"],plRe:"holi|rang"},
 eid:{name:"Eid",wish:"Eid Mubarak 🌙",emoji:"🌙",sub:"Eid Mubarak! Dil se dua 🤲",accent:"120,200,170",deco:"🌙 ⭐ 🕌 ✨ 🌙 ⭐ 🕌",fx:"stars",
  songQ:["eid songs","eid mubarak songs","qawwali hits"],plQ:["eid","eid mubarak","ramzan","qawwali"],plRe:"eid|ramzan|ramadan|qawwali|naat"},
 ramnavami:{name:"Ram Navami",wish:"Jai Shree Ram 🏹",emoji:"🏹",sub:"Ram Navami ki shubhkamnayein 🚩",accent:"255,140,40",deco:"🏹 🚩 🪔 🌸 🚩 🪔 🏹",fx:"petals",
  songQ:["ram navami songs","shri ram bhajan","jai shree ram songs"],plQ:["ram navami","shri ram","ram bhajan","ram"],plRe:"ram|navami"},
 rakhi:{name:"Raksha Bandhan",wish:"Happy Raksha Bandhan 🎀",emoji:"🎀",sub:"Bhai-behen ke pyaar ke gaane 💝",accent:"255,120,160",deco:"🎀 🌸 💝 ✨ 🎀 🌸 💝",fx:"petals",
  songQ:["raksha bandhan songs","rakhi songs bhai behen","bhai behen songs"],plQ:["raksha bandhan","rakhi","bhai behen","sibling"],plRe:"rakhi|raksha|bhai|behen|sibling|brother|sister"},
 ganesh:{name:"Ganesh Chaturthi",wish:"Ganpati Bappa Morya 🐘",emoji:"🐘",sub:"Ganesh Chaturthi ki shubhkamnayein 🙏",accent:"255,150,50",deco:"🐘 🌺 🪔 🙏 🐘 🌺 🪔",fx:"petals",
  songQ:["ganesh chaturthi songs","ganpati bappa songs","ganesh aarti"],plQ:["ganesh chaturthi","ganpati","ganesh","bappa"],plRe:"ganesh|ganpati|bappa|ganapati"},
 navratri:{name:"Navratri",wish:"Happy Navratri 💃",emoji:"💃",sub:"Garba nights! Maa Durga ke gaane 🔱",accent:"255,90,120",deco:"💃 🌺 🔱 🪔 💃 🌺 🔱",fx:"petals",
  songQ:["navratri garba songs","garba hits","durga mata songs"],plQ:["navratri","garba","dandiya","durga"],plRe:"navratri|garba|dandiya|durga|mata|navaratri"},
 dussehra:{name:"Dussehra",wish:"Happy Dussehra 🏹",emoji:"🏹",sub:"Burai pe achchai ki jeet! 🚩",accent:"255,140,40",deco:"🏹 🚩 🔥 🪔 🚩 🔥 🏹",fx:"petals",
  songQ:["dussehra songs","jai shree ram songs","vijayadashami songs"],plQ:["dussehra","vijayadashami","ram","dasara"],plRe:"dussehra|vijayadashami|dasara|dussera|ram"}
};
/* windows: [festival, first day, last day] in IST, last day inclusive. Lunar dates from drikpanchang (New Delhi); Eid depends on moon sighting. */
var W=[
 ["diwali","2026-11-07","2026-11-08"],
 ["christmas","2026-12-24","2026-12-25"],["newyear","2026-12-31","2027-01-01"],
 ["sankranti","2027-01-14","2027-01-15"],["republic","2027-01-25","2027-01-26"],
 ["eid","2027-03-09","2027-03-11"],["holi","2027-03-21","2027-03-22"],["ramnavami","2027-04-14","2027-04-15"],
 ["independence","2027-08-14","2027-08-15"],["rakhi","2027-08-16","2027-08-17"],["ganesh","2027-09-03","2027-09-05"],
 ["navratri","2027-09-30","2027-10-07"],["dussehra","2027-10-08","2027-10-09"],["diwali","2027-10-28","2027-10-29"],
 ["christmas","2027-12-24","2027-12-25"],["newyear","2027-12-31","2028-01-01"],
 ["sankranti","2028-01-14","2028-01-15"],["republic","2028-01-25","2028-01-26"],["holi","2028-03-10","2028-03-11"],["ramnavami","2028-04-02","2028-04-04"],
 ["independence","2028-08-14","2028-08-15"],["rakhi","2028-08-04","2028-08-05"],["ganesh","2028-08-22","2028-08-24"],
 ["navratri","2028-09-19","2028-09-25"],["dussehra","2028-09-26","2028-09-27"],["diwali","2028-10-16","2028-10-17"],
 ["christmas","2028-12-24","2028-12-25"],["newyear","2028-12-31","2029-01-01"]
];
var WIN=W.map(function(w){var d=D(w[1],w[2]);return {k:w[0],s:d[0],e:d[1]};});
var forced=null;
try{var q=(location.search.match(/[?&]fest=([a-z]+)/)||[])[1];
 if(q==="off")sessionStorage.removeItem("fsForce");else if(q&&F[q])sessionStorage.setItem("fsForce",q);
 forced=sessionStorage.getItem("fsForce");}catch(e){}
function curKey(){if(forced&&F[forced])return forced;var n=Date.now();for(var i=0;i<WIN.length;i++)if(n>=WIN[i].s&&n<WIN[i].e)return WIN[i].k;return null;}
function cur(){var k=curKey();if(!k)return null;var f=F[k];f.key=k;return f;}
window.__fest={cur:cur,all:F,windows:WIN};
if(!curKey())return;

var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var st=document.createElement("style");
st.id="fsCss";
st.textContent="#fsFx{position:fixed;left:0;top:0;width:100%;pointer-events:none;z-index:17}#fsStrip{margin:-2px 0 4px;pointer-events:none;overflow:hidden}#fsStrip svg{display:block}"
+".fsGar{position:relative;height:50px;margin:0 6px}.fsGar:before{content:'';position:absolute;left:0;right:0;top:5px;height:18px;border-top:1.2px solid rgba(var(--fsA),.55);border-radius:50%}"
+".fsGar span{position:absolute;top:10px;font-size:22px;line-height:26px;transform-origin:50% 0;animation:fsSw 2.2s ease-in-out infinite alternate;filter:drop-shadow(0 0 6px rgba(var(--fsA),.7))}"
+"@keyframes fsSw{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}"
+".dwFl{transform-box:fill-box;transform-origin:50% 100%;animation:dwFl 1.1s ease-in-out infinite alternate}.dwGl{animation:dwGl 1.6s ease-in-out infinite alternate}@keyframes dwFl{from{transform:scale(.9,.92) rotate(-3deg)}to{transform:scale(1.08,1.12) rotate(3deg)}}@keyframes dwGl{from{opacity:.55}to{opacity:1}}"
+"#mini{box-shadow:0 0 0 1.5px rgba(var(--fsA),.65),0 0 18px rgba(var(--fsA),.4),0 6px 24px rgba(0,0,0,.5)!important}"
+"@media (prefers-reduced-motion:reduce){.fsGar span,.dwFl,.dwGl{animation:none}}";
document.head.appendChild(st);

function strip(f){
 if(f.deco==="diya"){var n=7,vw=360,vh=58,h='<svg viewBox="0 0 '+vw+' '+vh+'" width="100%" aria-hidden="true" focusable="false"><defs><radialGradient id="dwG"><stop offset="0" stop-color="#ffc04d" stop-opacity=".75"/><stop offset="1" stop-color="#ff8c00" stop-opacity="0"/></radialGradient><linearGradient id="dwC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0792e"/><stop offset="1" stop-color="#8f3a12"/></linearGradient></defs><path d="M0 6 Q'+(vw/2)+' 24 '+vw+' 6" fill="none" stroke="rgba(255,196,90,.55)" stroke-width="1.2"/>';
  for(var i=0;i<n;i++){var t=(i+.5)/n,x=t*vw,y=6+(1-Math.pow(2*t-1,2))*9+6;
   h+='<g transform="translate('+x.toFixed(1)+' '+(y+10).toFixed(1)+')"><line x1="0" y1="-16" x2="0" y2="-8" stroke="rgba(255,196,90,.5)" stroke-width="1"/><circle class="dwGl" cy="-3" r="17" fill="url(#dwG)" style="animation-delay:-'+(i*.43).toFixed(2)+'s"/><path d="M-11 0 Q0 13 11 0 Q0 3 -11 0Z" fill="url(#dwC)"/><ellipse cx="0" cy="0" rx="11" ry="2.6" fill="#f0a35c"/><g class="dwFl" style="animation-delay:-'+(i*.31).toFixed(2)+'s"><path d="M0 -17 C5 -10 4.5 -5 0 -2.5 C-4.5 -5 -5 -10 0 -17Z" fill="#ffcf5a"/><ellipse cx="0" cy="-6.5" rx="1.5" ry="3.4" fill="#fff4c8"/></g></g>';}
  return h+'</svg>';}
 var it=f.deco.split(" "),n2=it.length,h2='<div class="fsGar">';
 for(var j=0;j<n2;j++){var tt=(j+.5)/n2,left=(tt*100).toFixed(1),dy=Math.round((1-Math.pow(2*tt-1,2))*9);
  h2+='<span style="left:calc('+left+'% - 12px);top:'+(8+dy)+'px;animation-delay:-'+(j*.37).toFixed(2)+'s">'+it[j]+'</span>';}
 return h2+'</div>';}

var C=document.createElement("canvas");C.id="fsFx";document.body.appendChild(C);
var X=C.getContext("2d"),dpr=Math.min(2,window.devicePixelRatio||1),W_=0,H_=0,P=[],T=0,last=0,raf=0,top=0,fx="stars";
function pcolor(k){var pal={color:["#ff3d7f","#ffd23f","#3ddc84","#3da5ff","#b24dff","#ff8c1a"],tricolor:["#ff9933","#ffffff","#138808"],confetti:["#ffd23f","#ff5c8a","#4dd0ff","#7cff6b","#ffffff"],petals:["#ff9f1c","#ffbf00","#ff7a00","#f4511e","#ff6f91"],snow:["#ffffff","#dff2ff"],stars:["#ffe9a8"]}[k]||["#fff"];return pal[Math.floor(Math.random()*pal.length)];}
function mk(init){return {x:Math.random()*W_,y:init?Math.random()*H_:-8,vy:12+Math.random()*26,vx:(Math.random()-.5)*10,r:1.5+Math.random()*3.2,a:Math.random()*6,va:(Math.random()-.5)*3,c:pcolor(fx),ph:Math.random()*6,sy:Math.random()*(H_||100)};}
function size(){top=0;try{var p=document.createElement("div");p.style.cssText="position:fixed;top:0;padding-top:env(safe-area-inset-top);visibility:hidden";document.body.appendChild(p);top=p.getBoundingClientRect().height;p.remove();}catch(e){}
 W_=window.innerWidth;H_=top+120;C.width=W_*dpr;C.height=H_*dpr;C.style.height=H_+"px";X.setTransform(dpr,0,0,dpr,0,0);P=[];var n=fx==="stars"?14:22;for(var i=0;i<n;i++)P.push(mk(true));}
function star(x,y,r,a){X.save();X.globalAlpha=a;X.fillStyle="#ffe9a8";X.beginPath();for(var i=0;i<8;i++){var rr=i%2?r*.35:r,an=i*Math.PI/4;X.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr);}X.fill();X.restore();}
function draw(dt){X.clearRect(0,0,W_,H_);
 for(var i=0;i<P.length;i++){var p=P[i];
  if(fx==="stars"){star(p.x,p.sy,p.r*1.3,.2+.45*Math.abs(Math.sin(T*1.6+p.ph)));continue;}
  p.y+=p.vy*dt;p.x+=(p.vx+Math.sin(T+p.ph)*8)*dt;p.a+=p.va*dt;if(p.y>H_+8)P[i]=mk(false);
  X.save();X.translate(p.x,p.y);X.rotate(p.a);X.globalAlpha=Math.max(0,Math.min(1,(H_-p.y)/40))*.9;X.fillStyle=p.c;
  if(fx==="snow"){X.beginPath();X.arc(0,0,p.r*.9,0,6.3);X.fill();}
  else if(fx==="color"){X.beginPath();X.arc(0,0,p.r*1.4,0,6.3);X.fill();}
  else{X.beginPath();X.ellipse(0,0,p.r*1.5,p.r*.8*Math.abs(Math.sin(p.a*2)+.3),0,0,6.3);X.fill();}
  X.restore();}}
function frame(ts){if(!curKey()){stop(true);return;}
 if(ts-last>=33){var dt=Math.min(.1,(ts-last)/1000);T+=dt;last=ts;draw(dt);}raf=requestAnimationFrame(frame);}
function stop(rm){cancelAnimationFrame(raf);raf=0;if(rm){C.remove();st.remove();var s=document.getElementById("fsStrip");if(s)s.remove();}}
function go(){if(reduce){draw(.016);return;}if(!raf)raf=requestAnimationFrame(frame);}
document.addEventListener("visibilitychange",function(){if(document.hidden)stop(false);else{if(!curKey()){stop(true);return;}go();}});
window.addEventListener("resize",function(){size();if(reduce)draw(.016);});

var shown=null;
function ensure(){
 var f=cur(),v=document.getElementById("view");if(!v)return;
 var ex=document.getElementById("fsStrip"),hd=v.querySelector(":scope > h1.hrow");
 if(!f){if(ex)ex.remove();return;}
 if(shown!==f.key){shown=f.key;fx=f.fx;document.documentElement.style.setProperty("--fsA",f.accent);if(ex)ex.remove();ex=null;size();}
 if(!hd){if(ex)ex.remove();return;}
 if(ex&&ex.previousElementSibling===hd)return;
 if(ex)ex.remove();
 var el=document.createElement("div");el.id="fsStrip";el.innerHTML=strip(f);hd.after(el);}
function boot(){var f=cur();document.documentElement.style.setProperty("--fsA",f.accent);fx=f.fx;shown=f.key;size();go();ensure();var v=document.getElementById("view");if(v)new MutationObserver(ensure).observe(v,{childList:true});setInterval(ensure,4000);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
