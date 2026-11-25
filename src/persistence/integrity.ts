// CRC32 detects accidental corruption; it is not authentication or tamper protection.
const table=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);return c>>>0});
export function checksum(text:string):string{
 let crc=0xffffffff;
 for(const b of new TextEncoder().encode(text))crc=(crc>>>8)^table[(crc^b)&255];
 return ((crc^0xffffffff)>>>0).toString(16).padStart(8,'0');
}
export const payloadLimit=8_000_000;
export const envelopeLimit=17_000_000;
export const envelopeFormat='the-ceo-save';
export function wrapPayload(payload:string){
 if(payload.length>payloadLimit)throw Error('Save exceeds supported payload limit');
 return JSON.stringify({format:envelopeFormat,envelopeVersion:1,contentVersion:1,build:'0.1.0',checksum:checksum(payload),payload});
}
export function unwrapPayload(text:string){
 if(text.length>envelopeLimit)throw Error('Save exceeds import limit');
 const obj:unknown=JSON.parse(text);
 if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('Invalid save object');
 const x=obj as Record<string,unknown>;
 if('format' in x){
  if(x.format!==envelopeFormat||x.envelopeVersion!==1||x.contentVersion!==1||typeof x.build!=='string'||typeof x.payload!=='string'||typeof x.checksum!=='string')throw Error('Unsupported save envelope');
  if(x.payload.length>payloadLimit||checksum(x.payload)!==x.checksum)throw Error('Save checksum mismatch; import rejected');
  return x.payload;
 }
 if(text.length>payloadLimit)throw Error('Legacy save exceeds payload limit');
 return text;
}
