import React, { createContext, useReducer, useContext, FC } from 'react'
import { useDevice } from 'vtex.device-detector'

interface LoadAction {
  type: 'LOAD'
  payload: {
    slidesToShow: number
    deviceType: 'desktop' | 'tablet' | 'phone'
    navigationStep: number
  }
}

interface LoadCorrectAction {
  type: 'LOADANDCORRECT'
  payload: {
    slidesPerPage: number
    navigationStep: number
    deviceType: 'desktop' | 'tablet' | 'phone'
    containerWidth: number
    slideWidth: number
    shouldCorrectItemPosition: boolean
  }
}

interface SlideAction {
  type: 'SLIDE'
  payload: {
    transform: number
    currentSlide: number
  }
}

interface State extends SliderLayoutProps {
  /** Width of each item */
  slideWidth: number
  /** Width of the full container */
  containerWidth: number
  /** Number of slides to show per page */
  slidesPerPage: number
  /** Index of the first item (left) of the current page */
  currentSlide: number
  /** Current device type (based on containerWidth and responsive prop) */
  deviceType: 'desktop' | 'tablet' | 'phone'
  /** Current transform value */
  transform: number
  totalItems: number
  navigationStep: number
  isPageNavigationStep: boolean
}

type Action = LoadAction | LoadCorrectAction | SlideAction
type Dispatch = (action: Action) => void

const SliderStateContext = createContext<State | undefined>(undefined)
const SliderDispatchContext = createContext<Dispatch | undefined>(undefined)

function sliderContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        deviceType: action.payload.deviceType,
        navigationStep: action.payload.navigationStep,
      }
    case 'LOADANDCORRECT':
      return {
        ...state,
        navigationStep: action.payload.navigationStep,
        slidesPerPage: action.payload.slidesPerPage,
        deviceType: action.payload.deviceType,
        containerWidth: action.payload.containerWidth,
        slideWidth: action.payload.slideWidth,
        transform: action.payload.shouldCorrectItemPosition
          ? -action.payload.slideWidth * state.currentSlide
          : state.transform,
      }
    case 'SLIDE':
      return {
        ...state,
        transform: action.payload.transform,
        currentSlide: action.payload.currentSlide,
      }
    default:
      return state
  }
}

const SliderContextProvider: FC<SliderLayoutProps & { totalItems: number }> = ({
  children,
  totalItems,
  label = 'slider',
  infinite = false,
  showNavigationArrows = 'always',
  showPaginationDots = 'always',
  navigationStep = 'page',
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
  const { device } = useDevice()
  const resolvedNavigationStep =
    navigationStep === 'page' ? itemsPerPage[device] : navigationStep

  const [state, dispatch] = useReducer(sliderContextReducer, {
    slideWidth: 0,
    slidesPerPage: itemsPerPage[device],
    currentSlide: 0,
    deviceType: 'desktop',
    transform: 0,
    containerWidth: 0,
    infinite,
    navigationStep: resolvedNavigationStep,
    showNavigationArrows,
    showPaginationDots,
    usePagination,
    slideTransition,
    itemsPerPage,
    label,
    totalItems,
    isPageNavigationStep: navigationStep === 'page',
  })

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
      'useAppVersionState must be used within a SliderContextProvider'
    )
  }
  return context
}

function useSliderDispatch() {
  const context = useContext(SliderDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useAppVersionDispatch must be used within a SliderContextProvider'
    )
  }
  return context
}

export { SliderContextProvider, useSliderDispatch, useSliderState }
