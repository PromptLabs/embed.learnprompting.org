import { DependencyList, useEffect, useState } from "react"

type UseAsyncMemoResult<T> = {
    value: T
    error: Error | null
}
export const useAsyncMemo = <T>(factory: () => Promise<T>, deps: DependencyList, initial: T): UseAsyncMemoResult<T> => {
    const [value, setValue] = useState<T>(initial)
    const [error, setError] = useState<Error | null>(null)
    useEffect(() => {
        factory()
            .then((value) => setValue(value))
            .catch((err) => setError(err))
    }, deps)
    return {
        value,
        error,
    }
}
