import React, { memo, FC } from 'react'

import { useContextCssHandles } from '../modules/cssHandles'
import { useSliderState } from './SliderContext'
import { useSliderControls } from '../hooks/useSliderControls'

const DOTS_DEFAULT_SIZE = 0.625

interface Props {
  controls: string
  totalItems: number
  infinite: boolean
}

export const CSS_HANDLES = ['paginationDotsContainer', 'paginationDot'] as const

const getSelectedDot = (
  passVisibleSlides: boolean,
  currentSlide: number,
  slidesToShow: number
): number => {
  const realCurrentSlide = passVisibleSlides
    ? currentSlide + (slidesToShow - 1)
    : currentSlide

  return passVisibleSlides
    ? Math.floor(realCurrentSlide / slidesToShow)
    : realCurrentSlide
}

const getSlideIndices = (
  slidesToShow: number,
  passVisibleSlides: boolean,
  totalItems: number
): number[] =>
  slidesToShow
    ? [
        ...Array(
          passVisibleSlides ? Math.ceil(totalItems / slidesToShow) : totalItems
        ).keys(),
      ]
    : []

const PaginationDots: FC<Props> = ({ controls, totalItems, infinite }) => {
  const { slidesPerPage, currentSlide, navigationStep } = useSliderState()
  const { goBack, goForward } = useSliderControls(infinite)
  const { handles, withModifiers } = useContextCssHandles()
  const passVisibleSlides = navigationStep === slidesPerPage

  const slideIndexes = getSlideIndices(
    slidesPerPage,
    passVisibleSlides,
    totalItems
  )

  const handleDotClick = (
    event: React.KeyboardEvent | React.MouseEvent,
    index: number
  ) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    // Considering that each pagination dot represents a page, pageDelta
    // represents how many pages did the user "skip" by clicking in the dot.
    const pageDelta =
      index - getSelectedDot(passVisibleSlides, currentSlide, slidesPerPage)

    const slidesToPass = Math.abs(pageDelta) * navigationStep

    pageDelta > 0 ? goForward(slidesToPass) : goBack(slidesToPass)
  }

  return (
    <div
      className={`${handles.paginationDotsContainer} flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
      role="group"
      aria-label="Slider pagination dots"
    >
      {slideIndexes.map(index => {
        const isActive =
          index ===
          getSelectedDot(passVisibleSlides, currentSlide, slidesPerPage)

        return (
          <div
            className={`${withModifiers(
              'paginationDot',
              isActive ? 'isActive' : ''
            )} ${
              isActive ? 'bg-emphasis' : 'bg-muted-3'
            } grow dib br-100 pa2 mr2 ml2 bw0 pointer outline-0`}
            style={{
              height: `${DOTS_DEFAULT_SIZE}rem`,
              width: `${DOTS_DEFAULT_SIZE}rem`,
            }}
            key={index}
            tabIndex={index}
            onKeyDown={event => handleDotClick(event, index)}
            onClick={event => handleDotClick(event, index)}
            role="button"
            aria-controls={controls}
            aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
            data-testid="paginationDot"
          />
        )
      })}
    </div>
  )
}

export default memo(PaginationDots)
