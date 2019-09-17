import React, { FC, useRef, Fragment } from 'react'
import { useDevice } from 'vtex.device-detector'

import { useScreenResize } from '../hooks/useScreenResize'
import { useTouchHandlers } from '../hooks/useTouchHandlers'
import { useSliderState } from './SliderContext'
import SliderTrack from './SliderTrack'
import Arrow from './Arrow'
import PaginationDots from './PaginationDots'

import sliderCSS from './slider.css'

const Slider: FC = ({ children }) => {
  const { isMobile, device } = useDevice()
  const {
    showNavigationArrows,
    showPaginationDots,
    usePagination,
    label,
  } = useSliderState()
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = `${label
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items`

  useScreenResize(containerRef, device)
  const { onTouchEnd, onTouchStart, onTouchMove } = useTouchHandlers()

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
      onTouchStart={e => (usePagination ? onTouchStart(e) : null)}
      onTouchEnd={e => (usePagination ? onTouchEnd(e) : null)}
      onTouchMove={e => (usePagination ? onTouchMove(e) : null)}
      aria-roledescription="carousel"
      aria-label={label}
      style={{ WebkitOverflowScrolling: !usePagination ? 'touch' : undefined }}
      className={`w-100 flex items-center relative ${
        usePagination ? 'overflow-hidden' : 'overflow-x-scroll'
      } ${sliderCSS.layoutContainer}`}
      ref={containerRef}
    >
      <SliderTrack>{children}</SliderTrack>
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
