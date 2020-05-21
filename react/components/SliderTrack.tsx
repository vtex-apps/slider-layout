import React, { FC, useEffect, useRef } from 'react'
import { useListContext } from 'vtex.list-context'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import { useSliderState } from './SliderContext'

const CSS_HANDLES = [
  'sliderTrack',
  'slide',
  'slideChildrenContainer',
]

const isSlideVisible = (
  index: number,
  currentSlide: number,
  slidesToShow: number
): boolean => {
  return index >= currentSlide && index < currentSlide + slidesToShow
}

const getFirstOrLastVisible = (slidesPerPage: number, index: number) => {
  if (index % slidesPerPage === 0) {
    return 'firstVisible'
  }
  
  if ((index + 1) % slidesPerPage === 0) {
    return 'lastVisible'
  }
  
  return ''
}

const useSliderVisibility = (currentSlide: number, slidesPerPage: number) => {
  /** Keeps track of slides that have been visualised before.
   * We want to keep rendering them because the issue is mostly rendering
   * slides that might never be viewed; On the other hand, hiding slides
   * that were visible causes visual glitches */
  const visitedSlides = useRef<Set<number>>(new Set())

  useEffect(() => {
    for (let i = 0; i < slidesPerPage; i++) {
      visitedSlides.current.add(currentSlide + i)
    }
  }, [currentSlide, slidesPerPage])

  const isItemVisible = (index: number) =>
    isSlideVisible(index, currentSlide, slidesPerPage)

  const shouldRenderItem = (index: number) => {
    return visitedSlides.current.has(index) || isItemVisible(index)
  }

  return { shouldRenderItem, isItemVisible }
}

const SliderTrack: FC<{ totalItems: number }> = ({ children, totalItems }) => {
  const {
    transform,
    slideWidth,
    slidesPerPage,
    currentSlide,
    isOnTouchMove,
    slideTransition: { speed, timing, delay },
  } = useSliderState()
  const handles = useCssHandles(CSS_HANDLES)

  const { shouldRenderItem, isItemVisible } = useSliderVisibility(
    currentSlide,
    slidesPerPage
  )

  const { list } = useListContext()

  const childrenArray = React.Children.toArray(children).concat(list)

  return (
    <div
      className={`${handles.sliderTrack} flex justify-around relative pa0 ma0`}
      style={{
        transition: isOnTouchMove
          ? undefined
          : `transform ${speed}ms ${timing}`,
        transitionDelay: `${delay}ms`,
        transform: `translate3d(${transform}%, 0, 0)`,
        width:
          slidesPerPage < totalItems
            ? `${(totalItems * 100) / slidesPerPage}%`
            : '100%',
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {childrenArray.map((child, index) => {
        return (
          <div
            key={index}
            className={`${applyModifiers(
              handles.slide,
              getFirstOrLastVisible(slidesPerPage, index)
            )} flex relative`}
            data-index={index}
            style={{
              width: `${slideWidth}%`,
            }}
            aria-hidden={isItemVisible(index) ? 'false' : 'true'}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${totalItems}`}
          >
            <div
              className={`${handles.slideChildrenContainer} flex justify-center items-center w-100`}
            >
              {shouldRenderItem(index) ? child : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SliderTrack
