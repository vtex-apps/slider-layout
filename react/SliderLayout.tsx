import React from 'react'
import { defineMessages } from 'react-intl'

import Slider from './components/Slider'
import { SliderContextProvider } from './components/SliderContext'

const SliderLayout: StorefrontFunctionComponent<
  SliderLayoutProps & { siteEditorConfig: SliderLayoutSiteEditorProps }
> = props => {
  const totalItems = props.totalItems || React.Children.count(props.children)
  const {
    infinite = false,
    showNavigationArrows = 'always',
    showPaginationDots = 'always',
    usePagination = true,
  } = props

  return (
    <SliderContextProvider totalItems={totalItems} {...props}>
      <Slider
        infinite={infinite}
        showNavigationArrows={showNavigationArrows}
        showPaginationDots={showPaginationDots}
        totalItems={totalItems}
        usePagination={usePagination}
      >
        {props.children}
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
      title: messages.sliderInfinite,
      type: 'boolean',
    },
    showNavigationArrows: {
      default: 'always',
      enum: ['mobileOnly', 'desktopOnly', 'always', 'never'],
      title: messages.sliderShowNavigation,
      type: 'string',
    },
    showPaginationDots: {
      default: 'always',
      enum: ['mobileOnly', 'desktopOnly', 'always', 'never'],
      title: messages.sliderShowPaginationDots,
      type: 'string',
    },
    usePagination: {
      default: true,
      title: messages.sliderUsePagination,
      type: 'boolean',
    },
  },
}

export default SliderLayout
