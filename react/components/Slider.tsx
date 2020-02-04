import React, { FC, useRef, Fragment } from 'react'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'

import { useScreenResize } from '../hooks/useScreenResize'
import { useTouchHandlers } from '../hooks/useTouchHandlers'
import { useAutoplay } from '../hooks/useAutoplay'
import { useSliderState } from './SliderContext'
import SliderTrack from './SliderTrack'
import Arrow from './Arrow'
import PaginationDots from './PaginationDots'

interface Props extends SliderLayoutSiteEditorProps {
  totalItems: number
}

const CSS_HANDLES = ['sliderLayoutContainer', 'sliderTrackContainer'] as const

const Slider: FC<Props> = ({
  children,
  totalItems,
  infinite,
  showNavigationArrows,
  showPaginationDots,
  usePagination,
  arrowSize,
  fullWidth,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()
  const { label } = useSliderState()
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = `${label
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items`

  useAutoplay(infinite, containerRef)
  useScreenResize(infinite)
  const { onTouchEnd, onTouchStart, onTouchMove } = useTouchHandlers({
    totalItems,
    infinite,
  })

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
      style={{
        WebkitOverflowScrolling: !usePagination ? 'touch' : undefined,
        paddingLeft: fullWidth ? undefined : arrowSize * 2,
        paddingRight: fullWidth ? undefined : arrowSize * 2,
      }}
      className={`w-100 flex items-center relative ${handles.sliderLayoutContainer}`}
    >
      <div
        className={`w-100 ${handles.sliderTrackContainer} ${
          usePagination ? 'overflow-hidden' : 'overflow-x-scroll'
        }`}
        ref={containerRef}
      >
        <SliderTrack totalItems={totalItems}>{children}</SliderTrack>
      </div>
      {shouldShowArrows && usePagination && (
        <Fragment>
          <Arrow
            totalItems={totalItems}
            orientation="left"
            controls={controls}
            infinite={infinite}
            arrowSize={arrowSize}
          />
          <Arrow
            totalItems={totalItems}
            orientation="right"
            controls={controls}
            infinite={infinite}
            arrowSize={arrowSize}
          />
        </Fragment>
      )}
      {shouldShowPaginationDots && usePagination && (
        <PaginationDots totalItems={totalItems} controls={controls} />
      )}
    </section>
  )
}

export default Slider
