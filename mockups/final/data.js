/* ==========================================================================
   MRT — the site's content data.
   This is the file the team edits each year. Nothing else should need touching
   to add a vehicle, a subteam, a sponsor tier or a roster name: every page
   renders itself from here, so every link resolves to the right thing and
   there is one place to update instead of one per page.

   Use null for anything not yet known — it renders as a visible TODO badge or
   "No verified record" rather than a guess. Never invent a value to fill a
   gap; an invented programme or year is worse than an empty one, because it
   reads as fact. See PLAN.md decision 2.
   ========================================================================== */
window.MRT = {

  site: {
    name: "McMaster Rocketry Team",
    short: "McMaster Rocketry",
    org: "McMaster University",
    city: "Hamilton, Ontario",
    email: "rocketry@mcmaster.ca",
    social: { instagram: null, discord: null, linkedin: null }
  },

  nav: [
    { label: "Rockets",  href: "rockets.html" },
    { label: "Subteams", href: "subteam.html" },
    { label: "Members",  href: "members.html" },
    { label: "Sponsors", href: "sponsors.html" },
    { label: "Join us",  href: "join.html" }
  ],

  /* Six vehicles today. The fleet lineup and every grid it feeds are built to
     hold at least nine without a layout change — see the FLEET LINEUP section
     of site.css, in particular the .craft min-width note.

     image: a PNG of the vehicle, nose pointing up, transparent background,
     tall rather than square (the fleet lineup renders it at a height between
     120px and 280px, scaled to relative apogee — the whole point of the
     component). Until it's set, the lineup draws a placeholder rocket glyph
     in its place — see render.js. Suggested path:
     ../../public/media/rockets/<slug>.png */
  vehicles: [
    { slug:"marauder-i",  name:"Marauder I",  year:2022, comp:"Launch Canada", image:null,
      apogee:null, mach:null,
      summary:"The first vehicle the team ever flew, and the one that proved we could get off the pad at all.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"marauder-ii", name:"Marauder II", year:2023, comp:"Spaceport America Cup", image:null,
      apogee:null, mach:null,
      summary:"Our first international competition vehicle.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"luminis",     name:"Luminis",     year:2024, comp:"Spaceport America Cup", image:null,
      apogee:null, mach:null,
      summary:"The first airframe designed around its payload rather than the other way round.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"luminis-v2",  name:"Luminis V2",  year:2024, comp:"Launch Canada", image:null,
      apogee:10456, mach:null,
      summary:"The first vehicle we flew with a flight computer we trusted enough to publish the numbers from.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"nimbus",      name:"Nimbus",      year:2025, comp:"Launch Canada", image:null,
      /* TODO(robin): 18,000 is rounded, in a column headed "Measured apogee".
         Publish the flight-computer figure, or set this to null so it renders
         as "No verified record" like the three above. Four of eight reviewers
         called this the single most damaging item on the site — see PLAN.md §4. */
      apogee:18000, apogeeUnverified:true, mach:null,
      summary:"First place in the Payload Challenge at Launch Canada 2025.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:"1st, Payload Challenge", accel:null },
      build:null },
    { slug:"osiris",      name:"Osiris",      year:2026, comp:"Launch Canada", image:"../../public/media/rockets/osiris.png",
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
      blurb:"Launch procedure, range safety and logistics on competition day, plus sponsorship, budget and the team&rsquo;s public face. No engineering background needed.",
      detail:null, first:null, skills:null, hours:null }
  ],

  sponsorship: {
    budget: [
      { label:"Airframe &amp; composites", note:"carbon, tooling, consumables", amount:null },
      { label:"Motors &amp; propulsion",   note:"per vehicle, per season",       amount:null },
      { label:"Avionics &amp; payload",    note:"boards, sensors, telemetry",    amount:null },
      { label:"Competition travel",        note:"getting the team and the rocket there", amount:null }
    ],
    tiers: [
      { name:"Supporter", amount:null, lead:false, benefits:[
        "Name on the sponsors page and in the season report",
        "Invitation to the end-of-season showcase",
        "Post-season technical report"
      ]},
      { name:"Partner", amount:null, lead:true, benefits:[
        "Everything in Supporter",
        "Logo on the airframe and on the team&rsquo;s competition banner",
        "Logo on this site at partner size",
        "One recruiting session with the team",
        "Launch-day invitation"
      ]},
      { name:"Title", amount:null, lead:false, benefits:[
        "Everything in Partner",
        "Naming rights on the season&rsquo;s vehicle",
        "Prominent logo placement on airframe and site",
        "Named in every press mention we place"
        /* "Access to the full team resume book" removed — the advisor's review
           flagged bulk access to ~60 students' personal data as paid
           consideration the team cannot promise. Replace with an opt-in book
           once one exists. See PLAN.md §4. */
      ]}
    ],
    /* Logo slots, in display order. slug/name null renders an empty slot. */
    partners: [
      { name:null, tier:"Title" },
      { name:null, tier:"Partner" },
      { name:null, tier:"Partner" },
      { name:null, tier:"Supporter" }
    ],
    contacts: [
      { role:"Sponsorship", title:"Operations lead", name:null,
        blurb:"The person who will answer your email and follow through." },
      { role:"Technical questions", title:"Chief engineer", name:null,
        blurb:"For questions about the vehicle, the flight data or the competition." }
    ]
  },

  join: {
    applyHref: null,
    steps: [
      { title:"Come to an info session",
        body:"We run two in the first two weeks of term. You will meet the subteam leads, see the current vehicle, and get a straight answer about time commitment.",
        todo:"dates, time and room" },
      { title:"Fill in the form",
        body:"It asks what you are interested in and how much time you have. It does not ask for a resume and there is no minimum GPA.",
        todo:"link the real application form" },
      { title:"Have a chat",
        body:"Fifteen minutes with the lead of whichever subteam you picked. This is us working out where you would enjoy yourself, not a test." },
      { title:"Start building",
        body:"You are on the team. First-term members shadow a build, take on one small deliverable, and are on the range crew by the spring if they want to be." }
    ],
    dates: [
      { label:"Info sessions",      note:"first two weeks of term" },
      { label:"Applications open",  note:"date" },
      { label:"Applications close", note:"date" },
      { label:"First build night",  note:"date" }
    ],
    faq: [
      { q:"I have never built anything. Can I still join?",
        a:"Yes, and most of us started there. First-term members are paired with someone who has done the job before, and your first deliverable is deliberately small. The team exists to teach this." },
      { q:"I am not in engineering. Is there a place for me?",
        a:"Yes. Operations is a full subteam, not an afterthought — it runs sponsorship, the budget, and everything we do on campus. Commerce, communications, humanities and science students all sit on it. Payload also takes science students most years." },
      { q:"How much time does it actually take?",
        a:"About six hours a week for most members, rising in the four weeks before a launch and dropping to almost nothing over exams. We plan around the academic term.",
        todo:"confirm the real figure" },
      { q:"Do I need to pay anything?", a:null,
        todo:"answer this — membership fee, travel costs to competition, and what the team covers" },
      { q:"Can I join partway through the year?",
        a:"Usually yes. Email us and we will tell you honestly whether a subteam has room right now, rather than putting you on a list." },
      { q:"What if I want to try a different subteam later?",
        a:"Normal, and encouraged. Plenty of people move once they have seen what the other subteams actually do." }
    ]
  },

  members: {
    stats: [
      { label:"Active members",         value:"~60", note:"across seven subteams" },
      { label:"Faculties represented",  value:null,  note:"engineering, science, commerce, humanities" },
      { label:"First years",            value:null,  note:"every year, no experience needed" },
      { label:"Founded",                value:null,  note:"year the team started" }
    ],
    /* Programme and year are deliberately absent, not TODO-badged — the round-
       two review's most dangerous placeholder was a fake programme/year paired
       with a TODO name (grep TODO will never catch it, and a real name would
       silently inherit the invented degree). Fill name + programme + year
       together, from the person, or leave both blank. See PLAN.md §5. */
    leads: [
      { role:"Team lead",           name:null, programme:null, year:null },
      { role:"Chief engineer",      name:null, programme:null, year:null },
      { role:"Avionics lead",       name:null, programme:null, year:null },
      { role:"Propulsion lead",     name:null, programme:null, year:null },
      { role:"Airframe lead",       name:null, programme:null, year:null },
      { role:"Recovery lead",       name:null, programme:null, year:null },
      { role:"Payload lead",        name:null, programme:null, year:null },
      { role:"Composites lead",     name:null, programme:null, year:null },
      { role:"Operations lead",     name:null, programme:null, year:null }
    ]
  }
};
