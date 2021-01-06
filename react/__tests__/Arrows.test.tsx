import React, { Fragment } from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import { useSliderState } from '../components/SliderContext'
import Arrow, { CSS_HANDLES } from '../components/Arrow'
import { useContextCssHandles } from '../modules/cssHandles'
import { mockedUseContextCssHandlesFn } from '../__fixtures__/CssHandlesHelper'

const mockGoForward = jest.fn()
const mockGoBack = jest.fn()

const mockedUseSliderState = useSliderState as jest.Mock

jest.mock('../components/SliderContext', () => ({
  useSliderState: jest.fn(),
}))

jest.mock('../hooks/useSliderControls', () => ({
  useSliderControls: () => ({
    goForward: mockGoForward,
    goBack: mockGoBack,
  }),
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

beforeEach(() => {
  mockGoForward.mockClear()
  mockGoBack.mockClear()
  // eslint-disable-next-line prettier/prettier
})

describe('Accessibility', () => {
  mockedUseSliderState.mockImplementation(() => ({
    currentSlide: 0,
    slidesPerPage: 5,
    navigationStep: 5,
  }))

  it('should render with correct aria attributes in each arrow', () => {
    const expectedLabelLeft = 'Previous Slide'
    const expectedLabelRight = 'Next Slide'
    const expectedContainerRole = 'button'

    const { queryAllByRole, queryByLabelText } = render(
      <Fragment>
        <Arrow
          infinite
          arrowSize={25}
          totalItems={20}
          orientation="left"
          controls="slider-items"
        />
        <Arrow
          infinite
          arrowSize={25}
          totalItems={20}
          orientation="right"
          controls="slider-items"
        />
      </Fragment>
    )

    expect(queryAllByRole(expectedContainerRole)).toHaveLength(2)
    expect(queryByLabelText(expectedLabelLeft)).toBeTruthy()
    expect(queryByLabelText(expectedLabelRight)).toBeTruthy()
  })
})

describe('Behavior upon interaction', () => {
  mockedUseSliderState.mockImplementation(() => ({
    currentSlide: 0,
    slidesPerPage: 5,
    navigationStep: 5,
  }))

  it('should go to the next page if right arrow is clicked', () => {
    const { getByTestId } = render(
      <Arrow
        infinite
        arrowSize={25}
        totalItems={20}
        orientation="right"
        controls="slider-items"
      />
    )

    const rightArrow = getByTestId('icon-caret-right')

    fireEvent.click(rightArrow)
    expect(mockGoForward).toHaveBeenCalledTimes(1)
  })

  it('should go to the previous page if left arrow is clicked', () => {
    const { getByTestId } = render(
      <Arrow
        infinite
        arrowSize={25}
        totalItems={20}
        orientation="left"
        controls="slider-items"
      />
    )

    const leftArrow = getByTestId('icon-caret-left')

    fireEvent.click(leftArrow)
    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should not go back on click if the slider is not infinite and left-end is reached', () => {
    const { getByTestId } = render(
      <Arrow
        infinite={false}
        arrowSize={25}
        totalItems={10}
        orientation="left"
        controls="slider-items"
      />
    )

    const leftArrow = getByTestId('icon-caret-left')

    fireEvent.click(leftArrow)
    expect(mockGoBack).toHaveBeenCalledTimes(0)
  })

  it('should not go forward on click if if the slider is not infinite and right-end is reached', () => {
    mockedUseSliderState.mockImplementation(() => ({
      currentSlide: 5,
      slidesPerPage: 5,
      navigationStep: 5,
    }))

    const { getByTestId } = render(
      <Arrow
        infinite={false}
        arrowSize={25}
        totalItems={10}
        orientation="right"
        controls="slider-items"
      />
    )

    const rightArrow = getByTestId('icon-caret-right')

    fireEvent.click(rightArrow)
    expect(mockGoForward).toHaveBeenCalledTimes(0)
  })
})
