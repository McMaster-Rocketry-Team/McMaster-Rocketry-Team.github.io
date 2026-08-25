/* Renders rocket.html and subteam.html from data.js, so every link resolves to
   the thing it names instead of every vehicle showing the same page. Falls back
   to the newest vehicle / a named subteam when no slug is given. */
(function(){
  'use strict';
  var D = window.MRT; if(!D) return;
  var slug = new URLSearchParams(location.search).get('v')
          || new URLSearchParams(location.search).get('t');

  var todo = function(label){
    return '<span class="todo" aria-hidden="true">TODO: ' + label + '</span>';
  };
  var set = function(sel, html){
    var el = document.querySelector(sel); if(el) el.innerHTML = html;
  };

  /* ---------------- vehicle page ---------------- */
  var vHost = document.getElementById('vehicle');
  if(vHost){
    var list = D.vehicles;
    var v = list.filter(function(x){ return x.slug === slug; })[0] || list[list.length-1];
    document.title = v.name + ' · McMaster Rocketry';

    set('#v-tag', 'Vehicle &middot; ' + v.year + ' &middot; ' + v.comp);
    set('#v-name', v.name);
    set('#v-summary', v.summary || todo('one-paragraph summary, written each year'));

    var apo = v.apogee
      ? v.apogee.toLocaleString() + (v.apogeeUnverified ? ' <span class="todo" aria-hidden="true">rounded — source it</span>' : '')
      : '<span class="nodata-inline">No verified record</span>';
    var rows = [
      ['Apogee', apo, v.apogee ? 'feet above ground level' : 'flew, but no instrumented figure'],
      ['Max velocity', v.mach ? 'Mach ' + v.mach : null, 'at burnout'],
      ['Max acceleration', v.specs.accel, 'peak, from flight data'],
      ['Length', v.specs.length, 'overall, nose to tail'],
      ['Liftoff mass', v.specs.mass, 'fuelled, with payload'],
      ['Motor', v.specs.motor, 'designation and impulse class'],
      ['Recovery', v.specs.recovery, 'drogue and main configuration'],
      ['Result', v.specs.result, 'placing, and in which category']
    ];
    set('#v-specs', rows.map(function(r){
      var val = r[1] ? '<dd>' + r[1] + ' <small>' + r[2] + '</small></dd>'
                     : '<dd class="nodata">Not published<small>' + r[2] + '</small></dd>';
      return '<div><dt>' + r[0] + '</dt>' + val + '</div>';
    }).join(''));

    set('#v-build', v.build
      ? '<p>' + v.build + '</p>'
      : '<p>No build write-up for this vehicle yet. ' + todo('build narrative') + '</p>');

    /* prev / next so the fleet is walkable */
    var i = list.indexOf(v);
    var nav = '';
    if(i > 0) nav += '<a class="btn" href="rocket.html?v=' + list[i-1].slug + '"><span aria-hidden="true">&larr;</span> ' + list[i-1].name + '</a>';
    nav += '<a class="btn" href="rockets.html">All vehicles</a>';
    if(i < list.length-1) nav += '<a class="btn" href="rocket.html?v=' + list[i+1].slug + '">' + list[i+1].name + ' <span aria-hidden="true">&rarr;</span></a>';
    set('#v-nav', nav);
  }

  /* ---------------- subteam page ---------------- */
  var sHost = document.getElementById('subteam');
  if(sHost){
    var subs = D.subteams;
    var picked = subs.filter(function(x){ return x.slug === slug; })[0];
    /* With no slug this page is the subteam index, not a subteam. Presenting one
       silently as "the" subteam was a dead end for anyone arriving from the nav. */
    if(!picked){
      var detail = document.getElementById('detail-section');
      if(detail) detail.hidden = true;
      var others = document.getElementById('t-others');
      if(others) others.innerHTML = subs.map(function(x){
        return '<a class="card" href="subteam.html?t=' + x.slug + '">' +
               '<div><h3>' + x.name + '</h3><p>' + x.blurb + '</p></div></a>';
      }).join('');
      return;
    }
    var t = picked;
    document.title = t.name.replace(/&amp;/g,'&') + ' · McMaster Rocketry';

    set('#t-name', t.name);
    set('#t-blurb', t.blurb);
    set('#t-detail', t.detail
      ? '<p>' + t.detail + '</p>'
      : '<p>' + t.blurb + '</p><p>' + todo('full subteam description') + '</p>');
    set('#t-first', t.first || todo('what a first-term member actually does'));
    set('#t-skills', t.skills || todo('useful-but-not-required skills'));
    set('#t-hours', t.hours || 'TODO');

    set('#t-others', subs.filter(function(x){ return x.slug !== t.slug; }).map(function(x){
      return '<a class="card" href="subteam.html?t=' + x.slug + '">' +
             '<div><h3>' + x.name + '</h3><p>' + x.blurb + '</p></div></a>';
    }).join(''));
  }
})();
