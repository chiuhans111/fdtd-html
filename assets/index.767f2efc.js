import{t as b,c as H,a as N,d as V,b as z,s as O,r as $,m as L,e as E,f as A,z as v,o as P,k as R,g as C,h as U,i as k,j as M,l as q,n as g,p as w,q as s,u as D,w as m,v as X,x as p,F as T,y as Y,A as Z,B as G,C as K,D as W,E as J,G as Q,H as j}from"./vendor.0a345d73.js";const tt=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const i of d.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerpolicy&&(d.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?d.credentials="include":l.crossorigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function o(l){if(l.ep)return;l.ep=!0;const d=a(l);fetch(l.href,d)}};tt();function et(t,e,a,o,l){let n=b(()=>{const r=t.E.slice([0,1,0]).pad([[0,0],[0,1],[0,0]]).sub(t.E),_=t.E.slice([1,0,0]).pad([[0,1],[0,0],[0,0]]).sub(t.E),f=H([_.gather(2,2).expandDims(2),r.gather(2,2).expandDims(2).mul(-1),r.gather(1,2).sub(_.gather(0,2)).expandDims(2)],2);return N(t.H.sub(f.div(e).div(t.u).mul(a).mul(t.dilation)).mul(t.attenuation).mul(t.absorption).mul(.9999),-1e10,1e10)});V(t.H),t.H=n,n=b(()=>{const r=t.H.sub(t.H.slice([0,0,0],[-1,t.H.shape[1]-1,-1]).pad([[0,0],[1,0],[0,0]])),_=t.H.sub(t.H.slice([0,0,0],[t.H.shape[0]-1,-1,-1]).pad([[1,0],[0,0],[0,0]])),f=H([_.gather(2,2).expandDims(2),r.gather(2,2).expandDims(2).mul(-1),r.gather(1,2).sub(_.gather(0,2)).expandDims(2)],2);return t.E.add(t.emission.mul(z(o*l)).mul(l/10).mul(a).pad([[0,0],[0,0],[2,0]])).add(f.div(e).div(t.e).mul(a).mul(t.dilation)).mul(t.absorption).mul(t.attenuation)}),V(t.E),t.E=n,n=b(()=>{let r=t.E.gather(2,2).expandDims(2);return H([r.mul(z(o*l)),r.mul(O(o*l))],2).mul(a).add(t.power).mul(.998)}),V(t.power),t.power=n}function st(t=600,e=400,a=40,o=1,l=.3){this.t=0,this.dx=o,this.dt=l,this.settings={wavelength:10},this.pixel_W=t,this.pixel_H=e,this.sim_W=t+a*2,this.sim_H=e+a*2;const d=this.sim_W*o,i=this.sim_H*o,x=$(0,this.sim_W).mul(o).cast("float32"),n=$(0,this.sim_H).mul(o).cast("float32"),r=L(x,n);console.log(r[0]);const _=E(E(r[0],r[1]),E(A(d,r[0]),A(i,r[1]))).div(a).clipByValue(0,1),f=_.sub(1).abs().mul(-.05).exp().expandDims(2),B=_.sub(1).abs().mul(-.1).exp().expandDims(2);this.fields={E:v([this.sim_H,this.sim_W,3]),H:v([this.sim_H,this.sim_W,3]),e:P([this.sim_H,this.sim_W,1]),u:P([this.sim_H,this.sim_W,1]),power:v([this.sim_H,this.sim_W,2]),gx:r[0],gy:r[1],dilation:f,attenuation:B,absorption:v([this.sim_H,this.sim_W,1]),emission:v([this.sim_H,this.sim_W,1])},this.clear=function(){this.t=0,this.fields.E.dispose(),this.fields.E=v([this.sim_H,this.sim_W,3]),this.fields.H.dispose(),this.fields.H=v([this.sim_H,this.sim_W,3]),this.fields.power.dispose(),this.fields.power=v([this.sim_H,this.sim_W,2])},this.update=function(){const F=2*Math.PI/this.settings.wavelength,I=Math.min(.5,this.settings.wavelength/10);for(let y=0;y<5;y++)this.t+=I,et(this.fields,this.dx,I,this.t,F);for(let y in this.fields)this.fields[y]=R(this.fields[y])}}const it=C.fabric.util.createClass(C.fabric.Object,{type:"grating",period:20,fillfactor:.5,initialize:function(t){this.callSuper("initialize",t)},_render:function(t){if(this.period==0)return;t.beginPath();const e=this.period/this.scaleX,a=Math.min(this.width/e/2,100);for(let o=-a;o<a;o++)t.rect(0+e*o,-this.height/2,this.fillfactor*e,this.height);this._renderPaintInOrder(t)}});var nt=(t,e)=>{const a=t.__vccOpts||t;for(const[o,l]of e)a[o]=l;return a};function at(t){return b(()=>{const a=t.div(.1).expandDims(2);return H([a,a.abs().mul(.5),a.mul(-1)],2).clipByValue(0,1)})}function ot(t){return b(()=>{const e=t.mul(.5).pow(2).sum(2).expandDims(2).log().mul(.3);return H([e.mul(1),e.mul(.6),e.mul(.4)],2).clipByValue(0,1)})}function S(t,e=1.33,a=0,o=0){t.index=e,t.absorption=a,t.emission=o,t.cornerSize=6}const c=new st;window.fields=c.fields;let u=null;const lt={data(){return{canvas:null,ctx:null,alive:!0,t:0,canvas2:document.createElement("Canvas"),ctx2:null,pause:!1,selected_object:[],wavelength:10,integrate_mode:!1}},mounted(){this.canvas=this.$refs.canvas,this.ctx=this.canvas.getContext("2d"),this.ctx2=this.canvas2.getContext("2d"),this.canvas.width=c.sim_W,this.canvas.height=c.sim_H,this.canvas2.width=c.sim_W,this.canvas2.height=c.sim_H,u=new C.fabric.Canvas(this.$refs.canvas_fabric),console.log(u),u.setHeight(c.sim_H),u.setWidth(c.sim_W),window.canvas_fabric=u;const t=this.canvas2,e=this.ctx2;e.clearRect(0,0,this.canvas.width,this.canvas.height),e.fillStyle="blue",e.beginPath(),e.ellipse(t.width/2,t.height/2,5,5,0,0,Math.PI*2),e.fill(),c.fields.E=U(t).cast("float32").div(255),this.update(),u.on("mouse:down",this.mousedown),u.on("object:modified",this.modified),u.on("selection:created",this.selected),u.on("selection:updated",this.selected)},unmounted(){this.alive=!1},methods:{layerUp(t){u.bringForward(k(t),!0)},layerDown(t){u.sendBackwards(k(t),!0)},add(t){if(t=="circle"){const e=new C.fabric.Circle({fill:"red",width:100,height:100,radius:100});S(e),u.add(e)}else if(t=="rect"){const e=new C.fabric.Rect({fill:"red",width:100,height:100});S(e),u.add(e)}else if(t=="grating"){const e=new it({fill:"red",width:100,height:100});S(e),u.add(e)}},del(t){console.log("delete",t),u.remove(k(t)),this.selected_object=this.selected_object.filter(e=>e!==t),this.$forceUpdate()},clear(){c.clear()},selected(t){console.log(t),this.selected_object=t.selected,this.$forceUpdate()},modified(t){console.log(t),this.$forceUpdate()},mousedown(t){if(t.target)return;const e=t.pointer.x,a=t.pointer.y,o=this.ctx2,l=this.canvas2;o.clearRect(0,0,this.canvas.width,this.canvas.height),o.fillStyle="white",o.beginPath(),o.ellipse(e,a,3,3,0,0,Math.PI*2),o.fill();let d=b(()=>c.fields.E.add(U(l).cast("float32").div(255)));V(c.fields.E),c.fields.E=d},update(){if(this.alive&&setTimeout(this.update,30),this.pause)return;let t=b(()=>{let e=u.getObjects(),a=1,o=.1,l=.1;for(let r of e)a=Math.max(r.index,a),o=Math.max(r.absorption,o),l=Math.max(r.emission,l);for(let r of e){let _=r.fill;r.fill="rgb("+[r.index/a,r.emission/l,r.absorption/o].map(f=>(f*255).toString()).join(",")+")",r.fill!==_&&(r.dirty=!0),a=Math.max(r.index,a)}u.renderAll();let d=U(u.toCanvasElement()).cast("float32").div(255),i=d.gather(0,2).expandDims(2).mul(a).maximum(1).pow(2),x=d.gather(2,2).expandDims(2).mul(o).sub(1).abs(),n=d.gather(1,2).expandDims(2).mul(l);return[i,x,n]});V([c.fields.e,c.fields.absorption,c.fields.emission]),c.fields.e=t[0],c.fields.absorption=t[1],c.fields.emission=t[2],u.requestRenderAll(),M().startScope(),c.update(),this.integrate_mode?q(ot(c.fields.power),this.canvas):q(at(c.fields.E.gather(2,2)),this.canvas),M().endScope()}},watch:{wavelength(){console.log("wavelength changed to",this.wavelength),c.settings.wavelength=this.wavelength}}},h=t=>(G("data-v-692c8df8"),t=t(),K(),t),dt={class:"container"},rt={class:"canvas-container"},ct={id:"fabric",ref:"canvas_fabric"},ut={id:"wave",ref:"canvas"},ht=Z("<div data-v-692c8df8><h2 data-v-692c8df8>How to use?</h2><div data-v-692c8df8><h4 data-v-692c8df8>Basic Interactions:</h4><ul data-v-692c8df8><li data-v-692c8df8>Click around and make ripple of waves. </li><li data-v-692c8df8>Add shapes, drag to transform, click on shapes to open menu.</li></ul></div><div data-v-692c8df8><h4 data-v-692c8df8>Simulation Controls:</h4><ul data-v-692c8df8><li data-v-692c8df8>&quot;Clear&quot; waves, &quot;Pause/Continue&quot; simulation.</li><li data-v-692c8df8>&quot;Integrate&quot; the intensity of the wave, change the &quot;Wavelength&quot; of the wave. </li></ul></div><div data-v-692c8df8><h4 data-v-692c8df8>Shape Settings:</h4><ul data-v-692c8df8><li data-v-692c8df8>Index: index of refraction.</li><li data-v-692c8df8>Absorption: 0=no absorption, 0.1=decay, 1=reflection</li><li data-v-692c8df8>Emission: amplitude of the excitation.</li></ul></div></div>",1),mt={class:"menu"},pt={class:"row"},_t={class:"row"},vt=h(()=>s("label",{for:"integrate"},"Integrate Mode",-1)),ft={class:"row"},gt=h(()=>s("label",{for:"wavelength"},"wavelength: ",-1)),wt={class:"row"},bt={class:"row"},xt=h(()=>s("label",null,"x: ",-1)),yt=["onUpdate:modelValue"],Ht=h(()=>s("label",null,"y: ",-1)),Vt=["onUpdate:modelValue"],Ct={class:"row"},Et=h(()=>s("label",null,"ScaleX: ",-1)),Ut=["onUpdate:modelValue"],kt=h(()=>s("label",null,"ScaleY: ",-1)),Dt=["onUpdate:modelValue"],St={class:"row"},Wt=h(()=>s("label",null,"Angle: ",-1)),It=["onUpdate:modelValue"],zt={class:"row"},$t=h(()=>s("label",null,"Index: ",-1)),At=["onUpdate:modelValue"],Pt={class:"row"},Mt=h(()=>s("label",null,"Absorption: ",-1)),qt=["onUpdate:modelValue"],Bt={class:"row"},Ft=h(()=>s("label",null,"Emission: ",-1)),Nt=["onUpdate:modelValue"],Ot={key:0,class:"row"},Lt=h(()=>s("label",null,"Period: ",-1)),Rt=["onUpdate:modelValue","onInput"],Xt=h(()=>s("label",null,"FillFactor: ",-1)),Tt=["onUpdate:modelValue","onInput"],Yt={class:"row"},Zt=h(()=>s("p",null,"Arrangement:",-1)),Gt=["onClick"],Kt=["onClick"],Jt=["onClick"];function Qt(t,e,a,o,l,d){return g(),w("div",null,[s("div",dt,[s("div",null,[s("div",rt,[s("canvas",ct,null,512),s("canvas",ut,null,512)]),ht]),s("div",null,[s("div",mt,[s("div",pt,[s("button",{onClick:e[0]||(e[0]=(...i)=>d.clear&&d.clear(...i))},"Clear"),t.pause?D("",!0):(g(),w("button",{key:0,onClick:e[1]||(e[1]=i=>t.pause=!0)},"Pause")),t.pause?(g(),w("button",{key:1,onClick:e[2]||(e[2]=i=>t.pause=!1)},"Continue")):D("",!0)]),s("div",_t,[m(s("input",{type:"checkbox",name:"integrate",id:"integrate","onUpdate:modelValue":e[3]||(e[3]=i=>t.integrate_mode=i)},null,512),[[X,t.integrate_mode]]),vt]),s("div",ft,[gt,m(s("input",{type:"text",name:"wavelength","onUpdate:modelValue":e[4]||(e[4]=i=>t.wavelength=i),size:"6"},null,512),[[p,t.wavelength,void 0,{number:!0}]])]),s("div",wt,[s("button",{onClick:e[5]||(e[5]=i=>d.add("rect"))},"Add Rect"),s("button",{onClick:e[6]||(e[6]=i=>d.add("circle"))},"Add Circle"),s("button",{onClick:e[7]||(e[7]=i=>d.add("grating"))},"Add Grating")]),(g(!0),w(T,null,Y(t.selected_object,(i,x)=>(g(),w("div",{class:"menu_obj",key:x},[W(J(i)+" ",1),s("div",bt,[xt,m(s("input",{type:"text","onUpdate:modelValue":n=>i.left=n,size:"6"},null,8,yt),[[p,i.left,void 0,{number:!0}]]),Ht,m(s("input",{type:"text","onUpdate:modelValue":n=>i.top=n,size:"6"},null,8,Vt),[[p,i.top,void 0,{number:!0}]])]),s("div",Ct,[Et,m(s("input",{type:"text","onUpdate:modelValue":n=>i.scaleX=n,size:"6"},null,8,Ut),[[p,i.scaleX]]),kt,m(s("input",{type:"text","onUpdate:modelValue":n=>i.scaleY=n,size:"6"},null,8,Dt),[[p,i.scaleY,void 0,{number:!0}]])]),s("div",St,[Wt,m(s("input",{type:"text","onUpdate:modelValue":n=>i.angle=n,size:"6"},null,8,It),[[p,i.angle,void 0,{number:!0}]])]),s("div",zt,[$t,m(s("input",{type:"text","onUpdate:modelValue":n=>i.index=n,size:"6"},null,8,At),[[p,i.index,void 0,{number:!0}]])]),s("div",Pt,[Mt,m(s("input",{type:"text","onUpdate:modelValue":n=>i.absorption=n,size:"6"},null,8,qt),[[p,i.absorption,void 0,{number:!0}]])]),s("div",Bt,[Ft,m(s("input",{type:"text","onUpdate:modelValue":n=>i.emission=n,size:"6"},null,8,Nt),[[p,i.emission,void 0,{number:!0}]])]),i.type=="grating"?(g(),w("div",Ot,[Lt,m(s("input",{type:"text","onUpdate:modelValue":n=>i.period=n,size:"6",onInput:n=>i.dirty=!0},null,40,Rt),[[p,i.period,void 0,{number:!0}]]),Xt,m(s("input",{type:"text","onUpdate:modelValue":n=>i.fillfactor=n,size:"6",onInput:n=>i.dirty=!0},null,40,Tt),[[p,i.fillfactor,void 0,{number:!0}]])])):D("",!0),s("div",Yt,[Zt,s("button",{onClick:n=>d.layerUp(i)},"UP",8,Gt),s("button",{onClick:n=>d.layerDown(i)},"DOWN",8,Kt)]),s("button",{onClick:n=>d.del(i)},"DELETE",8,Jt)]))),128))])])])])}var jt=nt(lt,[["render",Qt],["__scopeId","data-v-692c8df8"]]);const te={class:"main-container"},ee=s("h1",null,"FDTD simulator",-1),se={class:"main"},ie=s("div",null,[s("br"),s("hr"),s("p",null,[W("Developer: "),s("a",{href:"https://chiuhans111.github.io"},"Hans Chiu")]),s("p",null,[W("Repo: "),s("a",{href:"https://github.com/chiuhans111/fdtd-html"},"https://github.com/chiuhans111/fdtd-html")])],-1),ne={__name:"App",setup(t){return(e,a)=>(g(),w("div",te,[ee,s("div",se,[Q(jt)]),ie]))}};j(ne).mount("#app");