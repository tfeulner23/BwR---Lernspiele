import { createHandler } from '../_shared/api.mjs';
const url=Deno.env.get('SUPABASE_URL')!;
const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const origins=['https://tfeulner23.github.io','http://127.0.0.1:8766','http://localhost:8766'];
async function rest(table:string,params:Record<string,string>,method='GET',body?:unknown,prefer='return=representation'){
 const endpoint=new URL(url+'/rest/v1/'+table);for(const [k,v] of Object.entries(params))endpoint.searchParams.set(k,v);
 const result=await fetch(endpoint,{method,headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json',Prefer:prefer},...(body!==undefined?{body:JSON.stringify(body)}:{})});
 if(!result.ok)throw new Error('Storage request failed');if(result.status===204)return [];return await result.json();
}
const db={get:(table:string,q:Record<string,string>)=>rest(table,q),patch:(table:string,q:Record<string,string>,body:unknown)=>rest(table,q,'PATCH',body),insert:(table:string,body:unknown,options?:{onConflict?:string,ignore?:boolean})=>rest(table,options?.onConflict?{on_conflict:options.onConflict}:{},'POST',body,options?.ignore?'resolution=ignore-duplicates,return=representation':'return=representation')};
const verifyUser=async(token:string)=>{const r=await fetch(url+'/auth/v1/user',{headers:{apikey:secret,Authorization:'Bearer '+token}});return r.ok?await r.json():null;};
Deno.serve(createHandler({db,verifyUser,allowedOrigins:origins}));
