import React from 'react'
import { render } from '@vtex/test-tools/react'

import Slider from '../components/Slider'

let mockDeviceDetectorReturn = { device: 'desktop', isMobile: false }

jest.mock('../hooks/useTouchHandlers', () => ({
  useTouchHandlers: () => ({
    onTouchStart: jest.fn(),
    onTouchMove: jest.fn(),
    onTouchEnd: jest.fn(),
  }),
}))

jest.mock('../components/SliderContext', () => ({
  useSliderState: () => ({
    slideWidth: 20,
    slidesPerPage: 5,
    currentSlide: 0,
    transform: 0,
    navigationStep: 5,
    slides: [
      <div key={1} />,
      <div key={2} />,
      <div key={3} />,
      <div key={4} />,
      <div key={5} />,
      <div key={6} />,
      <div key={7} />,
      <div key={8} />,
      <div key={9} />,
      <div key={10} />,
    ],
    transformMap: {
      0: 0,
      1: 20,
      2: 40,
      3: 60,
      4: 80,
    },
    slideTransition: {
      speed: 400,
      delay: 0,
      timing: '',
    },
    itemsPerPage: {
      desktop: 5,
      tablet: 5,
      phone: 5,
    },
    label: 'slider',
    totalItems: 10,
    isPageNavigationStep: true,
    isOnTouchMove: false,
  }),
  useSliderDispatch: () => jest.fn(),
}))

jest.mock('vtex.device-detector', () => ({
  useDevice: jest.fn(() => mockDeviceDetectorReturn),
}))

describe('Basic rendering', () => {
  it('should render complete slider, with arrows and pagination dots on default settings', () => {
    const { getByTestId, getByLabelText } = render(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="always"
        showPaginationDots="always"
        arrowSize={25}
        fullWidth
        infinite
        usePagination
      />
    )

    const expectedCarouselRole = getByLabelText('slider')
    const leftArrow = getByTestId('icon-caret-left')
    const rightArrow = getByTestId('icon-caret-right')
    const paginationDots = getByLabelText('Slider pagination dots')

    expect(expectedCarouselRole).toBeDefined()
    expect(leftArrow).toBeDefined()
    expect(rightArrow).toBeDefined()
    expect(paginationDots).toBeDefined()
  })

  it('should render without pagination features and use x-scrolling if usePagination is set to false', () => {
    const { getByTestId, queryByTestId, queryByLabelText } = render(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="always"
        showPaginationDots="always"
        usePagination={false}
        arrowSize={25}
        fullWidth
        infinite
      />
    )

    const sliderTrackContainer = getByTestId('slider-track-container')
    const leftArrow = queryByTestId('icon-caret-left')
    const rightArrow = queryByTestId('icon-caret-right')
    const paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeNull()
    expect(rightArrow).toBeNull()
    expect(paginationDots).toBeNull()
    expect(sliderTrackContainer.className.split(' ')).toContain(
      'overflow-x-scroll'
    )
  })

  it('should render without pagination features if there are not enough slides to fill a page', () => {
    const { getByTestId, queryByTestId, queryByLabelText } = render(
      <Slider
        totalItems={3}
        itemsPerPage={5}
        showNavigationArrows="always"
        showPaginationDots="always"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    const sliderTrackContainer = getByTestId('slider-track-container')
    const leftArrow = queryByTestId('icon-caret-left')
    const rightArrow = queryByTestId('icon-caret-right')
    const paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeNull()
    expect(rightArrow).toBeNull()
    expect(paginationDots).toBeNull()

    // Make sure that the slider renders without x-scrolling, since usePagination is set to true
    expect(sliderTrackContainer.className.split(' ')).not.toContain(
      'overflow-x-scroll'
    )
  })

  it('should add appropriate padding in the x-axis if slider is not a full width one', () => {
    const { getByLabelText } = render(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="always"
        showPaginationDots="always"
        fullWidth={false}
        arrowSize={25}
        usePagination
        infinite
      />
    )

    const sliderSectionElement = getByLabelText('slider')
    const { paddingLeft } = sliderSectionElement.style
    const { paddingRight } = sliderSectionElement.style

    expect(paddingLeft).toEqual('50px')
    expect(paddingRight).toEqual('50px')
  })
})

describe('Behavior upon interaction', () => {
  it('should correctly toggle arrows and pagination dots visibility on mobile devices', () => {
    mockDeviceDetectorReturn = { device: 'phone', isMobile: true }

    // 'mobileOnly'
    const { queryByTestId, queryByLabelText, rerender } = render(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="mobileOnly"
        showPaginationDots="mobileOnly"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    let leftArrow = queryByTestId('icon-caret-left')
    let rightArrow = queryByTestId('icon-caret-right')
    let paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeTruthy()
    expect(rightArrow).toBeTruthy()
    expect(paginationDots).toBeTruthy()

    // 'desktopOnly'
    rerender(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="desktopOnly"
        showPaginationDots="desktopOnly"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    leftArrow = queryByTestId('icon-caret-left')
    rightArrow = queryByTestId('icon-caret-right')
    paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeNull()
    expect(rightArrow).toBeNull()
    expect(paginationDots).toBeNull()

    // 'always'
    rerender(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="always"
        showPaginationDots="always"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    leftArrow = queryByTestId('icon-caret-left')
    rightArrow = queryByTestId('icon-caret-right')
    paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeTruthy()
    expect(rightArrow).toBeTruthy()
    expect(paginationDots).toBeTruthy()

    // 'never'
    rerender(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="never"
        showPaginationDots="never"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    leftArrow = queryByTestId('icon-caret-left')
    rightArrow = queryByTestId('icon-caret-right')
    paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeNull()
    expect(rightArrow).toBeNull()
    expect(paginationDots).toBeNull()
  })

  it('should correctly toggle arrows and pagination dots visibility on desktop devices', () => {
    mockDeviceDetectorReturn = { device: 'desktop', isMobile: false }

    // 'mobileOnly'
    const { queryByTestId, queryByLabelText, rerender } = render(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="mobileOnly"
        showPaginationDots="mobileOnly"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    let leftArrow = queryByTestId('icon-caret-left')
    let rightArrow = queryByTestId('icon-caret-right')
    let paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeNull()
    expect(rightArrow).toBeNull()
    expect(paginationDots).toBeNull()

    // 'desktopOnly'
    rerender(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="desktopOnly"
        showPaginationDots="desktopOnly"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    leftArrow = queryByTestId('icon-caret-left')
    rightArrow = queryByTestId('icon-caret-right')
    paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeTruthy()
    expect(rightArrow).toBeTruthy()
    expect(paginationDots).toBeTruthy()

    // 'always'
    rerender(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="always"
        showPaginationDots="always"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    leftArrow = queryByTestId('icon-caret-left')
    rightArrow = queryByTestId('icon-caret-right')
    paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeTruthy()
    expect(rightArrow).toBeTruthy()
    expect(paginationDots).toBeTruthy()

    // 'never'
    rerender(
      <Slider
        totalItems={10}
        itemsPerPage={5}
        showNavigationArrows="never"
        showPaginationDots="never"
        arrowSize={25}
        usePagination
        fullWidth
        infinite
      />
    )

    leftArrow = queryByTestId('icon-caret-left')
    rightArrow = queryByTestId('icon-caret-right')
    paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).toBeNull()
    expect(rightArrow).toBeNull()
    expect(paginationDots).toBeNull()
  })
})
