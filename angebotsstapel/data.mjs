// Alle Lieferanten und Angebote sind fiktive Unterrichtsbeispiele.
export const offers = [
 {id:'CF-261025',vendor:'Carbonfieber GmbH',city:'Bamberg',color:'#1c6657',style:'letter',price:90,discount:10,shipping:100,packaging:0,insurance:0,terms:'ab Werk',goal:30,days:10,skonto:3,delivery:5,
 questions:[['price','Wie hoch ist der Einzelpreis je m²?','€'],['discount','Welcher Rabattsatz wird gewährt?','%'],['skonto','Wie hoch ist der Skontosatz?','%']]},
 {id:'DC-4826',vendor:'Deutsche Carbonwerke AG',city:'Fürth',color:'#385375',style:'table',price:85,discount:5,shipping:250,packaging:0,insurance:0,terms:'ab Werk',goal:30,days:8,skonto:2,delivery:7,
 questions:[['days','Wie lang ist die Skontofrist?','Tage'],['goal','Wie lang ist das Zahlungsziel?','Tage'],['shipping','Wie hoch sind die Transportkosten für Courtline?','€']]},
 {id:'MC-207',vendor:'MainCarbon GmbH',city:'Würzburg',color:'#9b643b',style:'email',price:92,discount:8,shipping:0,packaging:25,insurance:0,terms:'frei Haus',goal:30,days:10,skonto:2,delivery:4,
 questions:[['terms','Welche Lieferbedingung ist vereinbart?','select'],['payer','Wer trägt laut Lieferbedingung die Transportkosten?','payer'],['packaging','Welche Verpackungskosten werden berechnet?','€']]},
 {id:'MF-1038',vendor:'Mittelfranken Fasertechnik GmbH',city:'Ansbach',color:'#65517e',style:'table',price:89,discount:5,shipping:120,packaging:20,insurance:35,terms:'ab Werk',goal:21,days:7,skonto:2,delivery:6,
 questions:[['discount','Wie hoch ist der vereinbarte Rabatt?','%'],['insurance','Wie viel kostet die Transportversicherung?','€'],['shipping','Welche Transportkosten werden berechnet?','€']]},
 {id:'VK-526',vendor:'Verbundstoff-Kontor GmbH',city:'Erlangen',color:'#27777b',style:'letter',price:91.5,discount:6,shipping:0,packaging:0,insurance:0,terms:'frei Haus',goal:14,days:5,skonto:2.5,delivery:3,
 questions:[['goal','Nach wie vielen Tagen muss spätestens bezahlt werden?','Tage'],['skonto','Welchen Nachlass gibt es bei rechtzeitiger Zahlung?','%'],['days','Innerhalb wie vieler Tage ist der Skontoabzug möglich?','Tage']]},
 {id:'CP-710',vendor:'CarbonPartner GmbH',city:'Nürnberg',color:'#84534b',style:'email',price:88.5,discount:0,shipping:80,packaging:15,insurance:10,terms:'ab Werk',goal:30,days:10,skonto:1.5,delivery:8,
 questions:[['price','Welcher Einzelpreis gilt je m² Carbon-Gewebe?','€'],['payer','Wer bezahlt den Transport laut Lieferbedingung?','payer'],['discount','Welcher Rabatt ist in diesem Angebot vorgesehen?','%']]}
];
export const money = n => n.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
export const percent = n => n.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' %';
export function expected(o,key){return key==='payer'?(o.terms==='ab Werk'?'Käufer':'Verkäufer'):o[key];}
export function parseNumber(raw){
 let s=String(raw).trim().replace(/\s|€|%/g,'');
 if(!s || !/^[0-9.,]+$/.test(s))return NaN;
 if(s.includes(',')){if(!/^\d{1,3}(\.\d{3})*,\d{1,2}$/.test(s)&&!/^\d+,\d{1,2}$/.test(s))return NaN;s=s.replaceAll('.','').replace(',','.');}
 else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replaceAll('.','');
 else if(!/^\d+(\.\d{1,2})?$/.test(s))return NaN;
 return Number(s);
}
export function isCorrect(o,key,value){const e=expected(o,key);return typeof e==='number'?Math.abs(parseNumber(value)-e)<0.000001:value===e;}
export function totals(o){const goods=20000*Math.round(o.price*100)/100; const rebate=Math.round(goods*o.discount/100);return {goods,rebate,net:goods-rebate+Math.round((o.shipping+o.packaging+o.insurance)*100)};}
