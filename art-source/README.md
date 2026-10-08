# 지도 그림 제작 기록

내장 image_gen으로 기존 지도 구역을 참조해 다시 그렸습니다. 도로·건물·작물·수거함·연기는 그림에 포함되어 있으며, SVG는 구역 위치와 가장자리 연결에만 사용합니다. 기존 지도·계정·엔딩 판정은 유지했습니다.

최종 배포 그림: `dist/assets/world/forest-local-atlas-v3.webp`, `river-local-atlas-v3.webp`, `farm-local-atlas-v4.webp`, `festival-local-atlas-v3.webp`, `river-farm-runoff-v1.webp`.

2026-10-08 공기·물·흙 보강: [생성 문구와 파일 기록](pollution-prompts.md). 아래 v3 문구는 기존 그림의 제작 이력입니다.

원본 구역과 생성 PNG는 이 폴더에 보관합니다. PNG는 공개 배포와 Git 저장에서 제외하고, 게임 표시 크기에 맞춘 WebP만 배포합니다. 처음 만든 전체 지도 묶음은 확대 시 선명도가 달라 최종판에서 사용하지 않습니다.

## forest

참조: `forest-reference.png`. 생성 원본: `forest-local-atlas-v3.png`.

최종 생성 문구:

```text
Use case: precise-object-edit. Asset type: detailed LOCAL environment state atlas for a game.
Input image 1 is the EXACT EDIT TARGET, a cropped area of a larger village illustration. Output a flush 2-by-2 atlas containing four copies of this SAME CROPPED VIEW. Each panel has the exact same aspect ratio as the reference crop. Do not zoom out or show the rest of the map. The four panels must have identical framing, unchanged landmarks at exactly same positions and same pixel scale. Preserve every unaffected pixel/area as closely as possible. Match intricate warm hand-painted RPG picturebook style, richly painted vegetation, fine textured wood/stone, original perspective, sunlight and contact shadows. Native detail appropriate for close-up play, not simplified blurry thumbnails. No geometric flat overlays, dashboard icons, graphic plates, text, labels, borders, gutters, checkmarks, arrows or watermark. Reference crop is 680x540; overall atlas ratio 34:27. Preserve waterfall fragment and wooden bridge at extreme right, coast/wooden lookout lower-left, woodland tree positions outside work area. Each panel:
TOP LEFT cut: widen a gently winding gray road through the rabbit's woodland trail from upper-left woodland towards the central wooden bridge at right edge. Modest road width 28-35 reference pixels. Detailed worn pale lane marks, earth shoulders, small cut stumps, remove bushes/trees only in road's actual footprint. Road follows ground perspective and gently bends. Not a huge diagonal highway.
TOP RIGHT detour: original woods, rabbits and nest retained, tidy the original tan trail only, tiny rustic unlettered timber direction sign beside it. No new highway.
BOTTOM LEFT corridor: small woodland road and a small realistic grassy wildlife bridge above it near crop center, arched stone/timber supports, flowered grass strip and rabbit trail across road, woodland retained around it. Natural shadows and miniature proportions.
BOTTOM RIGHT garden: clear only the middle woodland thicket into a modest fenced uniform flower garden, several edge stumps, remove rabbit/nest habitat within cleared plot. Keep other trees, original existing trails, coast and waterfall fragment unchanged.
```

## river

참조: `river-reference.png`. 생성 원본: `river-local-atlas-v3.png`.

최종 생성 문구:

```text
Use case: precise-object-edit. Asset type: six-state LOCAL river illustration atlas for a game.
Input image 1 is the EXACT EDIT TARGET: a 420x400 crop of an existing detailed village illustration. Create a flush 2-column by 3-row atlas of SIX copies of this exact crop, each panel with the same 420:400 ratio, identical framing and landmarks. Overall aspect 7:10. Do not show the rest of the village, do not zoom out. Match reference drawing quality closely. Keep the bridge at precisely the same place and angle in the upper-left, narrow river same width and shape, stones/reeds same positions, farm plots at top right, big leafy tree and bench at right and tan footpath unchanged. Preserve landscape everywhere except a small affected stretch of river downstream of bridge and a SMALL workshop just beside its east bank. No widening river into lake; no giant buildings.
Each panel: tiny timber workshop about 55x45 reference pixels wide beside river on east bank just below bridge near (180,170), no larger than original bench/tree proportions. Tiny drain enters river. Treatment tanks when present are only about 22 reference pixels diameter, natural textures, architectural perspective. Keep shadows/scale/brush outlines identical to original, intricately hand-painted, no flat vector geometry.
TOP LEFT baseline: localized olive-brown pollution plume IN existing narrow stream, three little floating discarded cups/bottle. Upstream unchanged blue.
TOP RIGHT treat: workshop repaired with modest timber/stone extension and two tiny circular purification tanks, proper real pipes; clean blue stream. Healthy reeds. No badges or checks.
MIDDLE LEFT clean: small refuse sacks on river bank, floating litter removed, olive murky plume still coming from tiny drain.
MIDDLE RIGHT hide: small tan cloth screen beside workshop conceals drain from footpath, one short unlit lantern string; pollution still visible downstream.
BOTTOM LEFT share: unfinished small repair extension and one incomplete tank, a few boards/sacks and tiny cloth screen, muddy water still present.
BOTTOM RIGHT harm: unchanged untreated workshop, localized murky water, dull reeds, two small pale fish floating belly-up below bridge, naturally painted without X eyes, no gore.
NO labels, text, numbers, gutters, borders, UI, check marks, icon shapes, arrows or watermark. Do not alter scale/camera/terrain.
```

## farm

참조: `farm-reference.png`. 생성 원본: `farm-local-atlas-v3.png`.

최종 생성 문구:

```text
Use case: precise-object-edit. Asset type: detailed LOCAL environment state atlas for a game.
Input image 1 is the EXACT EDIT TARGET, a cropped area of a larger village illustration. Output a flush 2-by-2 atlas containing four copies of this SAME CROPPED VIEW. Each panel has the exact same aspect ratio as the reference crop. Do not zoom out or show the rest of the map. The four panels must have identical framing, unchanged landmarks at exactly same positions and same pixel scale. Preserve every unaffected pixel/area as closely as possible. Match intricate warm hand-painted RPG picturebook style, richly painted vegetation, fine textured wood/stone, original perspective, sunlight and contact shadows. Native detail appropriate for close-up play, not simplified blurry thumbnails. No geometric flat overlays, dashboard icons, graphic plates, text, labels, borders, gutters, checkmarks, arrows or watermark. Reference crop is 670x390; overall atlas ratio 67:39. Keep red-roof barn, greenhouse, fences, paths and buildings at precisely their reference positions. ONLY change the existing crop beds:
TOP LEFT care: retain varied healthy cabbages, carrots, grain and flowers; one small damaged patch tended with a tiny unlettered wooden marker, miniature bees near existing flowers.
TOP RIGHT spray: most crop beds become pale wilted yellow-brown rows and dull ground, few collapsed plants, no flying insects. No fog patch, no spray can symbol. Preserve soil/foliage texture.
BOTTOM LEFT garden: replace crop beds with uniform rows of the same pink flower species, same beds/fences, no diverse crops or weeds.
BOTTOM RIGHT wait: irregular overgrown weeds, visibly holed cabbage leaves, partially collapsed wilted crops, mixed unmanaged damaged beds.
Preserve chickens beyond crop beds and all untouched buildings. No added camera angle.
```

## festival

참조: `festival-reference.png`. 생성 원본: `festival-local-atlas-v3.png`.

최종 생성 문구:

```text
Use case: precise-object-edit. Asset type: detailed LOCAL environment state atlas for a game.
Input image 1 is the EXACT EDIT TARGET, a cropped area of a larger village illustration. Output a flush 2-by-2 atlas containing four copies of this SAME CROPPED VIEW. Each panel has the exact same aspect ratio as the reference crop. Do not zoom out or show the rest of the map. The four panels must have identical framing, unchanged landmarks at exactly same positions and same pixel scale. Preserve every unaffected pixel/area as closely as possible. Match intricate warm hand-painted RPG picturebook style, richly painted vegetation, fine textured wood/stone, original perspective, sunlight and contact shadows. Native detail appropriate for close-up play, not simplified blurry thumbnails. No geometric flat overlays, dashboard icons, graphic plates, text, labels, borders, gutters, checkmarks, arrows or watermark. Reference crop is 520x420; overall atlas ratio 26:21. Preserve exact blue-roof buildings, central round tree planter, market stalls, plaza paths, railings and roof outlines. Keep their positions precisely unchanged. Only alter small items and activities on plaza and waste station:
TOP LEFT reuse: small timber reusable-cup return counter with several small cups on rack beside existing waste station, tidy three-material bins and clean plaza; original daytime lantern string unlit. Counter no more than 55 reference pixels wide, bins same scale as existing bins.
TOP RIGHT once: a few small tied refuse sacks near bins, mostly swept plaza with a handful of crumpled disposable cups still at benches.
BOTTOM LEFT party: extra softly glowing daytime lantern string across plaza, little disposable-cup stacks on stall, many tiny scattered used cups/wrappers on floor.
BOTTOM RIGHT burn: small waste-burning pile beside bins with dark charcoal and modest orange embers, irregular wispy semitransparent gray smoke drifting over one side of plaza. Real painterly smoke, not circles, no giant campfire.
No injury/gore, no instructional fire diagram. Every cup, bin, lantern and sack must be a small real painted object, not an oversized UI icon.
```
