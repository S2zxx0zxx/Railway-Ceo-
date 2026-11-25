import {describe,it,expect} from 'vitest';
import {requestReceipt,wasCommitted,remember,receiptLimit} from '../src/persistence/receipts';
import {reportDocument} from '../src/ui/financial-export';
import {initialGame} from '../src/engine/game';
describe('G04 command receipts and exports',()=>{
 it('recognizes same request without depending on property order',()=>{const id='request-1234567890',a=requestReceipt(id,{type:'purchase',item:'flour',qty:1000},2),b=requestReceipt(id,{qty:1000,item:'flour',type:'purchase'},2);expect(wasCommitted([a],b)).toBe(true);expect(()=>wasCommitted([a],requestReceipt(id,{type:'purchase',item:'flour',qty:2000},2))).toThrow()});
 it('bounds receipt retention',()=>{let rows:ReturnType<typeof requestReceipt>[]=[];for(let i=0;i<receiptLimit+1;i++)rows=remember(rows,requestReceipt('request-id-'+String(i).padStart(8,'0'),{type:'advance',minutes:1},i));expect(rows).toHaveLength(receiptLimit);expect(rows[0].version).toBe(1)});
 it('exports exact decimal-string amounts and underlying journal',()=>{const g=initialGame(),out=JSON.parse(reportDocument(g));expect(out.statement.assets).toBe('130000000');expect(out.statement.balanced).toBe(true);expect(out.journal).toEqual(g.journal)});
});
