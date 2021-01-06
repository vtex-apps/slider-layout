import React from 'react'
import { render } from '@vtex/test-tools/react'

import Slider, { CSS_HANDLES } from '../components/Slider'
import { mockInitialInfiniteSliderState } from '../__fixtures__/SliderStateContext'
import { mockedUseContextCssHandlesFn } from '../__fixtures__/CssHandlesHelper'
import { useContextCssHandles } from '../modules/cssHandles'

let mockDeviceDetectorReturn = { device: 'desktop', isMobile: false }

jest.mock('../hooks/useTouchHandlers', () => ({
  useTouchHandlers: () => ({
    onTouchStart: jest.fn(),
    onTouchMove: jest.fn(),
    onTouchEnd: jest.fn(),
  }),
}))

jest.mock('../components/SliderContext', () => ({
  useSliderState: () => mockInitialInfiniteSliderState,
  useSliderDispatch: () => jest.fn(),
}))

jest.mock('vtex.device-detector', () => ({
  useDevice: jest.fn(() => mockDeviceDetectorReturn),
}))

jest.mock('../modules/cssHandles', () => ({
  useContextCssHandles: jest.fn(),
}))

const mockedUseContextCssHandles = useContextCssHandles as jest.Mock<
  ReturnType<typeof useContextCssHandles>
>

mockedUseContextCssHandles.mockImplementation(() =>
  mockedUseContextCssHandlesFn(CSS_HANDLES)
)

describe('Basic rendering', () => {
  it('should render complete slider, with arrows and pagination dots on default settings', () => {
    const { getByTestId, getByLabelText } = render(
      <Slider
        centerMode="disabled"
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

    expect(expectedCarouselRole).toBeInTheDocument()
    expect(leftArrow).toBeInTheDocument()
    expect(rightArrow).toBeInTheDocument()
    expect(paginationDots).toBeInTheDocument()
  })

  it('should render without pagination features and use x-scrolling if usePagination is set to false', () => {
    const { getByLabelText, queryByTestId, queryByLabelText } = render(
      <Slider
        centerMode="disabled"
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

    const renderedSlider = getByLabelText('slider')
    const sliderTrackContainer = renderedSlider.firstChild

    const leftArrow = queryByTestId('icon-caret-left')
    const rightArrow = queryByTestId('icon-caret-right')
    const paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).not.toBeInTheDocument()
    expect(rightArrow).not.toBeInTheDocument()
    expect(paginationDots).not.toBeInTheDocument()
    expect(sliderTrackContainer).toHaveClass('overflow-x-scroll')
  })

  it('should render without pagination features if there are not enough slides to fill a page', () => {
    const { getByLabelText, queryByTestId, queryByLabelText } = render(
      <Slider
        centerMode="disabled"
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

    const leftArrow = queryByTestId('icon-caret-left')
    const rightArrow = queryByTestId('icon-caret-right')
    const paginationDots = queryByLabelText('Slider pagination dots')

    expect(leftArrow).not.toBeInTheDocument()
    expect(rightArrow).not.toBeInTheDocument()
    expect(paginationDots).not.toBeInTheDocument()

    const renderedSlider = getByLabelText('slider')
    const sliderTrackContainer = renderedSlider.firstChild

    // Make sure that the slider renders without x-scrolling, since usePagination is set to true
    expect(sliderTrackContainer).not.toHaveClass('overflow-x-scroll')
  })

  it('should add appropriate padding in the x-axis if slider is not a full width one', () => {
    const { getByLabelText } = render(
      <Slider
        centerMode="disabled"
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

    expect(sliderSectionElement).toHaveStyle({
      paddingLeft: '50px',
      paddingRight: '50px',
    })
  })
})

describe('Behavior upon interaction', () => {
  it('should correctly toggle arrows and pagination dots visibility on mobile devices', () => {
    mockDeviceDetectorReturn = { device: 'phone', isMobile: true }

    // 'mobileOnly'
    const { queryByTestId, queryByLabelText, rerender } = render(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).toBeInTheDocument()
    expect(rightArrow).toBeInTheDocument()
    expect(paginationDots).toBeInTheDocument()

    // 'desktopOnly'
    rerender(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).not.toBeInTheDocument()
    expect(rightArrow).not.toBeInTheDocument()
    expect(paginationDots).not.toBeInTheDocument()

    // 'always'
    rerender(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).toBeInTheDocument()
    expect(rightArrow).toBeInTheDocument()
    expect(paginationDots).toBeInTheDocument()

    // 'never'
    rerender(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).not.toBeInTheDocument()
    expect(rightArrow).not.toBeInTheDocument()
    expect(paginationDots).not.toBeInTheDocument()
  })

  it('should correctly toggle arrows and pagination dots visibility on desktop devices', () => {
    mockDeviceDetectorReturn = { device: 'desktop', isMobile: false }

    // 'mobileOnly'
    const { queryByTestId, queryByLabelText, rerender } = render(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).not.toBeInTheDocument()
    expect(rightArrow).not.toBeInTheDocument()
    expect(paginationDots).not.toBeInTheDocument()

    // 'desktopOnly'
    rerender(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).toBeInTheDocument()
    expect(rightArrow).toBeInTheDocument()
    expect(paginationDots).toBeInTheDocument()

    // 'always'
    rerender(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).toBeInTheDocument()
    expect(rightArrow).toBeInTheDocument()
    expect(paginationDots).toBeInTheDocument()

    // 'never'
    rerender(
      <Slider
        centerMode="disabled"
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

    expect(leftArrow).not.toBeInTheDocument()
    expect(rightArrow).not.toBeInTheDocument()
    expect(paginationDots).not.toBeInTheDocument()
  })
})
