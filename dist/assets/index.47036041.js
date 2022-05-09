var B=Object.defineProperty;var W=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,J=Object.prototype.propertyIsEnumerable;var O=(t,e,l)=>e in t?B(t,e,{enumerable:!0,configurable:!0,writable:!0,value:l}):t[e]=l,w=(t,e)=>{for(var l in e||(e={}))F.call(e,l)&&O(t,l,e[l]);if(W)for(var l of W(e))J.call(e,l)&&O(t,l,e[l]);return t};const U=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))v(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&v(a)}).observe(document,{childList:!0,subtree:!0});function l(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerpolicy&&(i.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?i.credentials="include":s.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function v(s){if(s.ep)return;s.ep=!0;const i=l(s);fetch(s.href,i)}};U();const X=document.querySelector(".for-canvas"),H=document.querySelector(".pen"),T=document.querySelector(".pen-color"),S=document.querySelector(".pen-slider"),I=document.querySelector(".bucket-color"),j=document.querySelector(".eraser"),Y=document.querySelector(".clear"),x=document.querySelector(".save-image"),N=document.querySelectorAll(".header-icons-styles"),d=document.querySelector(".selected-tools"),K=document.querySelector(".save-storage"),G=document.querySelector(".load-storage"),Q=document.querySelector(".delete-storage"),V=document.querySelector(".undo"),Z=document.querySelector(".redo"),_=document.querySelector("header"),r=document.createElement("canvas");r.id="canvas";const n=r.getContext("2d");let g=10,E="#fff",m="#000000",y=!1,b=!1,o=[],u=-1,c=[],P=!1;I.addEventListener("input",()=>{E=I.firstElementChild.value,p(),L()});T.addEventListener("input",()=>{y=!1,m=T.firstElementChild.value});j.addEventListener("click",()=>{d.textContent="Eraser",y=!0,N.forEach(t=>{t.classList.contains("selected-icon-style")&&t.classList.remove("selected-icon-style")}),j.classList.add("selected-icon-style"),m=E,g=50,S.firstElementChild.value=g});S.addEventListener("change",()=>{g=S.firstElementChild.value});H.addEventListener("click",f);V.addEventListener("click",$);Z.addEventListener("click",ee);function $(){u<0||(u--,p(),L(),d.textContent="Undo",setTimeout(f,1e3))}function ee(){o.length-1!==u&&(u++,p(),L(),d.textContent="Redo",setTimeout(f,1e3))}function f(){y=!1,d.textContent="Pen",m=T.firstElementChild.value,g=10,N.forEach(t=>{t.classList.contains("selected-icon-style")&&t.classList.remove("selected-icon-style")}),H.classList.add("selected-icon-style"),S.firstElementChild.value=g}function p(){r.width=window.innerWidth*.95,r.height=window.innerHeight-_.offsetHeight-50,n.fillStyle=E,n.fillRect(0,0,r.width,r.height),X.appendChild(r),f()}function te(){if(o.length===0)return;let t=r.offsetWidth,e=r.offsetHeight,l=o[0][0].h,v=o[0][0].w,s=t/v,i=e/l;for(let a=0;a<o.length;a++)for(let h=0;h<o[a].length;h++)o[a][h].w=t,o[a][h].h=e,o[a][h].x*=s,o[a][h].y*=i,o[a][h].size*=(i+s)/2}window.addEventListener("resize",()=>{p(),console.log("Hello"),te(),L()});p();function L(){for(let t=0;t<=u;t++)for(let e=1;e<o[t].length;e++)n.beginPath(),n.moveTo(o[t][e-1].x,o[t][e-1].y),n.lineWidth=o[t][e-1].size,n.lineCap="round",o[t][e-1].erase?n.strokeStyle=E:n.strokeStyle=o[t][e-1].color,n.lineTo(o[t][e].x,o[t][e].y),n.stroke()}function R(t,e,l,v,s,i,a){const h={x:t,y:e,size:l,color:v,erase:s,h:i,w:a};o.length!=u&&(o=o.splice(0,u+1)),c.push(h)}Y.addEventListener("click",()=>{p(),o=[],d.textContent="Canvas Cleared",setTimeout(f,1500)});function z(t){const e=r.getBoundingClientRect();return{x:t.clientX-e.left,y:t.clientY-e.top,h:e.height,w:e.width}}r.addEventListener("mousedown",t=>{b=!0;const e=z(t);n.moveTo(e.x,e.y),n.beginPath(),n.lineWidth=g,n.lineCap="round",n.strokeStyle=m,c=[]});r.addEventListener("mousemove",t=>{if(b){const e=z(t);n.lineTo(e.x,e.y),n.stroke(),R(e.x,e.y,g,m,y,e.h,e.w)}});r.addEventListener("mouseup",t=>{if(c.length!==0){if(c.length===1){const e=w({},c[0]);e.x+=1e-4,c.push(e),console.log(c)}o.push(c),u=o.length-1}b=!1});function M(t){const e=r.getBoundingClientRect();return{x:t.touches[0].clientX-e.left,y:t.touches[0].clientY-e.top,h:e.height,w:e.width}}r.addEventListener("touchstart",t=>{P=!0;const e=M(t);n.moveTo(e.x,e.y),n.beginPath(),n.lineWidth=g,n.lineCap="round",n.strokeStyle=m,c=[]});r.addEventListener("touchmove",t=>{if(P){const e=M(t);n.lineTo(e.x,e.y),n.stroke(),R(e.x,e.y,g,m,y,e.h,e.w)}});r.addEventListener("touchend",t=>{if(c.length!==0){if(c.length===1){const e=w({},c[0]);e.x+=1e-4,c.push(e),console.log(c)}o.push(c),u=o.length-1}P=!1});K.addEventListener("click",()=>{localStorage.setItem("saveCanvas",JSON.stringify(o)),d.textContent="Canvas Saved",setTimeout(f,1500)});G.addEventListener("click",()=>{localStorage.getItem("saveCanvas")?(o=JSON.parse(localStorage.saveCanvas),u=o.length-1,d.textContent="Canvas Loaded",L(),setTimeout(f,1500)):(d.textContent="Canvas Not Found",setTimeout(f,1500))});Q.addEventListener("click",()=>{localStorage.removeItem("saveCanvas"),d.textContent="Cleared Local Storage",setTimeout(f,1500)});x.addEventListener("click",()=>{x.firstElementChild.href=r.toDataURL("image/jpeg",1),x.firstElementChild.download="paint-example.jpeg",d.textContent="Image File Saved",setTimeout(f,1500)});const A=document.querySelector(".bucket-set"),C=document.querySelector(".bucket-color-wrapper"),oe=document.querySelector(".pen-tool"),k=document.querySelector(".pen-tools-wrapper"),D=document.querySelector(".drop-menu"),q=document.querySelector(".drop-menu-items-container");console.log(C,A);A.addEventListener("click",()=>{C.classList.toggle("invisible"),C.classList.toggle("scale-0"),C.classList.toggle("-translate-x-[100%]")});oe.addEventListener("click",()=>{k.classList.toggle("invisible"),k.classList.toggle("scale-0"),k.classList.toggle("-translate-x-[70%]")});D.addEventListener("click",()=>{D.firstElementChild.classList.toggle("-rotate-90"),q.classList.toggle("translate-x-[45%]"),q.classList.toggle("-translate-y-[70%]"),q.classList.toggle("scale-0")});