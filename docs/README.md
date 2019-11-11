# VTEX Slider-Layout

Slider-Layout is a flexible solution for building `sliders` of `blocks` within VTEX IO Store Framework.

## Blocks API

The API for `slider-layout` is very permissive, similar to the `flex-layout` interface:

```json
"slider-layout": {
  "component": "SliderLayout",
  "composition": "children",
  "allowed": "*"
},
```

Notice that you could use _any_ array of blocks as `children`, given that they are allowed by the `block` that is directly above your `slider-layout`.

### Configuration

This props should be edited at your theme's `blocks.json`:

| Prop name              | Type                                                       | Description                                                                                                                                                                  | Default value                          |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `label`                | `String`                                                   | Aria label to be used by the `<Slider />` component.                                                                                                                         | `'slider'`                             |
| `showNavigationArrows` | `mobileOnly`&#124;`desktopOnly`&#124;`always`&#124;`never` | Controls when should navigation arrows be rendered.                                                                                                                          | `'always'`                             |
| `showPaginationDots`   | `mobileOnly`&#124;`desktopOnly`&#124;`always`&#124;`never` | Controls when should pagination dots be rendered.                                                                                                                            | `'always'`                             |
| `infinite`             | `Boolean`                                                  | Controls if the slider should or should not be infinite.                                                                                                                     | `false`                                |
| `navigationStep`       | `Number`&#124;`'page'`                                     | How many slides should be slid when the user navigates. When set to `'page'`, the number of slides that will slide is equal to the number of slides in a page of the slider. | `'page'`                               |
| `usePagination`        | `Boolean`                                                  | Toggles whether or not to use a fluid scroll for navigation, disabling the notion of a "page".                                                                               | `true`                                 |
| `itemsPerPage`         | `{ desktop: Number, tablet: Number, phone: Number }`        | Controls how many slides should be shown on each type of device.                                                                                                             | `{ desktop: 5, tablet: 3, phone: 1 }`   |
| `slideTransition`      | `{ speed: Number, delay: Number, timing: String }`         | Controls the transition animation between slides.                                                                                                                            | `{ speed: 400, delay: 0, timing: '' }` |
| `autoplay`             | `{ timeout: Number, stopOnHover: Boolean }`                | Controls the autoplay feature.                                                                                                                                               | `undefined`                            |

## Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
"builders": {
  "styles": "1.x"
}
```

2. Create a file called `vtex.slider-layout.css` inside the `styles/css` folder. Add your custom styles:

```css
.slide {
  margin-top: 10px;
}
```

### CSS namespaces

Below, we describe the namespaces that are defined by `slider-layout`.

| Class name                |
| ------------------------- |
| `sliderLayoutContainer`   |
| `sliderTrack`             |
| `slide`                   |
| `slideChildrenContainer`  |
| `sliderLeftArrow`         |
| `sliderRightArrow`        |
| `sliderArrows`            |
| `paginationDotsContainer` |
| `paginationDot`           |
