import {deflateSync} from 'node:zlib';
import {mkdir,writeFile} from 'node:fs/promises';
const table=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);return c>>>0});
function chunk(type,data){const tag=Buffer.from(type),body=Buffer.concat([tag,data]);let c=0xffffffff;for(const b of body)c=(c>>>8)^table[(c^b)&255];const len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);crc.writeUInt32BE((c^0xffffffff)>>>0);return Buffer.concat([len,body,crc])}
const polygons=[[[96,195],[256,100],[416,195],[416,335],[256,430],[96,335]],[[96,195],[256,285],[416,195],[256,100]],[[256,285],[256,430],[416,335],[416,195]],[[161,205],[256,151],[351,205],[256,260]],[[161,291],[161,246],[239,290],[239,336]],[[273,290],[351,246],[351,291],[273,336]]];
const colors=[[232,202,136],[244,227,189],[180,135,69],[23,61,88],[23,61,88],[23,61,88]];
function inside(x,y,p){let b=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [a,c]=p[i],[d,e]=p[j];if((c>y)!==(e>y)&&x<(d-a)*(y-c)/(e-c)+a)b=!b}return b}
export function iconPng(size,maskable=false){
 const raw=Buffer.alloc(size*(size*3+1)),scale=maskable?.78:1;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){let rgb=[0,0,0];for(const dy of [.25,.75])for(const dx of [.25,.75]){const px=((x+dx)*512/size-256)/scale+256,py=((y+dy)*512/size-256)/scale+256;let color=[20,60,89];for(let i=0;i<polygons.length;i++)if(inside(px,py,polygons[i]))color=colors[i];rgb=rgb.map((v,i)=>v+color[i])}const pos=y*(size*3+1)+1+x*3;for(let i=0;i<3;i++)raw[pos+i]=Math.round(rgb[i]/4)}
 const header=Buffer.alloc(13);header.writeUInt32BE(size,0);header.writeUInt32BE(size,4);header[8]=8;header[9]=2;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
}
await mkdir('public/icons',{recursive:true});
for(const n of [192,512])await writeFile('public/icons/icon-'+n+'.png',iconPng(n));
await writeFile('public/icons/maskable-512.png',iconPng(512,true));
