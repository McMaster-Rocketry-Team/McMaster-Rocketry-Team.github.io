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
    photos: z.array(z.object({ src: z.string(), alt: z.string() })).optional(),
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
  }),
});

export const collections = { vehicles, subteams };
