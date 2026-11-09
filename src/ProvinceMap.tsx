import {useState,useEffect,useRef,useMemo} from 'react';
import maplibregl from 'maplibre-gl';
import {geoCentroid,geoMercator,geoPath} from 'd3-geo';
import {Layers,RotateCcw} from 'lucide-react';
import type {Province,Hospital} from './data';
const markerSvg='<svg width="23" height="23" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 27V6h10v21M7 27V12h4m10 0h4v15M5 27h22M14 27v-6h4v6M14 12h4m-2-2v4M14 17h4"/></svg>';
export default function ProvinceMap({geo,province,hospitals,selected,onSelect,onReady}:{geo:any,province:Province,hospitals:Hospital[],selected:Hospital|null,onSelect:(h:Hospital)=>void,onReady:()=>void}){
 const ref=useRef<HTMLDivElement>(null),map=useRef<maplibregl.Map|null>(null);
 const [failed,setFailed]=useState(false),[roads,setRoads]=useState(true),[ready,setReady]=useState(false);
 const markers=useRef<{marker:maplibregl.Marker,id:string}[]>([]),bounds=useRef<maplibregl.LngLatBounds|null>(null);
 const selectRef=useRef(onSelect),readyRef=useRef(onReady),selectedRef=useRef(selected),hadSelection=useRef(false);
 selectRef.current=onSelect;readyRef.current=onReady;selectedRef.current=selected;
 const feature=geo.features.find((f:any)=>f.properties.province_name===province.id);
 function padding(withPanel:boolean){const w=ref.current?.clientWidth||window.innerWidth,h=ref.current?.clientHeight||window.innerHeight-64;if(!withPanel)return {top:90,bottom:50,left:55,right:55};return w>=900?{top:90,bottom:45,left:60,right:440}:{top:76,bottom:Math.max(45,Math.min(h-145,window.innerHeight*.57+24)),left:30,right:30}}
 function reset(){if(map.current&&bounds.current)map.current.fitBounds(bounds.current,{padding:padding(!!selectedRef.current),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:650})}
 useEffect(()=>{
  if(!ref.current)return;let m:maplibregl.Map|undefined,observer:ResizeObserver|undefined;let announced=false,disposed=false;const start=performance.now();const timers:ReturnType<typeof setTimeout>[]=[];
  const reveal=()=>{if(announced||disposed)return;announced=true;timers.push(setTimeout(()=>{if(!disposed)readyRef.current()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.max(0,650-(performance.now()-start))))};
  try{
   m=new maplibregl.Map({container:ref.current,style:{version:8,sources:{'base-map':{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'],tileSize:256,attribution:'Tiles © Esri — Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, © OpenStreetMap contributors, GIS User Community',maxzoom:20}},layers:[{id:'background',type:'background',paint:{'background-color':'#f1f3ed'}},{id:'street-map',type:'raster',source:'base-map',paint:{'raster-opacity':.65,'raster-saturation':-.8}}]},center:geoCentroid(feature) as [number,number],zoom:6,attributionControl:false});map.current=m;
   m.addControl(new maplibregl.NavigationControl({showCompass:false}),'bottom-left');m.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-right');
   m.on('error',e=>{if('sourceId' in e&&e.sourceId==='base-map')setRoads(false)});
   m.once('style.load',()=>{if(!m||disposed)return;m.addSource('provinces',{type:'geojson',data:geo});m.addLayer({id:'all-line',type:'line',source:'provinces',paint:{'line-color':'#9cae98','line-width':.7,'line-opacity':.35}});m.addSource('province',{type:'geojson',data:feature});m.addLayer({id:'province-fill',type:'fill',source:'province',paint:{'fill-color':province.color,'fill-opacity':.18}});m.addLayer({id:'province-border',type:'line',source:'province',paint:{'line-color':'#75917a','line-width':1.2}});
    const b=new maplibregl.LngLatBounds();function visit(a:any){if(typeof a[0]==='number')b.extend(a as [number,number]);else a.forEach(visit)}visit(feature.geometry.coordinates);bounds.current=b;m.fitBounds(b,{padding:padding(!!selectedRef.current),duration:0});setReady(true);m.once('idle',reveal);timers.push(setTimeout(reveal,1400));
   });
   observer=new ResizeObserver(()=>{m?.resize();if(selectedRef.current&&map.current===m)m?.easeTo({padding:padding(true),duration:0})});observer.observe(ref.current);
  }catch{setFailed(true);reveal()}
  return()=>{disposed=true;timers.forEach(clearTimeout);observer?.disconnect();markers.current.forEach(x=>x.marker.remove());m?.remove();map.current=null};
 },[province.id]);
 useEffect(()=>{const m=map.current;if(!m||!ready)return;markers.current.forEach(x=>x.marker.remove());markers.current=hospitals.map((h,i)=>{const el=document.createElement('button');el.className='hospital-marker enhanced-marker';el.dataset.hospitalId=h.id;el.setAttribute('aria-label',h.name);el.innerHTML=markerSvg;const badge=document.createElement('span');badge.className='marker-number';badge.textContent=(i+1).toLocaleString('ar-SY');const label=document.createElement('span');label.className='marker-name';label.textContent=h.name;el.append(badge,label);el.onclick=()=>selectRef.current(h);return {marker:new maplibregl.Marker({element:el}).setLngLat(h.position).addTo(m),id:h.id}})},[hospitals,ready]);
 useEffect(()=>{for(const item of markers.current){const active=selected?.id===item.id;item.marker.getElement().classList.toggle('selected',active);item.marker.getElement().setAttribute('aria-pressed',String(active))}},[selected,hospitals,ready]);
 useEffect(()=>{if(!map.current||!ready)return;if(selected){map.current.easeTo({center:selected.position,padding:padding(true),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:650});hadSelection.current=true}else if(hadSelection.current){map.current.easeTo({padding:padding(false),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:500});hadSelection.current=false}},[selected,ready]);
 useEffect(()=>{if(map.current&&ready){map.current.setLayoutProperty('street-map','visibility',roads?'visible':'none');map.current.setPaintProperty('province-fill','fill-opacity',roads?.18:.4)}},[roads,ready]);
 return <>{failed?<FallbackMap feature={feature} hospitals={hospitals} selected={selected} onSelect={onSelect}/>:<div className="province-map" ref={ref}/>}<div className="province-map-tools">{!failed&&<><button onClick={()=>setRoads(!roads)} aria-pressed={roads}><Layers size={16}/><span>{roads?'خريطة مبسّطة':'خريطة الطرق'}</span></button><button onClick={reset} aria-label="إظهار المحافظة كاملة"><RotateCcw size={16}/></button></>}</div></>;
}
function FallbackMap({feature,hospitals,selected,onSelect}:{feature:any,hospitals:Hospital[],selected:Hospital|null,onSelect:(h:Hospital)=>void}){
 const projection=useMemo(()=>geoMercator().fitExtent([[70,80],[730,570]],feature),[feature]);const path=geoPath(projection);
 return <svg className="province-fallback" viewBox="0 0 800 650" aria-label="خريطة المحافظة"><rect width="800" height="650" fill="#f1f3ec"/><path d={path(feature)||''} fill="#c1ceb6" fillOpacity=".6" stroke="#859a7e" strokeWidth="1"/>{hospitals.map((h,i)=>{const c=projection(h.position)!;return <g key={h.id} role="button" tabIndex={0} aria-label={h.name} className="fallback-marker" onClick={()=>onSelect(h)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(h)}}} transform={`translate(${c[0]},${c[1]})`}><circle r="16" fill={selected?.id===h.id?'#a99567':'#426a52'} stroke="white" strokeWidth="2"/><text textAnchor="middle" y="5" fill="white" fontSize="14">{(i+1).toLocaleString('ar-SY')}</text></g>})}</svg>;
}
