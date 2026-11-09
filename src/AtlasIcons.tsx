import type {CSSProperties} from 'react';
export type MedicalKind='hospital'|'emergency'|'surgery'|'radiology'|'icu'|'lab'|'clinic'|'beds'|'staff'|'map';
export function MedicalIcon({kind='hospital',size=40,className='',style}:{kind?:MedicalKind,size?:number,className?:string,style?:CSSProperties}){
 const drawings:Record<MedicalKind,React.ReactNode>={
 hospital:<><path className="icon-tone" d="M12 22h40v31H12z"/><path d="M22 53V12h20v41M12 53V24h10m20 0h10v29M8 53h48"/><path className="icon-accent" d="M28 24h8m-4-4v8"/><path d="M28 53V41h8v12M16 31h2m-2 7h2m28-7h2m-2 7h2M28 33h8"/></>,
 emergency:<><path className="icon-tone" d="M9 27h30v23H9zM39 34h9l8 9v7H39z"/><path d="M9 47V27h30v20m0-13h9l8 9v7h-6m-11 0H22m-8 0H8m35-11h5l4 5h-9z"/><circle cx="18" cy="50" r="5"/><circle cx="45" cy="50" r="5"/><path className="icon-accent" d="M19 36h10m-5-5v10M20 18l4-5m8 5v-7m8 9 5-4"/></>,
 surgery:<><path className="icon-tone" d="M20 32c-10-7-9-21 1-23 5-1 9 2 11 5 2-3 6-6 11-5 10 2 11 16 1 23L32 44z"/><path d="M20 32c-10-7-9-21 1-23 5-1 9 2 11 5 2-3 6-6 11-5 10 2 11 16 1 23L32 44zM21 51l22-21m-2 17 9 9m-6-12 4-4 9 9-4 4"/><path className="icon-accent" d="M20 24h7l3-6 5 13 3-7h8"/></>,
 radiology:<><rect className="icon-tone" x="13" y="8" width="38" height="44" rx="5"/><rect x="13" y="8" width="38" height="44" rx="5"/><path d="M25 58h14m-7-6v6M32 17v27"/><path className="icon-accent" d="m22 23 10 4 10-4M22 30l10 4 10-4m-20 7 10 4 10-4"/></>,
 icu:<><rect className="icon-tone" x="10" y="9" width="44" height="34" rx="5"/><rect x="10" y="9" width="44" height="34" rx="5"/><path d="M24 54h16m-8-11v11"/><path className="icon-accent" d="M16 27h7l4-9 7 18 5-12 3 3h6"/></>,
 lab:<><path className="icon-tone" d="M23 29V11h18v18l12 21c2 4 0 6-4 6H15c-4 0-6-2-4-6z"/><path d="M22 10h20m-18 0v19L12 50c-2 4 0 6 4 6h32c4 0 6-2 4-6L40 29V10"/><path className="icon-accent" d="M18 40h28m-18 8h1m8-4h1m-7-12h1"/></>,
 clinic:<><path className="icon-tone" d="M13 12h15v19H13zM37 35h16v16H37z"/><path d="M14 11v17c0 9 16 9 16 0V11m-16 0h5m6 0h5M22 35v9c0 15 25 15 25 1"/><circle cx="47" cy="37" r="8"/><circle className="icon-accent" cx="47" cy="37" r="3"/></>,
 beds:<><path className="icon-tone" d="M10 29h44v18H10z"/><path d="M9 19v37m46-23v23M9 47h46M9 32h46v15M32 32V22h16c4 0 7 3 7 7v3"/><circle className="icon-accent" cx="21" cy="25" r="5"/></>,
 staff:<><circle className="icon-tone" cx="32" cy="21" r="10"/><path className="icon-tone" d="M16 54V43c0-15 32-15 32 0v11z"/><circle cx="32" cy="21" r="10"/><path d="M16 54V43c0-15 32-15 32 0v11M9 32c-6 4-6 11-6 17m52-17c6 4 6 11 6 17"/><path className="icon-accent" d="M28 45h8m-4-4v8"/></>,
 map:<><path className="icon-tone" d="m8 16 16-6 16 6 16-6v38l-16 6-16-6-16 6z"/><path d="m8 16 16-6 16 6 16-6v38l-16 6-16-6-16 6zM24 10v38m16-32v38"/><path className="icon-accent" d="M24 29c0-11 16-11 16 0 0 5-8 12-8 12s-8-7-8-12z"/><circle cx="32" cy="28" r="2"/></>
 };
 return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={'medical-icon '+className} style={style} aria-hidden="true">{drawings[kind]}</svg>
}
export function LandmarkIcon({id,size=40}:{id:string,size?:number}){
 const shapes:Record<string,React.ReactNode>={
 'damascus-sword':<><path d="m15 49 4-11L43 9l-1 16-20 19zM13 36l16 14M13 49l-5 7m12-4-7-7"/><path className="icon-accent" d="m30 29 8-10M34 53h20M44 53V32m-5 7 5-7 5 7m-9 7h8"/></>,
 'rif-dimashq-ghouta':<><path className="icon-tone" d="M32 12c-24 10-24 31 0 31 24 0 24-21 0-31z"/><path d="M32 55V22m0 15L22 27m10 16 11-12M32 12c-24 10-24 31 0 31 24 0 24-21 0-31zM18 56h29"/></>,
 'aleppo-citadel':<><path className="icon-tone" d="m10 50 7-16h30l7 16zM19 18h26v20H19z"/><path d="m7 54 10-20h30l10 20M19 34V18h5v5h6v-5h5v5h6v-5h5v16M28 43v-8a4 4 0 0 1 8 0v8M13 54h38"/><path className="icon-accent" d="M20 46h5m14 0h5"/></>,
 'homs-clock':<><path className="icon-tone" d="M21 20h22v35H21z"/><path d="M18 55h28M22 55V21h20v34M18 21l14-11 14 11M28 10V6h8v4"/><circle cx="32" cy="31" r="7"/><path className="icon-accent" d="M32 27v5h4M29 54v-9h6v9"/></>,
 'hama-norias':<><circle className="icon-tone" cx="29" cy="29" r="19"/><circle cx="29" cy="29" r="19"/><circle cx="29" cy="29" r="4"/><path d="M29 10v15m0 8v15M10 29h15m8 0h15M16 16l10 10m6 6 10 10M16 42l10-10m6-6 10-10M10 55h43M48 29v26m-7-7h14"/><path className="icon-accent" d="M8 60c5-4 9 3 14-1s9 3 14-1 9 3 14-1"/></>,
 'latakia-triumph-arch':<><path className="icon-tone" d="M14 18h36v37H14z"/><path d="M10 55h44M14 55V18h36v37M23 55V32a9 9 0 0 1 18 0v23M11 18h42M17 12h30M18 18v36m28-36v36"/><path className="icon-accent" d="M9 60c8-4 12 4 20 0s12 4 20 0"/></>,
 'tartous-arwad':<><path className="icon-tone" d="M12 23h40v23H12z"/><path d="M12 46V23h6v6h6v-6h6v6h6v-6h6v6h6v-6h4v23M8 46h48M28 46V35h8v11"/><path className="icon-accent" d="M7 54c8-5 12 4 20 0s12 4 20 0 7 0 10 0M12 60c8-4 12 3 20 0s12 3 20 0"/></>,
 'idlib-ruweiha':<><path className="icon-tone" d="M12 29 32 12l20 17z"/><path d="M9 55h46M14 53V29h36v24M10 29l22-17 22 17M23 53V35h18v18M28 53V40h8v13"/><path className="icon-accent" d="M20 23h24M32 16v8"/></>,
 'deir-ez-zor-bridge':<><path d="M6 44h52M17 48V13m30 35V13M8 40c9-1 16-9 24-20 8 11 15 19 24 20M12 38v6m10-11v11m10-20v20m10-11v11m10-6v6"/><path className="icon-accent" d="M6 55c8-4 12 3 20 0s12 3 20 0 8 3 12 0"/></>,
 'raqqa-baghdad-gate':<><path className="icon-tone" d="M13 16h38v39H13z"/><path d="M9 55h46M13 55V16h38v39M12 16l20-7 20 7M24 55V37c0-8 8-14 8-14s8 6 8 14v18M18 23v23m28-23v23"/><path className="icon-accent" d="M24 19h16M28 55V39a4 4 0 0 1 8 0v16"/></>,
 'hasakah-ain-diwar':<><path d="M8 49V19h48v30M7 19h50M16 49V33c0-11 12-11 12 0v16m8 0V33c0-11 12-11 12 0v16M8 12h48"/><path className="icon-accent" d="M8 57c8-5 12 3 20 0s12 3 20 0 6 0 9 0"/></>,
 'daraa-omari-mosque':<><path className="icon-tone" d="M14 32h35v23H14z"/><path d="M9 55h47M14 55V32h35v23M22 32c0-17 19-17 19 0M48 32V13h7v42M47 13l5-8 5 8M25 55V42a6 6 0 0 1 12 0v13"/><path className="icon-accent" d="M18 38h3m20 0h3M52 20h3"/></>,
 'sweida-qanawat':<><path className="icon-tone" d="M10 20h44v8H10z"/><path d="M8 55h48M12 49h40M13 28h38M16 28v21m7-21v21m18-21v21m7-21v21M10 20h44v8H10zM9 19l23-10 23 10"/><path className="icon-accent" d="M29 49V33h6v16"/></>,
 'quneitra-beit-saida':<><path className="icon-tone" d="m10 30 22-17 22 17v25H10z"/><path d="M8 55h48M12 55V30h40v25M8 30l24-17 24 17M26 55V39h12v16"/><path className="icon-accent" d="M17 37h4v6h-4m26-6h4v6h-4M30 23h4"/></>
 };
 return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="landmark-icon" aria-hidden="true">{shapes[id]||shapes['aleppo-citadel']}</svg>
}
export const serviceCatalog:Record<string,{kind:MedicalKind,description:string,equipment:string[]}>={
 'الطوارئ':{kind:'emergency',description:'الاستقبال والفرز والتدخل الإسعافي الأولي.',equipment:['عربة إنعاش','أجهزة مراقبة العلامات الحيوية']},
 'الجراحة العامة':{kind:'surgery',description:'التقييم الجراحي والعمليات والمتابعة بعد الجراحة.',equipment:['طاولة عمليات','جهاز تخدير']},
 'الأشعة والتصوير':{kind:'radiology',description:'التصوير التشخيصي لدعم التقييم الطبي.',equipment:['جهاز أشعة سينية','جهاز إيكو']},
 'العناية المركزة':{kind:'icu',description:'المراقبة المكثفة ودعم الوظائف الحيوية.',equipment:['أجهزة مراقبة متعددة','جهاز تنفس اصطناعي']},
 'المخابر':{kind:'lab',description:'الفحوص المخبرية وتحليل العينات الطبية.',equipment:['محلل دم','مجهر مخبري']},
 'العيادات الخارجية':{kind:'clinic',description:'المعاينات والاستشارات والمتابعة الدورية.',equipment:['سرير فحص','أدوات تشخيص سريري']}
};
