import React, {
  createContext,
  useReducer,
  useContext,
  FC,
  ReactNode,
  useMemo,
  useState,
} from 'react'

import { useSliderGroupState } from '../SliderLayoutGroup'

interface AdjustOnResizeAction {
  type: 'ADJUST_ON_RESIZE'
  payload: {
    shouldCorrectItemPosition: boolean
    slidesPerPage: number
    navigationStep: number
  }
}

interface SlideAction {
  type: 'SLIDE'
  payload: {
    transform?: number
    currentSlide: number
  }
}

interface TouchAction {
  type: 'TOUCH'
  payload: {
    transform?: number
    isOnTouchMove: boolean
  }
}

interface DisableTransitionAction {
  type: 'DISABLE_TRANSITION'
}

interface AdjustCurrentSlideAction {
  type: 'ADJUST_CURRENT_SLIDE'
  payload: {
    currentSlide: number
    transform?: number
  }
}

interface SyncSliderGroupAction {
  type: 'SYNC_SLIDER_GROUP'
  payload: {
    currentSlide: number
    transform?: number
  }
}

interface AdjustContextValuesAction {
  type: 'ADJUST_CONTEXT_VALUES'
  payload: {
    transformMap: State['transformMap']
    slideWidth: State['slideWidth']
    newSlides: State['slides']
    slidesPerPage: State['slidesPerPage']
    transform: State['transform']
    navigationStep: State['navigationStep']
    totalItems: State['totalItems']
  }
}

interface State extends Partial<SliderLayoutProps> {
  /** Width of each slide */
  slideWidth: number
  /** Number of slides to show per page */
  slidesPerPage: number
  /** Index of the leftmost slide of the current page */
  currentSlide: number
  /** Current transform value */
  transform: number
  /** Total number of slides */
  totalItems: number
  /** Number of slides to slide in navigation */
  navigationStep: number
  /** Whether or not navigationStep prop is set to 'page' */
  isPageNavigationStep: boolean
  /** Whether or not a touchmove event is happening */
  isOnTouchMove: boolean
  useSlidingTransitionEffect: boolean
  transformMap: Record<number, number>
  slides: Array<Exclude<ReactNode, boolean | null | undefined>>
  slideTransition: Exclude<SliderLayoutProps['slideTransition'], undefined>
}

interface SliderContextProps extends SliderLayoutProps {
  totalItems: number
  infinite: SliderLayoutSiteEditorProps['infinite']
  // This type comes from React itself. It is the return type for
  // React.Children.toArray().
  slides: Array<Exclude<ReactNode, boolean | null | undefined>>
}

type Action =
  | AdjustOnResizeAction
  | SlideAction
  | TouchAction
  | DisableTransitionAction
  | AdjustCurrentSlideAction
  | AdjustContextValuesAction
  | SyncSliderGroupAction
type Dispatch = (action: Action) => void

const SliderStateContext = createContext<State | undefined>(undefined)
const SliderDispatchContext = createContext<Dispatch | undefined>(undefined)

function sliderContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADJUST_ON_RESIZE':
      return {
        ...state,
        slidesPerPage: action.payload.slidesPerPage,
        navigationStep: action.payload.navigationStep,
        transform: action.payload.shouldCorrectItemPosition
          ? state.transformMap[state.currentSlide]
          : state.transform,
      }

    case 'SLIDE':
      return {
        ...state,
        transform: action.payload.transform ?? state.transform,
        currentSlide: action.payload.currentSlide,
        useSlidingTransitionEffect: true,
      }

    case 'TOUCH':
      return {
        ...state,
        transform: action.payload.transform ?? state.transform,
        isOnTouchMove: action.payload.isOnTouchMove,
      }

    case 'DISABLE_TRANSITION':
      return {
        ...state,
        useSlidingTransitionEffect: false,
      }

    case 'ADJUST_CURRENT_SLIDE':
      return {
        ...state,
        currentSlide: action.payload.currentSlide,
        transform: action.payload.transform ?? state.transform,
      }

    case 'SYNC_SLIDER_GROUP':
      return {
        ...state,
        currentSlide: action.payload.currentSlide,
        transform: action.payload.transform ?? state.transform,
        useSlidingTransitionEffect: true,
      }

    case 'ADJUST_CONTEXT_VALUES':
      return {
        ...state,
        transformMap: action.payload.transformMap,
        slideWidth: action.payload.slideWidth,
        slides: action.payload.newSlides,
        slidesPerPage: action.payload.slidesPerPage,
        transform: action.payload.transform,
        navigationStep: action.payload.navigationStep,
        totalItems: action.payload.totalItems,
      }

    default:
      return state
  }
}

const SliderContextProvider: FC<SliderContextProps> = ({
  autoplay,
  children,
  totalItems,
  label = 'slider',
  navigationStep = 'page',
  slides,
  infinite = false,
  itemsPerPage,
  centerMode,
  slideTransition = {
    speed: 400,
    delay: 0,
    timing: '',
  },
}) => {
  const sliderGroupState = useSliderGroupState()

  // This enables us to support dynamic slider-layouts
  const [prevProps, setPrevProps] = useState<{
    itemsPerPage: SliderContextProps['itemsPerPage'] | null
    totalItems: SliderContextProps['totalItems'] | null
    slides: SliderContextProps['slides'] | null
  }>({
    itemsPerPage: null,
    totalItems: null,
    slides: null,
  })

  const resolvedNavigationStep: number =
    navigationStep === 'page' ? itemsPerPage : navigationStep

  const resolvedSlidesPerPage: number =
    totalItems <= itemsPerPage ? totalItems : itemsPerPage

  const postRenderedSlides = infinite
    ? slides.slice(0, resolvedSlidesPerPage)
    : []

  const preRenderedSlides = infinite
    ? slides.slice(slides.length - resolvedSlidesPerPage)
    : []

  const newSlides = preRenderedSlides.concat(slides, postRenderedSlides)

  const slideWidth = useMemo(() => {
    const baseSlideWidth = 100 / newSlides.length

    let resultingSlideWidth = baseSlideWidth

    if (centerMode !== 'disabled') {
      resultingSlideWidth =
        (resolvedSlidesPerPage / (resolvedSlidesPerPage + 1)) * baseSlideWidth
    }

    return resultingSlideWidth
  }, [newSlides.length, centerMode, resolvedSlidesPerPage])

  const transformMap = useMemo(() => {
    const currentMap: Record<number, number> = {}

    newSlides.forEach((_, idx) => {
      const currIdx = infinite ? idx - resolvedSlidesPerPage : idx
      let transformValue = -(slideWidth * idx)

      if (centerMode !== 'disabled') {
        // This represents the new value for each transformValue taking into
        // account the changes made to slideWidth's value due to the fact that
        // centerMode is enabled.
        const adjustedTransformValue = -(
          (1 + 1 / (4 * resolvedSlidesPerPage)) *
          slideWidth *
          idx
        )

        transformValue = adjustedTransformValue

        if (centerMode === 'center') {
          // This is a correction factor to center the slides when centerMode
          // is enabled and set to 'center'.
          const transformCenterCorrection =
            centerMode === 'center' ? (slideWidth * 3) / 8 : 0

          transformValue += transformCenterCorrection
        }
      }

      currentMap[currIdx] = transformValue
    })

    return currentMap
  }, [slideWidth, newSlides, resolvedSlidesPerPage, infinite, centerMode])

  const initialSlide = useMemo(() => sliderGroupState?.currentSlide ?? 0, [
    sliderGroupState,
  ])

  const initialTransform = useMemo(
    () => sliderGroupState?.transform ?? transformMap[initialSlide],
    [transformMap, initialSlide, sliderGroupState]
  )

  const [state, dispatch] = useReducer(sliderContextReducer, {
    slideWidth,
    slidesPerPage: resolvedSlidesPerPage,
    currentSlide: initialSlide,
    transform: initialTransform,
    transformMap,
    slides: newSlides,
    navigationStep: resolvedNavigationStep,
    slideTransition,
    itemsPerPage,
    label,
    autoplay,
    totalItems,
    isPageNavigationStep: navigationStep === 'page',
    isOnTouchMove: false,
    useSlidingTransitionEffect: false,
  })

  if (
    itemsPerPage !== prevProps.itemsPerPage ||
    totalItems !== prevProps.totalItems ||
    slides !== prevProps.slides
  ) {
    dispatch({
      type: 'ADJUST_CONTEXT_VALUES',
      payload: {
        transformMap,
        newSlides,
        slideWidth,
        slidesPerPage: resolvedSlidesPerPage,
        transform: transformMap[state.currentSlide],
        navigationStep: resolvedNavigationStep,
        totalItems,
      },
    })
    setPrevProps({ itemsPerPage, slides, totalItems })
  }

  if (
    sliderGroupState &&
    sliderGroupState.currentSlide !== state.currentSlide
  ) {
    const newCurrentSlide = sliderGroupState?.currentSlide ?? state.currentSlide
    const newTransformValue =
      sliderGroupState?.transform ?? transformMap[newCurrentSlide]

    dispatch({
      type: 'SYNC_SLIDER_GROUP',
      payload: {
        currentSlide: newCurrentSlide,
        transform: newTransformValue,
      },
    })
  }

  return (
    <SliderStateContext.Provider value={state}>
      <SliderDispatchContext.Provider value={dispatch}>
        {children}
      </SliderDispatchContext.Provider>
    </SliderStateContext.Provider>
  )
}

function useSliderState() {
  const context = useContext(SliderStateContext)

  if (context === undefined) {
    throw new Error(
      'useSliderState must be used within a SliderContextProvider'
    )
  }

  return context
}

function useSliderDispatch() {
  const context = useContext(SliderDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useSliderDispatch must be used within a SliderContextProvider'
    )
  }

  return context
}

export { SliderContextProvider, useSliderDispatch, useSliderState }
