import React, { FC, Fragment } from 'react'
import { useSSR } from 'vtex.render-runtime'
import { useListContext } from 'vtex.list-context'
import { useCssHandles } from 'vtex.css-handles'

import { useSliderState } from './SliderContext'

const CSS_HANDLES = ['sliderTrack', 'slide', 'slideChildrenContainer']

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
  const handles = useCssHandles(CSS_HANDLES)
  const { list } = useListContext()

  const childrenArray = React.Children.toArray(children).concat(list)

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
            className={`flex relative ${handles.slide}`}
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
      className={`${handles.sliderTrack} flex relative pa0 ma0`}
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
          className={`flex relative ${handles.slide}`}
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
          <div className={`${handles.slideChildrenContainer} w-100`}>
            {child}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SliderTrack
