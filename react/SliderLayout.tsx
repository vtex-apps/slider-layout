import React, { FC } from 'react'
import { SliderContextProvider } from './components/SliderContext'
import Slider from './components/Slider'

const SliderLayout: FC<SliderLayoutProps> = props => (
  <SliderContextProvider>
    <Slider {...props}>{props.children}</Slider>
  </SliderContextProvider>
)

export default SliderLayout
