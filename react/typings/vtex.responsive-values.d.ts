declare module 'vtex.responsive-values' {
  export enum InputDevices {
    mobile = 'mobile',
    phone = 'phone',
    tablet = 'tablet',
    desktop = 'desktop',
  }

  export enum OutputDevices {
    phone = 'phone',
    tablet = 'tablet',
    desktop = 'desktop',
  }

  export type ResponsiveInput<T> = { [P in keyof typeof InputDevices]?: T }
  export type MaybeResponsiveInput<T> = T | ResponsiveInput<T>

  export type ResponsiveOutput<T> = { [P in keyof typeof OutputDevices]: T }

  export function useResponsiveValue<T>(input: MaybeResponsiveInput<T>): T
}
