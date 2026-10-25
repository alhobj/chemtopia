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
  // Normalised atlas coordinates avoid coupling runtime layout to PNG resolution.
  // The clip is the current cell; artwork retains its actual pixel detail.
  const clip = `walk-clip-${characterId}-${pose.direction}-${pose.frame}`;
  return `<svg class="character-art walk-sprite" data-character="${characterId}" data-facing="${pose.direction}" data-frame="${pose.frame}" data-moving="${pose.moving}" x="-43" y="-86" width="86" height="86" viewBox="0 0 1 1" preserveAspectRatio="xMidYMax meet" overflow="hidden"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect width="1" height="1"/></clipPath></defs><g clip-path="url(#${clip})"><g transform="${pose.mirror ? 'translate(1 0) scale(-1 1)' : ''}"><image href="assets/world/walk-${characterId}.png" x="${-pose.frame}" y="${-pose.row}" width="4" height="3" preserveAspectRatio="none"/></g></g></svg>`;
}
