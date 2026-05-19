# RESUME — pick up here the moment you say "lets get started"

**Status: BUILD COMPLETE & SAFE + in playtest-iterate loop.** `node test.js`
green, `node sim-run.js` verdict *"depth systems balanced; determinism holds"*,
all committed & pushed to `main`. Build stamp on the title strip:
**`2026-05-19 · b10 meta+mobilefix`** (bump `GF_BUILD` in index.html + the
`CACHE` in sw.js every deploy; PWA now auto-updates within ~60s).

### Picking up in the morning — first things
1. The user will have **test-played more** → ask for / expect notes; turn each
   into a tested fix (gate every commit on `node test.js` green BEFORE
   `git commit` — use `&&`, never `;`, that mistake pushed a broken commit
   once this session, fixed in 97c1514).
2. **Card list is ready (the user asked for this):** `ART_CARDLIST.csv`
   (Google-Drive-ready → opens as a Sheet, has a Status column) +
   `ART_CARDLIST.md`. 36 cards + 8 enemies + 3 brand = 47 assets; 6
   content-pack runes flagged as needing fresh art direction. Regenerate
   after any content change: `node tools/cardlist.mjs`. To get it to Drive:
   download the CSV from the VS Code explorer (right-click → Download) and
   upload to Drive, or pull from the repo.
3. Recent session work (committed): balance tune, audio, juice (A/B/C),
   marketing+docs, **meta-progression spine** (Ascension ladder + Daily
   streak/score + Codex Mastery — additive, sim-inert), mobile fixes
   (dropped viewport-fit=cover; 100svh; cast-row clearance — fixed Pixel 9
   bottom-button clipping), build stamp + SW auto-update.

## Done & shipped (committed/pushed)
- All 6 deep-design phases (two-track engine, Sigils, relics, Champion, Rune
  Web, counter-boss). Content pack: 36 runes, 48 combos, 7 Sigils, 6
  Champions, 22 relics, 5 transmutations.
- **Balance tuned to clean verdict.** The 5 content-pack OP relics (+31..+35)
  + dead Low Lantern (−7.3) were sim-flagged and re-costed → every relic now
  Δ +5..+25, none dead/overpowered, determinism PASS. See `BALANCE.md`.
- **Synthesised Web Audio** (`GFAudio` IIFE, no asset files, mute button,
  Node-safe — inert in test/sim). Hooks: cast/combo/reward/hit/victory/
  defeat/tap.
- **Juice/polish** (3 batches): motion/haptic helpers + reduced-motion +
  44px taps; damage tiers + count-up + XMULT flash/shake + chip-damage HP
  bar; tap-tooltips (fixed real mobile bug) + slot/synergy/modal anims +
  relic rarity tokens.
- **Static-host deploy:** `tools/pack.sh` → `dist/` + `glyph-forge-hostinger.zip`
  + `tools/HOSTINGER-UPLOAD.md`. Test-play works regardless of codespace uptime.
- **Marketing + docs:** `ITCH_STORE_COPY.md` (rewritten), `DEVLOG.md`,
  `SOCIAL.md` (X/Reddit/Daily hooks/press/launch checklist), `LAUNCH.md`,
  `README.md`, `GAME_DESIGN_DEEP.md`, `BALANCE.md` — all synced to shipped.

## Meta-progression spine — SHIPPED (P0 of the cash roadmap)
Additive, sim-inert (Ascension modifiers only at run construction; tier 0 =
byte-identical to the validated game). Ascension ladder (6 tiers, unlock by
clearing your top tier), Ascension picker in the Sigil modal, title
progression strip, Daily Sigil streak+score (in win/defeat/share), Codex
Mastery track (11 seals, zero power). Saves auto-migrate (deep-merge).

## ▶ NEXT — cash roadmap (P0 done; user picks order)
- **P1** Boss phase-2 mechanic + deck-thinning reward (fairness/fun: losses
  feel earned, runs become sculptable).
- **P2** Teach the ceiling: surface the strong xmult/mono lines so players
  find the depth (sim: AI defaults to 52%-win retrigger; xmult/mono win 70%+
  but are under-discovered).
- **P3** Tighten Sigil spread (umbra 37% / zephyr 45% ↔ void 67%): ease the
  weak Sigils' seals/boons so first-run choice isn't a trap. Re-sim.
- **P4** (after retention proven) paid gate — Ascension/endless or full-run
  unlock.

## ▶ Launch/ops (anytime)
1. **Test-play — PERMANENT LINK IS LIVE.** GitHub Pages enabled 2026-05-19
   (repo made PUBLIC, Settings→Pages→main→/root). Always-on, codespace-
   independent, auto-deploys every push to `main` within ~1 min:
   **`https://stephenuffugus.github.io/glyph_forge/`**
   Verify a deploy: `gh api repos/Stephenuffugus/glyph_forge/pages/builds/latest`
   + `curl -s -L .../glyph_forge/ | grep GF_BUILD`. Codespace dev URL
   (`...app.github.dev`) is now only a scratch loop while awake.
   Open caveat: `art-slots/icon-192.png|512.png` 404 (placeholder folder) →
   PWA install icon is default; gameplay unaffected. Fix = drop 2 PNGs.
2. **Publish / promote.** `LAUNCH.md` go-live; itch via `ITCH_STORE_COPY.md`
   (set `GF_LINKS.itch`); `SOCIAL.md` copy-paste, lead with Daily Sigil.
3. **Art** (non-blocking): `ART_SHOTLIST.md` → drop PNGs in `art-slots/`.

## Discipline that must hold every commit
Single `<script>`; `node test.js` + `node sim-run.js` green; save key
`glyph-forge-v1` additive-only; baseline byte-identical with no Sigil/relics;
deterministic daily; `dist/` + zip are gitignored build artifacts. Commit per
coherent batch with the Co-Authored-By trailer.

## v1.1 backlog (post-money — see LAUNCH.md)
Boss phase-2; Sigil-spread tightening (37%↔67% optimal-AI, inside pass band);
deck-thinning; Firebase Daily leaderboard; optional freemium gate.
