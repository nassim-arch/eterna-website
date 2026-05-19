(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -- Cursor-tracking glow utility -- */
  function addGlow(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
    el.addEventListener('touchstart', function(e) {
      var t = e.touches[0], rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', (t.clientX - rect.left) + 'px');
      el.style.setProperty('--my', (t.clientY - rect.top) + 'px');
      el.classList.add('touch-active');
    }, { passive: true });
    el.addEventListener('touchend', function() {
      el.classList.remove('touch-active');
    }, { passive: true });
  }

  /* -- Stats counter animation -- */
  var statsBar = document.getElementById('stats-bar');
  if (statsBar) {
    var countersStarted = false;

    function animateCounter(el, target, suffix, duration) {
      if (prefersReducedMotion) {
        el.textContent = target + (suffix || '');
        return;
      }
      var startTime = null;
      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easeOut(progress);
        var current = Math.round(easedProgress * target);
        el.textContent = current + (progress >= 1 && suffix ? suffix : '');
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          var countEls = statsBar.querySelectorAll('[data-count]');
          countEls.forEach(function(el, index) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            setTimeout(function() { animateCounter(el, target, suffix, 1800); }, index * 150 + 200);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
  }

  /* -- Portfolio tile cursor-tracking glow -- */
  document.querySelectorAll('.portfolio-tile').forEach(function(tile) {
    tile.addEventListener('mousemove', function(e) {
      var rect = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      tile.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });

  /* -- Pillar card cursor-tracking glow -- */
  document.querySelectorAll('.pillar').forEach(addGlow);

  /* -- Stat item cursor-tracking glow -- */
  document.querySelectorAll('.stat-item').forEach(addGlow);

  /* -- Portfolio tile staggered entrance -- */
  var portfolioSection = document.getElementById('portfolio-section');
  if (portfolioSection) {
    var portfolioTiles = portfolioSection.querySelectorAll('.portfolio-tile');
    if (prefersReducedMotion) {
      portfolioTiles.forEach(function(tile) { tile.classList.add('tile-visible'); });
    } else {
      var portfolioObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            portfolioTiles.forEach(function(tile, index) {
              setTimeout(function() { tile.classList.add('tile-visible'); }, index * 60);
            });
            portfolioObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      portfolioObserver.observe(portfolioSection);
    }
  }
})();
