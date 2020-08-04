import React, {
  createContext,
  useReducer,
  useContext,
  FC,
  ReactNode,
  useMemo,
  useEffect,
} from 'react'

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

interface AdjustContextValuesAction {
  type: 'ADJUST_CONTEXT_VALUES'
  payload: {
    transformMap: State['transformMap']
    slideWidth: State['slideWidth']
    newSlides: State['slides']
  }
}

interface State extends SliderLayoutProps {
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
          ? -state.slideWidth * state.currentSlide
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

    case 'ADJUST_CONTEXT_VALUES':
      return {
        ...state,
        transformMap: action.payload.transformMap,
        slideWidth: action.payload.slideWidth,
        slides: action.payload.newSlides,
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
  slideTransition = {
    speed: 400,
    delay: 0,
    timing: '',
  },
}) => {
  const resolvedNavigationStep =
    navigationStep === 'page' ? itemsPerPage : navigationStep

  const resolvedSlidesPerPage =
    totalItems <= itemsPerPage ? totalItems : itemsPerPage

  const postRenderedSlides = infinite
    ? slides.slice(0, resolvedSlidesPerPage)
    : []

  const preRenderedSlides = infinite
    ? slides.slice(slides.length - resolvedSlidesPerPage)
    : []

  const newSlides = preRenderedSlides.concat(slides, postRenderedSlides)

  const slideWidth = useMemo(() => 100 / newSlides.length, [newSlides.length])

  const transformMap = useMemo(() => {
    const currentMap: Record<number, number> = {}

    newSlides.forEach((_, idx) => {
      const currIdx = infinite ? idx - resolvedSlidesPerPage : idx

      currentMap[currIdx] = -(slideWidth * idx)
    })

    return currentMap
  }, [slideWidth, newSlides, resolvedSlidesPerPage, infinite])

  const [state, dispatch] = useReducer(sliderContextReducer, {
    slideWidth,
    slidesPerPage: resolvedSlidesPerPage,
    currentSlide: 0,
    transform: transformMap[0],
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

  useEffect(() => {
    dispatch({
      type: 'ADJUST_CONTEXT_VALUES',
      payload: {
        transformMap,
        newSlides,
        slideWidth,
      },
    })
    // It's fine to disable this rule here since this effect
    // is only meant to update context values when vtex.responsive-values
    // updates its return value for `useResponsiveValue(itemsPerPage)`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage])

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
