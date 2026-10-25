import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import './check.mjs';
await rm('dist',{recursive:true,force:true});
await mkdir('dist');
await cp('prototype','dist',{recursive:true});
await writeFile('dist/README.txt','Static Chemtopia build. Serve through HTTP and open adventure.html. index.html remains the original filtration lab. Local profiles stay in this browser.\n');
console.log('Built static files in dist/. Use the Node development server for original lab URLs.');
