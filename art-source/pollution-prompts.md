
## 공기·물·흙 보강 (2026-10-08)

Built-in image_gen 편집 모드. 로컬 참조를 먼저 열어 검수했고, 생성 결과를 아래 프로젝트 경로로 복사했다. Pillow는 생성된 그림의 크기 맞춤·아틀라스 포장·WebP 압축에만 사용했다.

### 흙
참조: `farm-soil-reference.png` (기존 아틀라스의 농약 칸). 생성 원본: `farm-soil-v4.png`. 게임 파일: `dist/assets/world/farm-local-atlas-v4.webp` (535,198 bytes). 다른 세 칸의 구도와 내용은 유지한다.

최종 생성 문구:
```text
Use case: precise-object-edit. Asset type: painted environment state for a Korean elementary ecology story game. Input image 1 is the exact edit target: the existing village farm after excessive pesticide use. Edit this SINGLE landscape view, preserving the same aspect ratio, camera, exact positions and size of red-roof barn, greenhouse, paths, fences, scarecrow, chickens, neighboring trees and school roof. Keep the intricate warm hand-painted picturebook RPG style, outlines, lighting and textures unchanged. Change ONLY the crop-bed soil and their damaged crops: clearly expose more dull compacted soil between sparse wilted yellow-brown crops, several irregular damp pesticide/runoff residue patches and a small cloudy beige puddle along the low edge of the beds. Make the little furrows carry cloudy runoff toward the left downhill edge of the farm. Retain the existing contrast with lush healthy vegetation outside the treated beds. This is a subtle realistic environmental consequence of excessive pesticide use, visible even when viewed at map scale. No radioactive green liquid, no pitch-black soil, no fog, no oversized bottles, no label, no diagram, no icon, no text, no gutters, no added characters. Do not change any scenery outside the beds or zoom out. Output one flush illustration, not an atlas.
```

### 농장에서 흘러든 물
참조: `river-runoff-reference.png` (기존 아틀라스의 수리 칸). 생성 원본: `river-farm-runoff-v1.png`. 게임 파일: `dist/assets/world/river-farm-runoff-v1.webp` (97,330 bytes).

최종 생성 문구:
```text
Use case: precise-object-edit. Asset type: painted river runoff state in an elementary ecology story game. Input image 1 is the exact edit target: existing river view with REPAIRED workshop and TWO blue-water treatment tanks. Output a single view with exactly the same framing, aspect, perspective, landmarks and miniature scale, intricate warm hand-painted picturebook RPG illustration. Preserve the wooden bridge, small workshop, both functioning blue treatment tanks and the CLEAN blue outflow from the workshop unchanged: this facility has been fixed. Change only the river at the UPPER RIGHT river bank below the existing farm plot: a very narrow shallow runoff rivulet crosses under the existing farm fence/footpath from the farm corner and carries cloudy ochre-brown water into the river upstream of the bridge. Show a clear but localized cloudy ochre plume entering from that bank, mixing downstream through the narrow existing river below the bridge. Leave the far upper upstream river blue and make the source visually traceable to farm soil runoff, NOT the workshop drain. A few nearby reed tips look dull, but no dead fish at this stage. Keep all untouched scenery, tree positions, paths, school, bridge width and architecture identical. No new wide river, no giant ditch, no neon pollutant, no pipes from farm, no text, labels, arrows, icons, border or collage. Match brush style and lighting perfectly. Output one flush illustration, not an atlas.
```
