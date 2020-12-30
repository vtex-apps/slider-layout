import { CssHandlesTypes } from 'vtex.css-handles'

export const mockedUseContextCssHandlesFn = (
  CSS_HANDLES: CssHandlesTypes.CssHandlesList
) => ({
  handles: CSS_HANDLES.reduce<Record<string, string>>((acc, handle) => {
    acc[handle] = handle

    return acc
  }, {}),
  withModifiers: (handle: string, modifier: string | string[]) =>
    `${handle} ${handle}--${modifier}`,
})
