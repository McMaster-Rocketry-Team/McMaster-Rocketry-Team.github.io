import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

// Mirrors mockups/final/data.js. Every field that was `null` there stays
// optional/nullable here: an empty slot renders a TODO badge and ships, it
// does not fail the build. See PLAN.md decision 2 and the note at the top
// of data.js.

const vehicleSpecs = z.object({
  length: z.string().nullable(),
  mass: z.string().nullable(),
  motor: z.string().nullable(),
  recovery: z.string().nullable(),
  result: z.string().nullable(),
  accel: z.string().nullable(),
});

const vehicles = defineCollection({
  loader: file('src/data/vehicles.json'),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    year: z.number(),
    comp: z.string(),
    // Whether this vehicle actually flew. Added per PLAN.md's Astro port
    // notes: the blanket "No verified record" reads as sloppy record-keeping
    // rather than a hard year for a vehicle that never left the pad, and the
    // Launch Canada judge on the review panel wanted three different honest
    // reasons instead of three identical hedges.
    status: z.enum(['flew', 'failed', 'scrubbed', 'in-build']).default('flew'),
    image: z.string().nullable(),
    // Full-bleed background photo for the vehicle page header. Most vehicles
    // don't have one yet and fall back to the plain graphite header.
    heroImage: z.string().nullable().optional(),
    // Gallery photos, most vehicles don't have any yet and fall back to the
    // TODO placeholder slots.
    photos: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).optional(),
    // data-review indices Robin has confirmed for good on this vehicle's page.
    reviewLocked: z.array(z.number()).optional(),
    // True when `image` is white/light-dominant (the shared osiris.png
    // stand-in, or Osiris's own genuinely white finish). The fleet lineup
    // gives these a wider rim so they don't read as duller than colour-
    // blocked vehicles like Nimbus purely from lacking body colour.
    paleArt: z.boolean().optional(),
    apogee: z.number().nullable(),
    // Overall length in inches, tip to tail. Drives the fleet lineup's
    // relative sizing (real physical size, not a proxy like apogee).
    lengthIn: z.number().nullable(),
    mach: z.number().nullable(),
    summary: z.string(),
    specs: vehicleSpecs,
    build: z.string().nullable(),
  }),
});

const subteams = defineCollection({
  loader: file('src/data/subteams.json'),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    blurb: z.string(),
    detail: z.string().nullable(),
    first: z.string().nullable(),
    skills: z.string().nullable(),
    hours: z.string().nullable(),
    // Full-bleed pagehead photo. Most subteams stay a plain .phead until one
    // lands; with a hero, copy sits in .herobox like vehicle pages.
    heroImage: z.string().nullable().optional(),
    // Optional focal point for photographic heroes (e.g. center bottom when
    // the subject sits low in the frame). Defaults to center.
    heroImagePosition: z.string().optional(),
    // One work-in-progress shot for the subteam page. Null until a real
    // photo lands; the template shows a single slot rather than inventing a
    // multi-image gallery. Optional looping MP4 for bench footage.
    photo: z.string().nullable().optional(),
    photoVideo: z.string().nullable().optional(),
    // CAD/product shots use contain instead of cover in the body frame.
    photoIsProduct: z.boolean().optional(),
    photoAlt: z.string().nullable().optional(),
    photoCaption: z.string().nullable().optional(),
    photoTag: z.string().nullable().optional(),
    reviewLocked: z.array(z.number()).optional(),
  }),
});

const payloadElectronics = z.object({
  name: z.string(),
  role: z.string(),
  image: z.string(),
  alt: z.string(),
});

const payloads = defineCollection({
  loader: file('src/data/payloads.json'),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    year: z.number(),
    comp: z.string(),
    // Slug of the vehicle this payload flew on, links to /rockets/{vehicle}.
    vehicle: z.string().nullable(),
    result: z.string().nullable(),
    // Cropped cutout for the payload lineup, same role as vehicles' `image`.
    // Null renders a TODO stand-in in the same rise slot.
    image: z.string().nullable(),
    summary: z.string(),
    detail: z.string().nullable(),
    heroImage: z.string().nullable().optional(),
    heroImagePosition: z.string().optional(),
    // Key figures from the competition poster or final report.
    specs: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    // Extra prose blocks rendered as alternating sections after the main detail.
    blocks: z.array(z.object({
      tag: z.string(),
      heading: z.string(),
      body: z.string(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      // CAD part lineup (e.g. Magpie bus bulkheads + struts).
      parts: z.array(z.object({
        src: z.string(),
        alt: z.string(),
        role: z.enum(['bulkhead', 'strut']),
        count: z.number().optional(),
      })).optional(),
    })).optional(),
    // Experiment lifecycle steps, usually from the competition poster.
    procedure: z.array(z.string()).optional(),
    // SRAD board lineup for payloads with custom electronics.
    electronics: z.array(payloadElectronics).optional(),
    // Full competition poster image.
    poster: z.string().optional(),
    posterAlt: z.string().optional(),
    // Full product/CAD render — shown below the main detail prose, uncropped.
    render: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    // Gallery photos, most payloads don't have any yet and fall back to the
    // TODO placeholder slots.
    photos: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
      // Gallery frame ratio. Defaults to 3/2; use 2/3 or 3/4 for portrait photos.
      ratio: z.string().optional(),
      // True for CAD/product shots with transparency; uses contain instead of cover.
      contain: z.boolean().optional(),
    })).optional(),
    reviewLocked: z.array(z.number()).optional(),
  }),
});

export const collections = { vehicles, subteams, payloads };
