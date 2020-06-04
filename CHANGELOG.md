# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- `autoplay` props `timeout` and `stopOnHover` schema definition and allow it to be controlled by the Site Editor.

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
