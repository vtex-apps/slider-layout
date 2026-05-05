import { useCallback } from 'react'

import { useSliderDispatch, useSliderState } from '../components/SliderContext'
import { useSliderGroupDispatch } from '../SliderLayoutGroup'

export const useSliderControls = (infinite: boolean) => {
  const {
    currentSlide,
    slidesPerPage,
    totalItems,
    navigationStep,
    transformMap,
  } = useSliderState()

  const dispatch = useSliderDispatch()
  const groupDispatch = useSliderGroupDispatch()

  const goBack = useCallback(
    (step?: number) => {
      let nextSlide = 0
      let nextTransformValue = 0
      const activeNavigationStep = step ?? navigationStep

      const nextMaximumSlides = currentSlide - activeNavigationStep

      if (nextMaximumSlides >= 0) {
        nextSlide = nextMaximumSlides
        nextTransformValue = transformMap[nextSlide]
      } else if (currentSlide !== 0) {
        nextSlide = 0
        nextTransformValue = 0
      } else if (infinite) {
        nextSlide = nextMaximumSlides
        nextTransformValue = transformMap[nextSlide]
      }

      if (groupDispatch) {
        groupDispatch({
          type: 'SLIDE',
          payload: {
            currentSlide: nextSlide,
            transform: nextTransformValue,
          },
        })
      }

      dispatch({
        type: 'SLIDE',
        payload: {
          transform: nextTransformValue,
          currentSlide: nextSlide,
        },
      })
    },
    [
      currentSlide,
      navigationStep,
      slidesPerPage,
      totalItems,
      transformMap,
      dispatch,
      groupDispatch,
      infinite,
    ]
  )

  const goForward = useCallback(
    (step?: number) => {
      let nextSlide = 0
      let nextTransformValue = 0
      const activeNavigationStep = step ?? navigationStep

      const nextMaximumSlides =
        currentSlide + 1 + slidesPerPage + activeNavigationStep

      if (nextMaximumSlides <= totalItems) {
        nextSlide = currentSlide + activeNavigationStep
        nextTransformValue = transformMap[nextSlide]
      } else if (!infinite || currentSlide < totalItems - slidesPerPage) {
        nextSlide = totalItems - slidesPerPage
        nextTransformValue = transformMap[nextSlide]
      } else if (infinite) {
        nextSlide = currentSlide + activeNavigationStep
        nextTransformValue = transformMap[nextSlide]
      }

      if (groupDispatch) {
        groupDispatch({
          type: 'SLIDE',
          payload: {
            currentSlide: nextSlide,
            transform: nextTransformValue,
          },
        })
      }

      dispatch({
        type: 'SLIDE',
        payload: {
          transform: nextTransformValue,
          currentSlide: nextSlide,
        },
      })
    },
    [
      currentSlide,
      navigationStep,
      slidesPerPage,
      totalItems,
      transformMap,
      dispatch,
      groupDispatch,
      infinite,
    ]
  )

  return { goForward, goBack }
}
