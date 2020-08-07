import React from 'react'
import { render, getByLabelText, getByText, fireEvent } from '@vtex/test-tools/react'
import { useResponsiveValue } from 'vtex.responsive-values'

import SliderLayoutGroup from '../SliderLayoutGroup'
import SliderLayout from '../SliderLayout'

const mockedUseResponsiveValue = useResponsiveValue as jest.Mock<() => number>

mockedUseResponsiveValue.mockImplementation(() => 1)

test('should move all sliders in a group together', () => {
  const { debug, container } = render(
    <SliderLayoutGroup>
      <div id="first-slide">
        <SliderLayout showPaginationDots="never">
          <div>Slider 1 Item 1</div>
          <div>Slider 1 Item 2</div>
          <div>Slider 1 Item 3</div>
        </SliderLayout>
      </div>
      <div id="second-slide">
        <SliderLayout showPaginationDots="never">
          <div>Slider 2 Item 1</div>
          <div>Slider 2 Item 2</div>
          <div>Slider 2 Item 3</div>
        </SliderLayout>
      </div>
    </SliderLayoutGroup>
  )

  const firstSlide = container.querySelector('#first-slide') as HTMLElement
  const secondSlide = container.querySelector('#second-slide') as HTMLElement

  const nextArrow = getByLabelText(firstSlide, 'Next Slide')

  fireEvent.click(nextArrow)

  const visibleSlideFirstSlider = firstSlide.querySelector('[aria-hidden=false]')
  const visibleSlideSecondSlider = secondSlide.querySelector('[aria-hidden=false]')

  getByText(visibleSlideFirstSlider, 'Slider 1 Item 2')
  getByText(visibleSlideSecondSlider, 'Slider 2 Item 2')

  debug()

  expect(true).toBe(true)
})
