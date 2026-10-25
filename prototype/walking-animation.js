import {WALK_ATLASES} from './walking-atlases.js';
// Atlas rows are down/front, up/back, and right. Left mirrors the right row.
// Distance drives the gait so blocked movement never walks in place.
export const WALK_DIRECTIONS = ['front', 'back', 'left', 'right'];
export const WALK_STEP_DISTANCE = 18;

export function walkingPose(facing, distance = 0, moving = false, reducedMotion = false) {
  const direction = WALK_DIRECTIONS.includes(facing) ? facing : 'front';
  return {
    direction,
    row: direction === 'back' ? 1 : direction === 'left' || direction === 'right' ? 2 : 0,
    frame: moving && !reducedMotion ? Math.floor(Math.max(0, distance) / WALK_STEP_DISTANCE) % 4 : 1,
    mirror: direction === 'left',
    moving: Boolean(moving),
  };
}

export function walkingArt(characterId, pose) {
  if (!/^c01-[1-6]$/.test(characterId)) return '';
  // Register each pose to its torso and foot baseline. Cell centres differ in
  // generated sheets; displaying raw cells made a stationary gait jump sideways.
  const atlas=WALK_ATLASES[characterId],cell=atlas.rows[pose.row][pose.frame];
  const scale=(130/150)/cell.height,cx=(.5-cell.cx*scale),cy=145/150-cell.bottom*scale;
  const clip = `walk-clip-${characterId}`;
  return `<svg class="character-art walk-sprite" data-character="${characterId}" data-facing="${pose.direction}" data-frame="${pose.frame}" data-moving="${pose.moving}" x="-43.5" y="-87" width="87" height="87" viewBox="0 0 1 1" preserveAspectRatio="xMidYMax meet" overflow="hidden"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect width="1" height="1"/></clipPath></defs><g clip-path="url(#${clip})"><g class="walk-mirror" transform="${pose.mirror ? 'translate(1 0) scale(-1 1)' : ''}"><svg class="walk-cell-crop" x="${cx}" y="${cy}" width="${cell.w*scale}" height="${cell.h*scale}" viewBox="${cell.x} ${cell.y} ${cell.w} ${cell.h}" overflow="hidden"><image href="assets/world/${atlas.file}" width="${atlas.width}" height="${atlas.height}"/></svg></g></g></svg>`;
}

// Reuse the live image node while advancing frames: no SVG/image reconstruction.
export function renderWalking(container,characterId,pose){
 let svg=container.querySelector('.walk-sprite');
 if(!svg||svg.dataset.character!==characterId||svg.classList.contains('idle-sprite')){
  container.innerHTML=walkingArt(characterId,pose);svg=container.querySelector('.walk-sprite');delete container.dataset.idleKey;
 }
 if(!svg)return;
 if(svg.dataset.facing===pose.direction&&Number(svg.dataset.frame)===pose.frame&&svg.dataset.moving===String(pose.moving))return;
 const cell=WALK_ATLASES[characterId].rows[pose.row][pose.frame],scale=(130/150)/cell.height,crop=svg.querySelector('.walk-cell-crop');
 svg.dataset.facing=pose.direction;svg.dataset.frame=pose.frame;svg.dataset.moving=pose.moving;
 svg.querySelector('.walk-mirror').setAttribute('transform',pose.mirror?'translate(1 0) scale(-1 1)':'');
 for(const [key,value]of Object.entries({x:.5-cell.cx*scale,y:145/150-cell.bottom*scale,width:cell.w*scale,height:cell.h*scale,viewBox:`${cell.x} ${cell.y} ${cell.w} ${cell.h}`}))crop.setAttribute(key,value);
}
