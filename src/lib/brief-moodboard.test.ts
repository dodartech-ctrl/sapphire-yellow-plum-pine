import assert from "node:assert/strict";
import test from "node:test";
import {
  cleanArchitecturalQueryText,
  dedupeMoodboardItems,
  formatReferenceNoteFromImage,
  normalizeOpenverseResult,
  normalizeWikimediaPage,
  parseBriefToMoodboardQueries,
  type MoodboardImageItem,
} from "./brief-moodboard";
import { ARCHITECTURAL_STYLES, LIGHTING_CONDITIONS, MOOD_SETTINGS } from "./builder-data";
import { DEFAULT_ENGINE, DEFAULT_SCENE3D } from "./engines";
import { DEFAULT_DESIGN } from "./properties";

test("parseBriefToMoodboardQueries strips noise tokens and extracts 3 distinct architectural facets", () => {
  const queries = parseBriefToMoodboardQueries({
    visionDoc: {
      title: "Nordic Timber & Concrete Pavilion",
      synthesizedPrompt: "photorealistic architectural render 8k resolution no people brutalist concrete glass",
    },
    selectedStyle: ARCHITECTURAL_STYLES[0] ?? null,
    selectedLighting: LIGHTING_CONDITIONS[0] ?? null,
    selectedMood: MOOD_SETTINGS[0] ?? null,
    design: { ...DEFAULT_DESIGN, vertical: "exterior", look: "Minimalist", light: "Golden hour" },
    engine: { ...DEFAULT_ENGINE, facadeTypology: "Board-Marked Concrete" },
    scene3d: { ...DEFAULT_SCENE3D, primaryMaterial: "concrete" },
    customNotes: "28mm tilt-shift, no watermark, cantilevered travertine plinth, mirror reflecting pool",
  });

  assert.equal(queries.length, 3);
  assert.deepEqual(
    queries.map((q) => q.facet),
    ["Architecture", "Lighting", "Materiality"],
  );
  for (const q of queries) {
    assert.ok(q.query.length >= 8, `Expected non-empty query for ${q.facet}`);
    assert.equal(q.query.includes("watermark"), false);
    assert.equal(q.query.includes("28mm"), false);
  }
});

test("parseBriefToMoodboardQueries honors customQueryOverride", () => {
  const queries = parseBriefToMoodboardQueries({
    visionDoc: { title: "Test", synthesizedPrompt: "Test" },
    selectedStyle: null,
    selectedLighting: null,
    selectedMood: null,
    design: DEFAULT_DESIGN,
    engine: DEFAULT_ENGINE,
    scene3d: DEFAULT_SCENE3D,
    customNotes: "",
    customQueryOverride: "Japanese cedar courtyard pavilion",
  });

  assert.equal(queries.length, 1);
  assert.equal(queries[0]?.facet, "Custom");
  assert.ok(queries[0]?.query.includes("japanese"));
  assert.ok(queries[0]?.query.includes("cedar"));
});

test("cleanArchitecturalQueryText deduplicates words and caps word count", () => {
  const cleaned = cleanArchitecturalQueryText(
    "Concrete concrete modern 8k glass 24mm no people facade timber architecture pavilion",
    4,
  );
  assert.equal(cleaned, "concrete modern glass facade");
});

test("normalizeOpenverseResult filters undersized/invalid records and maps clean fields", () => {
  const valid = normalizeOpenverseResult(
    {
      id: "abc-123",
      title: "Concrete Pavilion Facade",
      url: "https://example.org/full.jpg",
      thumbnail: "https://api.openverse.org/v1/images/abc-123/thumb/",
      foreign_landing_url: "https://flickr.com/photos/123",
      creator: "Studio Nord",
      license: "by-sa",
      width: 1200,
      height: 800,
      tags: [{ name: "concrete" }, { name: "architecture" }],
    },
    "Architecture",
    "modern concrete architecture",
  );
  assert.ok(valid);
  assert.equal(valid.provider, "Openverse");
  assert.equal(valid.license, "BY-SA");
  assert.equal(valid.tags.length, 2);

  const tiny = normalizeOpenverseResult(
    {
      id: "tiny-1",
      url: "https://example.org/tiny.jpg",
      width: 120,
      height: 120,
    },
    "Architecture",
    "test",
  );
  assert.equal(tiny, null);
});

test("normalizeWikimediaPage keeps bitmap images and strips HTML from attribution", () => {
  const pdfRejected = normalizeWikimediaPage(
    {
      pageid: 99,
      title: "File:Concrete_manual.pdf",
      imageinfo: [{ mime: "application/pdf", url: "https://upload.wikimedia.org/test.pdf", width: 800, height: 1000 }],
    },
    "Materiality",
    "concrete",
  );
  assert.equal(pdfRejected, null);

  const photo = normalizeWikimediaPage(
    {
      pageid: 42,
      title: "File:Brutalist_library_facade.jpg",
      imageinfo: [
        {
          mime: "image/jpeg",
          thumburl: "https://upload.wikimedia.org/thumb.jpg",
          url: "https://upload.wikimedia.org/full.jpg",
          descriptionurl: "https://commons.wikimedia.org/wiki/File:Brutalist_library_facade.jpg",
          width: 1600,
          height: 1066,
          extmetadata: {
            Artist: { value: '<a href="https://commons.wikimedia.org">Elena Rossi</a>' },
            LicenseShortName: { value: "CC BY 4.0" },
          },
        },
      ],
    },
    "Architecture",
    "brutalist concrete",
  );

  assert.ok(photo);
  assert.equal(photo.title, "Brutalist library facade");
  assert.equal(photo.creator, "Elena Rossi");
  assert.equal(photo.license, "CC BY 4.0");
  assert.equal(photo.provider, "Wikimedia Commons");
});

test("dedupeMoodboardItems and formatReferenceNoteFromImage produce clean outputs", () => {
  const sample: MoodboardImageItem = {
    id: "ov-1",
    title: "Pavilion Glass",
    thumbnailUrl: "https://example.org/a.jpg",
    fullUrl: "https://example.org/a-full.jpg",
    sourceUrl: "https://example.org/a",
    creator: "Jane",
    license: "CC0",
    provider: "Openverse",
    facet: "Architecture",
    queryUsed: "pavilion glass",
    width: 1000,
    height: 750,
    tags: [],
  };
  const deduped = dedupeMoodboardItems([sample, { ...sample, id: "ov-2" }]);
  assert.equal(deduped.length, 1);
  assert.equal(
    formatReferenceNoteFromImage(sample),
    "Reference inspiration (Architecture): Pavilion Glass [Openverse · CC0]",
  );
});
