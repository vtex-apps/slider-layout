import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import SliderTrack, { CSS_HANDLES } from '../components/SliderTrack'
import { useSliderState } from '../components/SliderContext'
import {
  mockInitialSlides,
  mockInitialInfiniteSliderState,
  mockInitialNonInfiniteSliderState,
} from '../__fixtures__/SliderStateContext'
import { useContextCssHandles } from '../modules/cssHandles'
import { mockedUseContextCssHandlesFn } from '../__fixtures__/CssHandlesHelper'

const mockDispatch = jest.fn()

const mockedUseSliderState = useSliderState as jest.Mock

jest.mock('../components/SliderContext', () => ({
  useSliderState: jest.fn(),
  useSliderDispatch: () => mockDispatch,
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
  mockedUseSliderState.mockImplementation(() => mockInitialInfiniteSliderState)

  it('should render with correct width based on slides to render', () => {
    const TOTAL_ITEMS = 10
    const SLIDES_PER_PAGE = 5

    // slidesPerPage < totalItems
    const { getByTestId, rerender } = render(
      <SliderTrack
        centerMode="disabled"
        usePagination
        totalItems={TOTAL_ITEMS}
        infinite
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    let renderedSliderTrack = getByTestId('slider-track')

    // Since this slider is infinite, track width should be calculated
    // based on 2 * TOTAL_ITEMS.
    expect(renderedSliderTrack.style.width).toEqual(
      `${(2 * TOTAL_ITEMS * 100) / SLIDES_PER_PAGE}%`
    )

    // slidesPerPage === totalItems
    rerender(
      <SliderTrack centerMode="disabled" usePagination totalItems={5} infinite>
        {mockInitialSlides}
      </SliderTrack>
    )
    renderedSliderTrack = getByTestId('slider-track')
    expect(renderedSliderTrack.style.width).toEqual(
      `${(2 * TOTAL_ITEMS * 100) / SLIDES_PER_PAGE}%`
    )

    // slidesPerPage > totalItems
    rerender(
      <SliderTrack centerMode="disabled" usePagination totalItems={3} infinite>
        {mockInitialSlides}
      </SliderTrack>
    )
    renderedSliderTrack = getByTestId('slider-track')
    expect(renderedSliderTrack.style.width).toEqual('100%')
  })

  it('should render with correct translate3d(x, y, z), set to the initial slide', () => {
    // infinite slider
    const { getByTestId, rerender } = render(
      <SliderTrack centerMode="disabled" usePagination totalItems={10} infinite>
        {mockInitialSlides}
      </SliderTrack>
    )

    let renderedSliderTrack = getByTestId('slider-track')

    expect(renderedSliderTrack.style.transform).toEqual(
      `translate3d(-25%, 0, 0)`
    )

    // non-infinite slider
    mockedUseSliderState.mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(
      <SliderTrack
        centerMode="disabled"
        usePagination
        totalItems={10}
        infinite={false}
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    renderedSliderTrack = getByTestId('slider-track')
    expect(renderedSliderTrack.style.transform).toEqual(`translate3d(0%, 0, 0)`)
  })

  it('should render slides with correct indexes', () => {
    const TOTAL_ITEMS = 10
    const SLIDES_PER_PAGE = 5

    // infinite slider
    const { getByTestId, rerender } = render(
      <SliderTrack
        centerMode="disabled"
        usePagination
        totalItems={TOTAL_ITEMS}
        infinite
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    let renderedSliderTrack = getByTestId('slider-track')

    renderedSliderTrack.childNodes.forEach((element, idx) => {
      // This condition is due to the fact that this slider is infinite, so the
      // first SLIDES_PER_PAGE elements are a copy of the slider's last page,
      // and the last SLIDES_PER_PAGE elements are a copy of the first page.
      if (idx >= TOTAL_ITEMS + SLIDES_PER_PAGE || idx < SLIDES_PER_PAGE) {
        expect(element).not.toHaveAttribute('data-index')

        return
      }

      expect(element).toHaveAttribute(
        'data-index',
        `${idx + 1 - SLIDES_PER_PAGE}`
      )
    })

    // non-infinite slider
    mockedUseSliderState.mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(
      <SliderTrack
        centerMode="disabled"
        usePagination
        totalItems={TOTAL_ITEMS}
        infinite={false}
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    renderedSliderTrack = getByTestId('slider-track')

    renderedSliderTrack.childNodes.forEach((element, idx) => {
      expect(element).toHaveAttribute('data-index', `${idx + 1}`)
    })
  })

  it('should only render visible slides on initial mount', () => {
    const TOTAL_ITEMS = 10
    const SLIDES_PER_PAGE = 5
    const INDEXES = Array.from(new Array(10), (_, i) => i + 1)

    // infinite slider
    const { rerender, queryByText } = render(
      <SliderTrack
        centerMode="disabled"
        usePagination
        totalItems={TOTAL_ITEMS}
        infinite
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    let renderedSlides = INDEXES.map(idx =>
      queryByText(`I am a slide. My index is ${idx}`)
    ).filter(Boolean)

    expect(renderedSlides).toHaveLength(SLIDES_PER_PAGE)

    // non-infinite slider
    mockedUseSliderState.mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(
      <SliderTrack
        centerMode="disabled"
        usePagination
        totalItems={TOTAL_ITEMS}
        infinite={false}
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    renderedSlides = INDEXES.map(idx =>
      queryByText(`I am a slide. My index is ${idx}`)
    ).filter(Boolean)

    expect(renderedSlides).toHaveLength(SLIDES_PER_PAGE)
  })

  it('should render all slides on initial mount when slider is not using pagination', () => {
    const TOTAL_ITEMS = 10
    const INDEXES = Array.from(new Array(10), (_, i) => i + 1)

    // infinite slider
    const { rerender, queryByText, queryAllByText } = render(
      <SliderTrack
        centerMode="disabled"
        usePagination={false}
        totalItems={TOTAL_ITEMS}
        infinite
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    let renderedSlides: Array<HTMLElement | null | void> = INDEXES.map(idx =>
      expect(queryAllByText(`I am a slide. My index is ${idx}`)).toHaveLength(2)
    )

    expect(renderedSlides).toHaveLength(TOTAL_ITEMS)

    // non-infinite slider
    mockedUseSliderState.mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(
      <SliderTrack
        centerMode="disabled"
        usePagination={false}
        totalItems={TOTAL_ITEMS}
        infinite={false}
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    renderedSlides = INDEXES.map(idx =>
      queryByText(`I am a slide. My index is ${idx}`)
    ).filter(Boolean)

    expect(renderedSlides).toHaveLength(TOTAL_ITEMS)
  })
})

describe('Behavior upon interaction', () => {
  it('should correct slider state after infinite loop transitions', () => {
    const TOTAL_ITEMS = 10

    // This is a state where the slider is in its first page clone
    mockedUseSliderState.mockImplementation(() => ({
      ...mockInitialInfiniteSliderState,
      currentSlide: 10,
      transform: mockInitialInfiniteSliderState.transformMap[10],
    }))

    const { getByTestId, rerender } = render(
      <SliderTrack
        centerMode="disabled"
        totalItems={TOTAL_ITEMS}
        infinite
        usePagination
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    let renderedTrack = getByTestId('slider-track')

    fireEvent.transitionEnd(renderedTrack)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DISABLE_TRANSITION' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADJUST_CURRENT_SLIDE',
      payload: {
        currentSlide: 0,
        transform: mockInitialInfiniteSliderState.transformMap[0],
      },
    })

    // This is a state where the slider is in its last page clone
    mockedUseSliderState.mockImplementation(() => ({
      ...mockInitialInfiniteSliderState,
      currentSlide: -1,
      transform: mockInitialInfiniteSliderState.transformMap[-1],
    }))

    rerender(
      <SliderTrack
        centerMode="disabled"
        totalItems={TOTAL_ITEMS}
        infinite
        usePagination
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    renderedTrack = getByTestId('slider-track')
    fireEvent.transitionEnd(renderedTrack)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DISABLE_TRANSITION' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADJUST_CURRENT_SLIDE',
      payload: {
        currentSlide: 5,
        transform: mockInitialInfiniteSliderState.transformMap[5],
      },
    })
  })

  mockedUseSliderState.mockClear()
})

describe('Accessibility', () => {
  it('should have correct aria attributes set for each slide', () => {
    mockedUseSliderState.mockImplementation(
      () => mockInitialInfiniteSliderState
    )

    const TOTAL_ITEMS = 10
    const SLIDES_PER_PAGE = 5
    const INDEXES = Array.from(new Array(10), (_, i) => i + 1)

    const { getByTestId, getByLabelText } = render(
      <SliderTrack
        centerMode="disabled"
        usePagination
        totalItems={TOTAL_ITEMS}
        infinite
      >
        {mockInitialSlides}
      </SliderTrack>
    )

    const renderedSliderTrack = getByTestId('slider-track')

    const clones = renderedSliderTrack.querySelectorAll(
      "[role='none presentation']"
    )

    expect(clones).toHaveLength(SLIDES_PER_PAGE * 2)

    const visibleSlides = renderedSliderTrack.querySelectorAll(
      '[aria-hidden=false]'
    )

    expect(visibleSlides).toHaveLength(SLIDES_PER_PAGE)

    const nonCloneSlides = renderedSliderTrack.querySelectorAll(
      '[aria-roledescription=slide]'
    )

    expect(nonCloneSlides).toHaveLength(TOTAL_ITEMS)

    const slidesWithLabels = INDEXES.map(idx =>
      getByLabelText(`${idx} of ${TOTAL_ITEMS}`)
    ).filter(Boolean)

    expect(slidesWithLabels).toHaveLength(TOTAL_ITEMS)
  })
})
