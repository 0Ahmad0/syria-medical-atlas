import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const outputs=['src/.check-hospitals-data.mjs','src/.check-hospitals-store.mjs'];
try{
 for(const [i,source] of ['src/data.ts','src/hospitalStore.ts'].entries()){
  const code=ts.transpileModule(fs.readFileSync(source,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  fs.writeFileSync(outputs[i],code.replace("from './data'","from './.check-hospitals-data.mjs'"));
 }
 const {makeHospitals}=await import('../src/.check-hospitals-data.mjs');
 const {validateHospitals,provinceCounts}=await import('../src/.check-hospitals-store.mjs');
 const geo=JSON.parse(fs.readFileSync('public/syria.geojson','utf8'));
 const hospitals=makeHospitals(geo.features),first=hospitals[0];
 assert.doesNotThrow(()=>validateHospitals(hospitals,geo));
 assert.doesNotThrow(()=>validateHospitals([],geo));
 const invalid=[{...first,id:''},{...first,name:'   '},{...first,name:'x'.repeat(121)},{...first,kind:''},{...first,description:42},{...first,province:'unknown'},{...first,beds:-1},{...first,beds:1.5},{...first,beds:5001},{...first,staff:10001},{...first,staff:NaN},{...first,position:[0,0]},{...first,position:[first.position[0]+360,first.position[1]]},{...first,position:[Infinity,33]},{...first,position:[36]},{...first,services:['unknown']},{...first,services:['الطوارئ','الطوارئ']}];
 for(const record of invalid)assert.throws(()=>validateHospitals([record],geo));
 assert.throws(()=>validateHospitals([first,first],geo));
 assert.throws(()=>validateHospitals({},geo));
 const added={...first,id:'new-hospital',services:[],beds:0,staff:0};
 assert.doesNotThrow(()=>validateHospitals([...hospitals,added],geo));
 const counts=provinceCounts([...hospitals,added]);
 assert.equal(counts.find(p=>p.id===first.province).count,5);
 assert.equal(counts.reduce((n,p)=>n+p.count,0),hospitals.length+1);
 assert(provinceCounts([]).every(p=>p.count===0));
 console.log('PASS: valid records and empty lists, duplicate IDs, field limits, services, coordinate bounds and containment, live province counts.');
}finally{for(const path of outputs)if(fs.existsSync(path))fs.unlinkSync(path)}
