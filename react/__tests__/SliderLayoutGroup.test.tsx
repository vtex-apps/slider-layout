import React from 'react'
import {
  render,
  getByLabelText,
  getByText,
  fireEvent,
} from '@vtex/test-tools/react'
import { useResponsiveValue } from 'vtex.responsive-values'

import SliderLayoutGroup from '../SliderLayoutGroup'
import SliderLayout from '../SliderLayout'

const mockedUseResponsiveValue = useResponsiveValue as jest.Mock<
  number | string
>

mockedUseResponsiveValue.mockImplementation(args => {
  if (typeof args === 'string') return args

  return 1
})

test('should move all sliders in a group together', () => {
  const { container } = render(
    <SliderLayoutGroup>
      <div id="first-slider">
        <SliderLayout showPaginationDots="never">
          <div>Slider 1 Item 1</div>
          <div>Slider 1 Item 2</div>
          <div>Slider 1 Item 3</div>
        </SliderLayout>
      </div>
      <div id="second-slider">
        <SliderLayout showPaginationDots="never">
          <div>Slider 2 Item 1</div>
          <div>Slider 2 Item 2</div>
          <div>Slider 2 Item 3</div>
        </SliderLayout>
      </div>
    </SliderLayoutGroup>
  )

  const firstSlider = container.querySelector('#first-slider') as HTMLElement
  const secondSlider = container.querySelector('#second-slider') as HTMLElement

  const nextArrow = getByLabelText(firstSlider, 'Next Slide')
  const previousArrow = getByLabelText(secondSlider, 'Previous Slide')

  // Go to the right
  fireEvent.click(nextArrow)

  let visibleSlideFirstSlider: HTMLElement | null = firstSlider.querySelector(
    '[aria-hidden=false]'
  )

  let visibleSlideSecondSlider: HTMLElement | null = secondSlider.querySelector(
    '[aria-hidden=false]'
  )

  if (!visibleSlideFirstSlider || !visibleSlideSecondSlider) {
    throw new Error('Could not find any visible slides')
  }

  let secondSlide1 = getByText(visibleSlideFirstSlider, 'Slider 1 Item 2')
  let secondSlide2 = getByText(visibleSlideSecondSlider, 'Slider 2 Item 2')

  expect(secondSlide1).toBeDefined()
  expect(secondSlide2).toBeDefined()

  // Go to the left
  fireEvent.click(previousArrow)

  visibleSlideFirstSlider = firstSlider.querySelector('[aria-hidden=false]')

  visibleSlideSecondSlider = secondSlider.querySelector('[aria-hidden=false]')

  if (!visibleSlideFirstSlider || !visibleSlideSecondSlider) {
    throw new Error('Could not find any visible slides')
  }

  secondSlide1 = getByText(visibleSlideFirstSlider, 'Slider 1 Item 1')
  secondSlide2 = getByText(visibleSlideSecondSlider, 'Slider 2 Item 1')

  expect(secondSlide1).toBeDefined()
  expect(secondSlide2).toBeDefined()
})
