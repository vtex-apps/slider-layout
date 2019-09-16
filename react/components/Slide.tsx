import React, { FC, useRef, useLayoutEffect } from 'react'

import { useSliderState } from './SliderContext'
import sliderCSS from './slider.css'

interface Props {
  node: ChildNode
  index: number
}

const Slide: FC<Props> = ({ node, index }) => {
  const {
    slideWidth,
    slidesPerPage,
    currentSlide,
    totalItems,
  } = useSliderState()

  const slideRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (slideRef.current) {
      slideRef.current.appendChild(node)
    }
  }, [node])

  const isSlideVisibile = (index: number): boolean => {
    return index >= currentSlide && index < currentSlide + slidesPerPage
  }

  return (
    <div
      ref={slideRef}
      key={index}
      className={`flex relative ${sliderCSS.sliderItem || ''}`}
      data-index={index}
      style={{
        width: `${slideWidth}px`,
      }}
      aria-hidden={isSlideVisibile(index) ? 'false' : 'true'}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${totalItems}`}
    />
  )
}

export default Slide
