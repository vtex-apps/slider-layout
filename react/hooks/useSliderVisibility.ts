import { useEffect, useRef } from 'react'

import { SliderLayoutProps } from '../components/SliderContext'

const isSlideVisible = ({
  index,
  currentSlide,
  slidesToShow,
  totalItems,
  centerMode,
}: {
  index: number
  currentSlide: number
  slidesToShow: number
  totalItems: number
  centerMode: SliderLayoutProps['centerMode']
}): boolean => {
  const isClonedSlide = currentSlide < 0 || currentSlide >= totalItems
  let isVisible = index >= currentSlide && index < currentSlide + slidesToShow

  if (centerMode !== 'disabled') {
    isVisible =
      isVisible ||
      (index + 1 >= currentSlide && index + 1 < currentSlide + slidesToShow) ||
      (index - 1 >= currentSlide && index - 1 < currentSlide + slidesToShow)
  }

  return isVisible || isClonedSlide
}

export const useSliderVisibility = ({
  currentSlide,
  slidesPerPage,
  totalItems,
  centerMode,
}: {
  currentSlide: number
  slidesPerPage: number
  totalItems: number
  centerMode: SliderLayoutProps['centerMode']
}) => {
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
      centerMode,
    })

  const shouldRenderItem = (index: number) => {
    return visitedSlides.current.has(index) || isItemVisible(index)
  }

  return { shouldRenderItem, isItemVisible }
}
