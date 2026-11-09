import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {geoContains,geoBounds,geoArea} from 'd3-geo';
const source=fs.readFileSync('src/data.ts','utf8');
fs.writeFileSync('src/.check-data.mjs',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
try{
const {provinces,makeHospitals}=await import('../src/.check-data.mjs');
const geo=JSON.parse(fs.readFileSync('public/syria.geojson'));const hospitals=makeHospitals(geo.features);
assert.equal(provinces.length,14);assert.equal(geo.features.length,14);assert.equal(hospitals.length,33);assert.equal(new Set(hospitals.map(h=>h.id)).size,hospitals.length);
for(const f of geo.features){assert(geoArea(f)<1);assert(provinces.some(p=>p.id===f.properties.province_name));}
for(const h of hospitals){const f=geo.features.find(f=>f.properties.province_name===h.province);assert(geoContains(f,h.position),`Hospital ${h.id} outside province`);assert(h.services.length>0);}
const quneitra=geo.features.find(f=>f.properties.province_name==='Quneitra');
assert.equal(quneitra.geometry.type,'Polygon','Quneitra must not contain a drawn internal division.');
assert(Math.abs(geoArea(quneitra)-0.00004137971938967179)<1e-12,'Quneitra coverage must remain equal to the original source.');
const b=geoBounds(geo);assert(b[0][0]>35&&b[1][0]<43&&b[0][1]>32&&b[1][1]<38);
for(const p of provinces){assert(fs.existsSync(`public/icons/${p.icon}.svg`));}
console.log(`PASS: ${provinces.length} province mappings, ${hospitals.length} unique synthetic hospitals, all positions inside boundaries, geographic bounds and local assets.`);
}finally{fs.unlinkSync('src/.check-data.mjs')}
