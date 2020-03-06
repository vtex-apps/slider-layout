import React from 'react'
import { defineMessages } from 'react-intl'
import { useListContext } from 'vtex.list-context'
import { useResponsiveValue } from 'vtex.responsive-values'

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
  fullWidth = true,
  arrowSize = 25,
  children,
  ...contextProps
}) => {
  const { list } = useListContext() || []
  const totalSlides = totalItems || React.Children.count(children) + list.length
  const responsiveArrowIconSize = useResponsiveValue(arrowSize)

  return (
    <SliderContextProvider totalItems={totalSlides} {...contextProps}>
      <Slider
        infinite={infinite}
        showNavigationArrows={showNavigationArrows}
        showPaginationDots={showPaginationDots}
        totalItems={totalSlides}
        usePagination={usePagination}
        fullWidth={fullWidth}
        arrowSize={responsiveArrowIconSize}
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
  sliderFullWidth: {
    id: 'admin/editor.slider-layout.sliderFullWidth',
    defaultMessage: '',
  },
  sliderFullWidthDescription: {
    id: 'admin/editor.slider-layout.sliderFullWidthDescription',
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
    fullWidth: {
      default: true,
      title: messages.sliderFullWidth.id,
      description: messages.sliderFullWidthDescription.id,
      type: 'boolean',
    },
    autoplay: {
      type: 'object',
      isLayout: true,
      properties: {
        timeout: {
          type: 'number',
        },
        stopOnHover: {
          type: 'boolean',
        },
      },
    },
    itemsPerPage: {
      type: 'object',
      isLayout: true,
      properties: {
        desktop: {
          default: 5,
          type: 'number',
        },
        tablet: {
          default: 3,
          type: 'number',
        },
        phone: {
          default: 1,
          type: 'number',
        },
      },
    },
  },
}

export default SliderLayout
