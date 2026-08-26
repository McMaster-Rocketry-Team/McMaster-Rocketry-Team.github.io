/* ==========================================================================
   MRT: the site's content data.
   This is the file the team edits each year. Nothing else should need touching
   to add a vehicle, a subteam, a sponsor tier or a roster name: every page
   renders itself from here, so every link resolves to the right thing and
   there is one place to update instead of one per page.

   Use null for anything not yet known: it renders as a visible TODO badge or
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
     hold at least nine without a layout change (see the FLEET LINEUP section
     of site.css, in particular the .craft min-width note).

     image: a PNG of the vehicle, nose pointing up, transparent background,
     tall rather than square (the fleet lineup renders it at a height between
     200px and 460px, scaled to relative apogee, which is the whole point of the
     component). Until it's set, the lineup draws a placeholder rocket glyph
     in its place (see render.js). Suggested path:
     ../../public/media/rockets/<slug>.png

     TODO(robin): marauder-i, marauder-ii, luminis, and luminis-v2 are
     still temporarily pointed at osiris.png, standing in for their own
     photos so the enlarged fleet lineup can be judged at real scale.
     Revert each to image:null (its own placeholder glyph) once that
     vehicle has a real cutout. Nimbus now has its own cutout. */
  vehicles: [
    { slug:"marauder-i",  name:"Marauder I",  year:2022, comp:"Launch Canada", image:"../../public/media/rockets/osiris.png",
      apogee:null, mach:null,
      summary:"The first vehicle the team ever flew, and the one that proved we could get off the pad at all.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"marauder-ii", name:"Marauder II", year:2023, comp:"Spaceport America Cup", image:"../../public/media/rockets/osiris.png",
      apogee:null, mach:null,
      summary:"Our first international competition vehicle.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"luminis",     name:"Luminis",     year:2024, comp:"Spaceport America Cup", image:"../../public/media/rockets/osiris.png",
      apogee:null, mach:null,
      summary:"The first airframe designed around its payload rather than the other way round.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"luminis-v2",  name:"Luminis V2",  year:2024, comp:"Launch Canada", image:"../../public/media/rockets/osiris.png",
      apogee:10456, mach:null,
      summary:"The first vehicle we flew with a flight computer we trusted enough to publish the numbers from.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:null },
    { slug:"nimbus",      name:"Nimbus",      year:2025, comp:"Launch Canada", image:"../../public/media/rockets/nimbus.png",
      /* TODO(robin): 18,000 is rounded, in a column headed "Measured apogee".
         Publish the flight-computer figure, or set this to null so it renders
         as "No verified record" like the three above. Four of eight reviewers
         called this the single most damaging item on the site (see PLAN.md §4). */
      apogee:18000, apogeeUnverified:true, mach:null,
      summary:"First place in the Payload Challenge and third in the Basic Launch Category at Launch Canada 2025.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:"1st, Payload Challenge &middot; 3rd, Basic Launch Category", accel:null },
      build:null },
    { slug:"osiris",      name:"Osiris",      year:2026, comp:"Launch Canada", image:"../../public/media/rockets/osiris.png",
      apogee:33584, mach:1.92,
      summary:"Our highest and fastest vehicle to date, and the first to fly a student-designed recovery sequence end to end.",
      specs:{ length:null, mass:null, motor:null, recovery:null, result:null, accel:null },
      build:"Osiris was the first airframe where we laid up our own carbon tubes rather than buying them, which is why it is both lighter and straighter than Nimbus. The recovery sequence was rewritten from scratch after the Nimbus flight, moving from a single barometric trigger to a voted decision across three sensors." }
  ],

  subteams: [
    { slug:"airframe",   name:"Airframe",
      blurb:"Structures and aerodynamics. The airframe has to survive peak loading and come back straight.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"avionics",   name:"Avionics",
      blurb:"Flight computers and telemetry. This subteam decides when every event on the flight fires.",
      detail:"Avionics builds the flight computer stack: the sensors that tell the rocket where it is, the logic that decides when to fire each event, and the telemetry that gets the data back to the ground. Competition rules require a commercial altimeter and GPS as the primary flight computer, currently a Blue Raven paired with a Featherweight GPS. Alongside that, the subteam designs its own student-researched-and-developed boards, such as Void Lake, which fly as backup. If you have written code before, this is the fastest place on the team to see your work fly. If you have not, this is where a lot of us learned.",
      first:"Shadow a flight-computer build, wire and test one sensor board, and help run a ground test. No prior hardware experience assumed.",
      skills:"C or Python, a soldering iron you are not afraid of, and any exposure to control theory. We teach the rest.",
      hours:"About 6 h / week" },
    { slug:"propulsion", name:"Propulsion",
      blurb:"Motor integration, thrust curves, and Icarus: our in-house hybrid engine in development alongside the commercial motors we fly today.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"recovery",   name:"Recovery",
      blurb:"Dual-deployment parachutes and the sequencing that brings the vehicle back intact.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"payload",    name:"Payload",
      blurb:"The experiment we fly, and most years the reason the rocket exists at all.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"composites", name:"Composites",
      blurb:"Carbon and fibreglass layup, tooling, and the finishing that makes it fly straight.",
      detail:null, first:null, skills:null, hours:null },
    { slug:"operations", name:"Operations",
      blurb:"Launch procedure, range safety and logistics on competition day, plus sponsorship, budget and the team&rsquo;s public face. No engineering background needed.",
      detail:null, first:null, skills:null, hours:null }
  ],

  sponsorship: {
    packagePdf: "docs/sponsorship-package-2026-2027.pdf",
    budget: [
      { label:"Airframe", note:"commercial motor fuel and casing assembly, stock metal and fasteners for structural components", amount:"$7,882" },
      { label:"Payload", note:"technical experiment, control PCBs, metal stock and fasteners, workspace equipment", amount:"$5,875" },
      { label:"Recovery", note:"parachutes, recovery harness lines and hardware, commercial recovery electronics, airbrake structure", amount:"$2,849" },
      { label:"Controls and avionics bay", note:"recovery control PCBs, flight data acquisition, avionics bay structure", amount:"$3,429" },
      { label:"Composite manufacturing", note:"fibreglass and carbon fibre, epoxy, jigs, PPE", amount:"$1,845" },
      { label:"Operations", note:"outreach activities, Ad Astra magazine printing, food for events", amount:"$2,759" },
      { label:"Propulsion", note:"engine assembly, pressure testing setup, fill system, engine testing, fuel casting setup", amount:"$9,445" },
      { label:"Competition expenses 2027", note:"Launch Canada fees, accommodation, travel", amount:"$15,950" },
      { label:"Total", note:"2026–27 season projected expenses", amount:"$50,034" }
    ],
    /* Tiers, amounts and benefit lists are transcribed from "Rocketry
       Sponsorship Package 2026-2027.pdf" (gitignored, see PLAN.md and
       .gitignore), treated as source of truth per Robin, 2026-08-25. Season
       budget figures are from "McMaster Rocketry 2026-2027 Budget.xlsx"
       (2026-08-26), transcribed line for line from the Budget sheet. Named
       contacts below transcribed from team records, 2026-08-26. */
    tiers: [
      { name:"Bronze", amount:"$500+", lead:false, benefits:[
        "Small logo placement on the website and T-shirts",
        "Logo in all team videos and presentations",
        "Featured social media posts"
      ]},
      { name:"Silver", amount:"$2,000+", lead:true, benefits:[
        "Medium logo placement on the website, banner, T-shirts and rocket",
        "Logo in all team videos and presentations",
        "Featured social media posts",
        "Short write-up on the sponsorship page"
      ]},
      { name:"Gold", amount:"$3,000+", lead:false, benefits:[
        "Large logo placement on the website, banner, T-shirt and rocket",
        "Logo in all team videos and presentations",
        "Featured social media posts",
        "Long write-up on the sponsorship page",
        "Sponsor outreach events with rockets",
        "Customized promotion as requested"
        /* The PDF's own resume-book style bulk access to member contact
           info never appears in its tier lists, so there is nothing to strip here,
           unlike the drafted tiers this replaces. See PLAN.md §4. */
      ]}
    ],
    /* Logo slots, in display order. slug/name null renders an empty slot. */
    partners: [
      { name:null, tier:"Gold" },
      { name:null, tier:"Silver" },
      { name:null, tier:"Silver" },
      { name:null, tier:"Bronze" }
    ],
    contacts: [
      { role:"Sponsorship", title:"President", name:"Robin Anderson",
        blurb:"The person who will answer your email and follow through." },
      { role:"Sponsorship", title:"Project manager", name:"Christina Zhou",
        blurb:"Partnership coordination and follow-up. We both monitor the team inbox." }
    ]
  },

  join: {
    applyHref: null,
    steps: [
      { title:"Meet us at Clubsfest or Facultyfest",
        body:"We have a table at both events at the start of term.",
        todo:"confirm we run this every term" },
      { title:"Fill in the form",
        body:"It asks what you are interested in and how much time you have. A resume is optional, so first years do not feel like they need one, and there is no minimum GPA.",
        todo:"link the real application form, confirm the close date" },
      { title:"Interview with a subteam",
        body:"Every subteam runs its own interview, usually 30 minutes to an hour, about what you would want to work on." },
      { title:"Start building",
        body:"You are on the team. First-term members shadow a build and take on one small deliverable." }
    ],
    dates: [
      { label:"Clubsfest / Facultyfest", note:"date" },
      { label:"Applications open",       note:"date" },
      { label:"Applications close",      note:"date" },
      { label:"Interviews",              note:"per subteam, after applications close" }
    ],
    faq: [
      { q:"I have never built anything. Can I still join?",
        a:"Yes, and most of us started there. First-term members are paired with someone who has done the job before, and your first deliverable is deliberately small. The team exists to teach this." },
      { q:"I am not in engineering. Is there a place for me?",
        a:"Yes. Operations is a full subteam: it runs sponsorship, the budget, and everything we do on campus. Commerce, communications, humanities and science students all sit on it. Payload also takes science students most years." },
      { q:"How much time does it actually take?",
        a:"About six hours a week for most members, rising in the four weeks before a launch and dropping to almost nothing over exams. We plan around the academic term.",
        todo:"confirm the real figure" },
      { q:"Do I need to pay anything?", a:null,
        todo:"answer this: membership fee, travel costs to competition, and what the team covers" },
      { q:"Can I join partway through the year?",
        a:"Not usually. We hire during a set window each term, at Clubsfest and Facultyfest, rather than on a rolling basis. Email us and we will tell you honestly when the next one opens." },
      { q:"What if I want to try a different subteam later?",
        a:"Normal, and encouraged. Plenty of people move once they have seen what the other subteams actually do." }
    ]
  },

  /* Requested by the review panel: three reviewers (faculty advisor, Launch
     Canada judge, parent) independently called safety/supervision content
     the site's biggest missing credibility asset (see PLAN.md §0/§7). Every
     field below is a safety claim or a named credential, so none of it is
     drafted here. Claude writes the page structure and labels; Robin fills
     in every value. See CLAUDE.md: "Claude drafts non-technical prose only,
     never invent specs, numbers, or safety claims." */
  safety: {
    pillars: [
      { tag:"Sanctioning", title:"Sanctioned launches", body:null,
        todo:"which organisation sanctions our launches, and what that review covers" },
      { tag:"Supervision", title:"Faculty supervision", body:null,
        todo:"named faculty advisor, their role, and how design sign-off works" },
      { tag:"Range safety", title:"Range safety officer", body:null,
        todo:"who holds this role on launch day, and their certification" }
    ],
    credentials: [
      { label:"Faculty advisor",          value:null, note:"name and department" },
      { label:"Range safety officer",     value:null, note:"name and certifying body" },
      { label:"Team certification level", value:null, note:"highest level held, and who holds it" },
      { label:"Sanctioning body",         value:null, note:"e.g. CAR, Tripoli: whichever applies" }
    ],
    groundTest: { body:null, todo:"the team's ground-test practice before a vehicle flies" }
  },

  members: {
    stats: [
      { label:"Active members",         value:"100+", note:"across seven subteams" },
      { label:"Faculties represented",  value:null,  note:"engineering, science, commerce, humanities" },
      { label:"First years",            value:null,  note:"every year, no experience needed" },
      { label:"Founded",                value:null,  note:"year the team started" }
    ],
    /* Programme and year are deliberately absent, not TODO-badged. The round-
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
