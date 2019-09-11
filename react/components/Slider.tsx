import React, { FC, useRef, Fragment, useEffect } from 'react'
import { useDevice } from 'vtex.device-detector'

import { useScreenResize } from '../hooks/useScreenResize'
import { useTouchHandlers } from '../hooks/useTouchHandlers'
import { useSliderState, useSliderDispatch } from './SliderContext'
import SliderTrack from './SliderTrack'
import SlideList from './SlideList'
import Arrow from './Arrow'
import PaginationDots from './PaginationDots'

import sliderCSS from './slider.css'

const Slider: FC<SliderLayoutProps> = ({
  label = 'slider',
  children,
  showNavigationArrows = 'always',
  showPaginationDots = 'always',
  infinite,
  navigationStep,
  usePagination = true,
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
  const { slidesPerPage } = useSliderState()
  const resolvedNavigationStep =
    navigationStep === 'page' ? slidesPerPage : navigationStep
  const dispatch = useSliderDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const totalItems = React.Children.count(children)
  const controls = `${label
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items`

  useEffect(() => {
    dispatch({
      type: 'setInitialStateFromProps',
      payload: { totalItems, infinite, navigationStep: resolvedNavigationStep },
    })
  }, [resolvedNavigationStep])
  useScreenResize(containerRef, infinite, itemsPerPage)
  const { onTouchEnd, onTouchStart } = useTouchHandlers()

  const shouldShowArrows = !!(
    showNavigationArrows === 'always' ||
    (showNavigationArrows === 'mobileOnly' && isMobile) ||
    (showNavigationArrows === 'desktopOnly' && !isMobile)
  )
  const shouldShowPaginationDots = !!(
    showPaginationDots === 'always' ||
    (showPaginationDots === 'mobileOnly' && isMobile) ||
    (showPaginationDots === 'desktopOnly' && !isMobile)
  )

  return (
    <section
      onTouchStart={e => onTouchStart(e)}
      onTouchEnd={e => onTouchEnd(e)}
      aria-roledescription="carousel"
      aria-label={label}
      className={`w-100 flex items-center relative ${
        usePagination ? 'overflow-hidden' : 'overflow-x-scroll'
      } ${sliderCSS.container || ''}`}
      ref={containerRef}
    >
      <SliderTrack slideTransition={slideTransition}>
        <SlideList>{children}</SlideList>
      </SliderTrack>
      {shouldShowArrows && usePagination && (
        <Fragment>
          <Arrow orientation="left" controls={controls} />
          <Arrow orientation="right" controls={controls} />
        </Fragment>
      )}
      {shouldShowPaginationDots && usePagination && (
        <PaginationDots controls={controls} />
      )}
    </section>
  )
}

export default Slider
