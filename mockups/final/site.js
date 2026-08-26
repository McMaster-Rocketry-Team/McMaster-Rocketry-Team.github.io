/* MRT — shared behaviour for the hybrid direction.
   Everything here degrades to a working page if JS never runs. */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile navigation ----------
     The mockups deleted .navlinks below 860px with nothing in its place, so the
     site had no navigation at all on a phone. This is that replacement. */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navtoggle');
  var links = document.getElementById('navlinks');
  if(nav && toggle && links){
    var setNav = function(open){
      nav.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function(){ setNav(nav.dataset.open !== 'true'); });
    /* scoped to the nav: a global Escape listener yanked screen-reader users to
       the top of the page whenever they dropped out of focus mode */
    nav.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.dataset.open === 'true'){ setNav(false); toggle.focus(); }
    });
    links.addEventListener('click', function(e){ if(e.target.closest('a')) setNav(false); });
    matchMedia('(min-width:861px)').addEventListener('change', function(e){
      if(e.matches) setNav(false);
    });
  }

  /* ---------- nav background: fade-to-solid on scroll ----------
     nav rests as a transparent gradient over the page's dark hero/header;
     past that it needs a solid background to stay legible over paper
     sections. 24px covers the gradient's own height with margin. */
  if(nav){
    var setScrolled = function(){ nav.dataset.scrolled = String(window.scrollY > 24); };
    setScrolled();
    addEventListener('scroll', setScrolled, { passive: true });
  }

  /* ---------- background video: pause control (WCAG 2.2.2 Pause, Stop, Hide) ---------- */
  var vid = document.getElementById('bgvid');
  var vidToggle = document.getElementById('vidtoggle');

  /* The `media` attribute on <source> is ignored inside <video> — it only works
     in <picture> — so the markup ships the small cut as the default and we
     upgrade to the full file only on a large screen with a willing connection. */
  if(vid && vid.dataset.srcLg){
    var wide = matchMedia('(min-width:701px)').matches;
    var conn = navigator.connection || {};
    var thrifty = conn.saveData === true || /^(slow-2g|2g|3g)$/.test(conn.effectiveType || '');
    if(wide && !thrifty && !reduce){
      vid.src = vid.dataset.srcLg;
      vid.load();
    }
  }

  if(vid && vidToggle){
    if(reduce){ vid.pause(); vidToggle.textContent = 'Play video'; }
    /* The label carries the state, so no aria-pressed — a button reading
       "Play video" that reports itself as "pressed" contradicts itself. */
    vidToggle.addEventListener('click', function(){
      var paused = vid.paused;
      if(paused){ vid.play(); } else { vid.pause(); }
      vidToggle.textContent = paused ? 'Pause video' : 'Play video';
    });
  }

  /* ---------- fleet lineup reveal ----------
     render.js ships every lineup with .reveal-pending already on it — that
     class is the only thing hiding the rockets, and nothing here ever adds
     it. So a page with this script blocked, or an IntersectionObserver that
     never fires, is left showing the finished lineup rather than a stuck-empty
     one. Reduced motion (or no observer support) removes the class outright,
     instant and un-animated; otherwise each lineup reveals once, the first
     time it's a third of the way into view. */
  var charts = document.querySelectorAll('.lineup.reveal-pending');
  if(charts.length){
    if(reduce || !('IntersectionObserver' in window)){
      charts.forEach(function(c){ c.classList.remove('reveal-pending'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.remove('reveal-pending');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      charts.forEach(function(c){ io.observe(c); });
    }
  }
})();
