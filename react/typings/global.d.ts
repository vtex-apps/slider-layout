import { DetailedHTMLProps, HTMLAttributes, ButtonHTMLAttributes } from 'react'

interface ResponsiveType {
  [key: string]: {
    breakpoint: { max: number; min: number }
    items: number
  }
}

interface TransitionType {
  /** Transition speed in ms */
  speed: number
  /** Transition delay in ms */
  delay: number
  /** Timing function */
  timing: string
}

interface Thumbnail {
  /** Url of the thumbnail */
  url: string
  /** Slide that it refers to */
  forSlide: number
}

interface SliderProps {
  /** Aria label of slider */
  label?: string
  /** Device type */
  deviceType?: string
  /** Element props */
  elements: {
    /** Number of visible elements per breakpoint */
    visible: ResponsiveType
    /** Number of elements that are passed each time 1 to visible */
    toPass: number | 'visible'
  }
  /** If should show arrows */
  showArrows?: boolean
  /** Which device types that arrows should be hidden */
  removeArrowOnDeviceType?: string | string[]
  /** Custom arrow on left */
  customLeftArrow?: ComponentType<any> | null
  /** Custom arrow on right */
  customRightArrow?: ComponentType<any> | null
  /** Whatever is infinite mode or not */
  infinite?: boolean
  /** Custom classes */
  classNames?: {
    container?: string
    sliderContainer?: string
    slider?: string
    item?: string
    leftArrow?: string
    rightArrow?: string
    dotList?: string
    dot?: string
    thumbnails?: string
    thumbnail?: string
    selectedThumbnail?: string
  }
  /** If should show dots or not */
  showDots?: boolean
  /** Custom transition */
  transition?: TransitionType
  /** Thumbnails props */
  thumbnails?: {
    /** Array of thumbnails */
    items: Thumbnail[]
    /** Thumbs position relative to slider container */
    position: 'right' | 'left'
    /** Thumbs width with measure (px, em, rem %, ...) */
    width: string
  }
  /** Props for autoplay */
  autoplay?: {
    /** Time duration in ms */
    timeout: number
    /** If should stop the timeout by hovering the slide */
    stopOnHover?: boolean
  }
  /** If is controlled via keyboard arrows or not */
  keyboardControlled?: boolean
}

/** Shorten for Div */
type Div = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type Button = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
