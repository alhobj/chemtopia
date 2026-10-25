// Moving a vessel only changes its outer transform. Keep unchanged artwork in
// the DOM rather than reparsing images, masks and hundreds of grains each frame.
export function setArtwork(element,markup){
 if(element.__artwork===markup)return false;
 element.innerHTML=markup;element.__artwork=markup;return true;
}
