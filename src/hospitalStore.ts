import {geoContains} from 'd3-geo';
import {provinces,serviceOptions,type Hospital} from './data';
export const STORAGE_KEY='atlas-hospitals';
export function validateHospitals(value:unknown,geo:any):asserts value is Hospital[]{
 if(!Array.isArray(value)||value.length>10000)throw new Error('يجب أن يحتوي الملف على قائمة مشافٍ، بحد أقصى ١٠٬٠٠٠ سجل.');
 const ids=new Set<string>();
 for(const h of value){
  const feature=geo.features.find((f:any)=>f.properties.province_name===h?.province);
  if(!h||typeof h.id!=='string'||!h.id||h.id.length>150||ids.has(h.id)||!feature||typeof h.name!=='string'||!h.name.trim()||h.name.length>120||typeof h.kind!=='string'||!h.kind.trim()||h.kind.length>80||typeof h.description!=='string'||h.description.length>1000||!Number.isInteger(h.beds)||h.beds<0||h.beds>5000||!Number.isInteger(h.staff)||h.staff<0||h.staff>10000||!Array.isArray(h.services)||h.services.some((s:unknown)=>typeof s!=='string'||!serviceOptions.includes(s))||new Set(h.services).size!==h.services.length||!Array.isArray(h.position)||h.position.length!==2||!h.position.every((n:unknown)=>typeof n==='number'&&Number.isFinite(n))||Math.abs(h.position[0])>180||Math.abs(h.position[1])>90||!geoContains(feature,h.position))throw new Error('تحقق من حقول المشافي، وعدم تكرار المعرّفات، ووقوع كل موقع داخل محافظته.');
  ids.add(h.id);
 }
}
export function provinceCounts(hospitals:Hospital[]){return provinces.map(p=>({...p,count:hospitals.filter(h=>h.province===p.id).length}))}
