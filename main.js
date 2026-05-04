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

// ── Anomalous Scene data ────────────────────────────────────────────────────
const SCENE_DATA = {
  'lord': {
    text: `DESIGNATION: The Lord(?)\nCLASSIFICATION: Anomalous Entity\nSCENE TYPE: Monoworld\nTHREAT INDEX: Unconfirmed\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nVestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Curabitur blandit tempus porttitor.`
  },
  'threaders': {
    text: `DESIGNATION: The Threaders\nCLASSIFICATION: Anomalous Entity\nSCENE TYPE: Mobile / Migratory\nTHREAT INDEX: High\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.\n\nDonec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.\n\nAenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.`
  }
};

function openScene(id) {
  showPage('scene-' + id, null);
  const data = SCENE_DATA[id];
  if (!data) return;
  const textEl = document.getElementById('scene-text-' + id);
  if (textEl) setTimeout(() => typewrite(textEl, data.text, 18), 300);
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
    text: `NAME: Dr. Heaves\nROLE: Senior Research Officer\nCLEARANCE: Level 4\nSTATUS: Active\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nCurabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie dictum semper, ex quam interdum quam, vitae pulvinar ante ipsum vulputate ipsum.`
  },
  'rasputin': {
    text: `NAME: Rasputin\nROLE: Field Operative\nCLEARANCE: Level 3\nSTATUS: Active\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.\n\nDonec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae.\n\nAenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.`
  },
  'booker': {
    text: `NAME: Dr. Booker\nROLE: Anomaly Specialist\nCLEARANCE: Level 5\nSTATUS: Active\n\nMaecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo.\n\nSed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.\n\nNullam varius, turpis molestie dictum semper, ex quam interdum quam, vitae pulvinar ante ipsum vulputate ipsum. Praesent commodo cursus magna, vel scelerisque nisl consectetur.`
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
    text: `DESIGNATION: The World\nCLASSIFICATION: Primary\nTHREAT INDEX: Moderate\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nNulla facilisi. Cras commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo.\n\nVestibulum id ligula porta felis euismod semper. Duis mollis est non commodo luctus. Aenean lacinia bibendum nulla sed consectetur.`
  },
  'bluebells': {
    text: `DESIGNATION: Bluebell's\nCLASSIFICATION: Secondary\nTHREAT INDEX: Low\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.\n\nDonec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.\n\nVestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci.`
  },
  'unrds': {
    text: `DESIGNATION: Unrd's\nCLASSIFICATION: Tertiary\nTHREAT INDEX: Unknown\n\nMaecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt.\n\nDuis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc. Curabitur pretium tincidunt lacus.\n\nNulla gravida orci a odio. Nullam varius, turpis molestie dictum semper, ex quam interdum quam, vitae pulvinar ante ipsum vulputate ipsum.`
  }
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