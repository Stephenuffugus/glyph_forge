// Full run simulator. Greedy AI that picks the best damage combo each turn.
const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]+?)<\/script>/)[1];

const stubs = `
  const document = { getElementById: () => ({ addEventListener:()=>{}, classList:{add:()=>{},remove:()=>{},contains:()=>false}, appendChild:()=>{}, removeChild:()=>{}, setAttribute:()=>{}, getBoundingClientRect:()=>({left:0,top:0,width:0,height:0}), style:{}, innerHTML:'', textContent:'', onclick:null, dataset:{}, children:[], firstElementChild:{classList:{add:()=>{}},dataset:{},onclick:null,oncontextmenu:null,addEventListener:()=>{}}, querySelector:()=>({innerHTML:''}), querySelectorAll:()=>[], offsetWidth:0, offsetHeight:0 }), querySelectorAll:()=>[], createElement:()=>({className:'',innerHTML:'',textContent:'',style:{},classList:{add:()=>{}},dataset:{},onclick:null,oncontextmenu:null,firstElementChild:null,addEventListener:()=>{},remove:()=>{},getBoundingClientRect:()=>({left:0,top:0,width:0,height:0})}), body:{appendChild:()=>{}} };
  const window = { addEventListener:()=>{}, innerWidth:400 };
  const localStorage = { _s:{}, getItem(k){return this._s[k]||null}, setItem(k,v){this._s[k]=v} };
  const navigator = { serviceWorker:null };
  const setTimeout = (fn)=>{ /* immediate, but don't recurse */ };
  const clearTimeout = ()=>{};
  const confirm = ()=>true;
`;

const game = eval(`(function(){${stubs}${code}; return { state, RUNES, ENEMIES, NAMED_COMBOS, resolveSpell, mulberry32, findComboName };})()`);

// Replicate run logic locally so we don't need DOM-touching functions
function newSim(seedStr){
  const seed = (function(){
    let h = 1779033703 ^ seedStr.length;
    for(let i=0;i<seedStr.length;i++){
      h = Math.imul(h^seedStr.charCodeAt(i), 3432918353);
      h = (h<<13)|(h>>>19);
    }
    return h;
  })();
  const rng = game.mulberry32(seed);
  let deck = game.RUNES.filter(r=>r.starter).map(r=>r.id);
  for(let i=deck.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; }

  const path = [];
  for(let i=0;i<13;i++){
    if(i===12) path.push({enemyId:'sovereign'});
    else {
      const tier = i<3 ? 1 : (i<7 ? 2 : 3);
      const candidates = game.ENEMIES.filter(e=>e.tier===tier && !e.boss);
      path.push({enemyId: candidates[Math.floor(rng()*candidates.length)].id});
    }
  }
  return {
    seed: seedStr, rngSeed: seed,
    encounterIdx: 0, hp: 50, maxHp: 50,
    deck, hand: [], discard: [], spell: [null,null,null],
    path, enemyHp: 0, enemyMaxHp: 0,
    fluency: 0,
    log: []
  };
}

function draw(run){
  if(run.deck.length === 0){
    run.deck = run.discard.slice();
    run.discard = [];
    const rng = game.mulberry32(run.rngSeed + run.encounterIdx*1000 + run.hand.length);
    for(let i=run.deck.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [run.deck[i],run.deck[j]]=[run.deck[j],run.deck[i]]; }
  }
  if(run.deck.length > 0) run.hand.push(run.deck.shift());
}

function beginEnc(run){
  const e = game.ENEMIES.find(x=>x.id===run.path[run.encounterIdx].enemyId);
  const scale = 1 + (run.encounterIdx * 0.05);
  run.enemyHp = Math.floor(e.hp * scale);
  run.enemyMaxHp = run.enemyHp;
  run.spell = [null,null,null];
  if(run.encounterIdx > 0){
    run.hp = Math.min(run.maxHp, run.hp + 8);
  }
  while(run.hand.length < 5 && (run.deck.length > 0 || run.discard.length > 0)) draw(run);
}

function tryAllSpells(run){
  // brute force: try every combination of up to 3 from hand, return best
  const hand = run.hand;
  let best = { damage: 0, indices: [] };
  // single
  hand.forEach((id, i)=>{
    setSpell(run, [i]);
    const r = sim(run);
    if(r && r.damage > best.damage) best = { damage: r.damage, indices: [i], result: r };
  });
  // pair
  for(let i=0;i<hand.length;i++){
    for(let j=0;j<hand.length;j++){
      if(i===j) continue;
      setSpell(run, [i, j]);
      const r = sim(run);
      if(r && r.damage > best.damage) best = { damage: r.damage, indices: [i,j], result: r };
    }
  }
  // triple
  for(let i=0;i<hand.length;i++){
    for(let j=0;j<hand.length;j++){
      if(i===j) continue;
      for(let k=0;k<hand.length;k++){
        if(k===i||k===j) continue;
        setSpell(run, [i, j, k]);
        const r = sim(run);
        if(r && r.damage > best.damage) best = { damage: r.damage, indices: [i,j,k], result: r };
      }
    }
  }
  return best;
}

function setSpell(run, indices){
  run.spell = [null, null, null];
  indices.forEach((handIdx, slot) => run.spell[slot] = run.hand[handIdx]);
}

function sim(run){
  game.state.run = run;
  return game.resolveSpell();
}

function applyCast(run){
  const result = sim(run);
  if(!result) return null;
  run.enemyHp = Math.max(0, run.enemyHp - result.damage);
  if(result.healing) run.hp = Math.min(run.maxHp, run.hp + result.healing);

  // remove placed runes from hand, push to discard
  const placedIds = run.spell.filter(Boolean);
  placedIds.forEach(id => {
    const idx = run.hand.indexOf(id);
    if(idx !== -1) run.hand.splice(idx, 1);
    run.discard.push(id);
  });
  run.spell = [null,null,null];

  // bonus draw
  for(let i=0;i<(result.bonusDraw||0);i++) draw(run);

  // refill to 5
  while(run.hand.length < 5 && (run.deck.length>0 || run.discard.length>0)) draw(run);

  return result;
}

function enemyAttack(run, stunned){
  if(stunned) return;
  const enemy = game.ENEMIES.find(e=>e.id===run.path[run.encounterIdx].enemyId);
  run.hp = Math.max(0, run.hp - enemy.threat);
}

function rewardChoice(run){
  // Smarter AI: weigh by rarity AND synergy (matches existing deck element/shape).
  let pool;
  if(run.encounterIdx < 4) pool = game.RUNES.filter(r=>r.rarity==='common'||r.rarity==='uncommon');
  else if(run.encounterIdx < 9) pool = game.RUNES.filter(r=>r.rarity==='uncommon'||r.rarity==='rare');
  else pool = game.RUNES.filter(r=>r.rarity==='rare'||r.rarity==='mythic');
  const rng = game.mulberry32(run.rngSeed + run.encounterIdx*31);
  const offered = [];
  while(offered.length < 3 && pool.length > 0){
    const idx = Math.floor(rng()*pool.length);
    const r = pool[idx];
    if(!offered.find(o=>o.id===r.id)) offered.push(r);
    pool = pool.filter(x=>x.id!==r.id);
  }
  // Score each offered rune: rarity rank + element-match bonus + shape-match bonus
  const rank = { mythic:8, rare:5, uncommon:3, common:1 };
  const allCards = run.deck.concat(run.discard, run.hand);
  const elCounts = {}, shCounts = {};
  allCards.forEach(id => {
    const r = game.RUNES.find(x=>x.id===id);
    if(r){
      elCounts[r.element] = (elCounts[r.element]||0)+1;
      shCounts[r.shape] = (shCounts[r.shape]||0)+1;
    }
  });
  const score = (r) => rank[r.rarity] + (elCounts[r.element]||0)*0.5 + (shCounts[r.shape]||0)*0.3;
  offered.sort((a,b)=>score(b)-score(a));
  const picked = offered[0];
  // only heal if critically low
  if(run.hp < 8){
    run.hp = Math.min(run.maxHp, run.hp + 8);
    run.log.push(`  reward: healed +8 (hp ${run.hp})`);
    return null;
  }
  run.deck.push(picked.id);
  run.log.push(`  reward: ${picked.name} (${picked.rarity}) [score=${score(picked).toFixed(1)}]`);
  return picked;
}

function runOne(seedStr){
  const run = newSim(seedStr);
  beginEnc(run);
  let turnLimit = 200;
  while(turnLimit-- > 0){
    if(run.hp <= 0) break;
    if(run.encounterIdx >= 13) break;

    // pick best spell
    const best = tryAllSpells(run);
    if(best.indices.length === 0){
      // no spell possible — should be impossible since hand=5
      run.log.push(`  ! no playable spell?`);
      break;
    }
    setSpell(run, best.indices);
    const spellRunes = best.indices.map(i=>run.hand[i]).filter(Boolean);
    const result = applyCast(run);
    run.log.push(`  T${run.encounterIdx+1} cast [${spellRunes.join('+')}] dmg=${result.damage} enemy=${run.enemyHp}/${run.enemyMaxHp}`);

    if(run.enemyHp <= 0){
      run.log.push(`  >> defeated ${game.ENEMIES.find(e=>e.id===run.path[run.encounterIdx].enemyId).name}`);
      run.fluency += 1;
      rewardChoice(run);
      run.encounterIdx += 1;
      if(run.encounterIdx >= 13){
        run.log.push(`*** VICTORY *** in run "${seedStr}"`);
        break;
      }
      beginEnc(run);
    } else {
      enemyAttack(run, result.stun);
      run.log.push(`  enemy attacks; hp=${run.hp}`);
    }
  }
  return run;
}

// Run multiple seeds and aggregate
const NUM_RUNS = 100;
console.log(`Running ${NUM_RUNS} simulated playthroughs with synergy-aware greedy AI...`);
let wins = 0, losses = 0;
const lossEncounters = {};
const reachedHistogram = {};
let totalDmgsAll = [];
let peakDmgPerRun = [];
let turnsPerRun = [];
let runesAcquired = [];
for(let i=0;i<NUM_RUNS;i++){
  const run = runOne('sim-'+i);
  if(run.encounterIdx >= 13){
    wins++;
  } else {
    losses++;
    lossEncounters[run.encounterIdx] = (lossEncounters[run.encounterIdx]||0)+1;
  }
  reachedHistogram[run.encounterIdx] = (reachedHistogram[run.encounterIdx]||0)+1;
  const dmgs = run.log.filter(l=>l.includes('dmg=')).map(l=>{
    const m = l.match(/dmg=(\d+)/); return m ? parseInt(m[1]) : 0;
  });
  totalDmgsAll = totalDmgsAll.concat(dmgs);
  peakDmgPerRun.push(Math.max(0, ...dmgs));
  turnsPerRun.push(dmgs.length);
  runesAcquired.push(run.deck.length + run.discard.length + run.hand.length);
}
const winPct = (wins/NUM_RUNS*100);
const avgDmg = totalDmgsAll.length ? (totalDmgsAll.reduce((a,b)=>a+b,0)/totalDmgsAll.length).toFixed(1) : 0;
const peakAvg = (peakDmgPerRun.reduce((a,b)=>a+b,0)/peakDmgPerRun.length).toFixed(1);
const peakMax = Math.max(...peakDmgPerRun);
const avgTurns = (turnsPerRun.reduce((a,b)=>a+b,0)/turnsPerRun.length).toFixed(1);

console.log(`\n=== AGGREGATE ===`);
console.log(`Win rate: ${wins}/${NUM_RUNS} (${winPct.toFixed(1)}%)`);
console.log(`Avg damage per spell: ${avgDmg}`);
console.log(`Avg peak spell damage per run: ${peakAvg}  (max seen: ${peakMax})`);
console.log(`Avg total turns per run: ${avgTurns}`);
console.log(`Avg deck size at end: ${(runesAcquired.reduce((a,b)=>a+b,0)/runesAcquired.length).toFixed(1)}`);
console.log(`\nReached histogram (encounter idx → count):`);
for(let i=0;i<=13;i++){
  if(reachedHistogram[i]){
    const bar = '█'.repeat(reachedHistogram[i]);
    console.log(`  ${String(i).padStart(2)}: ${bar} (${reachedHistogram[i]})`);
  }
}
console.log(`\nLosses by encounter:`, lossEncounters);

console.log('\nSample run final 25 lines (sim-7):');
const r0 = runOne('sim-7');
r0.log.slice(-25).forEach(l => console.log(l));
