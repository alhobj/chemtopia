import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTION_BANK,checkQuestion,reviewQuestions} from '../prototype/review-questions.js';
for(const [lab,questions]of Object.entries(QUESTION_BANK)){
 test(lab+': three ordered questions retain the concept first and require harder numerical work',()=>{
  assert.equal(questions.length,3);assert.ok(questions[0].answers);assert.ok(questions[2].fields);
  const html=reviewQuestions(lab);assert.equal((html.match(/data-question="/g)||[]).length,3);
  for(const q of questions){
   if(q.answers){assert.ok(checkQuestion(q,{answer:'0'}));assert.ok(!checkQuestion(q,{answer:'1'}));const lengths=q.answers.map(a=>a.length);assert.ok(Math.max(...lengths)/Math.min(...lengths)<1.3,'choices have comparable lengths');}
   else{const values=Object.fromEntries(q.fields.map(f=>[f.id,String(f.answer)]));assert.ok(checkQuestion(q,values));for(const f of q.fields){assert.ok(!checkQuestion(q,{...values,[f.id]:''}));assert.ok(!checkQuestion(q,{...values,[f.id]:'0'}));assert.ok(!checkQuestion(q,{...values,[f.id]:'NaN'}));}}
  }
 });
}
test('correct choices do not have a systematic longest-text cue',()=>{
 const choices=Object.values(QUESTION_BANK).flat().filter(q=>q.answers);for(const q of choices)assert.ok(q.answers[0].length<=Math.max(...q.answers.slice(1).map(a=>a.length)),'the correct answer is never uniquely longest');
});
test('numerical examples use the relevant denominators and baseline offsets',()=>{
 assert.ok(checkQuestion(QUESTION_BANK.filtration[2],{value:String(6.4/8*100)}));
 assert.ok(checkQuestion(QUESTION_BANK.distillation[2],{recovery:String(.3/.5*100),composition:String(.3/(.3+.1)*100)}));
 assert.ok(!checkQuestion(QUESTION_BANK.distillation[2],{recovery:'75',composition:'60'}));
 assert.ok(checkQuestion(QUESTION_BANK.evaporation[2],{value:String(2.1/(12*.2)*100)}));
 assert.ok(checkQuestion(QUESTION_BANK.recrystallisation[2],{value:String(10-25*20/100)}));
 assert.ok(checkQuestion(QUESTION_BANK.chromatography[1],{value:String(3.6/8)}));
 assert.ok(!checkQuestion(QUESTION_BANK.chromatography[1],{value:String(8/3.6)}));
 assert.ok(checkQuestion(QUESTION_BANK.chromatography[2],{value:String(1+.65*(9-1))}));
 assert.ok(!checkQuestion(QUESTION_BANK.chromatography[2],{value:'5.2'}));
});
