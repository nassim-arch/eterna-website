(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -- Scroll progress bar -- */
  var progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    function updateProgress() {
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var height = (h.scrollHeight - h.clientHeight) || 1;
      progressBar.style.width = ((scrolled / height) * 100) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* -- Mobile nav toggle -- */
  var navToggle = document.getElementById('navToggleBtn');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    function navClose() {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    function navOpen() {
      navToggle.classList.add('open');
      navLinks.classList.add('open');
      document.body.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
    }
    navToggle.addEventListener('click', function() {
      navLinks.classList.contains('open') ? navClose() : navOpen();
    });
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', navClose);
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) navClose();
    });
  }

  /* -- Theme toggle (class toggle + localStorage, no page reload) -- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      var html = document.documentElement;
      if (html.classList.contains('light-mode')) {
        html.classList.remove('light-mode');
        localStorage.setItem('eterna-theme', 'dark');
      } else {
        html.classList.add('light-mode');
        localStorage.removeItem('eterna-theme');
      }
    });
  }

  /* -- IntersectionObserver for .reveal elements -- */
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el) { observer.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  }
})();
