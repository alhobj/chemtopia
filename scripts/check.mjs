import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {validateDefinitions} from '../prototype/experiment-definitions.js';
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]))).flat();}
for(const file of (await Promise.all(['prototype','scripts','tests'].map(walk))).flat().filter(f=>/\.(mjs|js)$/.test(f)&&!f.includes('/vendor/'))){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);}
validateDefinitions();
console.log('JavaScript syntax and experiment definitions checked.');
