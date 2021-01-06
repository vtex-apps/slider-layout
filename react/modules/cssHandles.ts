import { createCssHandlesContext } from 'vtex.css-handles'

import { CSS_HANDLES } from '../SliderLayout'

const { CssHandlesProvider, useContextCssHandles } = createCssHandlesContext(
  CSS_HANDLES
)

export { CssHandlesProvider, useContextCssHandles }
