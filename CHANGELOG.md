# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- How the `SliderTrack` component creates each individual slide.

### Added
- Suppor for the use of `blocks` that render a list of components that should be individual slides.

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
