import React from 'react'
import { defineMessages } from 'react-intl'
import {
  useProductSummaryListState,
  useImageListState,
} from 'vtex.list-context'

import Slider from './components/Slider'
import { SliderContextProvider } from './components/SliderContext'

const SliderLayout: StorefrontFunctionComponent<
  SliderLayoutProps & SliderLayoutSiteEditorProps
> = ({
  totalItems,
  infinite = false,
  showNavigationArrows = 'always',
  showPaginationDots = 'always',
  usePagination = true,
  children,
  ...contextProps
}) => {
  const productList = useProductSummaryListState() || []
  const imageList = useImageListState() || []
  const totalSlides =
    totalItems ||
    React.Children.count(children) + productList.length + imageList.length

  return (
    <SliderContextProvider totalItems={totalSlides} {...contextProps}>
      <Slider
        infinite={infinite}
        showNavigationArrows={showNavigationArrows}
        showPaginationDots={showPaginationDots}
        totalItems={totalSlides}
        usePagination={usePagination}
      >
        {children}
      </Slider>
    </SliderContextProvider>
  )
}

const messages = defineMessages({
  sliderTitle: {
    id: 'admin/editor.slider-layout.title',
    defaultMessage: '',
  },
  sliderInfinite: {
    id: 'admin/editor.slider-layout.infinite',
    defaultMessage: '',
  },
  sliderShowNavigation: {
    id: 'admin/editor.slider-layout.showNavigation',
    defaultMessage: '',
  },
  sliderShowPaginationDots: {
    id: 'admin/editor.slider-layout.showPaginationDots',
    defaultMessage: '',
  },
  sliderUsePagination: {
    id: 'admin/editor.slider-layout.usePagination',
    defaultMessage: '',
  },
})

SliderLayout.schema = {
  title: messages.sliderTitle.id,
  description: messages.sliderTitle.id,
  type: 'object',
  properties: {
    infinite: {
      default: true,
      title: messages.sliderInfinite.id,
      type: 'boolean',
    },
    showNavigationArrows: {
      default: 'always',
      enum: ['mobileOnly', 'desktopOnly', 'always', 'never'],
      title: messages.sliderShowNavigation.id,
      type: 'string',
    },
    showPaginationDots: {
      default: 'always',
      enum: ['mobileOnly', 'desktopOnly', 'always', 'never'],
      title: messages.sliderShowPaginationDots.id,
      type: 'string',
    },
    usePagination: {
      default: true,
      title: messages.sliderUsePagination.id,
      type: 'boolean',
    },
  },
}

export default SliderLayout
