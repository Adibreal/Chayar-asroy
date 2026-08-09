import type { ImageAsset } from "@/types";

/**
 * Choosing the photograph that represents a programme.
 *
 * The important thing about this file is the *order* of its signals. The CMS
 * already records which programme a photograph was taken at — every gallery
 * item carries a `program_id` — so for the programmes that have photographs,
 * guessing from words in a title would be inventing an answer the data already
 * states. Text matching is the **fallback**, not the method: it exists for a
 * programme published before its photographs are attached, which is the normal
 * order of events for this organisation.
 *
 * Pure and dependency-free on purpose: it takes plain candidates and returns a
 * choice plus its reasoning, so a new caller (a story, a campaign band) can
 * reuse it, and so the choice can be inspected rather than trusted.
 */

export type ProgramLike = {
  slug: string;
  title: string;
  summary?: string | null;
  category: string;
  location?: string | null;
};

export type ImageCandidate = {
  image: ImageAsset;
  /** The programme this photograph belongs to, when the CMS records one. */
  programSlug?: string | null;
};

export type ImageChoice = {
  image: ImageAsset | null;
  /** How the image was found — `exact` means the CMS said so. */
  confidence: "exact" | "high" | "low" | "none";
  /** Human-readable justification, for logging and for tests. */
  reason: string;
};

/**
 * Category → the words that describe what such a programme looks like.
 *
 * Extend this to teach the matcher a new category; nothing else needs to
 * change. `education` has no programmes yet and is here so it is ready.
 */
export const CATEGORY_THEMES: Record<string, readonly string[]> = {
  art: ["draw", "drawing", "paint", "painting", "canvas", "crayon", "colour", "color", "artwork"],
  community: ["celebration", "eid", "gather", "together", "group", "community", "festive", "share"],
  education: ["read", "reading", "book", "library", "learn", "learning", "class", "study"],
};

/** Words that mean "there are people in this photograph". */
const PEOPLE_GROUP = ["children", "kids", "girls", "boys", "volunteers", "group", "everyone"];
const PEOPLE_SINGLE = ["child", "girl", "boy", "volunteer", "teacher"];

/**
 * Phrases that mark a photograph as a detail shot. Beautiful in a gallery,
 * weak as a card thumbnail — a card is trying to say "this is who we are", and
 * a close-up of paint pots does not say it.
 */
const OBJECT_ONLY = [
  "close-up",
  "paint pots",
  "brushes on a table",
  "a crayon drawing of",
  "hand resting",
  "palette",
];

/** Words too common to carry meaning when matching a title to a caption. */
const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "of",
  "in",
  "on",
  "at",
  "for",
  "with",
  "to",
  "from",
  "by",
  "our",
  "their",
  "its",
  "project",
  "programme",
  "program",
  "workshop",
  "event",
  "chayar",
  "asroy",
]);

const tokenise = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

const contains = (haystack: string, needles: readonly string[]) =>
  needles.filter((needle) => haystack.includes(needle)).length;

/**
 * How well does this photograph work as a *card thumbnail*?
 *
 * Faces beat objects: a grid of cards is read at a glance, and a picture of
 * people reads instantly where a still life does not.
 */
function representativeScore(candidate: ImageCandidate, category: string): number {
  const alt = candidate.image.alt.toLowerCase();
  let score = 0;

  score += contains(alt, PEOPLE_GROUP) * 4;
  score += contains(alt, PEOPLE_SINGLE) * 2;
  score -= contains(alt, OBJECT_ONLY) * 5;
  score += contains(alt, CATEGORY_THEMES[category] ?? []) * 1;

  return score;
}

/**
 * Overlap between a programme's words and a photograph's description, split
 * into two parts that must not be conflated.
 *
 * `distinctive` is wording only this programme would share with this
 * photograph — its location, the unusual words in its title. `affinity` is how
 * well the picture suits the *kind* of programme, which every photograph of the
 * right category scores on.
 *
 * Only `distinctive` may earn a confident match. Letting affinity clear the bar
 * meant a programme with nothing whatsoever in common with a caption still
 * reported a "high" text match, when what had actually happened was a category
 * fallback wearing a better label.
 */
function textMatchScore(
  program: ProgramLike,
  candidate: ImageCandidate,
): { distinctive: number; affinity: number } {
  const alt = candidate.image.alt.toLowerCase();
  let distinctive = 0;

  // Location is the strongest textual signal: "Korail" in both is rarely chance.
  for (const token of tokenise(program.location ?? "")) {
    if (alt.includes(token)) distinctive += 6;
  }
  // Then the distinctive words of the title — "akibuki", "rongjatra", "eid".
  for (const token of tokenise(program.title)) {
    if (alt.includes(token)) distinctive += 4;
  }
  for (const token of tokenise(program.summary ?? "")) {
    if (alt.includes(token)) distinctive += 1;
  }

  const affinity =
    contains(alt, CATEGORY_THEMES[program.category] ?? []) * 2 +
    representativeScore(candidate, program.category) / 4;

  return { distinctive, affinity };
}

/** Highest scorer, with ties broken by the earlier candidate (editor order). */
function best<T>(
  items: readonly T[],
  score: (item: T) => number,
): { item: T; score: number } | null {
  let winner: { item: T; score: number } | null = null;
  for (const item of items) {
    const value = score(item);
    if (!winner || value > winner.score) winner = { item, score: value };
  }
  return winner;
}

/**
 * The photograph that best represents a programme.
 *
 * @param program the programme being illustrated.
 * @param gallery every published photograph available to choose from.
 */
export function getBestImageForProgram(
  program: ProgramLike,
  gallery: readonly ImageCandidate[],
): ImageChoice {
  if (gallery.length === 0) {
    return { image: null, confidence: "none", reason: "the gallery is empty" };
  }

  // 1 · The CMS already knows. An image attached to this programme beats any
  //     amount of clever inference about its title.
  const own = gallery.filter((candidate) => candidate.programSlug === program.slug);
  if (own.length > 0) {
    const pick = best(own, (candidate) => representativeScore(candidate, program.category));
    if (pick) {
      return {
        image: pick.item.image,
        confidence: "exact",
        reason:
          own.length === 1
            ? `the only photograph attached to this programme in the CMS`
            : `attached to this programme in the CMS; most representative of its ${own.length} photographs (score ${pick.score})`,
      };
    }
  }

  // 2 · No photographs of its own — infer from words. This runs for a newly
  //     published programme whose gallery has not been filled in yet.
  const scored = gallery.map((candidate) => {
    const { distinctive, affinity } = textMatchScore(program, candidate);
    return { candidate, distinctive, total: distinctive + affinity };
  });
  const match = best(scored, (entry) => entry.total);

  // At least one location or title word must genuinely appear in the caption.
  // Four is the weight of a single title token — the smallest real signal.
  if (match && match.item.distinctive >= 4) {
    return {
      image: match.item.candidate.image,
      confidence: "high",
      reason: `no photographs attached; caption shares this programme's location or title wording (distinctive ${match.item.distinctive}, total ${match.item.total.toFixed(1)})`,
    };
  }

  // 3 · Nothing convincing. Fall back to the most representative photograph of
  //     the same category rather than to whatever sorted first.
  const themed = gallery.filter(
    (candidate) =>
      contains(candidate.image.alt.toLowerCase(), CATEGORY_THEMES[program.category] ?? []) > 0,
  );
  const fallback = best(themed.length > 0 ? themed : gallery, (candidate) =>
    representativeScore(candidate, program.category),
  );

  if (fallback) {
    return {
      image: fallback.item.image,
      confidence: "low",
      reason: `no attached photographs and no strong text match; fell back to the most representative ${program.category} photograph`,
    };
  }

  return { image: null, confidence: "none", reason: "no usable candidates" };
}
