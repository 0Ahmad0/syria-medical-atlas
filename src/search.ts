/** Normalize Arabic text consistently without changing displayed names. */
export function normalizeSearch(value:string):string{
 return value.normalize('NFKD')
  .replace(/[\u064B-\u065F\u0670\u0640]/g,'')
  .replace(/[أإآٱ]/g,'ا')
  .replace(/ى/g,'ي')
  .toLowerCase().trim();
}
