# Brand art

Two pieces of artwork live here, and both are placeholders you can replace
without touching a component.

## `mascot-frames.svg` - the figure on each section rule

An 8-frame horizontal sprite (8 x 100 x 100). The frame order is fixed by
`FRAME` in `src/components/ui/Mascot.tsx`:

| #   | pose   | ground contact (fraction of the frame height) |
| --- | ------ | --------------------------------------------- |
| 0   | idle   | 0.995                                         |
| 1   | wink   | 0.995                                         |
| 2   | crouch | 0.995                                         |
| 3   | jump   | 0.995                                         |
| 4   | land   | 0.918                                         |
| 5   | wave   | 0.952                                         |
| 6   | sit    | 0.584 (the seat; the legs dangle below)       |
| 7   | sleep  | 0.584                                         |

To use your own art, replace this one file with any 8-frame strip of the same
shape (an SVG like this one, or a WebP/PNG 8 frames wide) and keep the order.
If your strip has a different frame count, update `FRAME`, `LAST_FRAME` and
`GROUND` in `Mascot.tsx` and the `background-size` on `.mascot-frame` in
`src/index.css` (it is `100% x frames`).

## `maker.json` - the small brand mark

Shared by `src/components/ui/MakerMark.tsx` (the nav and hero mark) and
`scripts/generate-brand-icons.js` (the favicons). Straight-line paths only:
the icon script rasterises the drawing itself, with no image library.

- **UI:** `<MakerMark size={36} />` inside a labelled home link or button. The
  artwork is decorative, so the accessible name stays on the control.
- **Hero motion:** pass `animated`. The eyes blink while the mark is visible
  and wink on pointer hover; Reduced mode is static, and offscreen or
  hidden-tab animation pauses.
- **Browser/app icons:** run `npm run brand:icons` after editing the drawing,
  then commit `public/favicon.ico` and `public/favicon_io/`. Tiny favicons
  drop the inner crest; app icons get a dark background and safe padding.

Keep artwork out of text labels: accessible controls keep their own names.
