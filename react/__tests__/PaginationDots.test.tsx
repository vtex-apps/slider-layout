import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import PaginationDots, { CSS_HANDLES } from '../components/PaginationDots'
import { useContextCssHandles } from '../modules/cssHandles'
import { mockedUseContextCssHandlesFn } from '../__fixtures__/CssHandlesHelper'

const mockGoForward = jest.fn()
const mockGoBack = jest.fn()

jest.mock('../components/SliderContext', () => {
  return {
    useSliderState: () => ({
      slideWidth: 20,
      slidesPerPage: 5,
      currentSlide: 0,
      transform: 0,
      navigationStep: 5,
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
      totalItems: 20,
      isPageNavigationStep: true,
      isOnTouchMove: false,
    }),
  }
})

jest.mock('../hooks/useSliderControls', () => {
  return {
    useSliderControls: () => ({
      goForward: mockGoForward,
      goBack: mockGoBack,
    }),
  }
})

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
  it('should render the correct number of pagination dots based on the number of slider pages', () => {
    const { queryAllByTestId } = render(
      <PaginationDots
        controls="pagination-dots-test"
        infinite
        totalItems={20}
      />
    )

    const numberOfPagesBasedOnTotalItems = 4
    const testId = 'paginationDot'

    expect(queryAllByTestId(testId)).toHaveLength(
      numberOfPagesBasedOnTotalItems
    )
  })
})

describe('Accessibility', () => {
  it('should have correct aria role and label in its container', () => {
    const { queryByRole, queryByLabelText } = render(
      <PaginationDots
        controls="pagination-dots-test"
        infinite
        totalItems={20}
      />
    )

    const expectedContainerRole = 'group'
    const expectedContainerAriaLabel = 'Slider pagination dots'

    expect(queryByRole(expectedContainerRole)).toBeTruthy()
    expect(queryByLabelText(expectedContainerAriaLabel)).toBeTruthy()
  })

  it('should have correct aria attributes in each dot', () => {
    const { queryAllByRole, queryByLabelText } = render(
      <PaginationDots
        controls="pagination-dots-test"
        infinite
        totalItems={20}
      />
    )

    const expectedDotsRole = 'button'
    const expectedNumberOfRenderedDots = 4

    expect(queryByLabelText('Dot 1 of 4')).toBeTruthy()
    expect(queryByLabelText('Dot 2 of 4')).toBeTruthy()
    expect(queryByLabelText('Dot 3 of 4')).toBeTruthy()
    expect(queryByLabelText('Dot 4 of 4')).toBeTruthy()

    expect(queryAllByRole(expectedDotsRole)).toHaveLength(
      expectedNumberOfRenderedDots
    )
  })
})

describe('Behavior upon interaction', () => {
  it('should call goForward() and goBack() methods with correct arguments as the user clicks in a dot', () => {
    const { queryAllByTestId } = render(
      <PaginationDots
        controls="pagination-dots-test"
        infinite
        totalItems={20}
      />
    )

    const renderedDots = queryAllByTestId('paginationDot')

    expect(renderedDots).toHaveLength(4)

    // Since the initial active dot is always index 0,
    // this should simulate a user clicking in the third
    // pagination dot.
    fireEvent.click(renderedDots[2])

    // Notice that this call does NOT update the sliderState,
    // so in the next assertion, the PaginationDots component
    // will behave as if it were still with the first dot active.
    expect(mockGoForward).toBeCalledWith(10)

    // Simulate the user clicking in the first pagination dot.
    fireEvent.click(renderedDots[0])
    expect(mockGoBack).toBeCalledWith(0)
  })
})
