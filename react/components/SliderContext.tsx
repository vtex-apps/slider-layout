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
  type: 'LOAD_AND_CORRECT'
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

interface TouchAction {
  type: 'TOUCH'
  payload: {
    transform?: number
    isOnTouchMove: boolean
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
  isOnTouchMove: boolean
}

type Action = LoadAction | LoadCorrectAction | SlideAction | TouchAction
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
    case 'LOAD_AND_CORRECT':
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
    case 'TOUCH':
      return {
        ...state,
        transform: action.payload.transform || state.transform,
        isOnTouchMove: action.payload.isOnTouchMove,
      }
    default:
      return state
  }
}

const SliderContextProvider: FC<SliderLayoutProps & { totalItems: number }> = ({
  autoplay,
  children,
  totalItems,
  label = 'slider',
  navigationStep = 'page',
  slideTransition = {
    speed: 400,
    delay: 0,
    timing: '',
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
    navigationStep: resolvedNavigationStep,
    slideTransition,
    itemsPerPage,
    label,
    autoplay,
    totalItems,
    isPageNavigationStep: navigationStep === 'page',
    isOnTouchMove: false,
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
