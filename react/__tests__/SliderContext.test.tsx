import { renderHook } from '@vtex/test-tools/react'

import { useSliderDispatch, useSliderState } from '../components/SliderContext'

describe('Initialization', () => {
  it.todo(
    'should correctly resolve initial navigationStep based on received props'
  )
  it.todo(
    'should correctly resolve initial slidesPerPage based on received props'
  )
  it.todo('should correctly initiate transformMap')
  it.todo('should correctly create clones if slider is infinite')
  it.todo('should correctly initiate transformMap in an infinite slider')
})

/**
 * Most of the actions are pretty simple, since they just update the state using the
 * values from their payloads directly.
 * That being said, if there's an issue in the slider's state behavior, it's likely
 * caused by dispatch callers, and not the reducer itself. Check './hooks.test.tsx'.
 */
describe('Reducer actions', () => {
  it.todo('SLIDE')
  it.todo('TOUCH')
  it.todo('ADJUST_ON_RESIZE')
  it.todo('DISABLE_TRANSITION')
  it.todo('ADJUST_CURRENT_SLIDE')
  it.todo('ADJUST_CONTEXT_VALUES')
})

describe('useSliderState and useSliderDispatch hooks', () => {
  it('should throw an error when used outside SliderContext', () => {
    const { result: sliderStateResult } = renderHook(() => useSliderState())

    const expectedUseStateError = new Error(
      'useSliderState must be used within a SliderContextProvider'
    )

    expect(sliderStateResult.error).toEqual(expectedUseStateError)

    const { result: sliderDispatchResult } = renderHook(() =>
      useSliderDispatch()
    )

    const expectedUseDispatchError = new Error(
      'useSliderDispatch must be used within a SliderContextProvider'
    )

    expect(sliderDispatchResult.error).toEqual(expectedUseDispatchError)
  })
})
