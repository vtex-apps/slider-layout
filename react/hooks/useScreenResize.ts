import { useEffect, useRef } from 'react'

import { useSliderDispatch, useSliderState } from '../components/SliderContext'

export const useScreenResize = (infinite: boolean, itemsPerPage: number) => {
  const { navigationStep, isPageNavigationStep, totalItems } = useSliderState()
  const dispatch = useSliderDispatch()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

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

    const onResize = (): void => {
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => setNewState(infinite), 100)
    }

    setNewState(false)

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(debounceRef.current)
    }
  }, [
    infinite,
    dispatch,
    totalItems,
    itemsPerPage,
    isPageNavigationStep,
    navigationStep,
  ])
}
