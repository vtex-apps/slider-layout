import * as React from 'react'

const initialState = {
  currentSlide: 0,
  transform: null,
}

const SliderGroupStateContext = React.createContext(initialState)
const SliderGroupDispatchContext = React.createContext(0)

const reducer = (state, action) => {
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

const SliderLayoutGroup: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <SliderGroupStateContext.Provider value={state}>
      <SliderGroupDispatchContext.Provider value={dispatch}>
        {props.children}
      </SliderGroupDispatchContext.Provider>
    </SliderGroupStateContext.Provider>
  )
}

export default SliderLayoutGroup
