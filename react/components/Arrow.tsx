import React, { memo, FC, ReactNode } from 'react'
import { IconCaret } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'

import { useSliderState, useSliderDispatch } from './SliderContext'
import { populateSlides } from '../utils/populateSlides'

import useKeyboardArrows from '../hooks/useKeyboardArrows'

interface Props {
  custom?: ReactNode
  orientation: 'left' | 'right'
  controls: string
  totalItems: number
  infinite: boolean
}

const CSS_HANDLES = ['sliderLeftArrow', 'sliderRightArrow', 'sliderArrows']

const Arrow: FC<Props> = ({
  custom,
  orientation,
  controls,
  totalItems,
  infinite,
}) => {
  const {
    currentSlide,
    slidesPerPage,
    slideWidth,
    navigationStep,
  } = useSliderState()
  const dispatch = useSliderDispatch()

  const handles = useCssHandles(CSS_HANDLES)

  const isLeftEndReach = !(
    currentSlide - (navigationStep ? navigationStep : 1) >=
    0
  )
  const isRightEndReach = !(currentSlide + 1 + slidesPerPage <= totalItems)
  const disabled =
    !infinite &&
    ((orientation === 'left' && isLeftEndReach) ||
      (orientation === 'right' && isRightEndReach))

  /** Populate next slider page */
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

  useKeyboardArrows(() => populate('left'), () => populate('right'))

  return (
    <button
      className={`${
        orientation === 'left'
          ? `${handles.sliderLeftArrow} left-1`
          : `${handles.sliderRightArrow} right-1`
      } ${
        handles.sliderArrows
      } absolute ma2 transparent flex items-center justify-center bn outline-0 pointer`}
      style={{ background: 'transparent' }}
      onClick={() => populate(orientation)}
      aria-controls={controls}
      aria-label={`${orientation === 'left' ? 'Previous' : 'Next'} Slide`}
      disabled={disabled}
    >
      {custom || <IconCaret size={25} orientation={orientation} thin />}
    </button>
  )
}

export default memo(Arrow)
