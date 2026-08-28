/* MRT: shared behaviour for the hybrid direction.
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

  /* ---------- nav scrim: deepen gradient on scroll ----------
     nav is a top-down transparent gradient at every scroll position (see
     site.css); data-scrolled only deepens that same gradient past the hero
     so text stays legible over paper sections. 24px covers the gradient's
     own height with margin. */
  if(nav){
    var setScrolled = function(){ nav.dataset.scrolled = String(window.scrollY > 24); };
    setScrolled();
    addEventListener('scroll', setScrolled, { passive: true });
  }

  /* ---------- background video: pause control (WCAG 2.2.2 Pause, Stop, Hide) ---------- */
  var vid = document.getElementById('bgvid');
  var vidToggle = document.getElementById('vidtoggle');

  /* The `media` attribute on <source> is ignored inside <video> (it only works
     in <picture>), so we pick the small or large cut here, before the video
     ever starts, and load that one file. Markup has no autoplay: setting
     .src and calling .load() after autoplay had already started the small
     cut used to restart playback mid-frame, a visible stutter on every load. */
  if(vid && vid.dataset.srcLg){
    var wide = matchMedia('(min-width:701px)').matches;
    var conn = navigator.connection || {};
    var thrifty = conn.saveData === true || /^(slow-2g|2g|3g)$/.test(conn.effectiveType || '');
    if(wide && !thrifty && !reduce){
      vid.src = vid.dataset.srcLg;
      vid.load();
    }
    /* .play() can reject (autoplay policy, low-power mode); catch it so an
       unplayed video doesn't leave the toggle lying about its own state. */
    if(!reduce){ vid.play().catch(function(){ if(vidToggle) vidToggle.textContent = 'Play video'; }); }
  }

  if(vid && vidToggle){
    if(reduce){ vidToggle.textContent = 'Play video'; }
    /* The label carries the state, so no aria-pressed: a button reading
       "Play video" that reports itself as "pressed" contradicts itself. */
    vidToggle.addEventListener('click', function(){
      var paused = vid.paused;
      if(paused){ vid.play().catch(function(){}); } else { vid.pause(); }
      vidToggle.textContent = paused ? 'Pause video' : 'Play video';
    });
  }

  /* ---------- decorative subteam video: lazy start + pause control ----------
     Autoplay-on-load fetched the whole clip the instant the page rendered,
     even for a visitor who never scrolled past the hero. This defers the
     fetch and playback to first view, same idea as the hero's source pick
     above, and gives it the same WCAG 2.2.2 pause control. */
  document.querySelectorAll('video.lazyvid[data-src]').forEach(function(v){
    var box = v.closest('.ph');
    var vt = box ? box.querySelector('.vidtoggle') : null;
    if(vt){ vt.textContent = 'Play video'; }
    var start = function(){
      if(v.src) return;
      v.src = v.dataset.src;
      v.load();
      if(!reduce){
        v.play().then(function(){ if(vt) vt.textContent = 'Pause video'; }).catch(function(){});
      }
    };
    if(reduce || !('IntersectionObserver' in window)){
      start();
    } else {
      var vio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ start(); vio.unobserve(entry.target); }
        });
      }, { threshold: 0.25 });
      vio.observe(v);
    }
    if(vt){
      vt.addEventListener('click', function(){
        if(!v.src){ start(); return; }
        var paused = v.paused;
        if(paused){ v.play().catch(function(){}); } else { v.pause(); }
        vt.textContent = paused ? 'Pause video' : 'Play video';
      });
    }
  });

  /* ---------- fleet lineup reveal ----------
     render.js ships every lineup with .reveal-pending already on it. That
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
