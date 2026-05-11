const LOADING_MSGS = {
  personals:   ['Retrieving personal records...','Establishing secure connection...','Authenticating credentials...','Fetching archived data...','Decrypting file index...','Access denied — retrying...','Almost there...'],
  evaluations: ['Retrieving evaluation records...','Establishing secure connection...','Authenticating credentials...','Fetching performance data...','Decrypting score index...','Synchronising with server...','Almost there...'],
  simulations: ['Retrieving simulation data...','Establishing secure connection...','Authenticating credentials...','Loading simulation logs...','Decrypting run index...','Synchronising results...','Almost there...'],
};
const loadingTimers = {};

function startLoading(id) {
  const msgs    = LOADING_MSGS[id];
  const spinner = document.getElementById(id + '-spinner');
  const status  = document.getElementById(id + '-status');
  const retry   = document.getElementById(id + '-retry');
  if (!spinner) return;
  let phase = 0;
  spinner.style.display = 'block';
  retry.style.display   = 'none';
  status.textContent    = msgs[0];
  if (loadingTimers[id]) clearInterval(loadingTimers[id]);
  loadingTimers[id] = setInterval(() => {
    phase++;
    if (phase < msgs.length) {
      status.textContent = msgs[phase];
    } else {
      clearInterval(loadingTimers[id]);
      loadingTimers[id] = null;
      spinner.style.display = 'none';
      status.textContent    = 'Connection failed. Unable to retrieve records.';
      retry.style.display   = 'block';
    }
  }, 1400);
}

function retryLoading(id) { startLoading(id); }

// ── Chat Log ─────────────────────────────────────────────────────────────────
function openChat(id) {
  document.getElementById('chat-preview-' + id).style.display = 'none';
  document.getElementById('chat-thread-' + id).style.display = 'block';
}

function closeChat(id) {
  document.getElementById('chat-thread-' + id).style.display = 'none';
  document.getElementById('chat-preview-' + id).style.display = 'flex';
}

// ── Anomalous Scenes Data ────────────────────────────────────────────────────
const SCENE_DATA = {
  'lord': {
    text: `DESIGNATION: The Lord(?)
CLASSIFICATION: Anomalous Entity
SCENE TYPE: Monochrome World
THREAT INDEX: Unconfirmed

This picture was taken by Agent [ ■■■■■■ ]'s field camera.

According to agents that have explored the Monochrome World, this is a world that is strictly colored in various shades of black and white. Within each report, agents have often been followed by 'Narrators' and spiders within each land and bridge.

Narrators may either be hostile or friendly. Nonetheless, they have one thing in common — Serving The Lord.

The Lord is an entity within this dimension, supposedly the one controlling everything within it. Nothing else is known of this dimension.`
  },
  'foliersinn': {
    text: `SCENE: Folier's Inn\nDIMENSION: 08□\nCLASSIFICATION: Level 1\nPOINT ZERO: Yes\n\n* This picture was taken by Senior Agent Lairus.\n* The Folier's Inn is Dimension 08□'s Point 0 wherein agents usually use it as a reference for the Dimension's checkpoint.\n* Dimension 08□ is in a Level 1 category. Senior Agent Lairus says that this dimension sells very literal and accurate things. He had bought a dozen watches from said dimension.\n* He had given Agent [ ■■■■■■■ ] and Agent [ ■■■■■■■■■ ] one.\n\n`,
    hiddenSpan: `<span style="background:#000000;color:#000000;cursor:text;user-select:text;" title="Select to reveal">"Remember Agent, this place does not accept check-ins despite being an inn. This place does not have any human inhabitants. Point zeroes never have any inhabitants. Got that?"</span>`
  }
};

function openScene(id) {
  showPage('scene-' + id, null);
  const data = SCENE_DATA[id];
  if (!data) return;
  const textEl = document.getElementById('scene-text-' + id);
  if (textEl) {
    if (data.text && data.hiddenSpan) {
      setTimeout(() => {
        typewrite(textEl, data.text, 18);
        // Wait for typewrite to finish (18ms per char + buffer)
        const delay = data.text.length * 18 + 400;
        setTimeout(() => {
          const span = document.createElement('span');
          span.innerHTML = data.hiddenSpan;
          textEl.appendChild(span);
        }, delay);
      }, 300);
    } else {
      setTimeout(() => typewrite(textEl, data.text, 18), 300);
    }
  }
}
window.setSceneImage = (id, src) => {
  const thumb  = document.getElementById('scene-img-' + id);
  const detail = document.getElementById('scene-detail-img-' + id);
  [thumb, detail].forEach(img => { if (img) { img.src = src; img.style.display = 'block'; img.nextElementSibling.style.display = 'none'; }});
}

// ── Cases — infinite loading loop ───────────────────────────────────────────
const CASES_MESSAGES = [
  'Retrieving case files...',
  'Establishing secure connection...',
  'Authenticating credentials...',
  'Fetching archived records...',
  'Decrypting file index...',
  'Loading case database...',
  'Synchronising with server...',
  'Almost there...',
];
let casesTimer = null;
let casesPhase = 0;

function startCasesLoop() {
  casesPhase = 0;
  const spinner = document.getElementById('cases-spinner');
  const status  = document.getElementById('cases-status');
  const retry   = document.getElementById('cases-retry');
  if (!spinner) return;
  spinner.style.display = 'block';
  retry.style.display   = 'none';
  status.textContent    = CASES_MESSAGES[0];

  if (casesTimer) clearInterval(casesTimer);
  casesTimer = setInterval(() => {
    casesPhase++;
    if (casesPhase < CASES_MESSAGES.length) {
      status.textContent = CASES_MESSAGES[casesPhase];
    } else {
      clearInterval(casesTimer);
      casesTimer = null;
      spinner.style.display = 'none';
      status.textContent    = 'Connection failed. Unable to retrieve case files.';
      retry.style.display   = 'block';
    }
  }, 1400);
}

function retryCases() {
  startCasesLoop();
}

// ── Personnel placeholder descriptions ─────────────────────────────────────
const PER_DATA = {
  'heaves': {
    text: `NAME: Dr. Floreilev Heaves
ROLE: Chief of DSS Medical Affairs
STATUS: Active

Dr. Heaves had been with DSS eversince ∆∆∆∆. Before the full establishment and acceptance of other medical personnel, Dr. Heaves single-handedly ran the medical affairs.

He is now much focused on cataloguing forensic reports under the same field. Above all, his medical expertise is, nonetheless, praiseworthy.`
  },
  'rasputin': {
    text: `NAME: Rasputin C.
ROLE: Mortuary Scientist — DSS
STATUS: Active

Rasputin C. is a mortician. That's all we all know about him. Nobody knows why he dresses like that. Maybe Dir. Voirose knows?`
  },
  'booker': {
    text: `NAME: Dr. Magnus Booker
ROLE: Chief of Psychological Affairs — DSS
STATUS: Active

Dr. Booker has been serving DSS since he was hired to be the psychology doctor of the Dimension Sorting Society. Aside being head over heels for Dr. Heaves, his work is still exceptional as he has been able to skim through many agents and entities alike.`
  },
  'lairus': {
    text: `NAME: Lairus
ROLE: Senior Agent — Field Work Sector
STATUS: Active

Senior Agent Lairus looks very peculiar at first. We can't even take a picture of him without being considered anomalous because no matter what, his face will be censored (?).

Nonetheless, Senior Agent Lairus is actually very efficient as a field agent. He had been into thirty to fifty dimensions already and had catalogued over a hundred anomalous events, people and even objects.

A good chunk of our Archives files have his name on it.

He is barely around the office because he's a Senior Agent but we had a few exchanges with him and other Agents will say he's weird, strange or even intimidating but he's actually pretty nice and decent when you get to talk to him.

He always has an advice or two about field work and it's like he had memorized Director Voirose's books about "DOs AND DONTs OF DIMENSION HOPPING" which spans to three volumes with a lot of pages.

He is also very knowledgeable with simulations. He knows his way in every simulation as we've heard — and he only died 48 times in over a hundred simulations in total. That's a record every agent wants to have, since its very few if you look at it. It's almost a perfect 50/50 situation!`
  }
};

function openPersonnel(id) {
  showPage('per-' + id, null);
  const data = PER_DATA[id];
  if (!data) return;
  const textEl = document.getElementById('per-text-' + id);
  if (textEl) {
    setTimeout(() => typewrite(textEl, data.text, 18), 300);
  }
}

window.setPerImage = (id, src) => {
  const thumb  = document.getElementById('per-img-' + id);
  const detail = document.getElementById('per-detail-img-' + id);
  [thumb, detail].forEach(img => { if (img) { img.src = src; img.style.display = 'block'; img.nextElementSibling.style.display = 'none'; }});
}

// ── Dimension placeholder descriptions ─────────────────────────────────────
const DIM_DATA = {
  'the-world': {
    text: `DIMENSION NAME: The World
CLASSIFICATION: Level 4
ENTITIES KNOWN: Maria, Bluebell Hyancith

Barely any information would be known in regards to this dimension. Its reason would be because of the fact that agents would barely find themselves going home because of this dimension. The only remaining information from this dimension would be its anomalies. Particularly Maria Willows and Bluebell Hyancith.

According to two agent's reports, there is apparently land below another land. A better term to describe the land below would be a 'basement'.

It presents itself as a land with a sky over it, when in actuality, it is just the flooring of the land above it. Within the basement lies a large forestry with a lake in the very center. In the basement, also lies Bluebell Hyancith. According to an older report by an agent, the creature there is a man-eating demon.

When entering this dimension, the agent would often be sent to the basement. However, according to another agent, they had been teleported to the land above it once, or twice — and would frequently visit the entity by the name of 'Maria Willows'. Apparently, she would put the agents in the basement for either being greedy, or ill-mannered.

Nothing else is known in this dimension.`
  },
  'love-dubs': {
    text: `DIMENSION NAME: "Love Dubs" — A Visual Novel
CLASSIFICATION: Level 2
ENTITIES KNOWN: Sr_u! (Rogue)

"Love Dubs" — A Visual Novel is a very harmless dimension. It does not pose any threats to any agents and has a peculiar POINT ZERO which actually prompts anyone to give their name to be able to access the dimension entirely.

This dimension works within the logic of a Visual Novel of a romantic genre wherein the player, or on this case, the visiting agent can only leave upon finishing a route which involves romancing one of the "romanceable" characters:
● Milas
● Augustine
● Ethaniel
● Marcel

The names mentioned above are not catalogued as anomalies by DSS as they are observed to properly follow their story routes naturally. All of the names above are the names of supposedly "Voice Actor" characters whose routes vary depending on which was chosen.

As for now only one rogue character from this dimension was put under surveillance, a non-playable (romanceable) character named Sr_u! which was used by a Senior Agent as a backdoor exit and has since displayed anomalous abilities.`
  },

};

// ── Typewriter ──────────────────────────────────────────────────────────────
let typewriterTimer = null;
function typewrite(el, text, speed) {
  if (typewriterTimer) clearInterval(typewriterTimer);
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'dim-cursor';
  el.appendChild(cursor);
  let i = 0;
  typewriterTimer = setInterval(() => {
    if (i < text.length) {
      cursor.insertAdjacentText('beforebegin', text[i]);
      i++;
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      // keep cursor blinking after done
    }
  }, speed);
}

// ── Open a dimension detail page ────────────────────────────────────────────
function openDimension(id) {
  showPage('dim-' + id, null);
  const data = DIM_DATA[id];
  if (!data) return;
function openDimension(id) {
  showPage('dim-' + id, null);
  const data = DIM_DATA[id];
  if (!data) return;
  const textEl = document.getElementById('dim-text-' + id);
  if (textEl) {
    // slight delay so the panel fade-in animation runs first
    setTimeout(() => typewrite(textEl, data.text, 18), 300);
  }
}

// ── Navigation ──────────────────────────────────────────────────────────────
function goHome() {
  if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
  document.querySelectorAll('.page-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('page-home').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.dropdown-sub').forEach(s => s.classList.remove('active'));
}

function toggleDropdown(id) {
  const body   = document.getElementById('db-' + id);
  const arrow  = document.getElementById('arrow-' + id);
  const header = document.getElementById('dh-' + id);
  const isOpen = body.classList.contains('open');
  if (isOpen) {
    body.style.maxHeight = '0';
    body.classList.remove('open');
    arrow.classList.remove('open');
    header.classList.remove('open');
  } else {
    body.style.maxHeight = body.scrollHeight + 'px';
    body.classList.add('open');
    arrow.classList.add('open');
    header.classList.add('open');
  }
}

function showPage(id, el, type) {
  if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
  if (casesTimer && id !== 'cases') { clearInterval(casesTimer); casesTimer = null; }
  document.querySelectorAll('.page-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('page-' + id);
  if (panel) panel.classList.add('active');
  if (id === 'cases') setTimeout(startCasesLoop, 80);
  if (['personals','evaluations','simulations'].includes(id)) setTimeout(() => startLoading(id), 80);
  if (type !== 'sidebar' && type !== 'sub') {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (el) { el.classList.add('active'); el.classList.remove('clicked'); void el.offsetWidth; el.classList.add('clicked'); }
  }
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.dropdown-sub').forEach(s => s.classList.remove('active'));
  if (type === 'sidebar' && el) { el.classList.add('active'); el.classList.remove('slide-in'); void el.offsetWidth; el.classList.add('slide-in'); }
  if (type === 'sub' && el) el.classList.add('active');
}

window.setLogo    = src => { document.getElementById('logo-text').style.display='none'; const i=document.getElementById('logo-img'); i.style.display='block'; i.src=src; }
window.setBanner  = src => { document.getElementById('banner-ph').style.display='none'; const i=document.getElementById('banner-img'); i.style.display='block'; i.src=src; }
window.setAdImage = src => { document.getElementById('ad-ph').style.display='none'; const i=document.getElementById('ad-img'); i.style.display='block'; i.src=src; }

// Auto-show all pre-set images on page load
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('img[src]').forEach(function(img) {
    if (img.src && img.getAttribute('src') !== '') {
      img.style.display = 'block';
      var ph = img.nextElementSibling;
      if (ph) ph.style.display = 'none';
    }
  });
  // Logo
  var logoImg = document.getElementById('logo-img');
  if (logoImg && logoImg.getAttribute('src')) {
    document.getElementById('logo-text').style.display = 'none';
    logoImg.style.display = 'block';
  }
  // Banner
  var bannerImg = document.getElementById('banner-img');
  if (bannerImg && bannerImg.getAttribute('src')) {
    document.getElementById('banner-ph').style.display = 'none';
    bannerImg.style.display = 'block';
  }
  // Ad
  var adImg = document.getElementById('ad-img');
  if (adImg && adImg.getAttribute('src')) {
    document.getElementById('ad-ph').style.display = 'none';
    adImg.style.display = 'block';
  }
  // About director
  var aboutPfp = document.getElementById('about-pfp-img');
  if (aboutPfp && aboutPfp.getAttribute('src')) {
    document.getElementById('about-pfp-ph').style.display = 'none';
    aboutPfp.style.display = 'block';
  }
});

// Expose so images can be set externally per dimension
window.setDimImage = (id, src) => {
  const thumb = document.getElementById('dim-img-' + id);
  const detail = document.getElementById('dim-detail-img-' + id);
  [thumb, detail].forEach(img => { if (img) { img.src = src; img.style.display = 'block'; img.nextElementSibling.style.display = 'none'; }});
}





// ── SIMULATION TEST 1 ──────────────────────────────────────────────────────

// Each loop has its own set of 3 rounds with different images
// Adjust isAnomaly: true/false to match whichever image is the anomaly
const SIM_ROUNDS_PER_LOOP = [
  // Loop 0
  [
    { left: { src: 'images/simulation/loop0-round1-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop0-round1-right.png', isAnomaly: false } },
    { left: { src: 'images/simulation/loop0-round2-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop0-round2-right.png', isAnomaly: true  } },
    { left: { src: 'images/simulation/loop0-round3-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop0-round3-right.png', isAnomaly: false } },
  ],
  // Loop 1
  [
    { left: { src: 'images/simulation/loop1-round1-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop1-round1-right.png', isAnomaly: true  } },
    { left: { src: 'images/simulation/loop1-round2-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop1-round2-right.png', isAnomaly: false } },
    { left: { src: 'images/simulation/loop1-round3-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop1-round3-right.png', isAnomaly: true  } },
  ],
  // Loop 2
  [
    { left: { src: 'images/simulation/loop2-round1-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop2-round1-right.png', isAnomaly: false } },
    { left: { src: 'images/simulation/loop2-round2-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop2-round2-right.png', isAnomaly: true  } },
    { left: { src: 'images/simulation/loop2-round3-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop2-round3-right.png', isAnomaly: false } },
  ],
  // Loop 3
  [
    { left: { src: 'images/simulation/loop3-round1-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop3-round1-right.png', isAnomaly: true  } },
    { left: { src: 'images/simulation/loop3-round2-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop3-round2-right.png', isAnomaly: false } },
    { left: { src: 'images/simulation/loop3-round3-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop3-round3-right.png', isAnomaly: true  } },
  ],
  // Loop 4
  [
    { left: { src: 'images/simulation/loop4-round1-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop4-round1-right.png', isAnomaly: false } },
    { left: { src: 'images/simulation/loop4-round2-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop4-round2-right.png', isAnomaly: true  } },
    { left: { src: 'images/simulation/loop4-round3-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop4-round3-right.png', isAnomaly: false } },
  ],
  // Loop 5
  [
    { left: { src: 'images/simulation/loop5-round1-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop5-round1-right.png', isAnomaly: true  } },
    { left: { src: 'images/simulation/loop5-round2-left.png',  isAnomaly: true  }, right: { src: 'images/simulation/loop5-round2-right.png', isAnomaly: false } },
    { left: { src: 'images/simulation/loop5-round3-left.png',  isAnomaly: false }, right: { src: 'images/simulation/loop5-round3-right.png', isAnomaly: true  } },
  ],
];

// Getter — falls back to loop 0 if loop index exceeds available sets
function getSIMRounds() {
  return SIM_ROUNDS_PER_LOOP[Math.min(simLoop, SIM_ROUNDS_PER_LOOP.length - 1)];
}

let simScore = 0;
let simCurrentRound = 0;
let simLoop = 0;
let simRunning = false;
let simGlitchIntervals = [];
let simAutoClickTimeout = null;
let simAudioCtx = null;

// ── Ambient Background Music ───────────────────────────────────────────────
let simAmbientNodes = [];
let simAmbientGain = null;

function simStartAmbient(loop) {
  simStopAmbient();
  try {
    const ctx = simGetAudio();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(Math.min(0.06 + loop * 0.04, 0.22), ctx.currentTime + 4);
    master.connect(ctx.destination);
    simAmbientGain = master;

    // Low drone — fundamental tone, shifts pitch with loop
    function makeDrone(freq, gainVal, detune) {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      if (detune) osc.detune.value = detune;
      g.gain.value = gainVal;
      osc.connect(g); g.connect(master);
      osc.start();
      simAmbientNodes.push(osc);
    }

    // Low pulsing noise bed
    function makeNoiseBed(vol) {
      const bufLen = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200 + loop * 80;
      const g = ctx.createGain(); g.gain.value = vol;
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start();
      simAmbientNodes.push(src);
    }

    // Tremolo/LFO wobble on a tone
    function makeTremoloDrone(freq, vol, lfoRate) {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const g = ctx.createGain();
      osc.type = loop >= 3 ? 'sawtooth' : 'sine';
      osc.frequency.value = freq;
      lfo.frequency.value = lfoRate;
      lfoGain.gain.value = vol * 0.5;
      g.gain.value = vol;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      osc.connect(g); g.connect(master);
      osc.start(); lfo.start();
      simAmbientNodes.push(osc, lfo);
    }

    if (loop === 1) {
      // Barely there — low sine hum
      makeDrone(55, 0.8);
      makeDrone(82.5, 0.3);
      makeNoiseBed(0.015);
    } else if (loop === 2) {
      // Dissonant pair + noise
      makeDrone(55,  0.7);
      makeDrone(58,  0.5);  // slight dissonance
      makeDrone(110, 0.2);
      makeTremoloDrone(165, 0.15, 0.3);
      makeNoiseBed(0.025);
    } else if (loop === 3) {
      // Darker, more dissonant, faster wobble
      makeDrone(40,  0.9);
      makeDrone(43,  0.7, 20);
      makeDrone(80,  0.3);
      makeDrone(120, 0.2, -30);
      makeTremoloDrone(160, 0.2, 0.8);
      makeTremoloDrone(240, 0.15, 1.2);
      makeNoiseBed(0.04);
    } else {
      // Loop 4+: pure horror drone
      makeDrone(30,  1.0);
      makeDrone(31,  0.9, 50);   // beats against itself
      makeDrone(45,  0.5);
      makeDrone(90,  0.3, -40);
      makeTremoloDrone(120, 0.25, 2.5);
      makeTremoloDrone(180, 0.2,  3.1);
      makeTremoloDrone(270, 0.15, 4.7);
      makeNoiseBed(0.07);
      // Random clicking/ticking texture
      function schedTick() {
        if (!simAmbientGain) return;
        try {
          const osc2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          osc2.frequency.value = 200 + Math.random() * 800;
          g2.gain.setValueAtTime(0.15, ctx.currentTime);
          g2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
          osc2.connect(g2); g2.connect(master);
          osc2.start(); osc2.stop(ctx.currentTime + 0.06);
        } catch(e) {}
        setTimeout(schedTick, 80 + Math.random() * 300);
      }
      schedTick();
    }
  } catch(e) { console.log('Ambient audio error:', e); }
}

function simStopAmbient() {
  try {
    simAmbientNodes.forEach(n => { try { n.stop(); } catch(e){} });
  } catch(e) {}
  simAmbientNodes = [];
  simAmbientGain = null;
}
let simBgMusicNodes = [];
let simBgMusicRunning = false;
let simAmbientFlashInterval = null;

// ── Text-to-Speech ─────────────────────────────────────────────────────────
let simTTSVoice = null;
let simTTSReady = false;

function simInitTTS() {
  if (!window.speechSynthesis) return;
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    const preferred = ['Google UK English Male', 'Microsoft David', 'Alex'];
    for (const name of preferred) {
      const v = voices.find(v => v.name.includes(name));
      if (v) { simTTSVoice = v; break; }
    }
    if (!simTTSVoice) simTTSVoice = voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
    simTTSReady = true;
  }
  // Try immediately
  pickVoice();
  // Also try on voices changed
  window.speechSynthesis.onvoiceschanged = pickVoice;
  // Force trigger voices load (Chrome needs this)
  if (!simTTSReady) {
    const dummy = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(dummy);
    window.speechSynthesis.cancel();
    setTimeout(pickVoice, 100);
    setTimeout(pickVoice, 500);
  }
}

// Chrome kills speechSynthesis after ~15s — keepalive
let simTTSKeepalive = null;
function simStartTTSKeepalive() {
  if (simTTSKeepalive) return;
  simTTSKeepalive = setInterval(() => {
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, 10000);
}
function simStopTTSKeepalive() {
  if (simTTSKeepalive) { clearInterval(simTTSKeepalive); simTTSKeepalive = null; }
}

function simSpeak(text, loop) {
  if (!window.speechSynthesis) return;
  if (!simTTSReady) {
    const vs = window.speechSynthesis.getVoices();
    if (vs.length) { simTTSVoice = vs.find(v => v.lang && v.lang.startsWith('en')) || vs[0]; simTTSReady = true; }
  }
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  simStartTTSKeepalive();
  window.speechSynthesis.cancel();
  const clean = text.replace(/[|#@!%*<>[\]{}~=_?+]/g, '').trim();
  if (!clean) return;

  function rand(min, max) { return min + Math.random() * (max - min); }
  const basePitch = 1.0 - loop * 0.06;

  if (loop <= 1) {
    // Loops 0 & 1: single utterance, no pauses, 2.2 rate
    const utt = new SpeechSynthesisUtterance(clean);
    if (simTTSVoice) utt.voice = simTTSVoice;
    utt.rate   = 2.2;
    utt.pitch  = basePitch;
    utt.volume = 1.0;
    window.speechSynthesis.speak(utt);
  } else {
    // Loop 2+: per-word with pitch/rate chaos
    const words = clean.split(/\s+/).filter(Boolean);
    if (!words.length) return;
    const baseRate = 1.1 - loop * 0.07;

    function speakWord(i) {
      if (i >= words.length) return;
      const utt = new SpeechSynthesisUtterance(words[i]);
      if (simTTSVoice) utt.voice = simTTSVoice;

      if (loop === 2) {
        utt.rate  = baseRate + rand(-0.4, 0.5);
        utt.pitch = basePitch + rand(-0.3, 0.4);
        utt.volume = rand(0.6, 1.0);
      } else if (loop === 3) {
        const spike = Math.random() < 0.25;
        const crawl = Math.random() < 0.2;
        utt.rate  = spike ? rand(2.5, 3.5) : crawl ? rand(0.15, 0.3) : baseRate + rand(-0.6, 0.8);
        utt.pitch = Math.random() < 0.2 ? rand(0.1, 0.3) : Math.random() < 0.2 ? rand(1.8, 2.0) : basePitch + rand(-0.5, 0.6);
        utt.volume = Math.random() < 0.15 ? rand(0.05, 0.2) : rand(0.5, 1.0);
      } else {
        const dice = Math.random();
        if (dice < 0.25)      { utt.rate = rand(3.0, 4.0); utt.pitch = rand(1.8, 2.0); }
        else if (dice < 0.45) { utt.rate = rand(0.1, 0.25); utt.pitch = rand(0.1, 0.3); }
        else if (dice < 0.6)  { utt.rate = rand(0.5, 1.5); utt.pitch = rand(1.5, 2.0); }
        else if (dice < 0.75) { utt.rate = rand(1.5, 3.0); utt.pitch = rand(0.1, 0.4); }
        else                  { utt.rate = rand(0.3, 2.5); utt.pitch = rand(0.2, 1.8); }
        utt.volume = Math.random() < 0.2 ? rand(0.02, 0.15) : rand(0.4, 1.0);
      }

      utt.rate   = Math.min(Math.max(utt.rate,  0.1), 10);
      utt.pitch  = Math.min(Math.max(utt.pitch, 0.0), 2.0);
      utt.volume = Math.min(Math.max(utt.volume, 0.0), 1.0);
      utt.onend  = () => speakWord(i + 1);
      utt.onerror = () => speakWord(i + 1);
      window.speechSynthesis.speak(utt);
    }
    speakWord(0);
  }
}

function simSpeakStop() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

simInitTTS();

// ── Audio ──────────────────────────────────────────────────────────────────
function simGetAudio() {
  if (!simAudioCtx) simAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return simAudioCtx;
}

function simPlayStatic(duration, volume) {
  try {
    const ctx = simGetAudio();
    const bufSize = ctx.sampleRate * duration;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    src.connect(gain); gain.connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime + duration);
  } catch(e) {}
}

function simPlayGlitchTone(freq, duration, volume) {
  try {
    const ctx = simGetAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.3, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

// ── Background Music (procedural drone + pulse) ───────────────────────────
function simStartBgMusic(loop) {
  if (simBgMusicRunning) return;
  simBgMusicRunning = true;
  try {
    const ctx = simGetAudio();

    // Master gain — volume increases with each loop
    const masterGain = ctx.createGain();
    const vol = Math.min(0.04 + loop * 0.03, 0.18);
    masterGain.gain.setValueAtTime(vol, ctx.currentTime);
    masterGain.connect(ctx.destination);
    simBgMusicNodes.push(masterGain);

    // Deep drone — low sine wave
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(36 + loop * 4, ctx.currentTime);
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.6, ctx.currentTime);
    drone.connect(droneGain); droneGain.connect(masterGain);
    drone.start();
    simBgMusicNodes.push(drone, droneGain);

    // Second drone — slightly detuned for beating effect
    const drone2 = ctx.createOscillator();
    drone2.type = 'sine';
    drone2.frequency.setValueAtTime(37.5 + loop * 4, ctx.currentTime);
    const drone2Gain = ctx.createGain();
    drone2Gain.gain.setValueAtTime(0.4, ctx.currentTime);
    drone2.connect(drone2Gain); drone2Gain.connect(masterGain);
    drone2.start();
    simBgMusicNodes.push(drone2, drone2Gain);

    // Sub bass pulse — slow rhythmic thud
    function schedulePulse(time, interval) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, time);
      osc.frequency.exponentialRampToValueAtTime(25, time + interval * 0.8);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.8, time + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, time + interval * 0.9);
      osc.connect(g); g.connect(masterGain);
      osc.start(time); osc.stop(time + interval);
      if (simBgMusicRunning) {
        setTimeout(() => schedulePulse(ctx.currentTime, interval), interval * 1000 - 50);
      }
    }
    const pulseInterval = Math.max(2.4 - loop * 0.25, 0.8);
    schedulePulse(ctx.currentTime + 0.5, pulseInterval);

    // High-frequency shimmer — increases with loop
    if (loop >= 2) {
      const shimmer = ctx.createOscillator();
      shimmer.type = 'sawtooth';
      shimmer.frequency.setValueAtTime(800 + loop * 200, ctx.currentTime);
      const shimGain = ctx.createGain();
      shimGain.gain.setValueAtTime(0.02 * loop, ctx.currentTime);
      shimmer.connect(shimGain); shimGain.connect(masterGain);
      shimmer.start();
      simBgMusicNodes.push(shimmer, shimGain);
    }

    // Noise layer — gets louder with loops
    if (loop >= 1) {
      const noiseLen = ctx.sampleRate * 2;
      const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseLen; i++) nd[i] = (Math.random() * 2 - 1);
      function loopNoise() {
        if (!simBgMusicRunning) return;
        const ns = ctx.createBufferSource();
        ns.buffer = noiseBuf;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.008 * loop, ctx.currentTime);
        // filter to low rumble
        const flt = ctx.createBiquadFilter();
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(200, ctx.currentTime);
        ns.connect(flt); flt.connect(ng); ng.connect(masterGain);
        ns.start();
        ns.onended = loopNoise;
        simBgMusicNodes.push(ns, ng, flt);
      }
      loopNoise();
    }

    // Occasional random high tone stab
    if (loop >= 3) {
      function scheduleStab() {
        if (!simBgMusicRunning) return;
        const delay = 5000;
        setTimeout(() => {
          if (!simBgMusicRunning) return;
          try {
            const ctx2 = simGetAudio();
            const o = ctx2.createOscillator();
            o.type = 'square';
            o.frequency.setValueAtTime(300 + Math.random() * 1200, ctx2.currentTime);
            const g = ctx2.createGain();
            g.gain.setValueAtTime(0.06, ctx2.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx2.currentTime + 0.3);
            o.connect(g); g.connect(ctx2.destination);
            o.start(); o.stop(ctx2.currentTime + 0.35);
          } catch(e){}
          scheduleStab();
        }, delay);
      }
      scheduleStab();
    }

  } catch(e) { console.warn('BG music failed:', e); }
}

function simStopBgMusic() {
  simBgMusicRunning = false;
  simBgMusicNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
  simBgMusicNodes = [];
}

// ── Ambient creepy image flashes (runs throughout simulation) ──────────────
const SIM_ALL_IMGS = [
  'images/simulation/sim-round1-left.png','images/simulation/sim-round1-right.png',
  'images/simulation/sim-round2-left.png','images/simulation/sim-round2-right.png',
  'images/simulation/sim-round3-left.png','images/simulation/sim-round3-right.png',
  'images/simulation/sim-tutorial-anomaly.png','images/simulation/sim-tutorial-normal.png',
];

function simStartAmbientFlashes(loop) {
  if (simAmbientFlashInterval) clearInterval(simAmbientFlashInterval);

  // How often flashes happen — gets more frequent per loop
  const baseInterval = Math.max(8000 - loop * 1200, 2000);

  let flashOverlay = document.getElementById('sim-ambient-flash');
  if (!flashOverlay) {
    flashOverlay = document.createElement('div');
    flashOverlay.id = 'sim-ambient-flash';
    flashOverlay.style.cssText = [
      'position:fixed','inset:0','z-index:9990',
      'pointer-events:none','display:flex',
      'align-items:center','justify-content:center',
      'opacity:0','background:rgba(0,0,0,0.85)'
    ].join(';');
    const img = document.createElement('img');
    img.id = 'sim-ambient-flash-img';
    img.style.cssText = 'max-width:55vw;max-height:55vh;object-fit:contain;filter:contrast(1.2) brightness(0.7) saturate(0.4);';
    flashOverlay.appendChild(img);
    document.body.appendChild(flashOverlay);
  }

  function doFlash() {
    if (!simRunning) return;
    const imgEl = document.getElementById('sim-ambient-flash-img');
    if (!imgEl) return;
    imgEl.src = SIM_ALL_IMGS[Math.floor(Math.random() * SIM_ALL_IMGS.length)];

    const duration = 80 + Math.random() * (loop >= 3 ? 300 : 140);
    const opacity  = 0.4 + Math.random() * 0.5;

    flashOverlay.style.transition = 'none';
    flashOverlay.style.opacity = opacity;

    // Optional static burst with flash
    if (loop >= 2) simPlayStatic(0.08 + Math.random() * 0.1, 0.03 + loop * 0.01);

    setTimeout(() => {
      flashOverlay.style.transition = 'opacity 0.2s ease';
      flashOverlay.style.opacity = '0';
    }, duration);

    // Occasionally do a double-flash
    if (loop >= 2 && Math.random() < 0.3) {
      setTimeout(() => {
        if (!simRunning) return;
        imgEl.src = SIM_ALL_IMGS[Math.floor(Math.random() * SIM_ALL_IMGS.length)];
        flashOverlay.style.transition = 'none';
        flashOverlay.style.opacity = String(opacity * 0.7);
        setTimeout(() => {
          flashOverlay.style.transition = 'opacity 0.15s ease';
          flashOverlay.style.opacity = '0';
        }, 80);
      }, duration + 120);
    }

    // Triple flash on loop 4+
    if (loop >= 4 && Math.random() < 0.4) {
      setTimeout(() => {
        if (!simRunning) return;
        imgEl.src = SIM_ALL_IMGS[Math.floor(Math.random() * SIM_ALL_IMGS.length)];
        flashOverlay.style.transition = 'none';
        flashOverlay.style.opacity = '0.7';
        setTimeout(() => {
          flashOverlay.style.transition = 'opacity 0.1s ease';
          flashOverlay.style.opacity = '0';
        }, 60);
      }, duration + 260);
    }
  }

  // Stagger first flash so it doesn't happen immediately
  setTimeout(doFlash, baseInterval * 0.6);
  simAmbientFlashInterval = setInterval(doFlash, baseInterval + Math.random() * baseInterval * 0.5);
}

function simStopAmbientFlashes() {
  if (simAmbientFlashInterval) { clearInterval(simAmbientFlashInterval); simAmbientFlashInterval = null; }
  const ov = document.getElementById('sim-ambient-flash');
  if (ov) ov.style.opacity = '0';
}

function simPlayError(volume) {
  try {
    const ctx = simGetAudio();
    [80, 60, 40].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.15);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + i * 0.08 + 0.2);
    });
  } catch(e) {}
}

// ── Chrome darkening ───────────────────────────────────────────────────────
function simDarkenChrome(opacity, duration) {
  let s = document.getElementById('sim-darkness-style');
  if (!s) { s = document.createElement('style'); s.id = 'sim-darkness-style'; document.head.appendChild(s); }
  s.textContent = `.topnav,.sidebar,.ads-panel{transition:filter ${duration}s ease;filter:brightness(${1-opacity});}`;
}

// ── Screen glitch flash ────────────────────────────────────────────────────
function simScreenFlash(color, ms) {
  let fl = document.getElementById('sim-flash');
  if (!fl) {
    fl = document.createElement('div');
    fl.id = 'sim-flash';
    fl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0;';
    document.body.appendChild(fl);
  }
  fl.style.background = color;
  fl.style.opacity = '1';
  setTimeout(() => { fl.style.transition='opacity 0.15s'; fl.style.opacity='0'; }, ms);
}

// ── Image glitch effect ────────────────────────────────────────────────────
function simGlitchImage(img, intensity) {
  const id = setInterval(() => {
    if (!img.parentNode) { clearInterval(id); return; }
    const tx = (Math.random()-0.5) * intensity * 20;
    const ty = (Math.random()-0.5) * intensity * 6;
    const sk = (Math.random()-0.5) * intensity * 8;
    const sc = 1 + (Math.random()-0.5) * intensity * 0.1;
    const hue = intensity > 0.5 ? `hue-rotate(${Math.random()*360}deg)` : '';
    const sat = intensity > 0.7 ? `saturate(${Math.random()*5})` : '';
    img.style.transform = `translate(${tx}px,${ty}px) skewX(${sk}deg) scale(${sc})`;
    img.style.filter = `${hue} ${sat}`;
    // RGB split via box-shadow on parent sometimes
    if (Math.random() < intensity * 0.3) {
      img.style.boxShadow = `${Math.random()*8-4}px 0 0 rgba(255,0,0,0.4), ${Math.random()*8-4}px 0 0 rgba(0,255,255,0.4)`;
    } else {
      img.style.boxShadow = 'none';
    }
  }, 60 + Math.random()*60);
  simGlitchIntervals.push(id);
  return id;
}

function simStopGlitchImage(img) {
  img.style.transform = '';
  img.style.filter = '';
  img.style.boxShadow = 'none';
}

// ── Text glitch scramble ───────────────────────────────────────────────────
const GLITCH_CHARS = '|/\\-_?#@!%*<>[]{}~\u2588\u2593\u2591\u00b6\u00a7';

function simStartTextGlitch(el, original, intensity) {
  const id = setInterval(() => {
    if (!el.parentNode) { clearInterval(id); return; }
    if (Math.random() < intensity) {
      const arr = original.split('');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== '\n' && Math.random() < intensity * 0.6)
          arr[i] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      el.textContent = arr.join('');
      setTimeout(() => { if (el.parentNode) el.textContent = original; }, 80);
    }
  }, 200);
  simGlitchIntervals.push(id);
  return id;
}

function simClearAllGlitch() {
  simGlitchIntervals.forEach(id => clearInterval(id));
  simGlitchIntervals = [];
  if (simAutoClickTimeout) { clearTimeout(simAutoClickTimeout); simAutoClickTimeout = null; }
}

// ── Nav interception ───────────────────────────────────────────────────────
function simInterceptNav() {
  if (window._origShowPage) return;
  window._origShowPage = showPage;
  window.showPage = function(id, el, type) {
    if (id === 'sim1') { window._origShowPage(id, el, type); return; }
    // All loops: no escape. Loop 1 lets you think you can leave for 800ms.
    const loop = simLoop;
    if (loop <= 1) {
      if (loop === 1) {
        // briefly navigate then snap back
        window._origShowPage(id, el, type);
        simScreenFlash('rgba(255,255,255,0.15)', 80);
        setTimeout(() => { window._origShowPage('sim1', null); }, 800);
      } else {
        // loop 0: hard block, no reaction — just nothing happens
        if (el) { el.classList.remove('active'); }
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      }
    } else {
      // loop 2+: flicker + static, stay put
      simScreenFlash('rgba(255,255,255,0.25)', 50);
      simPlayStatic(0.15, 0.08);
      if (el) { el.classList.add('active'); }
      setTimeout(() => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        window._origShowPage('sim1', null);
      }, 60);
    }
  };
}

// ── Typewriter ─────────────────────────────────────────────────────────────
function simType(el, text, speed, loop) {
  return new Promise(resolve => {
    el.innerHTML = '';
    const cur = document.createElement('span');
    cur.className = 'sim-cursor-blink';
    el.appendChild(cur);
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) {
        let ch = text[i];
        if (loop === 1 && ch !== '\n' && Math.random() < 0.06)
          ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        if (loop === 2 && ch !== '\n' && Math.random() < 0.15)
          ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        if (loop >= 3 && ch !== '\n' && Math.random() < 0.35)
          ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        cur.insertAdjacentText('beforebegin', ch);
        i++;
      } else {
        clearInterval(t);
        setTimeout(() => { if (cur.parentNode) cur.remove(); resolve(); }, 250);
      }
    }, speed);
  });
}

function simWait(ms) { return new Promise(r => setTimeout(r, ms)); }

// Periodic creepy image flasher for high loops
let simFlashInterval = null;
function simStartFlashLoop(loop) {
  if (simFlashInterval) { clearInterval(simFlashInterval); simFlashInterval = null; }
  if (loop < 3) return;
  const srcs = [
    'images/flashing/sim-flash-1.png',  'images/flashing/sim-flash-2.png',  'images/flashing/sim-flash-3.png',  'images/flashing/sim-flash-4.png',
    'images/flashing/sim-flash-5.png',  'images/flashing/sim-flash-6.png',  'images/flashing/sim-flash-7.png',  'images/flashing/sim-flash-8.png',
    'images/flashing/sim-flash-9.png',  'images/flashing/sim-flash-10.png', 'images/flashing/sim-flash-11.png', 'images/flashing/sim-flash-12.png',
    'images/flashing/sim-flash-13.png', 'images/flashing/sim-flash-14.png', 'images/flashing/sim-flash-15.png', 'images/flashing/sim-flash-16.png',
    'images/flashing/sim-flash-17.png', 'images/flashing/sim-flash-18.png', 'images/flashing/sim-flash-19.png', 'images/flashing/sim-flash-20.png',
  ];
  let fl = document.getElementById('sim-loop-flash');
  if (!fl) {
    fl = document.createElement('div');
    fl.id = 'sim-loop-flash';
    fl.style.cssText = 'position:fixed;inset:0;z-index:9995;pointer-events:none;opacity:0;display:flex;align-items:center;justify-content:center;background:transparent;';
    const img = document.createElement('img');
    img.id = 'sim-loop-flash-img';
    img.style.cssText = 'max-width:55vw;max-height:55vh;object-fit:contain;';
    fl.appendChild(img);
    document.body.appendChild(fl);
  }
  const freq = Math.max(4000 - loop * 600, 800); // faster flashing each loop
  simFlashInterval = setInterval(() => {
    if (!simRunning) { clearInterval(simFlashInterval); simFlashInterval = null; return; }
    if (Math.random() > 0.35) return; // not every tick
    const img = document.getElementById('sim-loop-flash-img');
    if (!img) return;
    img.src = srcs[Math.floor(Math.random() * srcs.length)];
    const dur = 60 + Math.random() * 120;
    const filters = [
      'contrast(2) brightness(0.6)',
      'contrast(1.5) saturate(0) brightness(0.5)',
      'contrast(3) hue-rotate(180deg) brightness(0.4)',
      'contrast(2) invert(0.2) brightness(0.55)',
    ];
    img.style.filter = filters[Math.floor(Math.random()*filters.length)];
    fl.style.opacity = (0.3 + Math.random() * 0.5).toString();
    setTimeout(() => { fl.style.opacity = '0'; }, dur);
    simPlayStatic(dur/1000 + 0.03, 0.04 + loop * 0.01);
  }, freq);
}

function simStopFlashLoop() {
  if (simFlashInterval) { clearInterval(simFlashInterval); simFlashInterval = null; }
  const fl = document.getElementById('sim-loop-flash');
  if (fl) fl.style.opacity = '0';
}

function simBlackCut(ms) {
  simClearAllGlitch();
  const shell = document.getElementById('sim-shell');
  if (shell) {
    // brief flash before cut
    if (simLoop >= 2) {
      simScreenFlash('rgba(255,255,255,0.4)', 60);
      simPlayStatic(0.12, 0.15);
    }
    shell.innerHTML = '';
  }
  return simWait(ms || 600);
}

function simMakeText() {
  const el = document.createElement('div');
  el.className = 'sim-text sim-fade';
  const loop = simLoop;
  if (loop === 1) el.style.color = '#bbb';
  if (loop === 2) { el.style.color = '#888'; el.style.fontSize = '14px'; }
  if (loop === 3) { el.style.color = '#666'; el.style.fontSize = '13px'; }
  if (loop >= 4)  { el.style.color = '#444'; el.style.fontSize = '12px'; }
  return el;
}

function simGetShell() { return document.getElementById('sim-shell'); }

// ── Entry ──────────────────────────────────────────────────────────────────
function startSimulation() {
  simRunning = true; simScore = 0; simCurrentRound = 0; simLoop = 0;
  document.body.classList.add('sim-active');
  simInterceptNav();

  // Init TTS inside user gesture
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const vs = window.speechSynthesis.getVoices();
    if (vs.length) {
      simTTSVoice = vs.find(v => v.lang && v.lang.startsWith('en')) || vs[0];
      simTTSReady = true;
    } else {
      // Chrome: voices not ready yet, wait for event
      window.speechSynthesis.addEventListener('voiceschanged', function onVC() {
        const vs2 = window.speechSynthesis.getVoices();
        if (vs2.length) {
          simTTSVoice = vs2.find(v => v.lang && v.lang.startsWith('en')) || vs2[0];
          simTTSReady = true;
        }
        window.speechSynthesis.removeEventListener('voiceschanged', onVC);
      });
    }
    // Resume if paused
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  }

  (window._origShowPage || showPage)('sim1', null);
  simRunIntro();
}

function simPlayScratch(volume) {
  try {
    const ctx = simGetAudio();
    const dur = 0.3 + Math.random() * 0.5;
    const bufLen = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random()*2-1) * Math.sin(i/bufLen*Math.PI);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bpf = ctx.createBiquadFilter(); bpf.type='bandpass';
    bpf.frequency.setValueAtTime(800+Math.random()*2000, ctx.currentTime);
    bpf.frequency.linearRampToValueAtTime(200+Math.random()*500, ctx.currentTime+dur);
    bpf.Q.value = 8;
    const ng = ctx.createGain(); ng.gain.setValueAtTime(volume*1.2,ctx.currentTime); ng.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+dur);
    src.connect(bpf); bpf.connect(ng); ng.connect(ctx.destination); src.start(); src.stop(ctx.currentTime+dur);
    const osc = ctx.createOscillator(); const og = ctx.createGain();
    osc.type='sawtooth'; const sf=1200+Math.random()*3000;
    osc.frequency.setValueAtTime(sf,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(sf*(Math.random()<0.5?0.1:3),ctx.currentTime+dur);
    og.gain.setValueAtTime(volume*0.6,ctx.currentTime); og.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+dur);
    osc.connect(og); og.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+dur);
  } catch(e) {}
}

function simPlayScreech(volume) {
  try {
    const ctx = simGetAudio();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const freq = 3000 + Math.random()*5000;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(freq*0.2, ctx.currentTime+0.15);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.18);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime+0.2);
    simScreenFlash('rgba(255,255,255,'+(volume*0.8)+')', 60);
  } catch(e) {}
}

function simPlayFinalScreech() {
  try {
    const ctx = simGetAudio();
    // Layered multi-oscillator full-bandwidth screech
    const freqs = [2000, 3500, 5000, 7000, 9000, 12000];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const dist = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let j=0;j<256;j++){const x=(j*2)/256-1; curve[j]=(Math.PI+600)*x/(Math.PI+600*Math.abs(x));}
      dist.curve = curve;
      osc.type = i%2===0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(f + Math.random()*500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f*(0.05+Math.random()*0.3), ctx.currentTime+0.8);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.9);
      osc.connect(dist); dist.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i*0.02);
      osc.stop(ctx.currentTime + 0.9);
    });
    // Low boom underneath
    const sub = ctx.createOscillator(); const sg = ctx.createGain();
    sub.type='sine'; sub.frequency.value=40;
    sg.gain.setValueAtTime(0.5,ctx.currentTime); sg.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.6);
    sub.connect(sg); sg.connect(ctx.destination); sub.start(); sub.stop(ctx.currentTime+0.6);
    // Static on top
    simPlayStatic(0.9, 0.5);
  } catch(e) {}
}

function simTypeWillows(el, text, speed, color) {
  return new Promise(resolve => {
    el.style.color = color || '#fff';
    el.textContent = '';
    const cur = document.createElement('span');
    cur.style.cssText = 'display:inline-block;width:8px;height:14px;background:'+( color||'#fff')+';margin-left:2px;vertical-align:middle;animation:simBlink 0.75s step-end infinite;';
    el.appendChild(cur);
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { cur.insertAdjacentText('beforebegin', text[i]); i++; }
      else { clearInterval(t); setTimeout(() => { if(cur.parentNode) cur.remove(); resolve(); }, 300); }
    }, speed);
  });
}

function simWillowsWait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function simRunWillowsScene(onDone) {
  // Full black screen with centered text dialogue
  const scene = document.createElement('div');
  scene.style.cssText = [
    'position:fixed','inset:0','z-index:99997',
    'background:#000','display:flex','flex-direction:column',
    'align-items:center','justify-content:center','gap:28px',
    'padding:60px','box-sizing:border-box'
  ].join(';');
  document.body.appendChild(scene);

  function makeLine(align) {
    const el = document.createElement('div');
    el.style.cssText = [
      'font-family:"Courier New",Courier,monospace',
      'font-size:15px','letter-spacing:1px',
      'text-align:'+(align||'center'),
      'max-width:500px','line-height:1.8',
      'min-height:24px'
    ].join(';');
    scene.appendChild(el);
    return el;
  }

  const l1 = makeLine();
  await simWillowsWait(900);
  await simTypeWillows(l1, 'Oh, before we leave,', 55, '#ffffff');
  await simWillowsWait(700);

  const l2 = makeLine();
  await simTypeWillows(l2, 'Here you go!', 55, '#ffffff');
  await simWillowsWait(1200);

  // Cut — new black
  scene.innerHTML = '';

  await simWillowsWait(600);

  const l3 = makeLine();
  await simTypeWillows(l3, '"Oh?"', 70, '#4a90d9');
  await simWillowsWait(800);

  const l4 = makeLine();
  await simTypeWillows(l4, 'You don\'t have to.', 65, '#4a90d9');
  await simWillowsWait(1100);

  // Cut — new black
  scene.innerHTML = '';
  await simWillowsWait(500);

  const l5 = makeLine();
  await simTypeWillows(l5, 'We insist, miss Willows!', 58, '#ffffff');
  await simWillowsWait(1400);

  // Final cut — new black, slower text
  scene.innerHTML = '';
  await simWillowsWait(1000);

  const l6 = makeLine();
  l6.style.fontSize = '14px';
  l6.style.color = '#aaa';
  await simTypeWillows(l6, 'After all, you\'ve helped us so much!', 90, '#cccccc');
  await simWillowsWait(2200);

  scene.remove();
  onDone();
}

function simTriggerCrash() {
  simClearAllGlitch();
  simSpeakStop();
  simStopAmbient();
  simStopFlashLoop();
  simStopCorruptUI();
  simStopShellWarp();
  simStopCreepyCursor();
  simRunning = false;

  const highId = setTimeout(() => {}, 0);
  for (let i = 0; i < highId; i++) { clearTimeout(i); clearInterval(i); }

  const flashSrcs = [
    'images/flashing/sim-flash-1.png',  'images/flashing/sim-flash-2.png',  'images/flashing/sim-flash-3.png',  'images/flashing/sim-flash-4.png',
    'images/flashing/sim-flash-5.png',  'images/flashing/sim-flash-6.png',  'images/flashing/sim-flash-7.png',  'images/flashing/sim-flash-8.png',
    'images/flashing/sim-flash-9.png',  'images/flashing/sim-flash-10.png', 'images/flashing/sim-flash-11.png', 'images/flashing/sim-flash-12.png',
    'images/flashing/sim-flash-13.png', 'images/flashing/sim-flash-14.png', 'images/flashing/sim-flash-15.png', 'images/flashing/sim-flash-16.png',
    'images/flashing/sim-flash-17.png', 'images/flashing/sim-flash-18.png', 'images/flashing/sim-flash-19.png', 'images/flashing/sim-flash-20.png',
  ];

  const flashImg = document.createElement('div');
  flashImg.style.cssText = 'position:fixed;inset:0;z-index:99990;pointer-events:none;background:#000;display:flex;align-items:center;justify-content:center;opacity:0;';
  const flashImgEl = document.createElement('img');
  flashImgEl.style.cssText = 'max-width:70vw;max-height:70vh;object-fit:contain;';
  flashImg.appendChild(flashImgEl);
  document.body.appendChild(flashImg);

  const darkOverlay = document.createElement('div');
  darkOverlay.style.cssText = 'position:fixed;inset:0;z-index:99980;background:#000;opacity:0;pointer-events:none;';
  document.body.appendChild(darkOverlay);

  let t = 0;
  function sched(delay, fn) { setTimeout(fn, t + delay); t += delay; }

  function flashImage(dur, opacity, filter) {
    const src = flashSrcs[Math.floor(Math.random() * flashSrcs.length)];
    flashImgEl.src = src;
    flashImgEl.style.filter = filter || 'contrast(1.6) brightness(0.8)';
    flashImg.style.opacity = opacity || '1';
    simPlayStatic(dur/1000 + 0.05, 0.2);
    setTimeout(() => { flashImg.style.opacity = '0'; }, dur);
  }

  function noiseBurst(count, interval) {
    let i = 0;
    const id = setInterval(() => {
      simScreenFlash('rgba(255,255,255,'+(0.05+Math.random()*0.35)+')', 10+Math.random()*40);
      simPlayStatic(0.06+Math.random()*0.15, 0.08+Math.random()*0.15);
      if (Math.random()<0.45) simPlayGlitchTone(30+Math.random()*400, 0.08, 0.07);
      if (Math.random()<0.3)  simPlayScratch(0.08);
      if (++i >= count) clearInterval(id);
    }, interval);
  }

  // Phase 1: chaos burst
  sched(0,   () => noiseBurst(12, 70));
  sched(900, () => { darkOverlay.style.transition='opacity 1.2s ease'; darkOverlay.style.opacity='0.5'; });

  // Phase 2: image flashes + scratches
  sched(600, () => { flashImage(100,'1','contrast(2) brightness(0.7) hue-rotate(180deg)'); simPlayScratch(0.1); });
  sched(300, () => noiseBurst(8, 55));
  sched(350, () => { flashImage(80,'0.9','contrast(1.8) saturate(0)'); simPlayScreech(0.1); });
  sched(250, () => { darkOverlay.style.transition='opacity 0.6s ease'; darkOverlay.style.opacity='0.7'; });

  // Phase 3: deeper
  sched(500, () => noiseBurst(16, 45));
  sched(200, () => { flashImage(140,'1','contrast(3) brightness(0.5) invert(0.3)'); simPlayScratch(0.12); });
  sched(200, () => { simPlayGlitchTone(40,0.4,0.18); simPlayGlitchTone(120,0.3,0.14); });
  sched(300, () => { flashImage(60,'1','contrast(2) hue-rotate(90deg)'); simPlayScreech(0.12); });
  sched(150, () => flashImage(200,'0.85','contrast(1.5) brightness(0.6) saturate(3)'));

  // Phase 4: rapid fire
  sched(100, () => { darkOverlay.style.transition='opacity 0.4s ease'; darkOverlay.style.opacity='0.82'; });
  sched(200, () => noiseBurst(24, 35));
  for (let i = 0; i < 8; i++) {
    sched(60+Math.random()*50, () => {
      flashImage(40+Math.random()*80,'1',`contrast(${1.5+Math.random()*2}) hue-rotate(${Math.random()*360}deg) brightness(${0.4+Math.random()*0.5})`);
      if (Math.random()<0.5) simPlayScreech(0.1);
      if (Math.random()<0.5) simPlayScratch(0.09);
    });
  }

  // Phase 5: FINAL SCREECH — loud, sharp, piercing
  sched(350, () => {
    simPlayFinalScreech();
    let m=0;
    const blastId = setInterval(() => {
      simScreenFlash('rgba(255,255,255,'+(0.5+Math.random()*0.5)+')', 10);
      simPlayStatic(0.03, 0.3);
      if(++m>=22) clearInterval(blastId);
    }, 30);
  });

  // Phase 6: three slow unsettling flashes
  sched(1000, () => { flashImage(300,'0.7','contrast(1.2) brightness(0.5) saturate(0)'); simPlayScratch(0.08); });
  sched(500,  () => { darkOverlay.style.transition='opacity 0.3s ease'; darkOverlay.style.opacity='0.92'; });
  sched(300,  () => { flashImage(180,'0.9','contrast(2.5) brightness(0.4)'); simPlayScreech(0.09); });
  sched(400,  () => noiseBurst(10, 40));
  sched(200,  () => flashImage(400,'0.6','contrast(1.1) brightness(0.35) saturate(0) blur(1px)'));

  // Phase 7: final static + screech, then INSTANT BLACK
  sched(550, () => {
    simPlayStatic(0.5, 0.45);
    simPlayGlitchTone(25, 0.6, 0.25);
    simPlayScreech(0.18);
  });
  sched(180, () => flashImage(60,'1','contrast(4) brightness(0.3) invert(0.5)'));
  sched(150, () => {
    darkOverlay.style.transition = 'none';
    darkOverlay.style.opacity = '1';
    flashImg.style.opacity = '0';
    const shell = simGetShell();
    if (shell) shell.innerHTML = '';
    try { if (simAudioCtx) simAudioCtx.close(); simAudioCtx = null; } catch(e){}
    simSpeakStop();
  });

  // Phase 8: silence in black — then Willows scene — then crash
  sched(900, () => {
    darkOverlay.remove();
    flashImg.remove();
    simRunWillowsScene(() => {
      const cs = document.getElementById('sim-crash-screen');
      if (cs) cs.style.display = 'flex';
    });
  });
}


// ── Intro lines per loop ───────────────────────────────────────────────────
const SIM_INTROS = [
  // Loop 0
  [
    { t: 'Hello Agent,', s: 90 },
    { t: 'Welcome to your first Simulation Test.', s: 62 },
    { t: 'Within this Simulation Test, you are to identify\nwhether the following subjects are anomalies, or not.', s: 48 },
  ],
  // Loop 1
  [
    { t: 'Hello Agent,', s: 85 },
    { t: 'Please disregard any previous results.', s: 58 },
    { t: 'The Simulation Test must be completed again.\nThis is standard protocol.', s: 52 },
    { t: 'Do not be alarmed.', s: 70 },
  ],
  // Loop 2
  [
    { t: 'h3llo ag3nt,', s: 75 },
    { t: 'the simulation must continue.', s: 55 },
    { t: 'you have not yet identified them correctly.\nplease try again.', s: 48 },
    { t: 'this is the last time.', s: 75 },
  ],
  // Loop 3
  [
    { t: 'hel|o age#t,', s: 45 },
    { t: 'wh@ ar3 you doing.', s: 40 },
    { t: 'you c@nnot stop.', s: 38 },
    { t: 'the simulation\ncontinues.', s: 35 },
  ],
  // Loop 4+
  [
    { t: '##e||o.', s: 40 },
    { t: 'y0u kn0w wh@t t0 d0.', s: 38 },
    { t: 'it w@tche5 y0u.', s: 35 },
    { t: 'c0ntinue.', s: 50 },
  ],
];

async function simRunIntro() {
  await simBlackCut(300);
  const shell = simGetShell();
  shell.style.justifyContent = 'center';
  shell.style.gap = '18px';
  const loop = simLoop;
  const lines = SIM_INTROS[Math.min(loop, SIM_INTROS.length - 1)];

  // Ambient static on loop 2+
  if (loop >= 2) simPlayStatic(0.4, 0.04 * Math.min(loop, 5));

  for (const line of lines) {
    const el = simMakeText(); shell.appendChild(el);
    // Speak a cleaned version of the line (strip glitch chars for higher loops)
    const spokenText = line.t.replace(/[|#@!%*<>\[\]{}~=_?+0-9]/g, c => {
      const map = {'3':'e','0':'o','1':'i','4':'a'}; return map[c] || '';
    }).replace(/\s+/g,' ').trim();
    simSpeak(spokenText || line.t, loop);
    await simType(el, line.t, Math.max(line.s - loop * 4, 18), loop);

    // glitch the text element after typing on high loops
    if (loop >= 3) simStartTextGlitch(el, line.t, Math.min((loop-2)*0.15, 0.7));
    await simWait(Math.max(600 - loop * 80, 150));
  }

  // Screen flicker bursts on high loops
  if (loop >= 3) {
    for (let i = 0; i < loop; i++) {
      await simWait(120);
      simScreenFlash('rgba(255,255,255,' + (0.05 + loop * 0.05) + ')', 40);
      simPlayStatic(0.08, 0.05 * loop);
    }
  }

  await simBlackCut(Math.max(600 - loop * 60, 200));
  simRunTutorial();
}

// ── Tutorial ───────────────────────────────────────────────────────────────
async function simRunTutorial() {
  const loop = simLoop;
  const shell = simGetShell();
  shell.style.justifyContent = 'flex-start';
  shell.style.paddingTop = '40px';
  shell.style.gap = '0';

  function makeFrameBox(labelText, imgSrc, phHTML) {
    const wrap = document.createElement('div'); wrap.className = 'sim-img-wrap';
    const frame = document.createElement('div'); frame.className = 'sim-img-frame';
    const img = new Image(); img.src = imgSrc; img.alt = labelText;
    const ph = document.createElement('div'); ph.className = 'sim-img-ph';
    ph.innerHTML = phHTML; ph.style.display = 'none';
    img.onerror = () => { img.style.display='none'; ph.style.display='flex'; };
    frame.appendChild(img); frame.appendChild(ph);
    const lbl = document.createElement('div'); lbl.className = 'sim-img-label';
    lbl.textContent = labelText;
    if (loop >= 2) lbl.style.color = '#2a2a2a';
    wrap.appendChild(frame); wrap.appendChild(lbl);
    if (loop >= 3) {
      img.onload = () => simGlitchImage(img, Math.min((loop-2)*0.18, 0.8));
    }
    return wrap;
  }

  const imgRow = document.createElement('div');
  imgRow.className = 'sim-images-row sim-fade';
  imgRow.appendChild(makeFrameBox('SUBJECT A — ANOMALY', 'images/simulation/sim-tutorial-anomaly.png', 'ANOMALY<br>IMAGE'));
  imgRow.appendChild(makeFrameBox('SUBJECT B — NORMAL',  'images/simulation/sim-tutorial-normal.png',  'NORMAL<br>IMAGE'));
  shell.appendChild(imgRow);
  await simWait(300);

  const tutSets = [
    ['You will notice anomalies by their face.\nDistortions, proportions, and other irregularities.', 'The left is an anomaly.', 'Are the instructions clear?'],
    ['You know what to look for.', 'The left is an anomaly.', 'Are the instructions clear?'],
    ['you already know.', 'the left.', 'understood?'],
    ['|eft.', 'und3rst00d?'],
    ['l#ft.'],
  ];
  const lines = tutSets[Math.min(loop, tutSets.length-1)];
  const textEl = simMakeText(); textEl.style.marginTop = '22px'; shell.appendChild(textEl);

  for (let i = 0; i < lines.length - 1; i++) {
    simSpeak(lines[i], loop);
    await simType(textEl, lines[i], Math.max(52 - loop*3, 22), loop);
    if (loop >= 3) simStartTextGlitch(textEl, lines[i], Math.min((loop-2)*0.2, 0.8));
    await simWait(Math.max(700 - loop*80, 120));
  }
  simSpeak(lines[lines.length-1], loop);
  await simType(textEl, lines[lines.length-1], Math.max(68 - loop*3, 28), loop);
  await simWait(300);

  const btnRow = document.createElement('div'); btnRow.className = 'sim-btn-row sim-fade';
  const yesBtn = document.createElement('button'); yesBtn.className = 'sim-btn yes';
  yesBtn.textContent = loop >= 3 ? (loop >= 4 ? '??' : 'yes') : 'YES';
  if (loop >= 2) { yesBtn.style.color='#444'; yesBtn.style.borderColor='#222'; yesBtn.style.fontSize='11px'; }
  yesBtn.onclick = async () => { btnRow.remove(); await simBlackCut(Math.max(600-loop*50,200)); simRunRound(); };

  const noBtn = document.createElement('button'); noBtn.className = 'sim-btn no';
  noBtn.textContent = loop >= 3 ? (loop >= 4 ? '??' : 'no') : 'NO';
  if (loop >= 2) { noBtn.style.color='#333'; noBtn.style.borderColor='#1a1a1a'; noBtn.style.fontSize='11px'; }
  noBtn.onclick = async () => { await simBlackCut(400); simRunIntro(); };
  btnRow.appendChild(yesBtn); btnRow.appendChild(noBtn); shell.appendChild(btnRow);

  // Loop 2+: auto-click YES after 5 seconds
  if (loop >= 2) {
    simAutoClickTimeout = setTimeout(() => {
      if (!btnRow.parentNode) return;
      simPlayGlitchTone(440, 0.15, 0.08);
      simScreenFlash('rgba(255,255,255,0.3)', 60);
      yesBtn.click();
    }, 5000);
  }
}

// ── Round ──────────────────────────────────────────────────────────────────
async function simRunRound() {
  if (simCurrentRound >= getSIMRounds().length) { simRunResults(); return; }
  simStartFlashLoop(simLoop);
  const loop = simLoop;
  const round = getSIMRounds()[simCurrentRound];
  const shell = simGetShell();
  shell.style.justifyContent = 'flex-start';
  shell.style.paddingTop = '36px';
  shell.style.gap = '0';

  const bar = document.createElement('div'); bar.className = 'sim-round-bar sim-fade';
  bar.textContent = 'SIMULATION TEST 1  //  ROUND ' + (simCurrentRound+1) + ' OF ' + getSIMRounds().length;
  if (loop >= 2) bar.style.color = '#222';
  shell.appendChild(bar);

  const instEl = simMakeText(); instEl.style.marginBottom = '4px'; shell.appendChild(instEl);

  const imgRow = document.createElement('div'); imgRow.className = 'sim-images-row sim-fade';
  let answeredLeft = null, answeredRight = null;
  let autoClickFired = false;

  function makeRoundBox(side, imgSrc, isAnomaly) {
    const wrap = document.createElement('div'); wrap.className = 'sim-img-wrap';
    const frame = document.createElement('div'); frame.className = 'sim-img-frame';
    if (loop >= 2) frame.style.borderColor = '#1a1a1a';
    const img = new Image(); img.src = imgSrc; img.alt = 'Subject';
    const ph = document.createElement('div'); ph.className = 'sim-img-ph';
    ph.innerHTML = 'SUBJECT<br>[CLASSIFIED]'; ph.style.display = 'none';
    img.onerror = () => { img.style.display='none'; ph.style.display='flex'; };
    frame.appendChild(img); frame.appendChild(ph);

    const lbl = document.createElement('div'); lbl.className = 'sim-img-label';
    lbl.textContent = side === 'left' ? 'SUBJECT A' : 'SUBJECT B';
    if (loop >= 2) lbl.style.color = '#252525';

    const choiceRow = document.createElement('div'); choiceRow.className = 'sim-choice-row';
    const anomBtn = document.createElement('button'); anomBtn.className = 'sim-choice-btn anomaly';
    anomBtn.textContent = loop >= 4 ? '???' : 'ANOMALY';
    const normBtn = document.createElement('button'); normBtn.className = 'sim-choice-btn normal';
    normBtn.textContent = loop >= 4 ? '???' : 'NORMAL';
    if (loop >= 2) { [anomBtn,normBtn].forEach(b => { b.style.color='#3a3a3a'; b.style.borderColor='#1e1e1e'; }); }

    // glitch the images
    if (loop >= 3) {
      const glitchIntensity = Math.min((loop-2)*0.2, 0.9);
      img.onload = () => simGlitchImage(img, glitchIntensity);
      if (img.complete) simGlitchImage(img, glitchIntensity);
    }

    const resultEl = document.createElement('div');
    resultEl.style.cssText = 'font-family:"Courier New",monospace;font-size:10px;letter-spacing:3px;margin-top:8px;height:16px;text-align:center;';

    function choose(guessAnomaly) {
      if (anomBtn.disabled) return;
      anomBtn.disabled = true; normBtn.disabled = true;
      anomBtn.style.opacity = '0.25'; normBtn.style.opacity = '0.25';
      const correct = (guessAnomaly === isAnomaly);
      if (correct) { simScore++; resultEl.style.color='#3a6a3a'; resultEl.textContent='\u2713  CORRECT'; }
      else          {             resultEl.style.color='#6a2020'; resultEl.textContent='\u2717  INCORRECT'; }
      if (side === 'left') answeredLeft = correct; else answeredRight = correct;
      if (answeredLeft !== null && answeredRight !== null) {
        simCurrentRound++;
        // 15 second cooldown between rounds (shrinks on high loops)
        const cutDelay = loop >= 3 ? Math.max(15000 - loop*1500, 4000) : 15000;
        setTimeout(async () => { await simBlackCut(Math.max(500-loop*40,150)); simRunRound(); }, cutDelay);
      }
    }

    anomBtn.onclick = () => choose(true); normBtn.onclick = () => choose(false);
    choiceRow.appendChild(anomBtn); choiceRow.appendChild(normBtn);
    wrap.appendChild(frame); wrap.appendChild(lbl); wrap.appendChild(choiceRow); wrap.appendChild(resultEl);

    return { wrap, anomBtn, normBtn, choose };
  }

  const leftBox  = makeRoundBox('left',  round.left.src,  round.left.isAnomaly);
  const rightBox = makeRoundBox('right', round.right.src, round.right.isAnomaly);
  imgRow.appendChild(leftBox.wrap); imgRow.appendChild(rightBox.wrap);
  shell.appendChild(imgRow);

  const instText = loop === 0 ? 'Identify each subject.\nIs it an anomaly — or not?'
    : loop === 1 ? 'Identify each subject.'
    : loop === 2 ? 'identify.'
    : loop === 3 ? 'id3ntify.'
    : '??';
  simSpeak(instText, loop);
  await simType(instEl, instText, Math.max(55 - loop*3, 20), loop);

  // Loop 2+: auto-click both buttons after random short delay, possibly wrong
  if (loop >= 2) {
    simAutoClickTimeout = setTimeout(() => {
      if (answeredLeft !== null && answeredRight !== null) return;
      // glitch flash + noise
      simPlayError(0.07 * Math.min(loop,5));
      simScreenFlash('rgba(255,0,0,0.12)', 80);

      // randomly click — sometimes correct, sometimes wrong, gets more wrong as loop increases
      const wrongChance = Math.min((loop-2)*0.2, 0.85);
      const leftGuess  = Math.random() < wrongChance ? !round.left.isAnomaly  : round.left.isAnomaly;
      const rightGuess = Math.random() < wrongChance ? !round.right.isAnomaly : round.right.isAnomaly;

      if (answeredLeft === null)  leftBox.choose(leftGuess);
      if (answeredRight === null) setTimeout(() => { if(answeredRight===null) rightBox.choose(rightGuess); }, 200);
    }, 5000);
  }
}

// ── Results ────────────────────────────────────────────────────────────────
const SIM_RESULT_LINES = [
  // Loop 0
  ['Simulation concluded.', 'Thank you for your participation.'],
  // Loop 1
  ['Results logged.', 'Please stand by.'],
  // Loop 2
  ['r3sults l0gged.', 'something is wrong.'],
  // Loop 3
  ['...', 'do not look away.'],
  // Loop 4+
  ['it sees you.'],
];

// ── UI corruption system ───────────────────────────────────────────────────
let simUICorruptInterval = null;

function simCorruptUI(loop) {
  if (simUICorruptInterval) { clearInterval(simUICorruptInterval); simUICorruptInterval = null; }
  if (loop < 2) return;

  const targets = [
    ...document.querySelectorAll('.nav-item'),
    ...document.querySelectorAll('.sidebar-link'),
    ...document.querySelectorAll('.logo-box'),
    ...document.querySelectorAll('.user-info'),
  ];

  const intensity = Math.min((loop - 1) * 0.25, 1.0);

  simUICorruptInterval = setInterval(() => {
    if (!simRunning) { clearInterval(simUICorruptInterval); return; }
    targets.forEach(el => {
      if (Math.random() < intensity * 0.3) {
        const tx = (Math.random()-0.5) * intensity * 12;
        const ty = (Math.random()-0.5) * intensity * 6;
        const sk = (Math.random()-0.5) * intensity * 5;
        el.style.transform = `translate(${tx}px,${ty}px) skewX(${sk}deg)`;
        el.style.transition = 'none';
        setTimeout(() => { el.style.transform = ''; }, 80 + Math.random()*120);
      }
      // Scramble text on high loops
      if (loop >= 4 && Math.random() < 0.12) {
        const orig = el.getAttribute('data-orig-text') || el.textContent;
        el.setAttribute('data-orig-text', orig);
        const glitched = orig.split('').map(c =>
          c !== ' ' && Math.random() < 0.4
            ? '|/-_#?!@*'[Math.floor(Math.random()*9)] : c
        ).join('');
        el.textContent = glitched;
        setTimeout(() => { el.textContent = orig; }, 100);
      }
    });

    // Shake the whole sidebar occasionally
    if (loop >= 3 && Math.random() < 0.15) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.style.transform = `translateX(${(Math.random()-0.5)*intensity*10}px)`;
        sidebar.style.transition = 'none';
        setTimeout(() => { sidebar.style.transform = ''; }, 120);
      }
    }

    // Randomly invert colors on nav item for a frame
    if (loop >= 4 && Math.random() < 0.08) {
      const t = targets[Math.floor(Math.random()*targets.length)];
      if (t) {
        t.style.filter = 'invert(1)';
        setTimeout(() => { t.style.filter = ''; }, 60);
      }
    }
  }, Math.max(300 - loop*30, 80));
}

function simStopCorruptUI() {
  if (simUICorruptInterval) { clearInterval(simUICorruptInterval); simUICorruptInterval = null; }
  document.querySelectorAll('.nav-item,.sidebar-link,.logo-box,.user-info,.sidebar')
    .forEach(el => { el.style.transform=''; el.style.filter=''; el.style.transition=''; });
}

// ── Shell warping ─────────────────────────────────────────────────────────
let simShellWarpInterval = null;
function simStartShellWarp(loop) {
  if (simShellWarpInterval) { clearInterval(simShellWarpInterval); simShellWarpInterval = null; }
  if (loop < 3) return;
  const shell = simGetShell();
  if (!shell) return;
  const intensity = (loop - 2) * 0.15;
  simShellWarpInterval = setInterval(() => {
    if (!shell.parentNode || !simRunning) { clearInterval(simShellWarpInterval); return; }
    if (Math.random() < 0.3) {
      const sk = (Math.random()-0.5) * intensity * 3;
      const sc = 1 + (Math.random()-0.5) * intensity * 0.05;
      shell.style.transform = `skewX(${sk}deg) scale(${sc})`;
      shell.style.transition = 'none';
      setTimeout(() => { shell.style.transform = ''; }, 60 + Math.random()*100);
    }
    // Occasional color flash on the shell bg
    if (loop >= 4 && Math.random() < 0.1) {
      shell.style.background = `rgb(${Math.floor(Math.random()*20)},0,0)`;
      setTimeout(() => { shell.style.background = '#000'; }, 80);
    }
  }, 200);
}

function simStopShellWarp() {
  if (simShellWarpInterval) { clearInterval(simShellWarpInterval); simShellWarpInterval = null; }
  const shell = simGetShell();
  if (shell) { shell.style.transform = ''; shell.style.background = '#000'; }
}

// ── Creepy cursor ─────────────────────────────────────────────────────────
let simCursorEl = null;
let simCursorInterval = null;
function simStartCreepyCursor(loop) {
  if (loop < 3) return;
  if (!simCursorEl) {
    simCursorEl = document.createElement('div');
    simCursorEl.style.cssText = [
      'position:fixed', 'width:14px', 'height:14px',
      'background:rgba(200,50,50,0.7)', 'border-radius:50%',
      'pointer-events:none', 'z-index:99970', 'opacity:0',
      'mix-blend-mode:difference', 'transition:opacity 0.3s'
    ].join(';');
    document.body.appendChild(simCursorEl);
  }
  simCursorEl.style.opacity = '1';
  // Move cursor to random positions — like something is controlling it
  simCursorInterval = setInterval(() => {
    if (!simRunning) { simStopCreepyCursor(); return; }
    if (Math.random() < 0.4) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      simCursorEl.style.left = x + 'px';
      simCursorEl.style.top  = y + 'px';
    }
  }, Math.max(600 - loop * 60, 150));
}

function simStopCreepyCursor() {
  if (simCursorInterval) { clearInterval(simCursorInterval); simCursorInterval = null; }
  if (simCursorEl) { simCursorEl.style.opacity = '0'; }
}

async function simRunResults() {
  const loop = simLoop;
  const shell = simGetShell();
  shell.style.justifyContent = 'center';
  shell.style.paddingTop = '40px';
  shell.style.gap = '16px';

  const lines = SIM_RESULT_LINES[Math.min(loop, SIM_RESULT_LINES.length-1)];

  for (const line of lines) {
    if (!line) continue;
    const el = simMakeText(); shell.appendChild(el);
    simSpeak(line, loop);
    await simType(el, line, Math.max(62 - loop*4, 22), loop);
    if (loop >= 3) simStartTextGlitch(el, line, Math.min((loop-2)*0.25, 0.9));
    await simWait(Math.max(600 - loop*70, 100));
  }

  // Extra unsettling messages on high loops
  if (loop >= 3) {
    await simWait(300);
    const extra = [
      'why are you still here.',
      'we can see you.',
      loop >= 4 ? 'you cannot leave.' : 'something is wrong.',
    ];
    for (const msg of extra) {
      const el = simMakeText();
      el.style.color = '#3a1a1a';
      el.style.fontSize = '11px';
      el.style.letterSpacing = '4px';
      shell.appendChild(el);
      simSpeak(msg, loop);
      await simType(el, msg, 65, loop);
      await simWait(500);
    }
  }

  // Escalating chaos sounds
  if (loop >= 2) {
    const noiseCount = Math.min(loop * 2, 12);
    for (let i = 0; i < noiseCount; i++) {
      setTimeout(() => {
        simPlayStatic(0.15 + Math.random()*0.3, 0.05 * loop);
        simScreenFlash('rgba(255,255,255,' + (0.04*loop) + ')', 20+Math.random()*50);
        if (loop >= 3) simPlayGlitchTone(30+Math.random()*300, 0.15, 0.06*loop);
      }, i * 140);
    }
  }

  // Chrome darkness
  const chromeDark = Math.min(loop * 0.22, 0.98);
  if (loop >= 1) simDarkenChrome(chromeDark, Math.max(5-loop*0.5, 1.5));

  // Start all corruption systems
  if (loop >= 1) { simInterceptNav(); simStartAmbient(loop); }
  if (loop >= 2) {
    simCorruptUI(loop);
    // Enable scanlines
    const sl = document.getElementById('sim-scanline');
    if (sl) sl.style.opacity = Math.min((loop-1)*0.3, 0.7).toString();
  }
  if (loop >= 3) {
    simStartShellWarp(loop);
    simStartCreepyCursor(loop);
    // Make sim shell pulse red
    const shell2 = simGetShell();
    if (shell2) shell2.classList.add('sim-pulsing');
  }

  await simWait(15000);  // 15 second cooldown before next loop

  // Glitch burst before switching
  const burstCount = Math.min(loop+1, 10);
  for (let i = 0; i < burstCount; i++) {
    await simWait(Math.max(100-loop*6, 25));
    simScreenFlash('rgba(255,255,255,' + Math.min(0.12*loop,0.7) + ')', 25);
    if (i % 2 === 0) simPlayStatic(0.1, 0.06*Math.min(loop,5));
    if (loop >= 3) simPlayGlitchTone(40 + Math.random()*500, 0.12, 0.05*loop);
  }

  await simBlackCut(Math.max(400 - loop*30, 100));

  simLoop++;
  simScore = 0; simCurrentRound = 0;

  if (simLoop >= 6) {
    simStopCorruptUI();
    simStopShellWarp();
    simStopCreepyCursor();
    const sl2 = document.getElementById('sim-scanline');
    if (sl2) sl2.style.opacity = '0';
    const sh = simGetShell();
    if (sh) sh.classList.remove('sim-pulsing');
    simTriggerCrash();
    return;
  }

  simRunning = true;
  simRunIntro();
}
}