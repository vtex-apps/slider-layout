# Slider-Layout

Slider-Layout is a flexible solution for building `sliders` of `blocks` within VTEX IO Store Framework.

![](https://user-images.githubusercontent.com/27777263/70230361-e839db00-1736-11ea-9f29-7c945c10a5f7.png)

:warning: In order to use the `slider-layout` as a substitute to the `carousel` component, check this [recipe](https://vtex.io/docs/recipes/layout/building-a-carousel-through-lists-and-slider-layout) out.

## Configuration

1. Add the slider-layout app to your theme's dependencies in the `manifest.json`, for example:

```json
"dependencies": {
  "vtex.slider-layout": "0.x"
}
```

2. Add the `slider-layout` to your template. For example:

```json
 "slider-layout#home": {
   "children": ["info-card#1", "info-card#2"],
   "props": {
     "autoplay": {
       "timeout": 5000,
       "stopOnHover": false
     }
   }
 },
 "info-card#1": {
   "props": {
     "imageUrl": "https://images.unsplash.com/photo-1524185962737-ea7c028a12cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
     "isFullModeStyle": true,
     "headline": "Black Friday",
     "callToActionText": "Subscribe",
     "textPosition": "center"
   }
 },
 "info-card#2": {
   "props": {
     "imageUrl": "https://images.unsplash.com/photo-1524185962737-ea7c028a12cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
     "isFullModeStyle": true,
     "headline": "Black Friday",
     "callToActionText": "Subscribe",
     "textPosition": "center"
   }
 }
```

| Prop name              | Type                                                       | Description                                                                                                                                                                  | Default value                          |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `label`                | `String`                                                   | Aria label to be used by the `<Slider />` component.                                                                                                                         | `'slider'`                             |
| `showNavigationArrows` | `mobileOnly`&#124;`desktopOnly`&#124;`always`&#124;`never` | Controls when should navigation arrows be rendered.                                                                                                                          | `'always'`                             |
| `showPaginationDots`   | `mobileOnly`&#124;`desktopOnly`&#124;`always`&#124;`never` | Controls when should pagination dots be rendered.                                                                                                                            | `'always'`                             |
| `infinite`             | `Boolean`                                                  | Controls if the slider should or should not be infinite.                                                                                                                     | `false`                                |
| `navigationStep`       | `Number`&#124;`'page'`                                     | How many slides should be slid when the user navigates. When set to `'page'`, the number of slides that will slide is equal to the number of slides in a page of the slider. | `'page'`                               |
| `usePagination`        | `Boolean`                                                  | Toggles whether or not to use a fluid scroll for navigation, disabling the notion of a "page".                                                                               | `true`                                 |
| `itemsPerPage`         | `{ desktop: Number, tablet: Number, phone: Number }`       | Controls how many slides should be shown on each type of device.                                                                                                             | `{ desktop: 5, tablet: 3, phone: 1 }`  |
| `slideTransition`      | `{ speed: Number, delay: Number, timing: String }`         | Controls the transition animation between slides.                                                                                                                            | `{ speed: 400, delay: 0, timing: '' }` |
| `autoplay`             | `{ timeout: Number, stopOnHover: Boolean }`                | Controls the autoplay feature.                                                                                                                                               | `undefined`                            |
| `fullWidth`            | `Boolean`                                                  | Controls whether or not the slides should occupy the full available width, making the arrows appear on top of them.                                                          | `true`                                 |
| `arrowSize`            | `Number`                                                   | Controls the size (height and width) in pixels of the arrows. This is a responsive prop, which means you can pass different values for each breakpoint.                      | `25`                                   |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles               |
| ------------------------- |
| `sliderLayoutContainer`   |
| `sliderTrackContainer`    |
| `sliderTrack`             |
| `slide`                   |
| `slideChildrenContainer`  |
| `sliderLeftArrow`         |
| `sliderRightArrow`        |
| `sliderArrows`            |
| `paginationDotsContainer` |
| `paginationDot`           |
| `paginationDot--isActive` |
