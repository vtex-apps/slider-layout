import { useEffect } from 'react'

/**
 * Hooks that sets a timeout that calls a passed function and is cleared if the stop condition is fulfilled
 * @param ttl : Time until call the fucntion again
 * @param call : Function that will be called
 * @param stop : Stop condition
 */
const useControlledTimeout = (ttl: number, call: () => any, stop: boolean) => {
  useEffect(() => {
    const timeout = setTimeout(() => call(), ttl)
    stop && clearTimeout(timeout)
    return () => clearTimeout(timeout)
  }, [call, stop, ttl])
}

export default useControlledTimeout
