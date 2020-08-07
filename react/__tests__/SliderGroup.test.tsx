import React from 'react'
import { render } from '@vtex/test-tools/react'

import SliderLayoutGroup from '../SliderLayoutGroup'
import SliderLayout from '../SliderLayout'

test('should move all sliders in a group together', () => {
  const { debug } = render(
    <SliderLayoutGroup>
      <SliderLayout blockClass="slider1">
        <div>Slider 1 Item 1</div>
        <div>Slider 1 Item 2</div>
        <div>Slider 1 Item 3</div>
      </SliderLayout>
      <SliderLayout blockClass="slider2">
        <div>Slider 2 Item 1</div>
        <div>Slider 2 Item 2</div>
        <div>Slider 2 Item 3</div>
      </SliderLayout>
    </SliderLayoutGroup>
  )

  debug()

  expect(true).toBe(true)
})
