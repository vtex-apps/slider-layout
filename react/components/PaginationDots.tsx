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

const getDotsCount = (
  slidesToShow: number,
  navigationStep: number,
  totalItems: number,
  infinite: boolean
): number => {
  const step = Math.max(1, navigationStep)

  // An infinite slider loops through every slide, so the last reachable
  // position is the last item. A finite one stops at the last full page.
  if (infinite) {
    return Math.ceil(totalItems / step)
  }

  return Math.ceil(Math.max(totalItems - slidesToShow, 0) / step) + 1
}

const getSelectedDot = (
  currentSlide: number,
  navigationStep: number,
  dotsCount: number
): number => {
  const step = Math.max(1, navigationStep)
  const selectedDot = Math.floor((currentSlide + step - 1) / step)

  // While the infinite loop is showing a cloned slide, currentSlide is outside
  // the range of real slides, so it has to be brought back into it.
  return Math.min(Math.max(selectedDot, 0), dotsCount - 1)
}

const getSlideIndices = (
  slidesToShow: number,
  navigationStep: number,
  totalItems: number,
  infinite: boolean
): number[] =>
  slidesToShow
    ? [
        ...Array(
          getDotsCount(slidesToShow, navigationStep, totalItems, infinite)
        ).keys(),
      ]
    : []

const PaginationDots: FC<Props> = ({ controls, totalItems, infinite }) => {
  const { slidesPerPage, currentSlide, navigationStep } = useSliderState()
  const { goBack, goForward } = useSliderControls(infinite)
  const { handles, withModifiers } = useContextCssHandles()

  const slideIndexes = getSlideIndices(
    slidesPerPage,
    navigationStep,
    totalItems,
    infinite
  )

  const selectedDot = getSelectedDot(
    currentSlide,
    navigationStep,
    slideIndexes.length
  )

  const handleDotClick = (
    event: React.KeyboardEvent | React.MouseEvent,
    index: number
  ) => {
    if (event) {
      event.stopPropagation()
      if ('key' in event) {
        // Only allow Enter and Space to trigger the click (#125)
        if (event.key !== 'Enter' && event.key !== ' ') {
          return
        }

        event.preventDefault()
      }
    }

    // Considering that each pagination dot represents a navigation step,
    // pageDelta represents how many steps did the user "skip" by clicking
    // in the dot.
    const pageDelta = index - selectedDot

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
        const isActive = index === selectedDot

        return (
          <div
            className={`${withModifiers(
              'paginationDot',
              isActive ? 'isActive' : ''
            )} ${
              isActive ? 'bg-emphasis' : 'bg-muted-3'
            } grow dib br-100 pa2 mr2 ml2 bw0 pointer`}
            style={{
              height: `${DOTS_DEFAULT_SIZE}rem`,
              width: `${DOTS_DEFAULT_SIZE}rem`,
            }}
            key={index}
            tabIndex={0}
            onKeyDown={event => handleDotClick(event, index)}
            onClick={event => handleDotClick(event, index)}
            role="button"
            aria-controls={controls}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
            data-testid="paginationDot"
          />
        )
      })}
    </div>
  )
}

export default memo(PaginationDots)
