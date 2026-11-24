# Karma screen

Karma-skærmen i loungen. Henter ugens nominerede fra `latestKings` og viser dem som et slideshow.

```bash
yarn install
yarn dev
```

- `/` – selve skærmen. `?animation=<id>` vælger en anden animation end standarden, `?data=test` bruger testdata.
- `/playground` – vælg animation, data (test/live) og nominee, replay og se timelinen.

## Skærmen

TV'et i loungen kører 1080×1920 (portræt). Alt tegnes på et fast lærred i den størrelse
(`app/components/TvCanvas.tsx`), som skaleres til viewporten. Til lokal test kan man oprette en
custom device i Chrome DevTools på 1080×1920.

## Animationer

Hver animation ligger i `animations/<id>/` og registreres i `animations/registry.ts`.
En animation består af:

- `Component` – får `nominee` og en beregnet `timeline`
- `timeline(nominee)` – navngivne trin bygget med `timeline()` fra `lib/motion.ts`
- `hold` – sekunder slidet står stille efter sidste trin

Eksperimenter ligger i `animations/lab/` (én fil per card) og vises under "Lab" i playgroundens
dropdown. Når en af dem skal i prod, flyttes den til sin egen mappe og sættes som
`DEFAULT_ANIMATION_ID`.

Slidet skifter efter `timeline.end + hold`, så varigheden følger animationen automatisk.

### Timeline

```ts
timeline({
  tag: { duration: 0.4 }, // starter når forrige trin slutter (her: 0)
  image: { at: '-0.2', duration: 0.8 }, // 0.2s før forrige slutter
  name: { at: '<', duration: 0.6 }, // samtidig med forrige
  votes: { after: 'tag', duration: 1 }, // når 'tag' slutter
  meta: { at: 2, duration: 0.4 }, // absolut tid
});
```

Brug `tl.transition('image')` (eller `tl.transition('name', springs.soft)`) som `transition` på
motion-elementet. Fælles springs, easings og variants ligger i `lib/motion.ts`.

### Performance på TV'et

TV'et har langt mindre CPU/GPU end en laptop, så en animation der kører flydende på desktop kan
hakke i loungen. Mål på selve TV'et med `?fps` (viser fps, værste frame og antal hak over 50 ms).

- Animér kun `transform` (x, y, scale, rotate) og `opacity`. De kan køre på GPU'en uden repaint.
- Ingen `filter`/`blur`/`backdrop-filter`, og ingen animerede skygger. Blur på store flader er
  det dyreste man kan gøre.
- `clipPath` og SVG `pathLength` maler om hver frame – kun på små elementer (fx `Tag`), aldrig
  fuldskærm. En fuldskærms-reveal laves med to modsatrettede `y`-transforms (se `lab/wipe.tsx`).
- Højst én uendelig ambient-animation per slide, og hold den langsom.
- Få animerede elementer: ord-for-ord er ok, bogstav-for-bogstav kun på korte tekster.
- Billederne forhåndsindlæses og decodes inden slideshowet starter (`lib/preload.ts`), så der
  ikke decodes billeder midt i en animation.
