import { useEffect } from 'react'

import { useSliderDispatch, useSliderState } from '../components/SliderContext'

export const useScreenResize = (infinite: boolean, itemsPerPage: number) => {
  const { navigationStep, isPageNavigationStep, totalItems } = useSliderState()
  const dispatch = useSliderDispatch()

  useEffect(() => {
    const newSlidesPerPage =
      totalItems <= itemsPerPage ? totalItems : itemsPerPage

    const newNavigationStep = isPageNavigationStep
      ? newSlidesPerPage
      : navigationStep

    const setNewState = (shouldCorrectItemPosition: boolean) => {
      dispatch({
        type: 'ADJUST_ON_RESIZE',
        payload: {
          shouldCorrectItemPosition,
          slidesPerPage: newSlidesPerPage,
          navigationStep: newNavigationStep,
        },
      })
    }

    const onResize = (value?: UIEvent): void => {
      setNewState(!value || infinite)
    }

    setNewState(false)

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [
    infinite,
    dispatch,
    totalItems,
    itemsPerPage,
    isPageNavigationStep,
    navigationStep,
  ])
}
