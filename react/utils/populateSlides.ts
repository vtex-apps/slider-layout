interface NextSlides {
  nextSlides: number | undefined
  nextPosition: number | undefined
}

/**
 * Populate the previous slides
 * TODO: Implement the 'fake' translate when in infinite mode when left end is reached
 */
const populatePrev = (
  currentSlide: number,
  slidesToShow: number,
  itemWidth: number,
  totalItems: number,
  infinite: boolean,
  realPassedSlides: number
): NextSlides => {
  let nextSlides
  let nextPosition

  const nextMaximumSlides = currentSlide - realPassedSlides

  if (nextMaximumSlides >= 0) {
    /** Have more slides hidden on left */
    nextSlides = nextMaximumSlides
    nextPosition = -(itemWidth * nextSlides)
  } else if (nextMaximumSlides < 0 && currentSlide !== 0) {
    /** Prevent overslide */
    nextSlides = 0
    nextPosition = 0
  } else if (infinite) {
    /** If reach start, go to last slide */
    nextSlides = totalItems - slidesToShow
    nextPosition = -(itemWidth * nextSlides)
  } else {
    nextSlides = undefined
    nextPosition = undefined
  }

  return {
    nextSlides,
    nextPosition,
  }
}

/**
 * Populate the next slides
 * TODO: Implement the 'fake' translate when in infinite mode when right end is reached
 */
const populateNext = (
  currentSlide: number,
  slidesToShow: number,
  itemWidth: number,
  totalItems: number,
  infinite: boolean,
  realPassedSlides: number
): NextSlides => {
  let nextSlides
  let nextPosition

  const nextMaximumSlides = currentSlide + 1 + slidesToShow + realPassedSlides

  if (nextMaximumSlides <= totalItems) {
    /** Have more slides hidden on right */
    nextSlides = currentSlide + realPassedSlides
    nextPosition = -(itemWidth * nextSlides)
  } else if (
    nextMaximumSlides > totalItems &&
    currentSlide !== totalItems - slidesToShow
  ) {
    /** Prevent overslide */
    nextSlides = totalItems - slidesToShow
    nextPosition = -(itemWidth * nextSlides)
  } else if (infinite) {
    /** if reach end go to first slide */
    nextSlides = 0
    nextPosition = -(itemWidth * nextSlides)
  } else {
    nextSlides = undefined
    nextPosition = undefined
  }

  return {
    nextSlides,
    nextPosition,
  }
}

/**
 * Populate slides based on order (prev or next)
 * Returns the next slides to show and the transition
 */
const populateSlides = (
  direction: 'left' | 'right',
  currentSlide: number,
  slidesToShow: number,
  itemWidth: number,
  totalItems: number,
  toPass: number,
  infinite: boolean
): NextSlides => {
  const realPassedSlides = toPass

  return direction === 'right'
    ? populateNext(
        currentSlide,
        slidesToShow,
        itemWidth,
        totalItems,
        infinite,
        realPassedSlides
      )
    : populatePrev(
        currentSlide,
        slidesToShow,
        itemWidth,
        totalItems,
        infinite,
        realPassedSlides
      )
}

export { populateSlides }
