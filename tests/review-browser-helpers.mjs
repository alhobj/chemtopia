// Expected solutions are independent of option order and the rendering code.
const followups={
 filtration:{'q2-answer':'0','q3-value':'80'},
 distillation:{'q2-answer':'0','q3-recovery':'60','q3-composition':'75'},
 chromatography:{'q2-value':'.45','q3-value':'6.2'},
 evaporation:{'q2-answer':'0','q3-value':'87.5'},
 recrystallisation:{'q2-answer':'0','q3-value':'5'}
};
export async function fillFollowups(evaluate,lab){
 await evaluate("new Promise(resolve=>setTimeout(resolve,500))");
 await evaluate(`(()=>{for(const [name,value] of Object.entries(${JSON.stringify(followups[lab])})){const fields=[...document.querySelectorAll('#explanation [name="'+name+'"]')];if(fields[0].type==='radio')fields.find(f=>f.value===value).checked=true;else fields[0].value=value;}})()`);
}
