import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import SliderTrack from '../components/SliderTrack'
import { useSliderState } from '../components/SliderContext'
import {
  mockInitialInfiniteSliderState,
  mockInitialNonInfiniteSliderState,
} from '../__fixtures__/SliderStateContext'

jest.mock('../components/SliderContext', () => ({
  useSliderState: jest.fn(),
  useSliderDispatch: () => jest.fn(),
}))

describe('Basic rendering', () => {
  ;(useSliderState as jest.Mock).mockImplementation(
    () => mockInitialInfiniteSliderState
  )

  it('should render with correct width based on slides to render', () => {
    // slidesPerPage < totalItems
    const { getByTestId, rerender } = render(
      <SliderTrack usePagination totalItems={10} infinite />
    )

    let renderedSliderTrack = getByTestId('slider-track')

    expect(renderedSliderTrack.style.width).toEqual(`${(20 * 100) / 5}%`)

    // slidesPerPage === totalItems
    rerender(<SliderTrack usePagination totalItems={5} infinite />)
    renderedSliderTrack = getByTestId('slider-track')
    expect(renderedSliderTrack.style.width).toEqual(`${(20 * 100) / 5}%`)

    // slidesPerPage > totalItems
    rerender(<SliderTrack usePagination totalItems={3} infinite />)
    renderedSliderTrack = getByTestId('slider-track')
    expect(renderedSliderTrack.style.width).toEqual('100%')
  })

  it('should render with correct translate3d(x, y, z), set to the initial slide', () => {
    // infinite slider
    const { getByTestId, rerender } = render(
      <SliderTrack usePagination totalItems={10} infinite />
    )

    let renderedSliderTrack = getByTestId('slider-track')

    expect(renderedSliderTrack.style.transform).toEqual(
      `translate3d(-25%, 0, 0)`
    )

    // non-infinite slider
    ;(useSliderState as jest.Mock).mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(<SliderTrack usePagination totalItems={10} infinite={false} />)

    renderedSliderTrack = getByTestId('slider-track')
    expect(renderedSliderTrack.style.transform).toEqual(`translate3d(0%, 0, 0)`)
  })

  it('should render slides with correct indexes', () => {
    const TOTAL_ITEMS = 10
    const SLIDES_PER_PAGE = 5

    // infinite slider
    const { getByTestId, rerender } = render(
      <SliderTrack usePagination totalItems={TOTAL_ITEMS} infinite />
    )

    let renderedSliderTrack = getByTestId('slider-track')

    renderedSliderTrack.childNodes.forEach((element, idx) => {
      // This condition is due to the fact that this slider is infinite, so the
      // first SLIDES_PER_PAGE elements are a copy of the slider's last page,
      // and the last SLIDES_PER_PAGE elements are a copy of the first page.
      if (idx >= TOTAL_ITEMS + SLIDES_PER_PAGE || idx < SLIDES_PER_PAGE) {
        expect((element as Element).getAttribute('data-index')).toBeNull()

        return
      }

      expect((element as Element).getAttribute('data-index')).toEqual(
        `${idx + 1 - SLIDES_PER_PAGE}`
      )
    })

    // non-infinite slider
    ;(useSliderState as jest.Mock).mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(
      <SliderTrack usePagination totalItems={TOTAL_ITEMS} infinite={false} />
    )

    renderedSliderTrack = getByTestId('slider-track')

    renderedSliderTrack.childNodes.forEach((element, idx) => {
      expect((element as Element).getAttribute('data-index')).toEqual(
        `${idx + 1}`
      )
    })
  })

  it('should only render visible slides on initial mount', () => {
    const TOTAL_ITEMS = 10
    const SLIDES_PER_PAGE = 5
    const INDEXES = Array.from(new Array(10), (_, i) => i + 1)

    // infinite slider
    const { rerender, queryByText } = render(
      <SliderTrack usePagination totalItems={TOTAL_ITEMS} infinite />
    )

    let renderedSlides = INDEXES.map(idx =>
      queryByText(`I am a slide. My index is ${idx}`)
    ).filter(Boolean)

    expect(renderedSlides).toHaveLength(SLIDES_PER_PAGE)

    // non-infinite slider
    ;(useSliderState as jest.Mock).mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(
      <SliderTrack usePagination totalItems={TOTAL_ITEMS} infinite={false} />
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
    const { rerender, queryByText } = render(
      <SliderTrack usePagination={false} totalItems={TOTAL_ITEMS} infinite />
    )

    let renderedSlides = INDEXES.map(idx =>
      queryByText(`I am a slide. My index is ${idx}`)
    ).filter(Boolean)

    expect(renderedSlides).toHaveLength(TOTAL_ITEMS)

    // non-infinite slider
    ;(useSliderState as jest.Mock).mockImplementationOnce(
      () => mockInitialNonInfiniteSliderState
    )

    rerender(
      <SliderTrack
        usePagination={false}
        totalItems={TOTAL_ITEMS}
        infinite={false}
      />
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
    const SLIDES_PER_PAGE = 5

      // This is a state where the slider is in its last page
    ;(useSliderState as jest.Mock).mockImplementation(() => ({
      ...mockInitialInfiniteSliderState,
      currentSlide: 5,
      transform: mockInitialInfiniteSliderState.transformMap[5],
    }))

    const { queryByText } = render(
      <SliderTrack totalItems={TOTAL_ITEMS} infinite usePagination />
    )

    // fireEvent.transitionEnd()
  })
})

describe('Accessibility', () => {
  it.todo('should have correct aria attributes set for each slide')
})
