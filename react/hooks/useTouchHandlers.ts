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
  } = useSliderState()
  const [touchStartX, setTouchStartX] = useState(0)
  const SWIPE_THRESHOLD = 50

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
    setTouchStartX(startX)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const delta = endX - touchStartX
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) populate('left')
      if (delta < 0) populate('right')
    }
    setTouchStartX(0)
  }

  return { onTouchEnd, onTouchStart }
}
