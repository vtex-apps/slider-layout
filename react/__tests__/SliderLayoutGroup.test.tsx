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

const mockedUseResponsiveValue = useResponsiveValue as jest.Mock<number>

mockedUseResponsiveValue.mockImplementation(() => 1)

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

  fireEvent.click(nextArrow)

  const visibleSlideFirstSlider: HTMLElement | null = firstSlider.querySelector(
    '[aria-hidden=false]'
  )

  const visibleSlideSecondSlider: HTMLElement | null = secondSlider.querySelector(
    '[aria-hidden=false]'
  )

  if (!visibleSlideFirstSlider || !visibleSlideSecondSlider) {
    throw new Error('Could not find any visible slides')
  }

  getByText(visibleSlideFirstSlider, 'Slider 1 Item 2')
  getByText(visibleSlideSecondSlider, 'Slider 2 Item 2')

  expect(true).toBe(true)
})
