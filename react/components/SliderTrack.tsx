import React, { FC, Fragment } from 'react'
import { useSSR } from 'vtex.render-runtime'
import {
  useProductSummaryListState,
  useImageListState,
} from 'vtex.list-context'

import { useSliderState } from './SliderContext'
import sliderCSS from './slider.css'

const SliderTrack: FC<{ totalItems: number }> = ({ children, totalItems }) => {
  const {
    transform,
    slideWidth,
    slidesPerPage,
    currentSlide,
    isOnTouchMove,
    slideTransition: { speed, timing, delay },
  } = useSliderState()
  const isSSR = useSSR()
  const productList = useProductSummaryListState() || []
  const imageList = useImageListState() || []

  // TO-DO: Enable the user to control WHERE items from lists should be inserted
  const childrenArray = React.Children.toArray(children)
    .concat(productList)
    .concat(imageList)

  const isSlideVisibile = (
    index: number,
    currentSlide: number,
    slidesToShow: number
  ): boolean => {
    return index >= currentSlide && index < currentSlide + slidesToShow
  }

  if (isSSR) {
    const slideWidthPercentage = 100 / slidesPerPage

    return (
      <Fragment>
        {childrenArray.slice(0, slidesPerPage).map((child, index) => (
          <div
            key={index}
            className={`flex relative ${sliderCSS.slide}`}
            data-index={index}
            style={{
              width: `${slideWidthPercentage}%`,
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
            <div className="w-100">{child}</div>
          </div>
        ))}
      </Fragment>
    )
  }

  return (
    <div
      className={`${sliderCSS.sliderTrack} flex relative pa0 ma0`}
      style={{
        transition: isOnTouchMove
          ? undefined
          : `transform ${speed}ms ${timing}`,
        transitionDelay: `${delay}ms`,
        transform: `translate3d(${transform}px, 0, 0)`,
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className={`flex relative ${sliderCSS.slide}`}
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
          <div className="w-100">{child}</div>
        </div>
      ))}
    </div>
  )
}

export default SliderTrack
