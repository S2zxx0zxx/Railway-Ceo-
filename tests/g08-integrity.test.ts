import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {encodeSave,decodeSave} from '../src/persistence/codec';
import {checksum,wrapPayload,unwrapPayload} from '../src/persistence/integrity';
describe('G08 portable save integrity',()=>{
 it('has stable CRC32 for UTF-8 data',()=>{expect(checksum('123456789')).toBe('cbf43926');expect(checksum('₹')).not.toBe(checksum('?'))});
 it('round trips a checksummed portable snapshot and supports legacy JSON',()=>{const g=apply(initialGame(),{type:'takeover',name:'Portable',ceo:'CEO',difficulty:'Beginner'});expect(decodeSave(encodeSave(g))).toEqual(g);expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('rejects corrupted data and unsupported envelope before migration',()=>{const g=initialGame(),e=JSON.parse(encodeSave(g));e.payload=e.payload.replace('Distressed','Tampered');expect(()=>decodeSave(JSON.stringify(e))).toThrow('checksum');expect(()=>decodeSave(JSON.stringify({...e,envelopeVersion:2}))).toThrow('Unsupported save envelope')});
 it('rejects valid checksum with an invalid schema or state',()=>{const g=initialGame();expect(()=>decodeSave(wrapPayload(JSON.stringify({...g,schema:2})))).toThrow();expect(()=>decodeSave(wrapPayload(JSON.stringify({...g,minute:-1})))).toThrow();expect(()=>unwrapPayload('null')).toThrow()});
});
