/* Renders every page from data.js, so a page's structure and its content stay
   separate: edit data.js to add a vehicle, a subteam, a sponsor tier or a
   roster name, and every page that shows it updates. Falls back gracefully
   (a "TODO" badge, "No verified record") rather than inventing a value. */
(function(){
  'use strict';
  var D = window.MRT; if(!D) return;

  var WORDS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
  var numberWord = function(n){ return WORDS[n] !== undefined ? WORDS[n] : String(n); };

  var todo = function(label){
    return '<span class="todo" aria-hidden="true">TODO: ' + label + '</span>';
  };
  var set = function(sel, html){
    var el = document.querySelector(sel); if(el) el.innerHTML = html;
  };
  var setAll = function(sel, html){
    document.querySelectorAll(sel).forEach(function(el){ el.innerHTML = html; });
  };

  /* mailto: link. Renders the real address once site.email is filled in;
     until then it renders the placeholder plus a visible TODO badge, so a
     dead contact route never looks like a working one. */
  var mailHref = function(subject){
    var addr = D.site.email || 'TODO@macrocketry.ca';
    return 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
  };
  var mailBadge = function(){ return D.site.email ? '' : ' ' + todo('real team email'); };

  /* Repeated "Email us" CTAs across every page: wire every one to the same
     address so there is one place to fix it instead of five. */
  document.querySelectorAll('[data-mail]').forEach(function(a){
    a.setAttribute('href', mailHref(a.getAttribute('data-mail-subject') || ''));
    if(!D.site.email) a.insertAdjacentHTML('afterend', ' ' + todo('real team email'));
  });

  /* ---------------- shared nav ---------------- */
  var navHost = document.getElementById('navlinks');
  if(navHost){
    var page = (document.getElementById('nav') || {}).dataset ? document.getElementById('nav').dataset.page : null;
    navHost.innerHTML = D.nav.map(function(item){
      var key = item.href.replace('.html', '');
      var current = key === page ? ' aria-current="page"' : '';
      return '<a href="' + item.href + '"' + current + '>' + item.label + '</a>';
    }).join('');
  }

  /* ---------------- shared footer ---------------- */
  var footHost = document.getElementById('site-footer');
  if(footHost){
    var social = [
      ['Instagram', D.site.social.instagram],
      ['Discord',   D.site.social.discord],
      ['LinkedIn',  D.site.social.linkedin]
    ].map(function(s){
      var href = s[1] || 'https://' + s[0].toLowerCase() + '.com/TODO';
      return '<li><a href="' + href + '">' + s[0] + '</a>' + (s[1] ? '' : ' ' + todo('link')) + '</li>';
    }).join('');

    footHost.innerHTML =
      '<div class="wrap"><div class="foot-grid">' +
        '<div><h2 class="fh">' + D.site.name + '</h2>' +
          '<p style="margin:0;max-width:38ch;font-size:14.5px;line-height:1.65;color:rgba(255,255,255,.78)">' +
          'A student team at ' + D.site.org + ' in ' + D.site.city + '. We design, build and ' +
          'fly our own rockets, and we compete at Launch Canada.</p>' +
          '<p style="margin:16px 0 0;font-size:14.5px"><a href="' + mailHref() + '">' +
          (D.site.email || 'TODO@macrocketry.ca') + '</a>' + mailBadge() + '</p></div>' +
        '<div><h2 class="fh">The team</h2><ul role="list">' +
          '<li><a href="rockets.html">Rockets</a></li>' +
          '<li><a href="subteam.html">Subteams</a></li>' +
          '<li><a href="members.html">Members</a></li><li><a href="join.html">Join us</a></li></ul></div>' +
        '<div><h2 class="fh">Get in touch</h2><ul role="list">' +
          '<li><a href="sponsors.html">Sponsorship</a></li>' +
          '<li><a href="' + mailHref() + '">Email</a>' + mailBadge() + '</li>' + social + '</ul></div>' +
      '</div><div class="foot-note"><span>' + D.site.org + ' &middot; ' + D.site.city + '</span></div></div>';
  }

  /* ---------------- fleet lineup (index + rockets index) ----------------
     Rockets on a shared baseline, sized to relative apogee, ported from
     mockups/ds-fleet.html. Each vehicle is a real link with real text
     content: the rocket art is aria-hidden, since the name and apogee are
     already in .nm/.val as text. */
  var maxRiseH = 460, minRiseH = 200, noDataH = 110;

  /* Procedural placeholder rocket, ported from ds-fleet.html and recoloured
     onto the ignition/graphite tokens. Swap for a real PNG per vehicle by
     giving that entry an `image` field in data.js. This renders an <img>
     at the same computed height instead, no other change needed. */
  var rocketGlyph = function(h){
    var w = Math.round(h * 0.17), cx = w / 2, nose = h * 0.16, finW = w * 0.85;
    var bodyBot = h - h * 0.13, ov = finW * 0.55, sw = w + ov * 2, id = 'rg' + h;
    return '<svg width="' + sw + '" height="' + h + '" viewBox="' + (-ov) + ' 0 ' + sw + ' ' + h +
      '" fill="none" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#241B1C"/><stop offset=".45" stop-color="#EAE6E4"/>' +
      '<stop offset=".65" stop-color="#A39C9A"/><stop offset="1" stop-color="#3D2E2F"/>' +
      '</linearGradient></defs>' +
      '<path d="M' + cx + ' 0 L' + w + ' ' + nose + ' L' + w + ' ' + bodyBot + ' L0 ' + bodyBot +
      ' L0 ' + nose + ' Z" fill="url(#' + id + ')"/>' +
      '<path d="M0 ' + bodyBot + ' L' + (-finW * 0.55) + ' ' + h + ' L0 ' + h + ' Z" fill="#3D2E2F"/>' +
      '<path d="M' + w + ' ' + bodyBot + ' L' + (w + finW * 0.55) + ' ' + h + ' L' + w + ' ' + h +
      ' Z" fill="#3D2E2F"/>' +
      '<rect x="0" y="' + (nose + h * 0.09) + '" width="' + w + '" height="' + Math.max(2, h * 0.012) +
      '" fill="#BF2026"/></svg>';
  };

  /* Generic silhouette, used anywhere a real photo (a member portrait, a
     range-day shot) is not in yet: a visible placeholder rather than a
     blank box, so the layout can be judged before the photos exist. */
  var personGlyph = function(){
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" ' +
      'style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">' +
      '<rect width="100" height="100" fill="var(--fog-100)"/>' +
      '<circle cx="50" cy="38" r="17" fill="var(--fog-300)"/>' +
      '<path d="M15 100 C15 71 30 60 50 60 C70 60 85 71 85 100 Z" fill="var(--fog-300)"/>' +
      '</svg>';
  };

  var buildFleetLineup = function(host){
    var vs = D.vehicles;
    var maxApogee = vs.reduce(function(m, v){ return v.apogee ? Math.max(m, v.apogee) : m; }, 1);

    var craft = vs.map(function(v){
      var h = v.apogee ? Math.round(minRiseH + (v.apogee / maxApogee) * (maxRiseH - minRiseH)) : noDataH;
      var val = v.apogee
        ? v.apogee.toLocaleString() + ' ft' + (v.apogeeUnverified
            ? '<span class="flag">unverified</span>' : '')
        : 'No verified record';
      var rise = v.image ? '<img src="' + v.image + '" alt="" style="height:' + h + 'px;width:auto">'
                          : rocketGlyph(h);
      var cls = 'craft' + (!v.apogee ? ' nodata' : '');
      return '<a class="' + cls + '" href="rocket.html?v=' + v.slug + '">' +
        '<span class="rise">' + rise + '</span>' +
        '<span class="val">' + val + '</span>' +
        '<span class="nm"><b>' + v.name + '</b><span>' + v.comp.replace('Launch Canada', 'LC')
          .replace('Spaceport America Cup', 'SAC') + ' &middot; ' + v.year + '</span></span>' +
        '</a>';
    }).join('');

    host.innerHTML =
      '<div class="lineup reveal-pending">' + craft + '</div>' +
      '<div class="wrap"><div class="baseline"></div></div>' +
      '<div class="wrap"><div class="fleetnote">' +
      '<span>LC = Launch Canada &middot; SAC = Spaceport America Cup</span>' +
      '<span>Rocket size = relative apogee &middot; grey = no verified record</span>' +
      '</div></div>';
  };
  document.querySelectorAll('[data-fleet-chart]').forEach(buildFleetLineup);

  /* ---------------- fleet stat callout (highest flown) ---------------- */
  var statHost = document.querySelector('[data-fleet-stat]');
  if(statHost){
    var best = D.vehicles.reduce(function(m, v){
      return (v.apogee && (!m || v.apogee > m.apogee)) ? v : m;
    }, null);
    statHost.innerHTML = best
      ? '<div class="lbl">Highest flown</div>' +
        '<div class="num">' + best.apogee.toLocaleString() + '</div>' +
        '<div class="unit">ft &middot; ' + best.name + ', ' + best.year + '</div>'
      : '<div class="lbl">Highest flown</div><div class="unit">No verified record yet</div>';
  }

  /* ---------------- fleet table (accessible, always present) ---------------- */
  var fleetTableHost = document.querySelector('[data-fleet-table]');
  if(fleetTableHost){
    var withDetail = fleetTableHost.dataset.fleetTable === 'detail';
    fleetTableHost.innerHTML = D.vehicles.map(function(v){
      var apo = v.apogee
        ? '<span' + (v.apogeeUnverified ? '' : '') + '>' + v.apogee.toLocaleString() + ' ft' +
          (v.apogeeUnverified ? ' <span class="todo" aria-hidden="true">rounded, source it</span>' : '') + '</span>'
        : '<span style="color:var(--muted-on-paper)">No verified record</span>';
      var detailCell = withDetail
        ? '<td><a href="rocket.html?v=' + v.slug + '" style="text-decoration:underline;text-underline-offset:3px">View<span class="vh"> details for ' + v.name + '</span></a></td>'
        : '';
      var nameCell = withDetail
        ? '<th scope="row">' + v.name + '</th>'
        : '<th scope="row"><a href="rocket.html?v=' + v.slug + '" style="text-decoration:underline;text-underline-offset:3px">' + v.name + '</a></th>';
      return '<tr>' + nameCell + '<td class="num">' + v.year + '</td><td>' + v.comp + '</td>' +
             '<td class="num">' + apo + '</td>' + detailCell + '</tr>';
    }).join('');
  }

  /* ---------------- vehicle-count copy (future-proofs past six) ---------------- */
  var vCount = D.vehicles.length;
  var years = D.vehicles.map(function(v){ return v.year; });
  var yearSpan = Math.max.apply(null, years) - Math.min.apply(null, years) + 1;
  var noRecordCount = D.vehicles.filter(function(v){ return !v.apogee; }).length;
  setAll('[data-vehicle-count]', numberWord(vCount).replace(/^./, function(c){ return c.toUpperCase(); }));
  setAll('[data-vehicle-count-lc]', numberWord(vCount));
  setAll('[data-year-span]', numberWord(yearSpan));
  setAll('[data-norecord-count]', numberWord(noRecordCount).replace(/^./, function(c){ return c.toUpperCase(); }));

  /* ---------------- subteam cards (homepage) ---------------- */
  var subHost = document.querySelector('[data-subteam-cards]');
  if(subHost){
    subHost.innerHTML = D.subteams.map(function(s, i){
      return '<a class="card" href="subteam.html?t=' + s.slug + '"><div>' +
        '<div class="tag">' + String(i + 1).padStart(2, '0') + '</div><h3>' + s.name + '</h3>' +
        '<p>' + s.blurb + '</p></div></a>';
    }).join('');
  }

  /* ---------------- sponsors page ---------------- */
  var budgetHost = document.querySelector('[data-sponsor-budget]');
  if(budgetHost){
    budgetHost.innerHTML = D.sponsorship.budget.map(function(b){
      var dd = b.amount ? '<dd>' + b.amount + '<small>' + b.note + '</small></dd>'
                         : '<dd class="nodata">TODO<small>' + b.note + '</small></dd>';
      return '<div><dt>' + b.label + '</dt>' + dd + '</div>';
    }).join('');
  }
  var tiersHost = document.querySelector('[data-sponsor-tiers]');
  if(tiersHost){
    tiersHost.innerHTML = D.sponsorship.tiers.map(function(t){
      var amt = t.amount || 'TODO';
      var flag = t.amount ? '' : '<span class="todo" aria-hidden="true">TODO: amount</span>';
      return '<div class="tier' + (t.lead ? ' lead' : '') + '"><h3>' + t.name + '</h3>' +
        '<div class="amount">' + amt + '</div><ul role="list">' +
        t.benefits.map(function(b){ return '<li>' + b + '</li>'; }).join('') +
        '</ul>' + flag + '</div>';
    }).join('');
  }
  var partnersHost = document.querySelector('[data-sponsor-partners]');
  if(partnersHost){
    partnersHost.innerHTML = D.sponsorship.partners.map(function(p){
      return '<div class="card" style="min-height:150px;align-items:center;justify-content:center">' +
        '<span class="mono" style="color:var(--muted-on-paper)">' +
        (p.name || 'Logo slot') + '<br>' + p.tier + '</span></div>';
    }).join('');
  }
  var contactsHost = document.querySelector('[data-sponsor-contacts]');
  if(contactsHost){
    contactsHost.innerHTML = D.sponsorship.contacts.map(function(c){
      /* c.name falls back to plain "TODO: name" text, not todo(): that
         helper's span is aria-hidden, and as the only content of an <h3>
         it would leave the heading with no accessible name at all. */
      return '<div class="card"><div><div class="tag">' + c.role + '</div>' +
        '<h3>' + (c.name || 'TODO: name') + '</h3><p>' + c.title + '. ' + c.blurb + '<br>' +
        '<a href="' + mailHref() + '" style="text-decoration:underline;text-underline-offset:3px">' +
        (D.site.email || 'TODO@macrocketry.ca') + '</a></p></div></div>';
    }).join('');
  }

  /* ---------------- join page ---------------- */
  var stepsHost = document.querySelector('[data-join-steps]');
  if(stepsHost){
    stepsHost.innerHTML = D.join.steps.map(function(s){
      return '<li><h3>' + s.title + '</h3><p>' + s.body + (s.todo ? ' ' + todo(s.todo) : '') + '</p></li>';
    }).join('');
  }
  var datesHost = document.querySelector('[data-join-dates]');
  if(datesHost){
    datesHost.innerHTML = D.join.dates.map(function(d){
      return '<div><dt>' + d.label + '</dt><dd class="nodata">TODO<small>' + d.note + '</small></dd></div>';
    }).join('');
  }
  var faqHost = document.querySelector('[data-join-faq]');
  if(faqHost){
    faqHost.innerHTML = D.join.faq.map(function(f){
      var a = f.a
        ? '<p class="a">' + f.a + (f.todo ? ' ' + todo(f.todo) : '') + '</p>'
        : '<p class="a">' + todo(f.todo || 'answer this') + '</p>';
      return '<details><summary><h3>' + f.q + '</h3></summary>' + a + '</details>';
    }).join('');
  }
  var applyHost = document.querySelector('[data-join-apply]');
  if(applyHost){
    var applyHref = D.join.applyHref || mailHref('Application');
    applyHost.setAttribute('href', applyHref);
    if(!D.join.applyHref){
      applyHost.insertAdjacentHTML('afterend', ' ' + todo('swap for form URL'));
    }
  }

  /* ---------------- members page ---------------- */
  var statsHost = document.querySelector('[data-member-stats]');
  if(statsHost){
    statsHost.innerHTML = D.members.stats.map(function(s){
      var dd = s.value ? '<dd>' + s.value + '<small>' + s.note + '</small></dd>'
                        : '<dd class="nodata">TODO<small>' + s.note + '</small></dd>';
      return '<div><dt>' + s.label + '</dt>' + dd + '</div>';
    }).join('');
  }
  var rosterHost = document.querySelector('[data-member-roster]');
  if(rosterHost){
    rosterHost.innerHTML = D.members.leads.map(function(m){
      /* Fallbacks are plain text, not todo(): that helper's span is
         aria-hidden, and .role/.prog are the only accessible content these
         cards have; hiding them would leave nothing for a screen reader
         to announce instead of a placeholder. */
      var prog = (m.programme && m.year)
        ? '<p class="prog">' + m.year + ' &middot; ' + m.programme + '</p>'
        : '<p class="prog nodata-inline">TODO: programme &amp; year</p>';
      return '<div class="person"><div class="shot" aria-hidden="true">' +
        personGlyph() +
        '<span style="position:relative;background:rgba(247,247,246,.88);padding:4px 8px;border-radius:2px">' +
        'Portrait slot<br>TODO: photo + alt text</span></div>' +
        '<h3>' + m.role + '</h3><p class="role">' + (m.name || 'TODO: name') + '</p>' + prog + '</div>';
    }).join('');
  }

  /* ---------------- safety page ---------------- */
  var pillarsHost = document.querySelector('[data-safety-pillars]');
  if(pillarsHost){
    pillarsHost.innerHTML = D.safety.pillars.map(function(p){
      return '<div class="card"><div><div class="tag">' + p.tag + '</div><h3>' + p.title + '</h3>' +
        '<p>' + (p.body || todo(p.todo)) + '</p></div></div>';
    }).join('');
  }
  var credsHost = document.querySelector('[data-safety-creds]');
  if(credsHost){
    credsHost.innerHTML = D.safety.credentials.map(function(c){
      var dd = c.value ? '<dd>' + c.value + '<small>' + c.note + '</small></dd>'
                        : '<dd class="nodata">TODO<small>' + c.note + '</small></dd>';
      return '<div><dt>' + c.label + '</dt>' + dd + '</div>';
    }).join('');
  }
  var groundTestHost = document.querySelector('[data-safety-groundtest]');
  if(groundTestHost){
    groundTestHost.innerHTML = D.safety.groundTest.body
      ? '<p>' + D.safety.groundTest.body + '</p>'
      : '<p>' + todo(D.safety.groundTest.todo) + '</p>';
  }

  /* ---------------- vehicle page ---------------- */
  var vHost = document.getElementById('vehicle');
  if(vHost){
    var list = D.vehicles;
    var slug = new URLSearchParams(location.search).get('v');
    var v = list.filter(function(x){ return x.slug === slug; })[0] || list[list.length-1];
    document.title = v.name + ' · McMaster Rocketry';

    set('#v-tag', 'Vehicle &middot; ' + v.year + ' &middot; ' + v.comp);
    set('#v-name', v.name);
    set('#v-summary', v.summary || todo('one-paragraph summary, written each year'));

    var apo = v.apogee
      ? v.apogee.toLocaleString() + (v.apogeeUnverified ? ' <span class="todo" aria-hidden="true">rounded, source it</span>' : '')
      : '<span class="nodata-inline">No verified record</span>';
    var rows = [
      ['Apogee', apo, v.apogee ? 'feet above ground level' : 'flew, but no instrumented figure'],
      ['Max velocity', v.mach ? 'Mach ' + v.mach : null, 'at burnout'],
      ['Max acceleration', v.specs.accel, 'peak, from flight data'],
      ['Length', v.specs.length, 'overall, tip to tail'],
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
    var tslug = new URLSearchParams(location.search).get('t');
    var picked = subs.filter(function(x){ return x.slug === tslug; })[0];
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
