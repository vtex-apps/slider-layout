import { useEffect, RefObject } from 'react'
import { useDevice } from 'vtex.device-detector'
import { useSliderDispatch } from '../components/SliderContext'

export const useScreenResize = (
  containerRef: RefObject<HTMLDivElement>,
  infinite: boolean,
  itemsPerPage: {
    desktop: number
    tablet: number
    phone: number
  }
) => {
  const { device } = useDevice()
  const dispatch = useSliderDispatch()

  useEffect(() => {
    const setNewState = (shouldCorrectItemPosition: boolean) => {
      if (containerRef && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const slideWidth: number = Math.round(
          containerWidth / itemsPerPage[device]
        )
        dispatch({
          type: 'loadAndCorrect',
          payload: {
            slidesPerPage: itemsPerPage[device],
            deviceType: device,
            containerWidth,
            slideWidth,
            shouldCorrectItemPosition,
          },
        })
      } else {
        dispatch({
          type: 'load',
          payload: {
            slidesToShow: itemsPerPage[device],
            deviceType: device,
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
  }, [device, itemsPerPage])
}
