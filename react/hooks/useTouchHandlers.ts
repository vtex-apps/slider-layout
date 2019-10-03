import { useState } from 'react'
import { useSliderDispatch, useSliderState } from '../components/SliderContext'
import { populateSlides } from '../utils/populateSlides'

export const useTouchHandlers = ({
  totalItems,
  infinite,
}: {
  totalItems: number
  infinite: boolean
}) => {
  const dispatch = useSliderDispatch()
  const {
    currentSlide,
    slidesPerPage,
    slideWidth,
    navigationStep,
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

    dispatch({
      type: 'TOUCH',
      payload: { transform: newTransform, isOnTouchMove: true },
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
        payload: {
          transform: touchState.touchInitialTransform,
          isOnTouchMove: false,
        },
      })
    }
    setTouchState({ touchStartX: 0, touchInitialTransform: transform })
    dispatch({
      type: 'TOUCH',
      payload: {
        isOnTouchMove: false,
      },
    })
  }

  return { onTouchEnd, onTouchStart, onTouchMove }
}
