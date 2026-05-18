# RESUME — pick up here the moment you say "lets get started"

**Status: WORKING & SAFE.** `node test.js` green, `node sim-run.js` runs,
determinism PASS, everything committed & pushed. The game is fully playable.
It is *not yet final-balance-tuned* (the content pack made some relics hot) and
3 swarm deliverables are produced but not yet integrated. None of this is broken
— it's the next build queue.

## Done & shipped (committed/pushed)
- All 6 deep-design phases (two-track engine, Sigils, relics, Champion, Rune
  Web, counter-boss). Sim-validated & rebalanced. UI depth strip. Onboarding.
- QA-audit bug fixes (old-save crash, daily desync, champion cap, seal exploit).
- **Content pack integrated:** 36 runes, 48 combos, 7 Sigils, 6 Champions, 22
  relics, 5 transmutations.
- **Deepened sim integrated:** per-Sigil battery + per-relic impact matrix +
  champion scaling + archetype detection + determinism assertion + verdict.

## ▶ NEXT, in order (resume sequence)

### 1. Balance tuning pass (do FIRST — perishable specifics below)
Last `node sim-run.js` verdict (post content pack):
- Overall **56%** (target ~46–52). Sigils all in 15–70 band (OK).
- **Overpowered relics (nerf these):** Twin Eclipse +35, Broken Hourglass
  +34, The Final Page +34, The Undertow Anchor +34, The Eternal Inkwell +31.
  (Pattern: flat/cube XMULT + draw/first-rune stackers compound too hard.)
- **Dead relic (rework/buff):** The Low Lantern −7.3 (rewarding empty slots
  loses more than +0.5 XMULT/slot gives — make it stronger or change effect).
- Champion scaling monotone ✓ (Lv4 62.7%; Lv2/3 0% is tiny-sample noise, fine).
- Archetypes varied ✓ (retrigger 55% / xmult 22% / others) — no single >60%.
- Determinism ✓ PASS all 7 Sigils.
Loop: nerf flagged relics in `index.html` RELICS, `node test.js` + `node
sim-run.js`, repeat until overall ~46–52%, every relic Δ +2..+25, none dead.
Commit when clean. Update BALANCE.md.

### 2. Integrate the Web Audio layer (swarm artifact, ready)
The audio agent produced a complete zero-dependency synthesized `GFAudio` IIFE
+ exact hook insertions (cast/combo/reward/hit/victory/defeat/tap) + a mute
button spec (Node-safe via `typeof window` guard). Paste into the single
`<script>`, wire hooks, add mute button to title `.menu-buttons` + HUD.
`node test.js` must stay green (guarded → inert in Node). Commit.

### 3. Integrate the juice/polish punch-list (swarm artifact, ready)
Prereqs first: add `gfReducedMotion()` + `gfHaptic()`. Then, by priority:
damage-pop magnitude tiering + count-up; XMULT escalation (screen shake/flash
+ readout heat + juicier combo banner); spell-slot fill anims + synergy throb;
`#hud-depth` tappable tooltips (title= attrs are dead on touch — real bug);
`prefers-reduced-motion` guard + 44px tap targets; modal entrance + relic
rarity tokens; HP-bar chip-damage. All snippets respect the flex-shrink layout
(only `.enemy-stage` flexes — don't reintroduce bottom-clipping). test green
each batch. Commit per batch.

### 4. Apply the marketing kit (swarm artifact, ready)
Replace ITCH_STORE_COPY.md body; add DEVLOG.md (the solo+AI story); add a
SOCIAL.md (X thread, Reddit posts r/roguelikes + r/incremental_games, 3 Daily
Sigil share hooks); press blurb + launch-day checklist. Commit.

### 5. Final docs pass
Update GAME_DESIGN_DEEP.md / BALANCE.md / LAUNCH.md to reflect final content +
balance. Commit.

## The one external blocker (still yours, ~20s, not urgent)
Public launch needs the GitHub Pages toggle:
`github.com/Stephenuffugus/glyph_forge/settings/pages` → Source: Deploy from a
branch → `main` → `/ (root)` → Save. Everything else is automated; the repo is
fully backed up regardless.

## How to play / test right now
Codespace dev URL (server may have slept — say "restart the server" if 404):
`https://cuddly-disco-r5pvxv4764xhw7r9-8000.app.github.dev`
⚙ dev badge (bottom-left) opens the sandbox. "Begin Inscription" → Sigil picker.

— Discipline that has held every commit: single `<script>`, `test.js`+
`sim-run.js` green, save key `glyph-forge-v1` unchanged (additive only),
baseline byte-identical with no Sigil/relics, deterministic daily.
