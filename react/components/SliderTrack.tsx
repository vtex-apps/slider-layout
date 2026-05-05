import React, { cloneElement, FC, ReactElement, ReactNode } from 'react'
import { useIntl } from 'react-intl'

import {
  useSliderState,
  useSliderDispatch,
  SliderLayoutProps,
} from './SliderContext'
import { useSliderGroupDispatch } from '../SliderLayoutGroup'
import { useSliderVisibility } from '../hooks/useSliderVisibility'
import { useContextCssHandles } from '../modules/cssHandles'

export const CSS_HANDLES = ['sliderTrack', 'slide'] as const

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

interface ResolveAriaAttributesProps {
  visible: boolean
  index: number
  totalItems: number
  intl: any
}

const resolveAriaAttributes = ({
  visible,
  index,
  totalItems,
  intl,
}: ResolveAriaAttributesProps) => {
  if (index < 0 || index >= totalItems) {
    return {
      'aria-hidden': true,
      'data-noindex': true,
      role: 'none presentation',
    }
  }

  return {
    'aria-hidden': !visible,
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${intl.formatMessage(
      { id: 'store/slider-layout.sliderTrack.aria-label' },
      { slide: index + 1, total: totalItems }
    )}`,
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
  const intl = useIntl()
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
    <ul
      data-testid="slider-track"
      data-slider-track
      className={`${handles.sliderTrack} flex ${
        centerMode !== 'disabled' ? '' : 'justify-around'
      } relative pa0 ma0 list`}
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
        const adjustedIndex = index - (infinite ? slidesPerPage : 0)
        const isClone = adjustedIndex < 0 || adjustedIndex >= totalItems
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
          <li
            key={adjustedIndex}
            {...resolveAriaAttributes({
              visible: isItemVisible(adjustedIndex),
              index: adjustedIndex,
              totalItems,
              intl,
            })}
            className={`${withModifiers('slide', [
              getFirstOrLastVisible(slidesPerPage, adjustedIndex),
              isItemVisible(adjustedIndex) ? 'visible' : 'hidden',
            ])} flex relative`}
            data-index={
              !isClone ? adjustedIndex + 1 : undefined
            }
            itemProp={!isClone ? 'itemListElement' : undefined}
            itemScope={!isClone ? true : undefined}
            itemType={
              !isClone ? 'https://schema.org/ListItem' : undefined
            }
            style={slideContainerStyles}
          >
            {!isClone && (
              <meta itemProp="position" content={String(adjustedIndex + 1)} />
            )}
            {!usePagination || shouldRenderItem(adjustedIndex) ? child : null}
          </li>
        )
      })}
    </ul>
  )
}

export default SliderTrack
