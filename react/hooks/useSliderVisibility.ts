import { useEffect, useRef } from 'react'

const isSlideVisible = ({
  index,
  currentSlide,
  slidesToShow,
  totalItems,
}: {
  index: number
  currentSlide: number
  slidesToShow: number
  totalItems: number
}): boolean => {
  const isClonedSlide = currentSlide < 0 || currentSlide >= totalItems

  return (
    (index >= currentSlide && index < currentSlide + slidesToShow) ||
    isClonedSlide
  )
}

export const useSliderVisibility = (
  currentSlide: number,
  slidesPerPage: number,
  totalItems: number
) => {
  /** Keeps track of slides that have been visualized before.
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
    isSlideVisible({
      index,
      currentSlide,
      slidesToShow: slidesPerPage,
      totalItems,
    })

  const shouldRenderItem = (index: number) => {
    return visitedSlides.current.has(index) || isItemVisible(index)
  }

  return { shouldRenderItem, isItemVisible }
}
