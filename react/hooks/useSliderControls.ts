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

  const goBack = (step?: number) => {
    let nextSlide = 0
    let nextTransformValue = 0
    const activeNavigationStep = step ?? navigationStep

    const nextMaximumSlides = currentSlide - activeNavigationStep

    if (nextMaximumSlides >= 0) {
      /** Have more slides hidden on left */
      nextSlide = nextMaximumSlides
      nextTransformValue = transformMap[nextSlide]
    } else if (currentSlide !== 0) {
      /** Prevent over-slide */
      nextSlide = 0
      nextTransformValue = 0
    } else if (infinite) {
      /** Have more slides hidden on left. The cloned page of an infinite
       * slider is the first entry of transformMap, so going further back
       * than that would leave the slider without a transform value. */
      nextSlide = Math.max(nextMaximumSlides, -slidesPerPage)
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
  }

  const goForward = (step?: number) => {
    let nextSlide = 0
    let nextTransformValue = 0
    const activeNavigationStep = step ?? navigationStep

    const nextMaximumSlides =
      currentSlide + 1 + slidesPerPage + activeNavigationStep

    if (nextMaximumSlides <= totalItems) {
      /** There are some slides hidden on the right */
      nextSlide = currentSlide + activeNavigationStep
      nextTransformValue = transformMap[nextSlide]
    } else if (!infinite || currentSlide < totalItems - slidesPerPage) {
      /** Prevent over-slide */
      nextSlide = totalItems - slidesPerPage
      nextTransformValue = transformMap[nextSlide]
    } else if (infinite) {
      /** The cloned first page is the last entry of transformMap, so going
       * further forward than that would leave the slider without a transform
       * value until the loop is corrected on the transition end. */
      nextSlide = Math.min(currentSlide + activeNavigationStep, totalItems)
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
  }

  return { goForward, goBack }
}
