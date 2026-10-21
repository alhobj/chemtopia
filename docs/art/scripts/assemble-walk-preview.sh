#!/usr/bin/env bash
# Assemble generated W01 artwork into a review GIF; this is not game code.
set -euo pipefail
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
art_dir="$(cd -- "$script_dir/.." && pwd)"
source_image="$art_dir/proposals/walk-cycle-w01.png"
output_image="$art_dir/previews/walk-cycle-w01.gif"
work_dir="$(mktemp -d /tmp/chemtopia-walk-preview.XXXXXX)"
trap 'rm -rf -- "$work_dir"' EXIT
[[ "$(identify -format '%wx%h' "$source_image")" == '2172x724' ]] || {
  echo 'W01 source dimensions changed; review cell boundaries before assembly.' >&2
  exit 1
}
convert "$source_image" -crop 4x1@ +repage "$work_dir/frame-%d.png"
for frame in 0 1 2 3; do
  # Register the upper silhouette so uneven source spacing does not slide the head.
  head_box="$(convert "$work_dir/frame-$frame.png" -crop 543x250+0+0 +repage -alpha extract -threshold 30% -format '%@' info:)"
  [[ "$head_box" =~ ^([0-9]+)x([0-9]+)\+([0-9]+)\+([0-9]+)$ ]] || exit 1
  head_width="${BASH_REMATCH[1]}"
  head_left="${BASH_REMATCH[3]}"
  offset=$((271 - head_left - head_width / 2))
  printf -v placement '%+d+0' "$offset"
  convert -size 543x724 xc:'#f7f5ef' "$work_dir/frame-$frame.png" \
    -geometry "$placement" -composite -filter point -resize 240x320! \
    "$work_dir/aligned-$frame.png"
done
mkdir -p -- "$(dirname -- "$output_image")"
convert -delay 14 "$work_dir/aligned-0.png" "$work_dir/aligned-1.png" \
  "$work_dir/aligned-2.png" "$work_dir/aligned-3.png" \
  -loop 0 -layers Optimize "$output_image"
printf 'Created %s\n' "$output_image"
