# Glyph Forge — Balance Reference

_All numbers reflect the current build. Re-run `node sim-run.js` after any change._

## Player

| Stat | Value | Notes |
|---|---|---|
| Starting / max HP | 50 | hard cap |
| Heal between encounters | +8 | up to maxHp |
| Starting deck size | 9 (starters) | one of each common rune |
| Hand size | 5 | refilled after each cast |
| Spell slot count | 3 | empty slots are skipped |
| Fluency mult | `1 + min(0.72, defeatedEnemies × 0.06)` | caps at ×1.72 after 12 wins |

## Enemy Stats

| Tier | ID | Name | Base HP | Scaled HP (at typical enc) | Threat | Tag |
|---|---|---|---|---|---|---|
| 1 | cinder | Cinder | 8 | 8 | 2 | shadow |
| 1 | wisp | Wisp | 10 | 10 | 2 | air |
| 1 | fenmote | Fenmote | 12 | 13 | 2 | earth |
| 2 | wight | Hollow Wight | 26 | ~32 | 3 | void |
| 2 | sirenshade | Sirenshade | 30 | ~36 | 3 | water |
| 3 | revenant | Brass Revenant | 52 | ~67 | 4 | order |
| 3 | glasswyrm | Glass Wyrm | 64 | ~83 | 4 | chaos |
| 4 | sovereign | The Sovereign | 210 | 336 | 5 | void |

HP scales: `baseHp × (1 + encounterIdx × 0.05)`. At encounter 12 (boss): ×1.6 → 336 HP.

## Rune Power Tiers

| Rarity | Count | Base Power Range | Effect Weight | Example |
|---|---|---|---|---|
| common   | 9 | 1–3 | minor or none | Stone (3) |
| uncommon | 9 | 0–2 | modifier (multiplier or repeat) | Surge (+50% neighbor) |
| rare     | 9 | 0–5 | strong conditional or scaling | Anchor; Crescendo (XMULT) |
| mythic   | 5 | 0   | game-bending global/XMULT effect | Singularity; Culminate (XMULT) |

32 runes total (Phase 2 added **Crescendo** rare + **Culminate** mythic — order-dependent XMULT payoffs).
Element distribution: Fire 3 · Water 3 · Earth 3 · Air 3 · Void 4 · Light 3 · Shadow 3 · Order 6 · Chaos 4
Shape distribution: Bolt 2 · Wave 4 · Burst 5 · Pulse 4 · Sigil 7 · Spiral 6 · Chain 4

## Synergy Math — Phase 2 two-track engine

Slots resolve **left → right (I → II → III); order matters.** Damage splits into
an additive POWER track and a multiplicative XMULT track.

```
POWER       = Σ ( (basePower + add) × runeMult × repeats )   // additive, per slot in order
elementMult = maxSameElement≥3 ? 3.0 : maxSameElement===2 ? 1.6 : 1     // EXPONENTIAL
shapeMult   = maxSameShape≥3   ? 2.0 : maxSameShape===2   ? 1.3 : 1
xmult       = elementMult × shapeMult × Π(order-dependent rune xmults)
              // order-dependent rune: xmult ×= 1 + (POWER assembled in EARLIER slots) × scale
              //   Crescendo scale 0.06 · Culminate scale 0.11  → reward placing them last
globalMult  = effect modifiers (ray/triskel/recursion/singularity/aurora …)
fluencyMult = 1 + min(0.72, defeatedEnemies × 0.06)          // caps at ×1.72
totalDamage = floor( POWER × globalMult × xmult × (1 + spellRetrigger) × fluencyMult )
```

Baseline (no synergy, no XMULT runes) is **byte-identical to pre-Phase-2** —
only focused/ordered play scales. Example: Stone + Stone + Stone, fluency 0
(3× Earth, 3× Burst): POWER 9 → ×3.0 (elem) ×2.0 (shape) = **54** (was 27 —
mono-element/shape now scales exponentially: this is the build-identity payoff).

## Damage Reference (validated by `test.js`)

| Spell | Damage (fluency 0) | Notes |
|---|---|---|
| Stone (alone) | 3 | baseline — unchanged from pre-Phase-2 |
| Stone + Echo | 6 | no synergy → identical to old engine |
| Ember + Ember + Ember | 36 | 3-elem ×3.0 · 3-Bolt ×2.0 (was 18) |
| Stone + Stone + Stone | 54 | 3-Earth ×3.0 · 3-Burst ×2.0 (was 27) |
| Stone + Echo + Echo | 12 | 2-Sigil ×1.3 · 2-Order ×1.6 |
| Stone + Twin | 9 | Twin +2 repeats slot 0, no synergy |
| Ember + Surge + Ember | 31 | Surge +50% neighbors + 2-Fire/2-Bolt XMULT |
| Ember + Drop + Aurora | 15 | Aurora globalMult ×5, no same-element |
| Ember + Singularity (hand=8) | 16 | base 2 × hand 8 (globalMult path intact) |
| Recursion + Ember + Recursion | 37 | 2-stack Recursion ×3 + 2-Order/2-Spiral XMULT |
| Ember + Ouroboros | 4 | spell re-casts once (×2) |
| Tally + Tally + Triskelion | 128 | 3-Order all same → Triskel ×3 × XMULT 6.0 |
| Tidewall @ 5/30 HP | 26 | +1 per missing HP, no synergy |
| **Pandemonium + Singularity × 2 (hand=10)** | **4160** | the deepest broken combo (was 3750) |

Mono-element/shape builds roughly **doubled**; the absolute mythic ceiling rose
~11%. Non-synergy spells are unchanged — depth is opt-in, paid for with focus.

## Win Rate Tests (synergy-aware greedy AI, 100 runs)

```
Win rate: 41/100 (41%)   [pre-Phase-2 baseline: 37%]
Avg damage per spell: 23.7
Avg peak spell damage per run: 207.6 (max seen: 2673)
Avg total turns per run: 45.6

Loss distribution by encounter:
   8: █        (1)
   9: ████     (4)
  10: ██       (2)
  11: ████     (4)
  12: ████████████████████████████████████████████████  (48) — The Sovereign
  13: WIN █████████████████████████████████████████ (41)
```

The Sovereign is still the dominant wall (48/59 losses occur there) — curve
shape preserved, just a higher ceiling. Greedy AI 41% → skilled human play with
intentional focus/ordering and reward routing should hit ~60–72%.

## Tuning Levers (in order of impact)

If win rate feels off post-launch, change in this order:

1. **Sovereign HP** (210 → 180 makes him much more killable; → 240 makes him brutal)
2. **Fluency rate** (`0.06` per win — bump to `0.08` for steeper curve, drop to `0.04` for harder)
3. **Player max HP** (50 → 60 for more forgiving mid-game)
4. **Between-encounter heal** (+8 → +10 for more sustain)
5. **XMULT synergy curve** (`elementMult` 1.6/3.0 · `shapeMult` 1.3/2.0 in resolveSpell — lower the 3-stack values to flatten the build-identity payoff)
6. **Order-dependent scales** (`Crescendo` 0.06 / `Culminate` 0.11 `xmultScale` — these set the combo ceiling; raise/lower with care)

DO NOT touch mythic rune effects or the XMULT curve without re-running `sim-run.js`. They define the ceiling and small changes cascade through the whole damage range. The forthcoming counter-boss (design Phase 6) — not an HP bump — is the intended lever for boss difficulty.

## Variance Analysis

High outcome variance because draw matters. A single run can swing from:
- **Low**: 8-15 dmg average spells, slow grind, die at tier 3
- **High**: a stacked-mythic turn at encounter 11 for 800+ damage one-shots Glass Wyrm

This is intentional, Balatro-style. The variance is the dopamine. Daily Sigil mode (same seed for everyone, one attempt) is the antidote — it normalizes draws across players for direct comparison.

## Run Length

- Avg turns to clear: 47 (5–7 turns per encounter average)
- Avg session length: ~12–18 minutes
- Designed for one commute / coffee break per attempt
