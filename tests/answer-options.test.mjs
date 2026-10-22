import test from 'node:test';
import assert from 'node:assert/strict';
import {shuffledAnswers} from '../prototype/answer-options.js';
test('answer order varies while stable IDs retain the correct marking',()=>{const answers=['correct','wrong A','wrong B'];const a=shuffledAnswers(answers,()=>0),b=shuffledAnswers(answers,()=>.99);assert.notDeepEqual(a,b);assert.notEqual(a[0].value,0);for(const options of [a,b]){assert.deepEqual(options.map(o=>o.value).sort(),[0,1,2]);assert.equal(options.find(o=>o.value===0).text,'correct');}});
