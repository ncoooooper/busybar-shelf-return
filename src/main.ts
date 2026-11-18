import {desk} from "@shared/desk";
import {wrap} from "@shared/surface";
let loans=[{name:"Library book",due:"2026-11-20"},{name:"Tripod",due:"2026-11-26"}];
type S={closed:string[];index:number;history:boolean};
function key(x:{name:string;due:string}){return x.name+"|"+x.due;}
function list(s:S){return loans.filter(x=>s.closed.includes(key(x))===s.history);}
desk<S>({name:"Shelf Return",accent:"#ECA64C",motion:{"motif":"bookmark","color":"#ECA64C","shine":"#FFF0BB"},initial:()=>({closed:[],index:0,history:false}),configure:(s,v)=>{
 const items=String(v.loans||"").split(";").map(t=>t.split("|")).filter(a=>a[0]?.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(a[1]?.trim()||""));
 loans=items.slice(0,8).map(a=>({name:a[0].trim(),due:a[1].trim()})).sort((a,b)=>a.due<b.due?-1:a.due>b.due?1:0);s.index=0;},
 render:(s,now)=>{const a=list(s),x=a[s.index%Math.max(1,a.length)];const t=new Date(now);const d=x?Date.parse(x.due+"T00:00:00Z")-Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()):0;
 const days=Math.round(d/86400000);return {title:s.history?"Returned":"Return by",value:x?(days<0?-days+"d late":days===0?"Today":days+" days"):"All clear",
 lines:[x?.name||"No items in this view",x?.due||"Edit loans in settings",(s.index+Number(!!x))+" / "+a.length,
 "Wheel: choose loan",s.history?"Click: reopen loan":"Click: mark returned","Start: returned / pending"]};},
 action:(s,k)=>{const a=list(s);if(k==="start"){s.history=!s.history;s.index=0;return;}if(!a.length)return;
 if(k==="up"||k==="down")s.index=wrap(s.index+(k==="up"?1:-1),a.length);if(k==="ok"){const x=key(a[s.index%a.length]);s.closed=s.history?s.closed.filter(t=>t!==x):s.closed.concat(x).slice(-40);s.index=0;}}});
