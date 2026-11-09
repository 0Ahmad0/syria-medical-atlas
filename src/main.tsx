import {useState,useEffect,useRef,useMemo,lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence,MotionConfig} from 'motion/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Search,ArrowUpLeft,ArrowRight,ChevronDown,List,SlidersHorizontal,X,Check,Info,Building2,Settings2} from 'lucide-react';
import {provinces,serviceOptions,makeHospitals,Province,Hospital} from './data';
import NationalMap from './NationalMap';
import HospitalDetails from './HospitalDetails';
import {MedicalIcon,LandmarkIcon} from './AtlasIcons';
import {AtlasDialog,AtlasSearch,Hint,Tooltip} from './Experience';
import {Toaster,toast} from 'sonner';
import './style.css';
import './studio.css';
const loadProvinceMap=()=>import('./ProvinceMap');
const ProvinceMap=lazy(loadProvinceMap);
const ar=(n:number)=>n.toLocaleString('ar-SY');
const routeProvince=()=>provinces.find(p=>p.icon===decodeURIComponent(location.hash.replace('#/province/','')))||null;
type Pane='list'|'details'|null;
function App(){
 const pendingSelection=useRef<Hospital|null>(null),detailsFromList=useRef(false),lastSelection=useRef<string|null>(null);
 const [geo,setGeo]=useState<any>(null),[error,setError]=useState(false),[province,setProvince]=useState<Province|null>(routeProvince);
 const [provinceReady,setProvinceReady]=useState(false),[hoveredProvince,setHoveredProvince]=useState<string|null>(null);
 const [hospitals,setHospitals]=useState<Hospital[]>([]),[selected,setSelected]=useState<Hospital|null>(null);
 const [pane,setPane]=useState<Pane>(null),[listMode,setListMode]=useState<'provinces'|'hospitals'>(province?'hospitals':'provinces');
 const [query,setQuery]=useState(''),[service,setService]=useState('');
 const [searchOpen,setSearchOpen]=useState(false),[modal,setModal]=useState<'about'|'manage'|null>(null);
 useEffect(()=>{fetch(`${import.meta.env.BASE_URL}syria.geojson`).then(r=>{if(!r.ok)throw Error();return r.json()}).then(g=>{
  setGeo(g);let data=makeHospitals(g.features);
  try{const saved=JSON.parse(localStorage.getItem('atlas-hospitals')||'null');if(Array.isArray(saved)&&saved.every(x=>x.id&&x.province&&Array.isArray(x.position)&&Array.isArray(x.services)))data=saved}catch{}
  setHospitals(data.map(h=>({...h,name:h.name.replace('المشفى العسكري التجريبي ','المشفى العسكري '),description:h.description==='منشأة طبية افتراضية لعرض تجربة استكشاف الأقسام والخدمات. جميع المعلومات والأرقام والمواقع توضيحية ولا تمثل منشأة فعلية.'?'':h.description})));
  void loadProvinceMap().catch(()=>{});
 }).catch(()=>setError(true))},[]);
 useEffect(()=>{const changed=()=>{const p=routeProvince(),h=pendingSelection.current;pendingSelection.current=null;setProvince(p);setProvinceReady(false);setHoveredProvince(null);setSelected(h);lastSelection.current=h?.id||null;setPane(h?'details':null);setListMode(p?'hospitals':'provinces');setQuery('');setService('');detailsFromList.current=false};addEventListener('hashchange',changed);return()=>removeEventListener('hashchange',changed)},[]);
 function navigate(p:Province|null,h?:Hospital){
  if(p?.id===province?.id){if(h)choose(h);else{setPane(null);setSelected(null)}return}
  pendingSelection.current=h||null;location.hash=p?`/province/${p.icon}`:'/';
 }
 function choose(h:Hospital){
  if(province?.id!==h.province){navigate(provinces.find(p=>p.id===h.province)!,h);return}
  detailsFromList.current=pane==='list';lastSelection.current=h.id;setSelected(h);setPane('details');
 }
 function closeDetails(){setSelected(null);setPane(detailsFromList.current?'list':null);requestAnimationFrame(()=>{if(lastSelection.current)document.querySelector<HTMLElement>(`button[data-hospital-id="${CSS.escape(lastSelection.current)}"]`)?.focus({preventScroll:true})})}
 function openList(mode:'provinces'|'hospitals'){setSelected(null);setListMode(mode);setPane(pane==='list'&&listMode===mode?null:'list')}
 useEffect(()=>{const key=(e:KeyboardEvent)=>{const typing=(e.target as HTMLElement)?.matches('input,textarea,select,[contenteditable="true"]');if(!modal&&((e.key.toLowerCase()==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&!typing))){e.preventDefault();setSearchOpen(x=>!x)}if(e.key==='Escape'&&!searchOpen&&!modal){if(selected)closeDetails();else setPane(null)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[modal,searchOpen,selected]);
 function save(h:Hospital){const next=hospitals.map(x=>x.id===h.id?h:x);try{localStorage.setItem('atlas-hospitals',JSON.stringify(next));setHospitals(next);if(selected?.id===h.id)setSelected(h);toast.success('تم حفظ التعديلات')}catch{toast.error('تعذر حفظ التعديلات',{description:'تحقق من توفر مساحة التخزين في المتصفح.'})}}
 const filtered=useMemo(()=>hospitals.filter(h=>(!province||h.province===province.id)&&(!query||h.name.includes(query))&&(!service||h.services.includes(service))),[hospitals,province,query,service]);
 const shownProvinces=provinces.filter(p=>(!query||p.name.includes(query)||hospitals.some(h=>h.province===p.id&&h.name.includes(query)))&&(!service||filtered.some(h=>h.province===p.id)));
 const visibleHospitals=listMode==='hospitals'?filtered:[];
 const activeCount=hospitals.filter(h=>!province||h.province===province.id).length;
 return <MotionConfig reducedMotion="user"><Tooltip.Provider><div className="app map-studio">
 <header className="header studio-header">
  <button className="brand" onClick={()=>navigate(null)} aria-label="أطلس، خريطة سوريا"><img src={`${import.meta.env.BASE_URL}emblem.svg`} alt=""/><span className="brand-line"/><span><strong>أطلس<span className="brand-dot">.</span></strong><small>المشافي العسكرية</small></span></button>
  <nav className="studio-location" aria-label="مسار الخريطة"><button onClick={()=>navigate(null)} className={!province?'current':''}>سوريا</button>{province&&<><span>/</span><strong>{province.name}</strong></>}</nav>
  <div className="header-end"><Hint label="البحث السريع · Ctrl / ⌘ + K"><button className="global-search-trigger" onClick={()=>setSearchOpen(true)} aria-label="البحث في أطلس"><Search size={17}/><span>ابحث في أطلس</span><kbd>Ctrl K</kbd></button></Hint><span className="demo-pill">بيانات تجريبية</span><Hint label="إدارة البيانات"><button className="avatar" onClick={()=>setModal('manage')} aria-label="إدارة البيانات"><Settings2 size={17}/></button></Hint><Hint label="عن أطلس"><button className="studio-about" onClick={()=>setModal('about')} aria-label="عن أطلس"><Info size={17}/></button></Hint></div>
 </header>
 <main className="studio-main"><section className="workspace studio-workspace" aria-label="مساحة الخريطة والبيانات" data-pane={pane||'none'}>
  <div className="workspace-bar studio-toolbar"><div className="section-title">{province&&<button className="studio-back" onClick={()=>navigate(null)} aria-label="العودة إلى خريطة سوريا"><ArrowRight size={17}/></button>}<h1>{province?province.name:'المحافظات السورية'}</h1><span className="studio-count">{ar(activeCount)} مشفى</span></div><span className="toolbar-divider"/><button className={'sidebar-toggle '+(pane==='list'?'active':'')} aria-expanded={pane==='list'} aria-controls="explorer-sidebar" onClick={()=>openList(province?'hospitals':'provinces')}><List size={16}/>{province?'المشافي':'المحافظات'}<ChevronDown size={12}/></button>{!province&&<button className="studio-hospitals-toggle" onClick={()=>openList('hospitals')} aria-label="عرض دليل المشافي"><Building2 size={16}/><span>المشافي</span></button>}</div>
  <div className="explorer studio-explorer"><div className="map-area studio-map-area">
   {geo?<>
    <div className={'national-stage '+(province?'is-background':'')} inert={!!province} aria-hidden={province?true:undefined}><NationalMap geo={geo} onSelect={navigate} allowed={shownProvinces} hovered={hoveredProvince} onHover={setHoveredProvince} focusProvince={province}/></div>
    <AnimatePresence>{province&&<motion.div key={province.id} className="province-map-wrapper province-stage" style={{pointerEvents:provinceReady?'auto':'none'}} initial={{opacity:0}} animate={{opacity:provinceReady?1:0}} exit={{opacity:0}} transition={{duration:.45,ease:[.22,1,.36,1]}}><Suspense fallback={null}><ProvinceMap geo={geo} province={province} hospitals={filtered} selected={selected} onSelect={choose} onReady={()=>{if(routeProvince()?.id===province.id)setProvinceReady(true)}}/></Suspense></motion.div>}</AnimatePresence>
   </>:<div className="map-loading" role="status"><MedicalIcon kind="map" size={42}/><p>{error?'تعذر تحميل الخريطة':'جارٍ تحميل الخريطة'}</p>{error&&<button className="outline-button" onClick={()=>location.reload()}>إعادة المحاولة</button>}</div>}
  </div>
  <AnimatePresence mode="wait">
   {pane==='list'?<motion.aside id="explorer-sidebar" key="list" className="explorer-side studio-panel list-panel" aria-label={listMode==='provinces'?'قائمة المحافظات':'قائمة المشافي'} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:8}} transition={{duration:.22}}>
    <div className="studio-panel-heading"><h2>{listMode==='provinces'?'المحافظات':'المشافي'}</h2><button onClick={()=>setPane(null)} aria-label="إغلاق القائمة"><X size={18}/></button></div>
    <div className="search-wrap"><Search size={17}/><input aria-label="البحث في القائمة" placeholder={listMode==='provinces'?'ابحث عن محافظة...':'ابحث عن مشفى...'} value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button onClick={()=>setQuery('')} aria-label="مسح البحث"><X size={14}/></button>}</div>
    <div className="filter"><SlidersHorizontal size={15}/><select aria-label="تصفية حسب الخدمة" value={service} onChange={e=>setService(e.target.value)}><option value="">جميع الخدمات الطبية</option>{serviceOptions.map(s=><option key={s}>{s}</option>)}</select><ChevronDown size={12}/></div>
    <div className="list-heading"><span>{ar(listMode==='provinces'?shownProvinces.length:visibleHospitals.length)} نتيجة</span>{(query||service)&&<button onClick={()=>{setQuery('');setService('')}}>مسح الفلاتر</button>}</div>
    <div className="province-list">{listMode==='provinces'?shownProvinces.map(p=><button className={'province-row '+(hoveredProvince===p.id?'row-hovered':'')} key={p.id} onClick={()=>navigate(p)} onMouseEnter={()=>setHoveredProvince(p.id)} onMouseLeave={()=>setHoveredProvince(null)} onFocus={()=>setHoveredProvince(p.id)} onBlur={()=>setHoveredProvince(null)}><span className="province-icon"><LandmarkIcon id={p.icon} size={35}/></span><div><strong>{p.name}</strong><small>{ar(hospitals.filter(h=>h.province===p.id).length)} مشافٍ</small></div><ArrowUpLeft size={15}/></button>):visibleHospitals.map((h,i)=><button className="hospital-row" key={h.id} data-hospital-id={h.id} onClick={()=>choose(h)}><span className="hospital-symbol"><span>{ar(i+1)}</span></span><div><strong>{h.name}</strong><small>{h.kind} · {ar(h.services.length)} خدمات</small><span className="row-capacity">{ar(h.beds)} سرير</span></div><ArrowUpLeft size={15}/></button>)}{(listMode==='provinces'?shownProvinces.length===0:visibleHospitals.length===0)&&<div className="list-empty"><Search size={24}/><strong>لا توجد نتائج مطابقة</strong><button className="text-button" onClick={()=>{setQuery('');setService('')}}>مسح الفلاتر</button></div>}</div>
   </motion.aside>:pane==='details'&&selected?<HospitalDetails key="details" hospital={selected} onClose={closeDetails} onEdit={()=>setModal('manage')}/>:null}
  </AnimatePresence>
  {province&&!provinceReady&&<div className="studio-transition-status" role="status">{province.name}</div>}
 </div></section></main>
 <AtlasDialog open={modal!==null} onOpenChange={open=>{if(!open)setModal(null)}} title={modal==='about'?'عن أطلس':'إدارة البيانات'}>{modal==='about'?<><h2>أطلس</h2><p>خريطة المشافي العسكرية في المحافظات السورية.</p><p>البيانات المعروضة تجريبية.</p><a href="https://syrian.zone/syid" target="_blank" rel="noreferrer">مصدر الهوية والحدود الجغرافية ↗</a></>:<Manage hospitals={hospitals} selected={selected} onSave={save}/>}</AtlasDialog>
 <AtlasSearch open={searchOpen} onOpenChange={setSearchOpen} hospitals={hospitals} onProvince={navigate} onHospital={choose}/>
 <Toaster position="bottom-center" dir="rtl" closeButton toastOptions={{className:'atlas-toast'}}/>
 </div></Tooltip.Provider></MotionConfig>
}
function Manage({hospitals,selected,onSave}:{hospitals:Hospital[],selected:Hospital|null,onSave:(h:Hospital)=>void}){const [id,setId]=useState(selected?.id||hospitals[0]?.id||'');const original=hospitals.find(h=>h.id===id);const [draft,setDraft]=useState<Hospital|undefined>(original);useEffect(()=>setDraft(original),[id]);return <><h2>إدارة البيانات</h2><p className="muted">تُحفظ التعديلات في هذا المتصفح.</p>{!draft?<p>البيانات غير جاهزة بعد.</p>:<form onSubmit={e=>{e.preventDefault();if(draft.name.trim())onSave({...draft,name:draft.name.trim()})}}><label>السجل<select value={id} onChange={e=>setId(e.target.value)}>{hospitals.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select></label><label>اسم المشفى<input required maxLength={120} value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><div className="form-grid"><label>عدد الأسرّة<input type="number" min="0" max="5000" required value={draft.beds} onChange={e=>setDraft({...draft,beds:Number(e.target.value)})}/></label><label>عدد الكوادر<input type="number" min="0" max="10000" required value={draft.staff} onChange={e=>setDraft({...draft,staff:Number(e.target.value)})}/></label></div><label>نبذة<textarea maxLength={1000} value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></label><fieldset><legend>الخدمات المتوفرة</legend><div className="checkboxes">{serviceOptions.map(s=><label key={s}><input type="checkbox" checked={draft.services.includes(s)} onChange={e=>setDraft({...draft,services:e.target.checked?[...draft.services,s]:draft.services.filter(x=>x!==s)})}/>{s}</label>)}</div></fieldset><button className="primary-button" type="submit"><Check size={17}/> حفظ التعديلات</button></form>}</>}
createRoot(document.getElementById('root')!).render(<App/>);
