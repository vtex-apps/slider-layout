# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.22.1] - 2021-12-17

### Fixed
- Spanish translation.

### Removed
- Pseudolanguage.

## [0.22.0] - 2021-09-30

### Added
- `centerModeSlidesGap` prop.


## [0.21.0] - 2021-09-24

### Added
- I18n Bg and Bs (pseudo-language to implement in-context tool).

### Fixed
- I18n Es and It. 

## [0.20.0] - 2021-09-15
### Added
- `SliderTrack`: Pass `__isDuplicated` prop to duplicated child.

## [0.19.2] - 2021-07-15

### Fixed

- Broken link in documentation

## [0.19.1] - 2021-06-17

### Fixed
- Crowdin configuration file.

## [0.19.0] - 2021-05-03

### Added 
- I18n Fr, It, Ko and Nl.

### Changed
- Crowdin configuration file.

## [0.18.0] - 2021-03-08

### Added

- I18n Ro and Jp.

### Fixed

- Crowdin configuration file.

## [0.17.0] - 2021-01-06
### Added
- Prop `classes` to SliderLayout.

### Changed
- Migrate to `vtex.css-handles@1.x`.

## [0.16.0] - 2020-12-16
### Added
- Modifiers `visible` and `hidden` for the `slide` CSS Handles

## [0.15.2] - 2020-10-29
### Fixed
- Navigation controls would not work when the `slider` was placed inside an `<a>` tag. This is the case if you were to place a `slider-layout` inside of a `product-summary`.

## [0.15.1] - 2020-09-24
### Fixed
- Slides not re-rendering on prop change

## [0.15.0] - 2020-08-24
### Added
- New `centerMode` prop.

## [0.14.0] - 2020-08-19
### Added
- Proper support for dynamic `slider-layout`s.

## [0.13.2] - 2020-08-19
### Added
- Unity tests for individual components.

## [0.13.1] - 2020-08-13
### Fixed
- `ADJUST_ON_RESIZE` reducer action setting `transform` to incorrect values, not based on `transformMap`.

## [0.13.0] - 2020-08-12
### Added
- New `SliderLayoutGroup` component and its `slider-layout-group` interface.

## [0.12.0] - 2020-08-06
### Added
- Full support for `responsive-values` in the `itemsPerPage` prop, through the use of `vtex.responsive-values`.

## [0.11.6] - 2020-08-03
### Fixed
- `slidesPerPage` miscalculation in situations where the total number of slides to render where less than the value from `itemsPerPage` for the current device.

## [0.11.5] - 2020-07-30 [YANKED]
### Fixed
- `SliderTrack` component miscalculating its own width.

## [0.11.4] - 2020-07-29 [YANKED]
### Fixed
- Infinite loops now happen without "rewinding" effects.

## [0.11.3] - 2020-07-22
### Changed
- Dampening effect during touch movement, making the slider more responsive on mobile devices.

## [0.11.2] - 2020-05-26
### Fixed
- Navigation using `PaginationDots` would result in elements not being rendered.

## [0.11.1] - 2020-05-22

### Added
- Modifiers `firstVisible` and `lastVisible` for the `slide` CSS Handles 

## [0.11.0] - 2020-03-11
### Added
- New CSS Handle `paginationDot--isActive`.

## [0.10.0] - 2020-03-09
### Added
- `fullWidth` to `SliderLayout` schema definition and allow it to be controlled by the Site Editor.
- `autoplay` and `itemsPerPage` to `SliderLayout` schema as `layout` properties.

## [0.9.0] - 2020-03-06
### Changed
- Prevent unvisited slides from rendering, improving performance.

## [0.8.2] - 2020-02-07
### Fixed
- Touch handlers not working as expected.

## [0.8.1] - 2020-02-06
### Fixed
- Slider would "flash" when transitioning from SSR to CSR.

## [0.8.0] - 2020-01-13
### Added
- New `sliderTrackContainer` CSS handle.
- New props `fullWidth` and `arrowSize`.

## [0.7.3] - 2019-12-17

### Added
- Recipe about how to use slider-layout as carousel

## [0.7.2] - 2019-12-05

## [0.7.1] - 2019-11-25

## [0.7.0] - 2019-10-28
### Added
- Support for `autoplay` feature via a new `autoplay` prop.

### Changed
- CSS handles.

## [0.6.0] - 2019-10-22
### Added
- Support for consuming `list-context`s.

## [0.5.0] - 2019-10-03
### Added
- Support for customization via Site Editor.

## [0.4.1] - 2019-09-20
### Fixed
- Prevent slides from rendering before `slideWidth` is calculated.

## [0.4.0] - 2019-09-17
### Added
- `README` file.

### Removed
- Unnecessary `.sliderContainer` CSS class.

### Changed
- CSS handles.
- `children` rendered on a slide has `w-100` token.

## [0.3.0] - 2019-09-17
### Added
- Support for swipeable navigation on mobile.

## [0.2.0] - 2019-09-11
### Added
- Support for `usePagination` prop.

### Changed
- Rename enum values for `showPaginationDots`.

## [0.1.0] - 2019-09-10
### Added
- First implementation of `slider-layout`.
