(function() {
  'use strict';

  /* -- Portfolio tile cursor-tracking glow -- */
  document.querySelectorAll('.portfolio-tile').forEach(function(tile) {
    tile.addEventListener('mousemove', function(e) {
      var rect = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      tile.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });

  /* -- Filter pills -- */
  var pills = document.querySelectorAll('.filter-pill');
  var tiles = document.querySelectorAll('.portfolio-tile');
  var empty = document.getElementById('portfolioEmptyHint');

  function applyFilter(filter) {
    var visible = 0;
    tiles.forEach(function(t) {
      var match = (filter === 'all') || (t.getAttribute('data-status') === filter);
      t.classList.toggle('is-hidden', !match);
      if (match) visible++;
    });
    if (empty) empty.classList.toggle('is-hidden', visible > 0);
  }

  pills.forEach(function(p) {
    p.addEventListener('click', function() {
      pills.forEach(function(x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      p.classList.add('active');
      p.setAttribute('aria-selected', 'true');
      applyFilter(p.getAttribute('data-filter'));
    });
  });

  /* -- Scroll reveal for portfolio -- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  } else if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function(el) { obs.observe(el); });
  }
})();
