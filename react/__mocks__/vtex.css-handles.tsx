import React from 'react'

export const useCssHandles = (cssHandles: string[]) => {
  const handles: Record<string, string> = {}

  cssHandles.forEach(handle => {
    handles[handle] = handle
  })

  return {
    handles,
    withModifiers: (handle: string, modifier: string) => {
      return `${handle} ${handle}--${modifier}`
    },
  }
}

export function createCssHandlesContext(_handles: string[]) {
  const Context = React.createContext<any>(null)

  const useContextCssHandles = () => {
    return React.useContext(Context)
  }

  const CssHandlesProvider = ({
    withModifiers,
    handles,
    children,
  }: React.PropsWithChildren<any>) => {
    const value = React.useMemo(
      () => ({
        handles,
        withModifiers,
      }),
      [withModifiers, handles]
    )

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return {
    CssHandlesProvider,
    useContextCssHandles,
  }
}
