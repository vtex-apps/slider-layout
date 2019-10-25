import { useEffect } from 'react'
import { useSliderState, useSliderDispatch } from '../components/SliderContext'
import { populateSlides } from '../utils/populateSlides'
import useHovering from './useHovering'

export const useAutoplay = (
  infinite: boolean,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const {
    autoplay,
    currentSlide,
    slidesPerPage,
    slideWidth,
    totalItems,
    navigationStep,
  } = useSliderState()
  const dispatch = useSliderDispatch()
  const { isHovering } = useHovering(containerRef)

  const shouldStop = autoplay && autoplay.stopOnHover && isHovering

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

  useEffect(() => {
    if (!autoplay) {
      return
    }

    const timeout = setTimeout(() => {
      populate('right')
    }, autoplay.timeout)

    shouldStop && clearTimeout(timeout)

    return () => clearTimeout(timeout)
  }, [populate, shouldStop, autoplay])
}
