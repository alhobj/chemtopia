# Local physics dependency

`matter.js` contains Matter.js **0.20.0**, by Liam Brummitt and contributors, under the [MIT licence](MATTER-LICENSE.txt).

- Project: https://github.com/liabru/matter-js
- Package: https://registry.npmjs.org/matter-js/-/matter-js-0.20.0.tgz
- Source inside package: `package/build/matter.min.js`
- Downloaded package SHA-256: `c2594c16b67adf76d32d9c4576a388a32cee80e5dfe2823cd3bf1b8fb93cc7f2`
- Local JavaScript SHA-256: `e3616f86e920fed3714571803dfc945cf46ed6d68cfdcc2b2887a7d5f3f853a2`

The upstream minified build is preserved except for changing the UMD root from `this` to `globalThis` and appending `export default globalThis.Matter;`. This lets the same local module run in both browsers and Node's test runner. The upstream copyright header and licence are retained.

The file is committed so playing or testing requires no package installation, CDN or Internet request. The game's collision shapes and interactions are authored in `../physics.js`; this folder is third-party code, not game artwork.
