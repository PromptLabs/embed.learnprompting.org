import { decodeUrlConfig, UrlConfig } from "../urlconfig"
import { useAsyncMemo, UseAsyncMemoResult } from "./useAsyncMemo"

export const useSearchParamConfig = (): UseAsyncMemoResult<UrlConfig | null> => {
    return useAsyncMemo(
        async () => {
            const params = new URLSearchParams(window.location.search)
            const config = params.get("config")
            if (config == null) {
                throw new Error(`query param "config" does not exist in url`)
            }

            try {
                return decodeUrlConfig(config)
            } catch (error) {
                throw new Error(`failed to parse config`, { cause: error })
            }
        },
        [],
        null
    )
}
