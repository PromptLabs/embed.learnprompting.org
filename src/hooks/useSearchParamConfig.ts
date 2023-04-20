import { useMemo } from "react"
import { decodeUrlConfig, UrlConfig } from "../urlconfig"

export const useSearchParamConfig = (): { config?: UrlConfig; error?: Error } => {
    return useMemo(() => {
        const params = new URLSearchParams(window.location.search)
        const config = params.get("config")
        if (config == null) {
            return {}
        }

        try {
            return { config: decodeUrlConfig(config) }
        } catch (error) {
            return { error: error as Error }
        }
    }, [])
}
