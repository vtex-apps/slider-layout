import React, { cloneElement, FC, ReactElement, ReactNode } from 'react'

import {
  useSliderState,
  useSliderDispatch,
  SliderLayoutProps,
} from './SliderContext'
import { useSliderGroupDispatch } from '../SliderLayoutGroup'
import { useSliderVisibility } from '../hooks/useSliderVisibility'
import { useContextCssHandles } from '../modules/cssHandles'

export const CSS_HANDLES = [
  'sliderTrack',
  'slide',
  'slideChildrenContainer',
] as const

interface Props {
  totalItems: number
  infinite: boolean
  usePagination: boolean
  centerMode: SliderLayoutProps['centerMode']
  centerModeSlidesGap?: SliderLayoutProps['centerModeSlidesGap']
  // This type comes from React itself. It is the return type for
  // React.Children.toArray().
  children?: Array<Exclude<ReactNode, boolean | null | undefined>>
}

const resolveAriaAttributes = (
  visible: boolean,
  index: number,
  totalItems: number
) => {
  if (index < 0 || index >= totalItems) {
    return {
      'aria-hidden': !visible,
      role: 'none presentation',
    }
  }

  return {
    'aria-hidden': !visible,
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${index + 1} of ${totalItems}`,
  }
}

const getFirstOrLastVisible = (slidesPerPage: number, index: number) => {
  // every multiple of the number of slidesPerPage is a first (e.g. 0,3,6 if slidesPerPage is 3)
  if (index % slidesPerPage === 0) {
    return 'firstVisible'
  }

  // every slide before  the multiple of the number of slidesPerPage is a last (e.g. 2,5,8 if slidesPerPage is 3)
  if ((index + 1) % slidesPerPage === 0) {
    return 'lastVisible'
  }

  return ''
}

const removeAnalyticsProperties = (children: ReactElement[]) => {
  return React.Children.toArray(
    React.Children.map(children, child =>
      typeof child === 'string' || typeof child === 'number'
        ? child
        : cloneElement(child, {
            ...child.props,
            // Tells the component it is being duplicated. Each component should handle it
            __isDuplicated: true,
          })
    )
  )
}

const SliderTrack: FC<Props> = ({
  infinite,
  usePagination,
  centerMode,
  centerModeSlidesGap,
  totalItems,
  children,
}) => {
  const {
    slideWidth,
    slidesPerPage,
    currentSlide,
    isOnTouchMove,
    useSlidingTransitionEffect,
    slideTransition: { speed, timing, delay },
    transformMap,
    transform,
  } = useSliderState()

  const dispatch = useSliderDispatch()
  const groupDispatch = useSliderGroupDispatch()
  const { handles, withModifiers } = useContextCssHandles()

  const { shouldRenderItem, isItemVisible } = useSliderVisibility({
    currentSlide,
    slidesPerPage,
    totalItems,
    centerMode,
  })

  const postRenderedSlides =
    infinite && children
      ? removeAnalyticsProperties(children as ReactElement[]).slice(
          0,
          slidesPerPage
        )
      : []

  const preRenderedSlides =
    infinite && children
      ? removeAnalyticsProperties(children as ReactElement[]).slice(
          children.length - slidesPerPage
        )
      : []

  const slides = preRenderedSlides.concat(children ?? [], postRenderedSlides)

  const trackWidth =
    slidesPerPage <= totalItems
      ? `${(slides.length * 100) / slidesPerPage}%`
      : '100%'

  return (
    <div
      data-testid="slider-track"
      className={`${handles.sliderTrack} flex ${
        centerMode !== 'disabled' ? '' : 'justify-around'
      } relative pa0 ma0`}
      style={{
        transition:
          isOnTouchMove || !useSlidingTransitionEffect
            ? undefined
            : `transform ${speed}ms ${timing} ${delay}ms`,
        transform: `translate3d(${
          isOnTouchMove ? transform : transformMap[currentSlide]
        }%, 0, 0)`,
        width: trackWidth,
      }}
      onTransitionEnd={() => {
        dispatch({ type: 'DISABLE_TRANSITION' })

        if (currentSlide >= totalItems) {
          dispatch({
            type: 'ADJUST_CURRENT_SLIDE',
            payload: {
              currentSlide: 0,
              transform: transformMap[0],
            },
          })
          groupDispatch?.({
            type: 'SLIDE',
            payload: {
              currentSlide: 0,
              transform: transformMap[0],
            },
          })
        }

        if (currentSlide < 0) {
          dispatch({
            type: 'ADJUST_CURRENT_SLIDE',
            payload: {
              currentSlide: currentSlide + totalItems,
              transform: transformMap[currentSlide + totalItems],
            },
          })
          groupDispatch?.({
            type: 'SLIDE',
            payload: {
              currentSlide: currentSlide + totalItems,
              transform: transformMap[currentSlide + totalItems],
            },
          })
        }
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {slides.map((child, index) => {
        // This is to take into account that there is a clone of the last page
        // in the left, to enable the infinite loop effect in case infinite
        // is set to true.
        const adjustedIndex = index - (infinite ? slidesPerPage : 0)
        const slideContainerStyles = {
          width: `${slideWidth}%`,
          marginLeft:
            centerMode !== 'disabled' && !centerModeSlidesGap
              ? `${slideWidth / (8 * slidesPerPage)}%`
              : undefined,
          marginRight:
            centerMode !== 'disabled' && !centerModeSlidesGap
              ? `${slideWidth / (8 * slidesPerPage)}%`
              : undefined,
          paddingLeft:
            centerMode !== 'disabled' && centerModeSlidesGap
              ? centerModeSlidesGap / 2
              : undefined,
          paddingRight:
            centerMode !== 'disabled' && centerModeSlidesGap
              ? centerModeSlidesGap / 2
              : undefined,
        }

        return (
          <div
            key={adjustedIndex}
            {...resolveAriaAttributes(
              isItemVisible(adjustedIndex),
              adjustedIndex,
              totalItems
            )}
            className={`${withModifiers('slide', [
              getFirstOrLastVisible(slidesPerPage, adjustedIndex),
              isItemVisible(adjustedIndex) ? 'visible' : 'hidden',
            ])} flex relative`}
            data-index={
              adjustedIndex >= 0 && adjustedIndex < totalItems
                ? adjustedIndex + 1
                : undefined
            }
            style={slideContainerStyles}
          >
            <div
              className={`${handles.slideChildrenContainer} flex justify-center items-center w-100`}
            >
              {!usePagination || shouldRenderItem(adjustedIndex) ? child : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SliderTrack
