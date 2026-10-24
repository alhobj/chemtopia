// Exercise the same room navigation students use; only wait out document replacement.
export async function visitLab({id,click,evaluate,pause}){
 await click('#return-laboratory');
 for(let i=0;i<60;i++){
  try{if(await evaluate("!!document.querySelector('#laboratory-room [data-lab]')"))break;}
  catch(e){if(e.code!==-32000||!/navigated|context.*destroyed/i.test(e.message))throw e;}
  await pause(100);
 }
 await click(`[data-lab="${id}"]`);
 for(let i=0;i<60;i++){
  try{if(await evaluate("!!document.querySelector('#equipment-menu')"))break;}
  catch(e){if(e.code!==-32000||!/navigated|context.*destroyed/i.test(e.message))throw e;}
  await pause(100);
 }
}
