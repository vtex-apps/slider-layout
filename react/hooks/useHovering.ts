import { useState, useEffect } from 'react'

import {
  useSliderGroupState,
  useSliderGroupDispatch,
} from '../SliderLayoutGroup'

/**
 * Hook that returns the hover state of a passed ref
 * @param ref React ref
 */
const useHovering = (ref: React.RefObject<HTMLDivElement>) => {
  const [isHovering, setHovering] = useState(false)
  const groupState = useSliderGroupState()
  const groupDispatch = useSliderGroupDispatch()

  useEffect(() => {
    const onMouseEnter = () => {
      groupDispatch?.({ type: 'HOVER', payload: { isHovering: true } })

      setHovering(true)
    }

    const onMouseLeave = () => {
      groupDispatch?.({ type: 'HOVER', payload: { isHovering: false } })

      setHovering(false)
    }

    if (ref?.current) {
      ref.current.addEventListener('mouseenter', onMouseEnter)
      ref.current.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      const { current } = ref

      if (!current) {
        return
      }

      current.removeEventListener('mouseenter', onMouseEnter)
      current.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [ref, groupDispatch])

  if (groupState?.isHovering) {
    return { isHovering: true }
  }

  return { isHovering }
}

export default useHovering
