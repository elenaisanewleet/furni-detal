# Мастерская — Workshop Dossier Design System

A design system extracted from **elenaisanewleet/3d-disign** (`Workshop source dossier v1.0`) — a
research site built to brief a 3D reconstruction of a real furniture-hardware workshop.

## Context

The subject is a one-master workshop specialising in **мебельная фурнитура** (furniture hardware):
hinges, brackets, mounting plates, threaded rod, castors, batches of fasteners; plus drilling and
pressing, grinding and sharpening, precise sawing, hand assembly, weighing and packing. The master
also builds simple furniture quickly (a chair, table and bench are documented) and has fabricated
his own belt-driven grinding rig.

The repository is not a product. It is a **source dossier**: 193 photographs in 13 batches,
13 contact sheets, three approved AI reference renders, a spatial map of three rooms plus the
garden, and a copy-ready 3D brief. Its one published surface — `index.html` — is the interface this
design system is derived from.

**Products represented**
1. **Лендинг мастера** (`ui_kits/master-landing/`) — the client-facing site for **Мастерская
   Архангельское**: services, hardware catalogue groups, machine-park capabilities, about the
   master, and a request form that opens WhatsApp with a prefilled message. Built for local SEO in
   Ульяновская область. Contacts: Николай (мастер), Елена +7 985 198 29 45 (оператор),
   Telegram @elenaisanewleet.
2. **Досье мастерской** (the dossier site) — sticky pill nav, split hero, analysis cards, per-batch
   notes, contact sheets, a 193-photo archive, do/do-not guidance, and the brief in a mono block.
   Recreated in `ui_kits/workshop-dossier/`. Internal — not for clients.

## Sources

- GitHub: **https://github.com/elenaisanewleet/3d-disign** (branch `main`) — read
  `index.html` (all styling and layout in this system comes from its `:root` block and rules),
  `claude_design_brief.md` (all copy, tone and terminology), `README.md`, `manifest.json`.
  Explore that repository directly for the full 193-image photo base if you need more material.

Assets copied into `assets/` are a subset: the three `reference/` renders, two contact sheets,
ten thumbnails. The originals (`assets/source/`, 193 JPEGs) stay in the repo.

## Content fundamentals

- **Language is Russian.** All product copy, headings, tags and captions are in Russian. English
  appears only as technical labels in the kicker line and in code-adjacent terms: `WORKSHOP DIGITAL
  TWIN · SOURCE DOSSIER V1.0`, `BATCH 07`, `ROOM 2`, `master-scene`, `asset library`,
  `SOURCE OF TRUTH`. Do not translate those; do not translate the Russian body copy either.
- **Register: factual, technical, unsentimental** — even though the subject is the author's father.
  Feeling is carried by the objects named (сумка с котом, картина-натюрморт, книги), never by
  adjectives about them.
- **Epistemics are explicit.** The dossier constantly separates what is confirmed from what is
  inferred: "Это рабочая гипотеза, а не установленный факт", "Подтверждённый пользователем
  контекст", "визуальный вывод". The `Tag` component exists for exactly this. Never restate a
  hypothesis as a fact.
- **Person:** third person about the master ("мастер умеет…", "отец…"), and "пользователь" for the
  author's own requirements. No "мы" marketing voice, no direct address to a reader.
- **Headlines are short, declarative, often two sentences with a full stop between them:**
  «Не придумать новую мастерскую. Перестроить его.» Section titles are plain nouns: «Исходная идея»,
  «Полный архив», «Разложено по смыслу».
- **Instructions are imperative bullets** with a leading `•`: «Не заменять старые реальные станки на
  абстрактные современные аналоги», «Если назначение детали неочевидно — моделировать геометрию».
- **Numbers are load-bearing** and appear as bare facts in pills and intros: 193 фотографии,
  13 пачек, 3 помещения, «27 фотографий».
- **Casing:** sentence case everywhere except kickers, which are ALL CAPS with wide tracking.
  Russian typographic quotes «…» and em dashes with spaces are used throughout.
- **No emoji. No exclamation marks. No jokes.**

## Visual foundations

**Palette.** Warm paper (`#f4f1e8`) under near-black ink (`#171714`), with a slightly warmer card
white (`#fbfaf5`) and pure white for cards on tinted ground. Two accents only: a muted craft green
(`#5d6a50`, used for batch labels and links) and a wood tan (`#b9854f`, used very sparingly).
Everything else is a tint: sage for "do", clay for "do-not", and four pale tag fills for the
evidence legend. Deep brown-black (`#26231f`) is the inverted surface for quotes; true ink for code.
Nothing is saturated; nothing is blue except the pale `--tag-user` chip.

**Type.** Inter throughout, weights 400–800, plus the system mono stack for briefs. The display
headline is extreme: `clamp(48px, 6.5vw, 104px)`, line-height `.92`, tracking `-.055em`. H2 is
`clamp(32px, 4vw, 64px)` at `-.04em`. Body sits at 16px/1.5, intros at 18px grey, captions at 11px.
Kickers are 12px, 700, uppercase, `.16em` tracking (`.12em` and green for batch labels).

**Layout.** One 1500px wrap with 28px gutters. Sections are separated by 88px of vertical padding
**and a 1px hairline** — the hairline is the structural device of the whole system. Section headers
are a two-column grid (`minmax(220px,.55fr) 1.45fr`): title left, standfirst right, capped at 850px.
Photo archive is a 5-column grid; note cards are 2-up; analysis cards 3-up. Under 1000px everything
collapses to one column and the hero image moves above the copy.

**Backgrounds.** Flat paper. No gradients anywhere, no textures, no patterns. Full-bleed photography
appears only in the hero's right half and in reference cards; everything else is contained imagery
in bordered cards.

**Borders and elevation.** There are **no shadows in this system at all**. Separation is either a
`1px solid var(--line)` hairline or a flat tint. Tinted panels (do/do-not, tags) carry no border.

**Radii.** 10px (caption capsule), 12px (photo card), 16px (contact sheet), 18px (card, panel,
reference, prompt block), 22px (quote), 999px (pills, tags, filter buttons).

**Transparency and blur.** Used in exactly two places: the sticky nav (`rgba(244,241,232,.9)` +
`blur(18px)`) and image caption capsules (`rgba(20,20,18,.78)` + `blur(8px)`). Nav pills sit on
`#fff9`. Captions are **capsules, never protection gradients**.

**Motion.** Almost none. `scroll-behavior: smooth` on the document, and a single
`transform .2s ease` scaling archive thumbnails to `1.015` on hover. No fades, no bounces, no
entrance animation. Anything more would fight the document's tone.

**Hover / press states.** Hover is the 1.015 photo scale and a link colour shift to ink; there is no
opacity dimming and no colour darkening on pills. The filter button's *active* state is the only
strong state change: it inverts to `--deep` with `--on-deep` text. No press/shrink states exist —
do not invent them.

**Imagery.** Two registers. (1) **Source photos** — unretouched phone photographs of a real cluttered
workshop, warm indoor light, cropped 4:3, captioned with filename and batch number; they are
evidence, never decoration. (2) **Reference renders** — the approved direction: bright,
daylight-filled, high ceilings, pale wood, plants, deep depth of field. Both are warm; neither is
graded, tinted or grained. Never crop a source photo so tightly that the object stops being
identifiable — the point is the object.

## Iconography

**The source uses no icons.** No icon font, no SVG sprite, no PNG glyph set, no emoji, no unicode
symbols as UI affordances. The dossier's entire interface vocabulary is type, hairlines, capsules
and photographs.

Two typographic marks do carry meaning and should be preserved:
- `·` (middle dot) as the separator inside kicker lines — `WORKSHOP DIGITAL TWIN · SOURCE DOSSIER V1.0`.
- `•` (bullet) at the head of every instruction line inside the 3D brief.

**Do not add an icon set to this system.** If a future surface genuinely needs one, flag it and ask
— substituting Lucide or Heroicons here would introduce a visual language the source does not have.

**Logo:** the repository contains no logo or brand mark. Wherever a mark would go, set the word
**Мастерская** in Inter 800 at `-.05em`, optionally with the kicker line beside it
(see `guidelines/brand-wordmark.html`). Nothing was drawn or reconstructed.

## Index

- `styles.css` — the entry point consumers link. `@import` lines only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`,
  `effects.css`, `base.css`.
- `assets/reference/` — three approved direction renders.
  `assets/contact/` — two batch contact sheets. `assets/thumbs/` — ten source thumbnails.
- `guidelines/` — 17 specimen cards (Colors, Type, Spacing, Brand).
- `components/core/` — Kicker, Pill, Tag, Button, Field, Card, Quote, PromptBlock, FilterButton.
- `components/content/` — SectionHead, NoteCard, PhotoCard, RefCard, BatchHeader, ContactSheet,
  GuidancePanel.
- `components/navigation/` — TopNav, Hero.
- `ui_kits/master-landing/` — the client-facing landing (8 sections, WhatsApp-prefilling request form).
- `ui_kits/workshop-dossier/` — the dossier site, v1.1: 8 screens (brief, decision history, workflow,
  asset registry, P0, batches, archive, 3D brief with a reserved model frame).
- `research/` — `tz-v1.1.md` (digest of the user's deep-research TZ), `3d-request.html` (raw log).
- `github.md` — source repo association. `SKILL.md` — Agent Skills entry point.

### Intentional additions

- **Button** — the dossier had no calls to action; the client landing needs one. Uses existing
  tokens only (`--deep` / `--accent` fill, pill radius, no shadow, hover-darken only).
- **Field** — same reason: the dossier had no forms, the landing has a request form.

Everything else corresponds to a CSS class family in the source `index.html`
(`.kicker`, `.pill`, `.tag`, `.card`, `.quote`, `pre.prompt`, `.controls button`, `.section-head`,
`.note-card`, `.photo-card`, `.ref-card`, `.batch-header`, `.contact`, `.dos`/`.donts`, `.topnav`,
`.hero`).

### Substitutions to confirm

- **Inter** is declared by the source but shipped no font binaries; it is loaded from Google Fonts.
  Send the licensed files if the brand needs self-hosted webfonts.
