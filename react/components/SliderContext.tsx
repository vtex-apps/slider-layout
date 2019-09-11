import React, { createContext, useReducer, useContext, ReactNode } from 'react'

interface LoadAction {
  type: 'load'
  payload: { slidesToShow: number; deviceType: string }
}

interface LoadCorrectAction {
  type: 'loadAndCorrect'
  payload: {
    slidesPerPage: number
    deviceType: string
    containerWidth: number
    slideWidth: number
    shouldCorrectItemPosition: boolean
  }
}

interface SlideAction {
  type: 'slide'
  payload: {
    transform: number
    currentSlide: number
  }
}

interface SetInitialStateFromPropsAction {
  type: 'setInitialStateFromProps'
  payload: {
    totalItems: number
    infinite: boolean
    navigationStep: number
  }
}

interface State {
  /** Width of each item */
  slideWidth: number
  /** Width of the full container */
  containerWidth: number
  /** Number of slides to show per page */
  slidesPerPage: number
  /** Index of the first item (left) of the current page */
  currentSlide: number
  /** If the dom is loaded or not */
  isDOMLoaded: boolean
  /** Current device type (based on containerWidth and responsive prop) */
  deviceType?: string
  /** Current transform value */
  transform: number
  totalItems: number
  infinite: boolean
  navigationStep: number
}

type Action =
  | LoadAction
  | LoadCorrectAction
  | SlideAction
  | SetInitialStateFromPropsAction
type Dispatch = (action: Action) => void

const SliderStateContext = createContext<State | undefined>(undefined)
const SliderDispatchContext = createContext<Dispatch | undefined>(undefined)

function sliderContextReducer(state: State, action: Action) {
  switch (action.type) {
    case 'load':
      return {
        ...state,
        isDOMLoaded: true,
        ...action.payload,
      }
    case 'loadAndCorrect':
      return {
        ...state,
        isDOMLoaded: true,
        slidesPerPage: action.payload.slidesPerPage,
        deviceType: action.payload.deviceType,
        containerWidth: action.payload.containerWidth,
        slideWidth: action.payload.slideWidth,
        transform: action.payload.shouldCorrectItemPosition
          ? -action.payload.slideWidth * state.currentSlide
          : state.transform,
      }
    case 'slide':
      return {
        ...state,
        ...action.payload,
      }
    case 'setInitialStateFromProps':
      return {
        ...state,
        totalItems: action.payload.totalItems,
        infinite: action.payload.infinite,
        navigationStep: action.payload.navigationStep,
      }
    default:
      return state
  }
}

function SliderContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sliderContextReducer, {
    slideWidth: 0,
    slidesPerPage: 0,
    currentSlide: 0,
    deviceType: '',
    isDOMLoaded: false,
    transform: 0,
    containerWidth: 0,
    totalItems: 0,
    infinite: false,
    navigationStep: 0,
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
