import fs from 'node:fs';
import assert from 'node:assert/strict';
import clipping from 'polygon-clipping';
import {geoArea} from 'd3-geo';
const filename='public/syria.geojson';
const geo=JSON.parse(fs.readFileSync(filename));
const feature=geo.features.find(f=>f.properties.province_name==='Quneitra');
if(feature.geometry.type==='MultiPolygon'){
 const before=geoArea(feature);const polygons=clipping.union(...feature.geometry.coordinates);
 assert.equal(polygons.length,1,'Do not bridge disjoint geometry or remove territory.');
 for(const polygon of polygons){if(geoArea({type:'Polygon',coordinates:polygon})>Math.PI*2)polygon.forEach(r=>r.reverse())}
 const geometry={type:'Polygon',coordinates:polygons[0]};
 assert(Math.abs(geoArea({...feature,geometry})-before)<1e-12,'Province coverage must remain unchanged.');
 feature.geometry=geometry;fs.writeFileSync(filename,JSON.stringify(geo));
 console.log('Merged the shared internal boundary; province area is unchanged.');
}else console.log('Quneitra already has one exterior polygon.');
