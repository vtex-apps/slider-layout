import React, { FC, Fragment } from 'react'

import sliderCSS from './slider.css'
import { useSliderState } from './SliderContext'

interface Props {
  totalItems: number
}

/**
 * Returns if the slide is visible or not
 */
const isSlideVisibile = (
  index: number,
  currentSlide: number,
  slidesToShow: number
): boolean => {
  return index >= currentSlide && index < currentSlide + slidesToShow
}

/** List of all slides */
const SlideList: FC<Props> = ({ children, totalItems }) => {
  const { currentSlide, slideWidth, slidesPerPage } = useSliderState()

  return (
    <Fragment>
      {React.Children.toArray(children).map((child, index) => (
        <div
          key={index}
          className={`flex relative ${sliderCSS.sliderItem || ''}`}
          data-index={index}
          style={{
            width: `${slideWidth}px`,
          }}
          aria-hidden={
            isSlideVisibile(index, currentSlide, slidesPerPage)
              ? 'false'
              : 'true'
          }
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${totalItems}`}
        >
          {child}
        </div>
      ))}
    </Fragment>
  )
}

export default SlideList
