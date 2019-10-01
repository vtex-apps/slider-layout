import { useEffect, RefObject } from 'react'

import { useSliderDispatch, useSliderState } from '../components/SliderContext'

export const useScreenResize = (
  containerRef: RefObject<HTMLDivElement>,
  device: 'desktop' | 'tablet' | 'phone',
  infinite: boolean
) => {
  const {
    navigationStep,
    isPageNavigationStep,
    itemsPerPage,
  } = useSliderState()
  const dispatch = useSliderDispatch()

  useEffect(() => {
    const setNewState = (shouldCorrectItemPosition: boolean) => {
      if (containerRef && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const slideWidth: number = Math.round(
          containerWidth / itemsPerPage[device]
        )
        dispatch({
          type: 'LOAD_AND_CORRECT',
          payload: {
            slidesPerPage: itemsPerPage[device],
            deviceType: device,
            navigationStep: isPageNavigationStep
              ? itemsPerPage[device]
              : navigationStep,
            containerWidth,
            slideWidth,
            shouldCorrectItemPosition,
          },
        })
      } else {
        dispatch({
          type: 'LOAD',
          payload: {
            slidesToShow: itemsPerPage[device],
            deviceType: device,
            navigationStep: isPageNavigationStep
              ? itemsPerPage[device]
              : navigationStep,
          },
        })
      }
    }
    const onResize = (value?: UIEvent): void => {
      setNewState(!value || infinite)
    }
    setNewState(false)

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [
    device,
    containerRef,
    infinite,
    navigationStep,
    isPageNavigationStep,
    itemsPerPage,
  ])
}
