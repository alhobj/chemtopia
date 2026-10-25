// Inspection/testing only: production progression definitions do not load lab physics.
import {createState as filtration} from '../prototype/model.js';
import {createState as evaporation} from '../prototype/evaporation-model.js';
import {createState as chromatography} from '../prototype/chromatography-model.js';
import {createState as recrystallisation} from '../prototype/recrystallisation-model.js';
import {createState as solution} from '../prototype/solution-model.js';
import {createState as titration} from '../prototype/titration-model.js';
import {createState as distillation} from '../prototype/distillation-model.js';
import {createState as calorimetry} from '../prototype/calorimetry-model.js';
import {createState as rates} from '../prototype/rates-model.js';
import {createState as conductivity} from '../prototype/conductivity-model.js';
import {createState as colorimetry} from '../prototype/colorimetry-model.js';
import {createState as voltaic} from '../prototype/voltaic-model.js';
export const LAB_FACTORIES={filtration,evaporation,chromatography,recrystallisation,solution,titration,distillation,neutralisation:()=>calorimetry('neutralisation'),combustion:()=>calorimetry('combustion'),rates,conductivity,colorimetry,voltaic};
