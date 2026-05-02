function goHome() {
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
  document.querySelectorAll('.page-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('page-' + id);
  if (panel) panel.classList.add('active');
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