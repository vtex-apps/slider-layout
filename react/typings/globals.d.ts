interface SliderLayoutProps {
  label: string
  showNavigationArrows: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  infinite: boolean
  showPaginationDots: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  slideTransition: {
    /** Transition speed in ms */
    speed: number
    /** Transition delay in ms */
    delay: number
    timing: string
  }
  autoplay?: {
    /** Timeout duration in ms */
    timeout: number
    stopOnHover?: boolean
  }
  navigationStep: number | 'page'
  usePagination: boolean
  itemsPerPage: {
    desktop: number
    tablet: number
    phone: number
  }
}
