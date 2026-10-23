# Selected B equipment sprites

`equipment-atlas.png` is an original AI-generated sprite adaptation of the owner's selected **row B detailed pixel-art equipment studies**, prepared with `image_gen` on 23 October 2026. It replaces the earlier smooth SVG equipment placeholders across the nine workbenches. It is an adaptation for interactive use, not a set of pixel-identical crops from the concept sheets.

The unchanged source sheets are in `docs/art/proposals/`. Direct image references for this adaptation were P01, P02, P04, P07 and P12. The adaptation also includes matching small tools and the newly implemented insulated cup, aluminium can and ethanol burner. No external or previous-project assets were used. No new licence is asserted: these are project-generated assets, and the project-wide licence decision remains open. The owner's current request explicitly authorises their in-game use; it does not approve every piece of apparatus pictured on all concept sheets as new gameplay scope.

Atlas SHA-256: `a1f57ddb31a25ef9e928250c9c0e7eb38fb864637f073eb77f882efe1fdad1d6`.

## Bounds and rendering

`atlas.js` records the 30 sprite bounds, measured from the generated atlas. The atlas is copied unchanged from the image-generation output. Each sprite uses an SVG viewport into that local image; no image service, canvas processing, new dependency or remote request is required at runtime. Nearest-neighbour image rendering preserves the pixel edges.

`prototype/equipment-art.js` places the art in the existing apparatus coordinate system. Separate bowl/stem pieces keep funnel proportions aligned with existing support and insertion geometry. Stands are assembled from base, pole and ring pieces. The condenser follows the existing sloped axis; its functional coolant ports remain at the actual hose anchors. The angled still-head outlet follows the existing joint. New art does not replace or resize Matter.js bodies, model coordinates or experiment attachment rules.

Moving liquid, salts, crystals, chromatography bands, indicator colour, true calibration scales, digital values and control states remain live model-driven SVG overlays. Thermometer columns and digital readings respond to the live temperature. Meaningful labels and readable numbers remain normal text rather than baked pixel lettering. Rulers/chromatography paper and fixed plumbing retain geometric measurement rendering so their scales and operations remain usable.

`docs/design/design-b-equipment-review.md` records the practical checks and previews. The drawings remain stylised two-dimensional representations, with forgiving placement tolerances and visible liquid cutaways; they are not precision scientific diagrams.
