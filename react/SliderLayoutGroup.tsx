import React, { createContext, useReducer, useContext } from 'react'

interface State {
  currentSlide: number
  transform?: null | number
  isHovering: boolean
}

interface SlideAction {
  type: 'SLIDE'
  payload: {
    currentSlide: number
    transform?: number
  }
}

interface HoverAction {
  type: 'HOVER'
  payload: {
    isHovering: boolean
  }
}

type Action = SlideAction | HoverAction
type Dispatch = (action: Action) => void

const SliderGroupStateContext = createContext<State | undefined>(undefined)

const SliderGroupDispatchContext = createContext<Dispatch | undefined>(
  undefined
)

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SLIDE': {
      return {
        ...state,
        currentSlide: action.payload.currentSlide,
        transform: action.payload.transform,
      }
    }

    default: {
      return state
    }
  }
}

const SliderLayoutGroup: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    currentSlide: 0,
    transform: null,
    isHovering: false,
  })

  return (
    <SliderGroupStateContext.Provider value={state}>
      <SliderGroupDispatchContext.Provider value={dispatch}>
        {children}
      </SliderGroupDispatchContext.Provider>
    </SliderGroupStateContext.Provider>
  )
}

export function useSliderGroupState() {
  const context = useContext(SliderGroupStateContext)

  return context
}

export function useSliderGroupDispatch() {
  const context = useContext(SliderGroupDispatchContext)

  return context
}

export default SliderLayoutGroup
