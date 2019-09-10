import React, { FC, useRef, Fragment } from 'react'
import { useDevice } from 'vtex.device-detector'

import { useScreenResize } from '../hooks/useScreenResize'
import { useSliderState } from './SliderContext'
import SliderTrack from './SliderTrack'
import SlideList from './SlideList'
import Arrow from './Arrow'
import PaginationDots from './Dots'

import sliderCSS from './slider.css'

interface Props {
  label?: string
  showNavigationArrows: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  infinite: boolean
  showPaginationDots: 'visible' | 'hidden' | 'desktopOnly' | 'mobileOnly'
  slideTransition?: {
    /** Transition speed in ms */
    speed: number
    /** Transition delay in ms */
    delay: number
    timing: string
  }
  autoplay?: {
    /** Timeout duration in ms */
    timeout: number
    stopOnHover?: boolean
  }
  navigationStep: number | 'page'
  usePaginationOnDrag: boolean
  itemsPerPage: {
    desktop: number
    tablet: number
    phone: number
  }
}

const Slider: FC<Props> = ({
  label = 'slider',
  children,
  showNavigationArrows,
  showPaginationDots,
  infinite,
  navigationStep,
  slideTransition = {
    speed: 400,
    delay: 0,
    timing: 'ease-in-out',
  },
  itemsPerPage = {
    desktop: 5,
    tablet: 3,
    phone: 1,
  },
}) => {
  const { isMobile } = useDevice()
  const sliderState = useSliderState()
  const containerRef = useRef<HTMLDivElement>(null)
  const totalItems = React.Children.count(children)
  const controls = `${label
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items`

  const shouldShowArrows = !!(
    showNavigationArrows === 'always' ||
    (showNavigationArrows === 'mobileOnly' && isMobile) ||
    (showNavigationArrows === 'desktopOnly' && !isMobile)
  )
  const shouldShowPaginationDots = !!(
    showPaginationDots === 'visible' ||
    (showPaginationDots === 'mobileOnly' && isMobile) ||
    (showPaginationDots === 'desktopOnly' && !isMobile)
  )
  const resolvedNavigationStep =
    navigationStep === 'page' ? sliderState.slidesPerPage : navigationStep

  useScreenResize(containerRef, itemsPerPage)

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={`w-100 flex items-center relative overflow-hidden ${sliderCSS.container ||
        ''}`}
      ref={containerRef}
    >
      <SliderTrack slideTransition={slideTransition}>
        <SlideList totalItems={totalItems}>{children}</SlideList>
      </SliderTrack>
      {shouldShowArrows && (
        <Fragment>
          <Arrow
            orientation="left"
            label={label}
            infinite={infinite}
            totalItems={totalItems}
            navigationStep={resolvedNavigationStep}
          />
          <Arrow
            orientation="right"
            label={label}
            infinite={infinite}
            totalItems={totalItems}
            navigationStep={resolvedNavigationStep}
          />
        </Fragment>
      )}
      {shouldShowPaginationDots && (
        <PaginationDots
          navigationStep={resolvedNavigationStep}
          totalItems={totalItems}
          controls={controls}
        />
      )}
    </section>
  )
}

export default Slider
