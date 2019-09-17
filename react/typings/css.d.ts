declare module '*.css' {
  const css: CSSHandles
  export default css
}

interface CSSHandles {
  layoutContainer: string
  sliderContainer: string
  sliderTrack: string
  slide: string
  leftArrow: string
  rightArrow: string
  dotsContainer: string
  dot: string
}
