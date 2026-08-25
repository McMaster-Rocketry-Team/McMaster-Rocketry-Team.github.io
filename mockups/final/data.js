/* ==========================================================================
   MRT — the site's content data.
   This is the file the team edits each year. Nothing else should need touching
   to add a vehicle or change a subteam: rocket.html and subteam.html render
   themselves from here, so every link resolves to the right thing and there is
   one place to update instead of seven.
   ========================================================================== */
window.MRT = {
  vehicles: [
    { slug:"marauder-i",  name:"Marauder I",  year:2022, comp:"Launch Canada",
      apogee:null, mach:null,
      summary:"The first vehicle the team ever flew, and the one that proved we could get off the pad at all.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"marauder-ii", name:"Marauder II", year:2023, comp:"Spaceport America Cup",
      apogee:null, mach:null,
      summary:"Our first international competition vehicle.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"luminis",     name:"Luminis",     year:2024, comp:"Spaceport America Cup",
      apogee:null, mach:null,
      summary:"The first airframe designed around its payload rather than the other way round.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"luminis-v2",  name:"Luminis V2",  year:2024, comp:"Launch Canada",
      apogee:10456, mach:null,
      summary:"The first vehicle we flew with a flight computer we trusted enough to publish the numbers from.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"nimbus",      name:"Nimbus",      year:2025, comp:"Launch Canada",
      /* TODO(robin): 18,000 is rounded, in a column headed "Measured apogee".
         Publish the flight-computer figure, or set this to null so it renders
         as "No verified record" like the three above. */
      apogee:18000, apogeeUnverified:true, mach:null,
      summary:"First place in the Payload Challenge at Launch Canada 2025.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:"1st, Payload Challenge", accel:null },
      build:null },
    { slug:"osiris",      name:"Osiris",      year:2026, comp:"Launch Canada",
      apogee:33584, mach:1.92,
      summary:"Our highest and fastest vehicle to date, and the first to fly a student-designed recovery sequence end to end.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:"Osiris was the first airframe where we laid up our own carbon tubes rather than buying them, which is why it is both lighter and straighter than Nimbus. The recovery sequence was rewritten from scratch after the Nimbus flight, moving from a single barometric trigger to a voted decision across three sensors." }
  ],

  subteams: [
    { slug:"airframe",   name:"Airframe",
      blurb:"Structures and aerodynamics — the airframe has to survive peak loading and come back straight.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"avionics",   name:"Avionics",
      blurb:"Flight computers and telemetry. This subteam decides when every event on the flight fires.",
      detail:"Avionics builds the flight computer stack: the sensors that tell the rocket where it is, the logic that decides when to fire each event, and the telemetry that gets the data back to the ground. If you have written code before, this is the fastest place on the team to see your work fly. If you have not, this is where a lot of us learned.",
      first:"Shadow a flight-computer build, wire and test one sensor board, and help run a ground test. No prior hardware experience assumed.",
      skills:"C or Python, a soldering iron you are not afraid of, and any exposure to control theory. We teach the rest.",
      hours:"About 6 h / week" },
    { slug:"propulsion", name:"Propulsion",
      blurb:"Motor integration, thrust curves and the plumbing that gets everything off the pad.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"recovery",   name:"Recovery",
      blurb:"Dual-deployment parachutes and the sequencing that brings the vehicle back intact.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"payload",    name:"Payload",
      blurb:"The experiment we fly — and, most years, the reason the rocket exists at all.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"composites", name:"Composites",
      blurb:"Carbon and fibreglass layup, tooling, and the finishing that makes it fly straight.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"operations", name:"Operations",
      blurb:"Launch procedure, range safety, logistics and everything that happens on the day.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"business",   name:"Business &amp; Outreach",
      blurb:"Sponsorship, budget, outreach and the team&rsquo;s public face. No engineering background needed.",
      detail:null, first:null, skills:null, hours:null }
  ]
};
