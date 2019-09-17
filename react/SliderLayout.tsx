import React, { FC } from 'react'
import { SliderContextProvider } from './components/SliderContext'
import Slider from './components/Slider'

const SliderLayout: FC<SliderLayoutProps> = props => {
  const totalItems = React.Children.count(props.children)
  return (
    <SliderContextProvider totalItems={totalItems} {...props}>
      <Slider>{props.children}</Slider>
    </SliderContextProvider>
  )
}

export default SliderLayout
