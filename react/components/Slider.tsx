import React, { FC, useRef, Fragment, ReactNode } from 'react'
import { useDevice } from 'vtex.device-detector'

import { useScreenResize } from '../hooks/useScreenResize'
import { useTouchHandlers } from '../hooks/useTouchHandlers'
import { useAutoplay } from '../hooks/useAutoplay'
import {
  SliderLayoutProps,
  SliderLayoutSiteEditorProps,
  useSliderState,
} from './SliderContext'
import SliderTrack, {
  CSS_HANDLES as SliderTrackCssHandles,
} from './SliderTrack'
import Arrow, { CSS_HANDLES as ArrowCssHandles } from './Arrow'
import PaginationDots, {
  CSS_HANDLES as PaginationDotsCssHandles,
} from './PaginationDots'
import { useContextCssHandles } from '../modules/cssHandles'

interface Props extends SliderLayoutSiteEditorProps {
  arrowSize: number
  totalItems: number
  itemsPerPage: number
  centerMode: SliderLayoutProps['centerMode']
  // This type comes from React itself. It is the return type for
  // React.Children.toArray().
  children?: Array<Exclude<ReactNode, boolean | null | undefined>>
}

export const CSS_HANDLES = [
  'sliderLayoutContainer',
  'sliderTrackContainer',
  ...SliderTrackCssHandles,
  ...ArrowCssHandles,
  ...PaginationDotsCssHandles,
] as const

const Slider: FC<Props> = ({
  children,
  totalItems,
  infinite = false,
  showNavigationArrows,
  showPaginationDots,
  usePagination: shouldUsePagination = true,
  arrowSize,
  fullWidth,
  itemsPerPage,
  centerMode,
}) => {
  const { handles } = useContextCssHandles()
  const { isMobile } = useDevice()
  const { label = 'slider', slidesPerPage } = useSliderState()
  const containerRef = useRef<HTMLDivElement>(null)
  const { onTouchEnd, onTouchStart, onTouchMove } = useTouchHandlers({
    infinite,
    centerMode,
  })

  useAutoplay(infinite, containerRef)
  useScreenResize(infinite, itemsPerPage)

  const shouldBeStaticList = slidesPerPage >= totalItems

  const controls = `${label
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items`

  const shouldShowArrows = Boolean(
    (showNavigationArrows === 'always' ||
      (showNavigationArrows === 'mobileOnly' && isMobile) ||
      (showNavigationArrows === 'desktopOnly' && !isMobile)) &&
      !shouldBeStaticList
  )

  const shouldShowPaginationDots = Boolean(
    (showPaginationDots === 'always' ||
      (showPaginationDots === 'mobileOnly' && isMobile) ||
      (showPaginationDots === 'desktopOnly' && !isMobile)) &&
      !shouldBeStaticList
  )

  const touchStartHandler = (e: React.TouchEvent) =>
    shouldUsePagination && !shouldBeStaticList ? onTouchStart(e) : null

  const touchEndHandler = (e: React.TouchEvent) =>
    shouldUsePagination && !shouldBeStaticList ? onTouchEnd(e) : null

  const touchMoveHandler = (e: React.TouchEvent) =>
    shouldUsePagination && !shouldBeStaticList ? onTouchMove(e) : null

  return (
    <section
      onTouchStart={touchStartHandler}
      onTouchEnd={touchEndHandler}
      onTouchMove={touchMoveHandler}
      aria-label={label}
      style={{
        WebkitOverflowScrolling: !shouldUsePagination ? 'touch' : undefined,
        paddingLeft: fullWidth ? undefined : arrowSize * 2,
        paddingRight: fullWidth ? undefined : arrowSize * 2,
      }}
      className={`w-100 flex items-center relative ${handles.sliderLayoutContainer}`}
    >
      <div
        className={`w-100 ${handles.sliderTrackContainer} ${
          shouldUsePagination ? 'overflow-hidden' : 'overflow-x-scroll'
        }`}
        ref={containerRef}
      >
        <SliderTrack
          centerMode={centerMode}
          infinite={infinite}
          totalItems={totalItems}
          usePagination={shouldUsePagination}
        >
          {children}
        </SliderTrack>
      </div>
      {shouldShowArrows && shouldUsePagination && (
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
      {shouldShowPaginationDots && shouldUsePagination && (
        <PaginationDots
          totalItems={totalItems}
          controls={controls}
          infinite={infinite}
        />
      )}
    </section>
  )
}

export default Slider
