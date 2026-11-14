# Brand source assets

- `logo.svg` — authoritative vector artwork used by the export script.
- `logo-transparent.png` — original transparent raster.
- `logo-on-black.png` — original concept on black.

Run `npm run brand:export` from the project root after changing the vector master. Generated website files live in `public/brand/`; browser and Apple icons live directly in `public/`. Keep source artwork here rather than in the repository root or the public folder.
