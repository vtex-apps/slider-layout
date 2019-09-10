declare module '*.css' {
  const css: CSSHandles
  export default css
}

interface CSSHandles {
  container: string
  sliderContainer: string
  slider: string
  sliderItem: string
  leftArrow: string
  rightArrow: string
  dotsContainer: string
  dot: string
}
