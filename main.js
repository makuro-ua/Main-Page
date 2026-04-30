function showPage(id, el, type) {
  document.querySelectorAll('.page-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('page-' + id);
  if (panel) panel.classList.add('active');

  if (type !== 'sidebar' && type !== 'sub') {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (el) {
      el.classList.add('active');
      el.classList.remove('clicked');
      void el.offsetWidth;
      el.classList.add('clicked');
    }
  }

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.sub-item').forEach(s => s.classList.remove('active'));

  if (type === 'sidebar' && el) {
    el.classList.add('active');
    el.classList.remove('slide-in');
    void el.offsetWidth;
    el.classList.add('slide-in');
  }
  if (type === 'sub' && el) el.classList.add('active');
}

window.setAdImage = function(src) {
  const img = document.getElementById('ad-img');
  const ph = document.getElementById('ad-ph');
  img.src = src;
  img.style.display = 'block';
  ph.style.display = 'none';
}