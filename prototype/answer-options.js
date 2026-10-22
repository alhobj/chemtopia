export function shuffledAnswers(answers,random=Math.random){
 const options=answers.map((text,value)=>({text,value}));
 for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
 return options;
}
export const answerOptions=(answers,name='answer')=>shuffledAnswers(answers).map(({text,value})=>`<label class="answer-option"><input type="radio" name="${name}" value="${value}" required><span>${text}</span></label>`).join('');
