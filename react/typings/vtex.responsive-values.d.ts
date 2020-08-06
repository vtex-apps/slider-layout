declare module 'vtex.responsive-values' {
  export type InputDevices = 'mobile' | 'phone' | 'tablet' | 'desktop'
  export type InputDevices = 'phone' | 'tablet' | 'desktop'

  export type ResponsiveInput<T> = { [P in keyof typeof InputDevices]?: T }
  export type MaybeResponsiveInput<T> = T | ResponsiveInput<T>

  export type ResponsiveOutput<T> = { [P in keyof typeof OutputDevices]: T }

  export function useResponsiveValue<T>(input: MaybeResponsiveInput<T>): T
}
