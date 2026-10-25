export const TUTORIAL_STAGES=[
 {id:'movement',title:'Find your feet',text:'Walk around the square, inspect the welcome sign and speak to the guide. Move with arrows/WASD, click a destination, or use the touch controls. E or Interact talks to nearby people and objects.',requires:['move','welcome-sign','guide']},
 {id:'inventory',title:'Your laboratory kit',text:'Open Inventory. Inspect one piece of reusable equipment and one consumable supply. Your starter kit is small; more apparatus can be acquired later.',requires:['inventory-open','inspect-equipment','inspect-material']},
 {id:'currency',title:'Lab credits',text:'Open your credit balance and read how the provisional currency works. Credits buy equipment; future missions can award credits and equipment.',requires:['currency-read']},
 {id:'laboratory',title:'Your first laboratory',text:'Enter the laboratory, inspect the evaporation experiment requirements and start it. Other experiments need additional equipment or materials. You can return here before finishing the experiment.',requires:['enter-lab','view-requirements','start-experiment']},
 {id:'progression',title:'Choose your next equipment',text:'Open the progression map at the noticeboard. Inspect an unavailable experiment to see which equipment or supplies it needs. If you already own every requirement, inspect any experiment. Equipment ownership opens branches; completing a topic is not an arbitrary gate.',requires:['open-map','inspect-locked']}
];
export function tutorialState(){return{stage:0,flags:[],replays:0};}
export function tutorialEvent(player,event){if(!TUTORIAL_STAGES.some(s=>s.requires.includes(event)))return false;const t=player.tutorial;if(!t.flags.includes(event))t.flags.push(event);const previous=t.stage;while(t.stage<TUTORIAL_STAGES.length&&TUTORIAL_STAGES[t.stage].requires.every(e=>t.flags.includes(e)))t.stage++;return t.stage!==previous;}
export function replayTutorial(player){player.tutorial={...tutorialState(),replays:(player.tutorial.replays||0)+1};}
export const currentTutorial=player=>TUTORIAL_STAGES[player.tutorial.stage]||null;
