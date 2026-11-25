export const accounts = ['cash','raw','wip','finished','equipment','receivable','payable','payroll','debt','equity','revenue','cogs','wages','interest','expense','loss'] as const;
export type Account=typeof accounts[number];
export type Entry={id:string;minute:number;description:string;lines:{account:Account;amount:string}[]};
export const money=(rupees:number):bigint=>{if(!Number.isSafeInteger(rupees)) throw Error('Whole rupees required');return BigInt(rupees)*100n};
export const balance=(journal:Entry[],account:Account)=>journal.reduce((sum,e)=>sum+e.lines.filter(l=>l.account===account).reduce((a,l)=>a+BigInt(l.amount),0n),0n);
export function post(journal:Entry[],id:string,minute:number,description:string,lines:Entry['lines']){
 if(!id||!Number.isSafeInteger(minute)||minute<0||journal.some(e=>e.id===id)) throw Error('Invalid or duplicate entry');
 if(lines.length<2||lines.some(l=>!accounts.includes(l.account)||!(/^-?(0|[1-9][0-9]*)$/).test(l.amount)||BigInt(l.amount)===0n)||lines.reduce((s,l)=>s+BigInt(l.amount),0n)!==0n) throw Error('Unbalanced journal');
 journal.push({id,minute,description,lines:lines.map(l=>({...l}))});
}
export function transfer(journal:Entry[],id:string,minute:number,description:string,debit:Account,credit:Account,amount:bigint){
 if(amount<=0n||debit===credit) throw Error('Invalid transfer');
 post(journal,id,minute,description,[{account:debit,amount:amount.toString()},{account:credit,amount:(-amount).toString()}]);
}
export const profit=(j:Entry[])=>-balance(j,'revenue')-(['cogs','wages','interest','expense','loss'] as const).reduce((a,k)=>a+balance(j,k),0n);
