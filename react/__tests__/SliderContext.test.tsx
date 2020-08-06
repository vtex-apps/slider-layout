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

describe('Hooks', () => {
  it.todo('should throw an error when used outside SliderContext')
})
