# Painted character images · 2026-10-08

Generated with the built-in imagegen tool; no API/CLI fallback. Village illustration is a style reference, not an edit target. Transparent original PNGs are saved locally in `art-source/character-<role>-v1.png` (ignored by Git). Packaged 256×384 WebP assets retain alpha and are used by map walking, chapter introductions and live dialogue. They require no external image service.

Packaged asset total: 155,848 bytes. Verified map sprite loading and footpath travel in the real game at 1024×600. All four live dialogue cutouts loaded at 800×480 without page or panel overflow. Introduction portrait loaded without overflow at 800×480. Existing ecology, state, world, mission, navigation and save-schedule checks passed. Browser visual fixture: `qa/character-preview.html` (not shipped).

## explorer

Asset: `dist/assets/characters/explorer-v1.webp`

Prompt:

Use case: illustration-story. Asset type: transparent full-body game character sprite for a Korean elementary-school ecology game. The reference is STYLE ONLY, do not include its landscape. Create one adorable young village explorer, short chestnut hair, soft friendly face, mustard jacket, moss-green small backpack, brown boots. Hand-painted gouache storybook illustration, warm natural colors, organic brush textures and delicate brown outlines matching the supplied illustrated village. A cute 3-head-tall figure, front three-quarter view from slightly above for an isometric village map. Upright relaxed pose, both feet visible and aligned at bottom, hands free, readable silhouette at 60 pixels. Single figure centered filling 90% of height with narrow margins. Genuine transparent background; no ground, no landscape, no frame, no text, no checkerboard, no geometric CSS appearance.

Final cutout refinement:

Edit the supplied explorer character. Keep the exact face, hair, outfit, backpack, body, colors, painted texture and full-body pose. Remove ALL brown glow, haze, vignette and semi-transparent colored aura surrounding the figure. Produce a clean genuine transparent cutout: outside the character silhouette pixels are 100% transparent. No drop shadow, no ground or background. The figure alone is opaque with smooth clean antialiased edges. No other changes.

## forest

Asset: `dist/assets/characters/forest-v1.webp`

Prompt:

Use case: illustration-story. Create ONE isolated full-body character cutout for a children's ecology game, matching the warm hand-painted gouache brush texture, delicate brown outlines and cute proportions of reference image 2. Reference image 1 is the village style reference only. Character fills 90% of canvas height, both feet fully visible, front three-quarter view slightly from above. Warm friendly storybook style. CRITICAL: outside the character silhouette every pixel must be fully transparent. No glow, no aura, no colored haze, no ground shadow, no backdrop, no landscape, no text or frame. Subject: Friendly young forest keeper, short dark brown hair, moss-green ranger vest over cream shirt, green cap with a small leaf, brown boots. Holding a small field notebook by their side.

## river

Asset: `dist/assets/characters/river-v1.webp`

Prompt:

Use case: illustration-story. Create ONE isolated full-body character cutout for a children's ecology game, matching the warm hand-painted gouache brush texture, delicate brown outlines and cute proportions of reference image 2. Reference image 1 is the village style reference only. Character fills 90% of canvas height, both feet fully visible, front three-quarter view slightly from above. Warm friendly storybook style. CRITICAL: outside the character silhouette every pixel must be fully transparent. No glow, no aura, no colored haze, no ground shadow, no backdrop, no landscape, no text or frame. Subject: Friendly young river keeper, wavy dark hair, sky-blue work shirt with rolled sleeves, navy shorts and teal rubber boots. Carrying a little water observation jar by their side.

## farm

Asset: `dist/assets/characters/farm-v1.webp`

Prompt:

Use case: illustration-story. Create ONE isolated full-body character cutout for a children's ecology game, matching the warm hand-painted gouache brush texture, delicate brown outlines and cute proportions of reference image 2. Reference image 1 is the village style reference only. Character fills 90% of canvas height, both feet fully visible, front three-quarter view slightly from above. Warm friendly storybook style. CRITICAL: outside the character silhouette every pixel must be fully transparent. No glow, no aura, no colored haze, no ground shadow, no backdrop, no landscape, no text or frame. Subject: Friendly young farmer, warm dark braided hair, straw hat, terracotta overalls over cream shirt, brown boots. Carrying a little woven basket with one carrot.

## festival

Asset: `dist/assets/characters/festival-v1.webp`

Prompt:

Use case: illustration-story. Create ONE isolated full-body character cutout for a children's ecology game, matching the warm hand-painted gouache brush texture, delicate brown outlines and cute proportions of reference image 2. Reference image 1 is the village style reference only. Character fills 90% of canvas height, both feet fully visible, front three-quarter view slightly from above. Warm friendly storybook style. CRITICAL: outside the character silhouette every pixel must be fully transparent. No glow, no aura, no colored haze, no ground shadow, no backdrop, no landscape, no text or frame. Subject: Friendly young festival keeper, short dark brown hair, mustard knit winter hat, rust-red padded coat, green scarf, brown boots. Holding a small unlit paper lantern by their side.
