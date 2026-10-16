import {accounts,success,stocks,openingEquity,getAccount,parseMoney,money,short,sanitize} from './assignment.mjs';
export function grade(raw){const a=sanitize(raw),items=[];const expenses=success.filter(x=>getAccount(x.id).type==='expense').reduce((s,x)=>s+x.balance,0),income=success.filter(x=>getAccount(x.id).type==='income').reduce((s,x)=>s+x.balance,0),profit=income-expenses,equity=openingEquity+profit;
 const ownProfit=parseMoney(a.profit),ownSigned=ownProfit===null?null:(a.resultKind==='loss'?-ownProfit:a.resultKind==='profit'?ownProfit:null),ownEquity=ownSigned===null?null:openingEquity+ownSigned;
 const ownEk=parseMoney(a.equity),stockTotal=stocks.filter(x=>getAccount(x.id).type==='active').reduce((s,x)=>s+x.balance,0);
 function add(section,label,given,expected,ok,follow=false){items.push({section,label,given:String(given||'–'),expected:String(expected),points:ok||follow?1:0,follow:!ok&&follow});}
 function booking(section,title,row,d,c,n,followAmount=null){add(section,`${title}: Sollkonto`,short(row.debit),short(d),row.debit===d);add(section,`${title}: Habenkonto`,short(row.credit),short(c),row.credit===c);const amount=parseMoney(row.amount);add(section,`${title}: Betrag`,amount===null?row.amount:money(amount),money(n),amount===n,followAmount!==null&&amount===followAmount&&followAmount>=0);}
 for(const x of success){const expense=getAccount(x.id).type==='expense';booking(1,short(x.id),a.success[x.id],expense?'8020':x.id,expense?x.id:'8020',x.balance);}
 add(2,'Summe Aufwendungen',a.expenseTotal,money(expenses),parseMoney(a.expenseTotal)===expenses);add(2,'Summe Erträge',a.incomeTotal,money(income),parseMoney(a.incomeTotal)===income);
 add(2,'Ergebnisart',a.resultKind==='profit'?'Gewinn':a.resultKind==='loss'?'Verlust':a.resultKind,'Gewinn',a.resultKind==='profit');add(2,'Erfolgshöhe',a.profit,money(profit),ownProfit===profit);
 // Bei einem falsch berechneten Ergebnis werden seine korrekte buchhalterische Fortführung und die Fortschreibung des EK als Folgefehler anerkannt.
 const ownDir=ownSigned!==null&&ownSigned<0;const cd=ownDir?'3000':'8020',cc=ownDir?'8020':'3000';
 add(2,'GuV-Abschluss: Sollkonto',short(a.closing.debit),'8020 GUV',a.closing.debit==='8020',ownSigned!==null&&a.closing.debit===cd);add(2,'GuV-Abschluss: Habenkonto',short(a.closing.credit),'3000 EK',a.closing.credit==='3000',ownSigned!==null&&a.closing.credit===cc);
 const ca=parseMoney(a.closing.amount);add(2,'GuV-Abschluss: Betrag',a.closing.amount,money(profit),ca===profit,ownProfit!==null&&ca===ownProfit);add(2,'Eigenkapital nach Abschluss',a.equity,money(equity),ownEk===equity,ownEquity!==null&&ownEquity>=0&&ownEk===ownEquity);
 for(const x of stocks){const active=getAccount(x.id).type==='active';booking(3,short(x.id),a.stocks[x.id],active?'8010':x.id,active?x.id:'8010',x.id==='3000'?equity:x.balance,x.id==='3000'?ownEk:null);}
 add(3,'SBK-Summe Soll',a.sbkDebit,money(stockTotal),parseMoney(a.sbkDebit)===stockTotal);
 const ownPassive=stocks.filter(x=>getAccount(x.id).type==='passive'&&x.id!=='3000').reduce((s,x)=>s+x.balance,0)+(ownEk??equity);
 add(3,'SBK-Summe Haben',a.sbkCredit,money(stockTotal),parseMoney(a.sbkCredit)===stockTotal,ownEk!==null&&parseMoney(a.sbkCredit)===ownPassive);
 const sections=[1,2,3].map(id=>{const rows=items.filter(i=>i.section===id);return {id,score:rows.reduce((s,i)=>s+i.points,0),max:rows.length};});return {score:items.reduce((s,i)=>s+i.points,0),max:items.length,sections,items};}
