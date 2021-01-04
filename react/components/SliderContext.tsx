import React, {
  createContext,
  useReducer,
  useContext,
  FC,
  useMemo,
  useState,
} from 'react'
import { ResponsiveValuesTypes } from 'vtex.responsive-values'

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
    slidesPerPage: State['slidesPerPage']
    transform: State['transform']
    navigationStep: State['navigationStep']
    totalItems: State['totalItems']
  }
}

export interface SliderLayoutSiteEditorProps {
  infinite?: boolean
  showNavigationArrows?: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  showPaginationDots?: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  usePagination?: boolean
  fullWidth?: boolean
  arrowSize?: ResponsiveValuesTypes.ResponsiveValue<number>
}

export interface SliderLayoutProps {
  totalItems?: number
  label?: string
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
  navigationStep?: number | 'page'
  itemsPerPage?: ResponsiveValuesTypes.ResponsiveValue<number>
  centerMode?: ResponsiveValuesTypes.ResponsiveValue<
    'center' | 'to-the-left' | 'disabled'
  >
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
  slideTransition: Exclude<SliderLayoutProps['slideTransition'], undefined>
}

interface SliderContextProps extends SliderLayoutProps {
  totalItems: number
  itemsPerPage: number
  infinite: SliderLayoutSiteEditorProps['infinite']
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
  }>({
    itemsPerPage: null,
    totalItems: null,
  })

  const resolvedNavigationStep: number =
    navigationStep === 'page' ? itemsPerPage : navigationStep

  const resolvedSlidesPerPage: number =
    totalItems <= itemsPerPage ? totalItems : itemsPerPage

  const hiddenSlides = infinite ? resolvedSlidesPerPage * 2 : 0

  const newTotalItems = hiddenSlides + totalItems

  const slideWidth = useMemo(() => {
    const baseSlideWidth = 100 / newTotalItems

    let resultingSlideWidth = baseSlideWidth

    if (centerMode !== 'disabled') {
      resultingSlideWidth =
        (resolvedSlidesPerPage / (resolvedSlidesPerPage + 1)) * baseSlideWidth
    }

    return resultingSlideWidth
  }, [newTotalItems, centerMode, resolvedSlidesPerPage])

  const transformMap = useMemo(() => {
    const currentMap: Record<number, number> = {}

    for (let idx = 0; idx < newTotalItems; ++idx) {
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
    }

    return currentMap
  }, [slideWidth, newTotalItems, resolvedSlidesPerPage, infinite, centerMode])

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
    totalItems !== prevProps.totalItems
  ) {
    dispatch({
      type: 'ADJUST_CONTEXT_VALUES',
      payload: {
        transformMap,
        slideWidth,
        slidesPerPage: resolvedSlidesPerPage,
        transform: transformMap[state.currentSlide],
        navigationStep: resolvedNavigationStep,
        totalItems,
      },
    })
    setPrevProps({ itemsPerPage, totalItems })
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
