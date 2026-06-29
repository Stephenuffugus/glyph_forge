# Glyph Forge — Combat-Depth Overhaul (build plan)

Branch: `combat-depth-overhaul`. Goal: make the game *engaging and fun*, not just
balanced. Grounded in a 9-agent competition-research + audit pass (Balatro, Slay
the Spire, Monster Train, Into the Breach, Inscryption, mobile roguelite market
2024-26). Full synthesis archived in the session record.

## Diagnosis (the one-paragraph version)
Glyph Forge has a deep, juicy, **order-dependent scoring engine** (POWER+ → MULT+
→ XMULT×, Balatro-style) but almost **no game around it**: the enemy is a passive
HP counter that deals a fixed, varianceless number, so all 13 fights collapse to
"cast the biggest spell my hand allows," and a full heal between fights deletes
attrition. The multiplier that makes the engine sing (XMULT) is **invisible**
(the full damage breakdown is dev-gated), so the ~80% who never win literally
cannot learn the one thing that wins. Fix: **give the enemy agency the player can
READ and ANSWER** (telegraphed intent + a defensive Ward verb + persistent HP +
status), and **make the engine legible**. Most plumbing already exists unused
(`currentThreat`, `ignoreWard`/`trueDamage`/`burn`, the trace renderer, the
threat-meter anchor) — the work is wiring + tuning, not inventing.

## Discipline (every batch)
- One `index.html`, single `<script>`. `node test.js` + `node sim-run.js` green.
- New combat RNG uses seeded **offset** seeds `mulberry32(rngSeed + encIdx*PRIME +
  turn)` with a prime ≠ 7919 (the cast seed); never `Date.now`/`Math.random`.
  Re-derive identically in `sim-run.js` so the determinism assertion PASSES.
- Damage-math inside `resolveSpell`/`applyDepth`/`onSpellBound` auto-propagates to
  the sim; **run-loop** changes (armor/ward/status/heal) must be hand-mirrored in
  `sim-run.js` (`applyCast`, `enemyAttack`, `beginEnc`) and any asserted value in
  `test.js`.
- Save key `glyph-forge-v1` additive-only; backfill every new `run.*` field in
  `ensureRunDepth()`; guard new nested `meta.*` (loadState shallow-merges meta).
- New depth gated at run-construction / `beginEncounter` / behind `runHelp()` /
  Ascension — never inside `resolveSpell` — so tier-0 stays byte-identical where
  intended and veteran builds aren't flattened.

## Batches
- **A · Foundation** ✅ honest harness (sim no longer over-counts hand size) +
  determinism. Re-baselined.
- **B · Enemy Intent** — telegraphed, tag-flavored intents (ATTACK/CHARGE/GUARD/
  MEND/HEX) in the threat meter; expected damage ≈ current flat threat so baseline
  holds. *Transformative.*
- **C · Defense + Status + Attrition** — Ward verb, enemy armor/ward, revive
  `ignoreWard`/`trueDamage`/`burn`, Vulnerable/Weak/Poison, scarcer heal. *High
  balance risk — re-tune to band.*
- **D · Legibility + Juice** — un-hide the XMULT math under the gold number,
  define XMULT, teach a turn-1 *shape* pair, sequential number-climb + ASCENDED
  overkill, inline card effect text.
- **E · Sculpt + Boss + Surfacing** — Forget-a-Glyph deck-thinning, multi-phase
  Sovereign that reads your dominant pattern, visible transmutation triads.
- **F · Goals + polish** — non-win Mastery goals, champion-path accumulate,
  Sigil-picker clarity, surface Final Page's hidden +2.

## Honest baseline (post Batch-A harness fix, greedy-AI, 100 runs/Sigil)
free 55 · ember 58 · order 65 · void 37 · tide 52 · zephyr 42 · umbra 35 —
**overall 49.1%** (band 30-55), determinism PASS. (Pre-fix overall was 56.0%;
void was the most inflated, 67→37, because it leaned on hand-size mechanics.)

## Balance debt (defer to final pass, after Batch C reshapes relic values)
- Relic spread is wide: Serpent's Coil / Unseen Hand / Riptide Knot ≈ **+26pts**
  (top), Whisper Glass **+3.3** (bottom). Don't tune now — `trueDamage`/`ignoreWard`
  relics (Storm Sigil etc.) are **no-ops until enemies get ward/armor** in Batch C,
  so values will shift. Re-tune relics + Sigils together at the end.
- `retrigger` is the AI default (57% of runs) but wins only 45.5%; xmult/mono win
  60-65% but are under-discovered — Batches D/E must teach + reward them.
- `singularity` (×hand size) / `pandemonium` (Σ hand basePower) top out weak in
  real play (hand shrinks to ~2 when you stage 3) — consider rescaling off
  `run.deck.length` during the final pass.
