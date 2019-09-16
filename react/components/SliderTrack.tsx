import React, {
  FC,
  useState,
  useLayoutEffect,
  useRef,
  ReactElement,
  Fragment,
} from 'react'
import { useSSR } from 'vtex.render-runtime'

import { useSliderState } from './SliderContext'
import Slide from './Slide'
import sliderCSS from './slider.css'

const SliderTrack: FC = ({ children }) => {
  const {
    transform,
    isOnTouchMove,
    slidesPerPage,
    currentSlide,
    totalItems,
    slideTransition: { speed, timing, delay },
  } = useSliderState()
  const isSSR = useSSR()

  const childrenArray = React.Children.toArray(children)

  const [isSliderReady, setIsSliderReady] = useState(false)
  const [componentsToRender, setComponentsToRender] = useState(new Array())
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const { current } = trackRef
    let components: ReactElement[] = []

    if (current && !isSliderReady) {
      current.childNodes.forEach((val, index) => {
        const componentToRender: ReactElement = (
          <Slide node={val} index={index} />
        )
        components.push(componentToRender)
      })
    }

    setIsSliderReady(true)
    setComponentsToRender(components)
  }, [])

  const isSlideVisibile = (
    index: number,
    currentSlide: number,
    slidesToShow: number
  ): boolean => {
    return index >= currentSlide && index < currentSlide + slidesToShow
  }

  if (isSSR) {
    const slideWidthPercentage = 100 / slidesPerPage

    return (
      <Fragment>
        {childrenArray.slice(0, slidesPerPage).map((child, index) => (
          <div
            key={index}
            className={`flex relative ${sliderCSS.slide}`}
            data-index={index}
            style={{
              width: `${slideWidthPercentage}%`,
            }}
            aria-hidden={
              isSlideVisibile(index, currentSlide, slidesPerPage)
                ? 'false'
                : 'true'
            }
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${totalItems}`}
          >
            <div className="w-100">{child}</div>
          </div>
        ))}
      </Fragment>
    )
  }

  return (
    <div
      className={`${sliderCSS.sliderTrack} flex relative pa0 ma0`}
      ref={trackRef}
      style={{
        transition: isOnTouchMove
          ? undefined
          : `transform ${speed}ms ${timing}`,
        transitionDelay: `${delay}ms`,
        transform: `translate3d(${transform}px, 0, 0)`,
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {!isSliderReady
        ? children
        : componentsToRender.map(element => <Fragment>{element}</Fragment>)}
    </div>
  )
}

export default SliderTrack
