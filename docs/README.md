📢 Use this project, [contribute](https://github.com/vtex-apps/slider-layout) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Slider Layout

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Slider Layout is a flexible solution for building sliders of blocks within VTEX Store Framework, such as a carousel component. 

![](https://user-images.githubusercontent.com/27777263/70230361-e839db00-1736-11ea-9f29-7c945c10a5f7.png)

:information_source: *In order to use the Slider Layout as a substitute to the [Carousel app](https://github.com/vtex-apps/carousel), check out the [Building a Carousel through lists and Slider Layout](https://vtex.io/docs/recipes/layout/building-a-carousel-through-lists-and-slider-layout) documentation.*

## Configuration

1. Add the `slider-layout` app to your theme's dependencies in the `manifest.json` file:

```json
"dependencies": {
  "vtex.slider-layout": "0.x"
}
```

2. Add the `slider-layout` block to your template. For example:

```json
  "slider-layout#text-test": {
    "props": {
      "itemsPerPage": {
        "desktop": 1,
        "tablet": 1,
        "phone": 1
      },
      "infinite": true,
      "showNavigationArrows": "desktopOnly",
      "blockClass": "carousel"
    },
    "children": ["rich-text#1", "rich-text#2", "rich-text#3"]
  },

  "rich-text#1": {
    "props": {
      "text": "Test1"
    }
  },
  "rich-text#2": {
    "props": {
      "text": "Test2"
    }
  },
  "rich-text#3": {
    "props": {
      "text": "Test3"
    }
  },
```

| Prop name              | Type                         | Description               | Default value                        |
| ---------------------- | ---------------------------- | ------------------------- | ------------------------------------ |
| `label`   | `string`  | `aria-label` attribute value to be used by the `<Slider/>` component when rendered. The `aria-label` value should explicitly tell users what the HTML element being inspected is responsible for.   | `slider`  |
| `showNavigationArrows` | `enum` | When navigation arrows should be rendered. Possible values are: `mobileOnly`, `desktopOnly`, `always`, or `never`.  | `always` |
| `showPaginationDots`   | `enum` | When pagination dots should be rendered. Possible values are: `mobileOnly`, `desktopOnly`, `always`, or `never`.  | `always` |
| `infinite`   | `boolean`   | Whether the slider should be infinite (`true`) or not (`false`). When this prop is set as `false`, the slider will have an explicit end for users. | `false` |
| `usePagination`        | `boolean`  | Whether the slider should use slide pages (`true`) or not (`false`). When this prop is set as `false`, the slider will use smooth scrolling for slide navigation instead of arrows.  | `true` |  
| `itemsPerPage`         | `object`    | Number of slider items to be shown on each type of device. For more on this, check out the  `itemsPerPage` object section below. | `{ desktop: 5, tablet: 3, phone: 1 }`  |
| `navigationStep`       | `number` / `enum` | Number of slider items that should be displayed at a time when users click on one of the slider's arrows. It is also possible to set this prop value as `page`, meaning that the number of slider items to be displayed when one of the arrows is clicked on is equal to the number of slider items set per page (in the `itemsPerPage` prop). | `page`  |
| `slideTransition`      | `object`  | Controls the transition animation between slides based on [CSS attributes](https://developer.mozilla.org/en-US/docs/Web/CSS/transition). For more on this, check out the `slideTransition` object section below.  | `{ speed: 400, delay: 0, timing: '' }` |
| `autoplay`  | `object` | Controls the autoplay feature behavior. For more on this, check out the `autoplay` object section below.   | `undefined` |
| `fullWidth`            | `boolean` | Whether the slides should occupy the full page width, making the arrows appear on top of them (`true`) or not (`false`). |`true` |
| `arrowSize`            | `number` / `object`   | Slider arrows size (height and width) in pixels. This is a responsive prop, which means you can pass to it an object with different values for each breakpoint (`desktop`, `tablet`, and `phone`).  | `25`  |

- **`itemsPerPage` object**

| Prop name | Type | Description | Default value |
| ------- | ------ | -------- | ------------- | 
| `desktop` | `number` | Number of slides to be shown on desktop devices. |  `5` | 
| `tablet` | `number` |  Number of slides to be shown on tablet devices. | `3` | 
| `phone` | `number` |  Number of slides to be shown on phone devices.   | `1` | 

- **`slideTransition` object**

| Prop name | Type | Description | Default value |
| ------- | ------ | -------- | ------------- | 
| `speed` | `number` | Transition speed (in `ms`).  |  `400` | 
| `delay` | `number` |  Delay between slides transition (in `ms`).  | `0` | 
| `timing` | `string` | Timing function. | `''` | 

- **`autoplay` object**

| Prop name | Type | Description | Default value |
| ------- | ------ | -------- | ------------- | 
| `timeout` | `number` |  Timeout (in `ms`) between each slide. |  `undefined` | 
| `stopOnHover` | `boolean` |  Whether the auto play should stop when users are hovering the slider (`true`) or not (`false`). | `undefined` |

## `slider-layout-group`

The `slider-layout-group` block enables you to keep a group of `slider-layout` blocks in sync with each other.

Here's an example using three `slider-layout` blocks inside of a `slider-layout-group`. Each of those `slider-layout`s received three `rich-text` blocks to serve as individual slides.

![slider-layout-group demo](https://user-images.githubusercontent.com/27777263/89814281-46665b80-db19-11ea-9ff2-8aff60c72a73.gif)

This block only expects to receive `children`, such as:

```json
{
  "slider-layout-group#test": {
    "children": [
      "slider-layout#1",
      "slider-layout#2",
      "slider-layout#3"
    ]
  }
}
```

:information_source: It is **very** important that all `slider-layout` blocks inside a group receive the same configuration props, and differ only in their children. Trying to use `slider-layout` blocks with different configuration, such as each one with a different value for `itemsPerPage`, will result in unexpected behavior and is **not** supported.

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles               |
| ------------------------- |
| `sliderLayoutContainer`   |
| `sliderTrackContainer`    |
| `sliderTrack`             |
| `slide`                   |
| `slide--firstVisible`     |
| `slide--lastVisible`      |
| `slideChildrenContainer`  |
| `sliderLeftArrow`         |
| `sliderRightArrow`        |
| `sliderArrows`            |
| `paginationDotsContainer` |
| `paginationDot`           |
| `paginationDot--isActive` |


<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
