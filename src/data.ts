import {geoContains,geoCentroid} from 'd3-geo';
export const provinces = [
 ['Damascus','دمشق','damascus-sword','#5b8275',4],['Rif Dimashq','ريف دمشق','rif-dimashq-ghouta','#91a98a',3],['Aleppo','حلب','aleppo-citadel','#b9a779',4],['Homs','حمص','homs-clock','#c9b9a0',3],['Hamah','حماة','hama-norias','#8c9e82',2],['Lattakia','اللاذقية','latakia-triumph-arch','#76a49d',2],['Tartus','طرطوس','tartous-arwad','#a1b9a7',2],['Idlib','إدلب','idlib-ruweiha','#d4c49a',2],['Dayr Az Zawr','دير الزور','deir-ez-zor-bridge','#b4a286',2],['Ar Raqqah','الرقة','raqqa-baghdad-gate','#b6bca0',2],['Al Ḥasakah','الحسكة','hasakah-ain-diwar','#8aa28f',2],['Dar`a','درعا','daraa-omari-mosque','#c6ac92',2],['As Suwayda','السويداء','sweida-qanawat','#b19b9e',2],['Quneitra','القنيطرة','quneitra-beit-saida','#83a6a0',1]
].map(([id,name,icon,color,count])=>({id:String(id),name:String(name),icon:String(icon),color:String(color),count:Number(count)}));
export type Province = typeof provinces[number];
export type Hospital = {id:string;province:string;name:string;kind:string;services:string[];beds:number;staff:number;position:[number,number];description:string};
export const serviceOptions=['الطوارئ','الجراحة العامة','الأشعة والتصوير','العناية المركزة','المخابر','العيادات الخارجية'];
export function makeHospitals(features:any[]):Hospital[]{return provinces.flatMap((p)=>{
 const f=features.find((x:any)=>x.properties.province_name===p.id); if(!f)return [];
 // Select strictly interior synthetic locations, never real hospital coordinates.
 const coords:number[][]=[]; const walk=(a:any)=>{if(typeof a[0]==='number')coords.push(a);else a.forEach(walk)};walk(f.geometry.coordinates);
 const xs=coords.map(x=>x[0]),ys=coords.map(x=>x[1]); const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const used:[number,number][]=[];
 function interior(i:number):[number,number]{for(let t=0;t<600;t++){const x=minX+(maxX-minX)*(((t*73+i*31+21)%997)/997);const y=minY+(maxY-minY)*(((t*137+i*47+99)%991)/991);const pos:[number,number]=[x,y];if(geoContains(f,pos)&&used.every(u=>Math.hypot(u[0]-x,u[1]-y)>(maxX-minX)*.12)){used.push(pos);return pos}}return geoCentroid(f) as [number,number]}
 return Array.from({length:p.count},(_,i)=>({id:`${p.icon}-${i}`,province:p.id,name:`المشفى العسكري ${['الأول','الثاني','الثالث','الرابع'][i]} — ${p.name}`,kind:i%2?'مشفى تخصصي':'مشفى عام',services:serviceOptions.filter((_,j)=>j<3||(i+j)%2===0),beds:80+i*40,staff:45+i*18,position:interior(i),description:''}));
 })}
