describe('useAutoplay', () => {
  it.todo('should call goForward() after the correct interval')
  it.todo('should stop if user is hovering the slider')
  it.todo(
    'should trigger autoplay again after user moves the mouse away from the slider'
  )
})

describe('useHovering', () => {
  it.todo('should return true if user is hovering the slider')
  it.todo('should return false if user is not hovering the slider')
})

describe('useKeyboardArrows', () => {
  it.todo('should call onRight() function when user presses ArrowRight key')
  it.todo('should call onLeft() function when user presses ArrowLeft key')
})

describe('useScreenResize', () => {
  it.todo('should perform an ADJUST_ON_RESIZE dispatch call upon screen resize')
  it.todo(
    'should calculate the correct number of slides per page after a change in device'
  )
  it.todo(
    'should calculate the correct navigation step after a change in device'
  )
  it.todo(
    `should use the total number of slides for slides per page when that number
     is smaller than the resolved slides per page based on device type`
  )
  it.todo(
    `should use the total number of slides for navigation step when that number
     is smaller than the resolved slides per page based on device type`
  )
})

describe('useSliderControls', () => {
  describe('goBack()', () => {
    it.todo(
      'should dispatch a SLIDE action to go back exactly one page when goBack() is called with no arguments'
    )
    it.todo(
      'should dispatch a SLIDE action to go back `step` pages when goBack() is called'
    )
    it.todo(
      'should prevent SLIDE action to set `currentSlide` to a negative number if the slider is not an infinite one'
    )
    it.todo('should prevent over-sliding backwards')
  })

  describe('goForward()', () => {
    it.todo(
      'should dispatch a SLIDE action to go forward exactly one page when goForward() is called with no arguments'
    )
    it.todo(
      'should dispatch a SLIDE action to go forward `step` pages when goForward() is called'
    )
    it.todo(
      `should prevent SLIDE action to set \`currentSlide\` to a number greater than the total slides count if the
       slider is not an infinite one`
    )
    it.todo('should prevent over-sliding forwards')
  })
})

describe('useTouchHandlers', () => {
  it.todo('should update transform value accordingly to touch movement')
  it.todo(
    "should not call slider controls if the user's touch movement delta was below the threshold"
  )
  it.todo(
    'should trigger forward slide movement if a user swipes from right to left'
  )
  it.todo(
    'should trigger backward slide movement if a user swipes from left to right'
  )
})

describe('useSliderVisibility', () => {
  it.todo(
    'should return ({ shouldRenderItem: false, isItemVisible: false }) if slide has never been seen'
  )
  it.todo(
    `should return ({ shouldRenderItem: true, isItemVisible: false }) if slide has been seen,
     but is not currently visible`
  )
  it.todo(
    'should return ({ shouldRenderItem: true, isItemVisible: true }) if slide is currently visible'
  )
})
