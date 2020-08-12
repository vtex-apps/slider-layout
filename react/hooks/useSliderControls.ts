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
    } else if (nextMaximumSlides < 0 && currentSlide !== 0) {
      /** Prevent over-slide */
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
    } else if (
      nextMaximumSlides > totalItems &&
      currentSlide !== totalItems - slidesPerPage
    ) {
      /** Prevent over-slide */
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
  }

  return { goForward, goBack }
}
