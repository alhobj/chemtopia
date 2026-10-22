import {answerOptions} from './answer-options.js';
// Original practice questions. Numerical examples are supplied data, not model readings.
export const QUESTION_BANK={
 filtration:[
  {prompt:'Why did filtration separate this mixture?',answers:[
   'Insoluble sand stays on the paper; liquid water passes through.',
   'Dissolved sand stays on the paper; liquid water passes through.',
   'Liquid water stays on the paper; insoluble sand passes through.'
  ],hint:'Consider which material is insoluble and which passes through the paper.'},
  {prompt:'A sample contains sand and salt dissolved in water. After filtration, what is in the filtrate?',answers:[
   'Water and dissolved salt pass through; insoluble sand stays behind.',
   'Water and suspended sand pass through; dissolved salt stays behind.',
   'Only pure water passes through; both sand and salt stay behind.'
  ],hint:'Filtration retains insoluble particles, but does not remove dissolved salt.'},
  {prompt:'A sample starts with 8.0 g of sand and 5.0 g of dissolved salt. After filtration and drying, 6.4 g of sand is recovered. Calculate the percentage recovery of sand.',fields:[{id:'value',label:'Sand recovery (%)',answer:80,tolerance:.05}],hint:'Use recovered sand ÷ starting sand × 100. Dissolved salt is not part of the starting sand mass.'}
 ],
 distillation:[
  {prompt:'Why is acetone collected before water in this model?',answers:[
   'Acetone boils first; the condenser cools its vapour to liquid.',
   'Water boils first; the condenser converts this water into acetone.',
   'Both boil together; the condenser filters only acetone from water.'
  ],hint:'Compare the boiling points and distinguish condensation from filtration.'},
  {prompt:'Two identical runs use different coolant inlet ports. Why can feeding the upper port reduce acetone recovery in this model?',answers:[
   'The jacket fills less completely, so more process vapour escapes.',
   'The jacket fills more completely, so more process vapour escapes.',
   'The coolant mixes with acetone, so less acetone reaches the receiver.'
  ],hint:'Compare jacket filling and condensation; coolant remains separate from the sample.'},
  {prompt:'A feed contains 0.50 mol of acetone. The collected distillate contains 0.30 mol of acetone and 0.10 mol of water. Calculate both acetone recovery and the acetone mole percentage in the distillate.',fields:[{id:'recovery',label:'Acetone recovery (%)',answer:60,tolerance:.05},{id:'composition',label:'Acetone in collected distillate (mol %)',answer:75,tolerance:.05}],hint:'Recovery uses initial acetone; composition uses total collected acetone plus water.'}
 ],
 chromatography:[
  {prompt:'How do you calculate an R_F value from ruler measurements?',answers:[
   'Divide baseline-to-spot distance by baseline-to-front distance, using matching units.',
   'Divide baseline-to-front distance by baseline-to-spot distance, using matching units.',
   'Divide bottom-edge-to-spot distance by bottom-edge-to-front distance, using matching units.'
  ],hint:'Measure both distances from the pencil baseline; put the spot distance in the numerator.'},
  {prompt:'A spot centre travels 3.6 cm from the pencil baseline. The solvent front travels 8.0 cm from that baseline. Calculate R_F to two decimal places.',fields:[{id:'value',label:'R_F (no units)',answer:.45,tolerance:.005}],hint:'Divide 3.6 by 8.0. R_F is a ratio, so it has no units.'},
  {prompt:'The baseline is 1.0 cm above the bottom edge and the marked solvent front is 9.0 cm above that edge. A band has R_F = 0.65. Calculate the height of its centre above the bottom edge.',fields:[{id:'value',label:'Band-centre height above bottom edge (cm)',answer:6.2,tolerance:.05}],hint:'Find baseline-to-front distance first, multiply by R_F, then add the baseline height.'}
 ],
 evaporation:[
  {prompt:'Why does salt remain when this solution is heated?',answers:[
   'Water evaporates; the non-volatile sodium chloride stays behind.',
   'Salt evaporates; the remaining water changes into a new solid.',
   'Both substances evaporate; salt vapour then settles in the basin.'
  ],hint:'Heating separates the solvent from a non-volatile solute; it does not create salt.'},
  {prompt:'A student weighs the recovered salt while it is still wet. How does this affect the reported dry-salt recovery?',answers:[
   'It is too high because the measured mass includes retained water.',
   'It is too low because the measured mass excludes dissolved salt.',
   'It is unchanged because retained water has no effect on the mass.'
  ],hint:'A wet sample includes water as well as salt; dry-salt recovery should exclude that water.'},
  {prompt:'A 12.0 g solution contains 20.0% salt by mass. After evaporation, 2.10 g of dry salt is collected. Calculate the percentage recovery of salt.',fields:[{id:'value',label:'Salt recovery (%)',answer:87.5,tolerance:.05}],hint:'Find the starting salt mass from the solution mass and mass percentage, then calculate recovery.'}
 ],
 recrystallisation:[
  {prompt:'Why did crystals form when the hot filtrate cooled?',answers:[
   'Solubility falls on cooling; some solute forms solid crystals.',
   'Solubility rises on cooling; all solute becomes solid crystals.',
   'Solubility stays unchanged; dissolved sand forms new crystals.'
  ],hint:'Cooling reduces solubility; some desired solute still remains in the mother liquor.'},
  {prompt:'Two clean hot solutions contain equal solute amounts, but one uses much more water. After both cool to the same temperature, why can the more dilute solution produce fewer crystals?',answers:[
   'More solvent can keep more solute dissolved in the mother liquor.',
   'More solvent makes the cold solute less soluble in the mother liquor.',
   'More solvent converts some of the desired solute into insoluble sand.'
  ],hint:'At the same temperature, a larger solvent amount can retain more dissolved solute.'},
  {prompt:'In a hypothetical solubility example, a hot solution contains 10.0 g of solute in 25.0 g of water. At the final temperature, solubility is 20.0 g per 100 g of water. With no evaporation or transfer losses, calculate the maximum mass of crystals formed.',fields:[{id:'value',label:'Maximum crystal mass (g)',answer:5,tolerance:.05}],hint:'Calculate how much remains dissolved in 25.0 g of water, then subtract it from the starting solute mass.'}
 ]
};
export function checkQuestion(question,values){
 if(question.answers)return values.answer==='0';
 return question.fields.every(f=>typeof values[f.id]==='string'&&values[f.id].trim()!==''&&Number.isFinite(Number(values[f.id]))&&Math.abs(Number(values[f.id])-f.answer)<=f.tolerance+1e-10);
}
export function reviewQuestions(lab){
 return `<form id="explanation"><h3>Review questions</h3><p>Answer all three questions. Questions 2 and 3 apply the ideas to harder examples. Numerical data below are practice examples.</p>${QUESTION_BANK[lab].map((q,i)=>`<fieldset data-question="${i+1}"><legend>${i+1}. ${q.prompt}</legend>${q.answers?answerOptions(q.answers,i===0?'answer':`q${i+1}-answer`):q.fields.map(f=>`<label class="calculation-answer"><span>${f.label}</span><input name="q${i+1}-${f.id}" type="number" step="any" required></label>`).join('')}<p class="review-feedback" data-review-feedback="${i+1}" aria-live="polite"></p></fieldset>`).join('')}<button class="primary" type="submit">Check answers</button><p id="question-feedback" aria-live="polite"></p></form>`;
}
export function bindReviewQuestions(lab,onComplete){
 const form=document.getElementById('explanation');if(!form)return;
 form.addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(form);
  const results=QUESTION_BANK[lab].map((q,i)=>{
   const values=q.answers?{answer:data.get(i===0?'answer':`q${i+1}-answer`)}:Object.fromEntries(q.fields.map(f=>[f.id,data.get(`q${i+1}-${f.id}`)]));
   const correct=checkQuestion(q,values);form.querySelector(`[data-review-feedback="${i+1}"]`).textContent=correct?'Correct.':q.hint;return correct;
  });
  const feedback=document.getElementById('question-feedback');
  if(results.every(Boolean)){
   feedback.textContent=onComplete()===false?'All three questions are correct. Complete the ruler measurements to finish.':'Activity complete. All three questions are correct.';
   for(const field of form.querySelectorAll('fieldset'))field.disabled=true;form.querySelector('button').disabled=true;
  }else feedback.textContent='Check the feedback for each question. Choose another answer or revise the calculation, then try again.';
 });
}
