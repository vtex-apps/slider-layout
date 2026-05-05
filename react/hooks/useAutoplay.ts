import { useEffect } from 'react'

import { useSliderState } from '../components/SliderContext'
import { useSliderControls } from './useSliderControls'
import useHovering from './useHovering'

export const useAutoplay = (
  infinite: boolean,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const { autoplay } = useSliderState()
  const { isHovering } = useHovering(containerRef)

  const shouldStop = autoplay?.stopOnHover && isHovering

  const { goForward } = useSliderControls(infinite)

  useEffect(() => {
    if (!autoplay) {
      return
    }

    const timeout = setTimeout(() => {
      goForward()
    }, autoplay.timeout)

    if (shouldStop) clearTimeout(timeout)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') clearTimeout(timeout)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [goForward, shouldStop, autoplay])
}
