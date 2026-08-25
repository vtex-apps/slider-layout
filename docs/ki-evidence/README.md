# Known issue evidence

Recordings used in the pull requests that fix STR-440 and STR-444. This branch only
hosts the media files, it is not meant to be merged.

Captured with Playwright against `storetheme.vtex.com` (published
`vtex.slider-layout@0.24.10`) and against a `storecomponents` workspace with the app
linked from the fix branch. Both runs use the same page, the same slider and the same
interaction, so the only difference is the app version.

| File | Scenario |
|---|---|
| `str440-before.gif` | 0.24.10, mobile emulation, backwards swipe on the first slide of an infinite shelf (`itemsPerPage: 1`, `navigationStep: 3`) |
| `str440-after.gif` | Same interaction with the fix linked |
| `str440-frozen-state.png` | Full page shot of the frozen state on 0.24.10 |
| `str444-before.gif` | 0.24.10, desktop, clicking every pagination dot of a shelf with `itemsPerPage.desktop: 4`, `navigationStep: 1`, `infinite: false` |
| `str444-after.gif` | Same interaction with the fix linked |

The KI configurations are not part of the store theme, so `navigationStep`,
`itemsPerPage` and `infinite` were injected into the slider extension props before
hydration.
