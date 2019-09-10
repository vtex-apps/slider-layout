import React, { FC } from 'react'

import { useSliderState } from './SliderContext'
import sliderCSS from './slider.css'

interface Props {
  slideTransition: TransitionType
}

interface TransitionType {
  /** Transition speed in ms */
  speed: number
  /** Transition delay in ms */
  delay: number
  /** Timing function */
  timing: string
}

const SliderTrack: FC<Props> = ({ children, slideTransition }) => {
  const { speed, timing, delay } = slideTransition
  const { transform } = useSliderState()

  return (
    <div
      className={`${sliderCSS.slider || ''} flex relative pa0 ma0`}
      style={{
        willChange: 'transform',
        transition: `transform ${speed}ms ${timing}`,
        transitionDelay: `${delay}ms`,
        transform: `translate3d(${transform}px, 0, 0)`,
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {children}
    </div>
  )
}

export default SliderTrack
