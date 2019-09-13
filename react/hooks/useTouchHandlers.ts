import { useState } from 'react'
import { useSliderDispatch, useSliderState } from '../components/SliderContext'
import { populateSlides } from '../utils/populateSlides'

export const useTouchHandlers = () => {
  const dispatch = useSliderDispatch()
  const {
    currentSlide,
    slidesPerPage,
    slideWidth,
    totalItems,
    navigationStep,
    infinite,
    transform,
  } = useSliderState()
  const [touchState, setTouchState] = useState({
    touchStartX: 0,
    touchInitialTransform: 0,
  })
  const SWIPE_THRESHOLD = 75

  const populate = (direction: 'left' | 'right') => {
    const { nextSlides, nextPosition } = populateSlides(
      direction,
      currentSlide,
      slidesPerPage,
      slideWidth,
      totalItems,
      navigationStep,
      infinite
    )
    dispatch({
      type: 'SLIDE',
      payload: {
        transform: nextPosition || 0,
        currentSlide: nextSlides || 0,
      },
    })
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX
    setTouchState({ touchStartX: startX, touchInitialTransform: transform })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX

    const newTransform =
      touchState.touchInitialTransform + (currentX - touchState.touchStartX)

    const transformDelta = Math.abs(
      newTransform - touchState.touchInitialTransform
    )

    if (transformDelta >= 0.95 * slideWidth) return

    dispatch({
      type: 'TOUCH',
      payload: { transform: newTransform },
    })
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const delta = endX - touchState.touchStartX
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) populate('left')
      if (delta < 0) populate('right')
    } else {
      dispatch({
        type: 'TOUCH',
        payload: { transform: touchState.touchInitialTransform },
      })
    }
    setTouchState({ touchStartX: 0, touchInitialTransform: transform })
  }

  return { onTouchEnd, onTouchStart, onTouchMove }
}
