import { QueryClient, useMutation, useSuspenseQuery } from "@tanstack/react-query"
import ky from "ky"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { persistQueryClient, removeOldestQuery } from "@tanstack/react-query-persist-client"

// Necessary to make sure everyone gets new updates without having to manually clear their localstorage
// Need to increment version on each update to push to new users
if (localStorage.getItem("version") !== "0.0.1") {
    localStorage.clear()
    localStorage.setItem("version", "0.0.1")
}

export const client = ({ signal }: { signal?: AbortSignal } = { signal: undefined }) =>
    ky.extend({
        prefixUrl: import.meta.env.VITE_SERVER_HOST,
        headers: {
            authorization: `Bearer ${typeof window === "object" && localStorage.getItem("token")}`,
            "X-Whitelisted-Email": `${typeof window === "object" && localStorage.getItem("whitelisted_email")}`,
        },
        signal,
        throwHttpErrors: true,
        timeout: 30000,
    })

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: 1560,
            staleTime: 1000,
            retry: true,
            retryDelay: 1000,
        },
    },
})

const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
})

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
})

export const useIsLoggedIn = () =>
    useSuspenseQuery({
        queryKey: ["isLoggedIn"],
        queryFn: () => {
            const token = localStorage.getItem("token")
            const whitelistedEmail = localStorage.getItem("whitelisted_email")
            return !!token || !!whitelistedEmail
        },
    }).data!

export const useCheckWhitelist = () =>
    useSuspenseQuery({
        queryKey: ["checkWhitelisted"],
        queryFn: async () => {
            const whitelisted = localStorage.getItem("whitelisted_email")
            return !!whitelisted
        },
        staleTime: 60,
    }).data!

export const useApiKey = () =>
    useSuspenseQuery({
        queryKey: ["apiKey"],
        queryFn: async () => localStorage.getItem("apiKey"),
    }).data!

export const useEditApiKey = () =>
    useMutation({
        mutationKey: ["apiKey"],
        mutationFn: (apiKey: string) => client().put("apiKey", { json: { apiKey: apiKey } }),
        onMutate: async (newApiKey) => {
            localStorage.setItem("apiKey", newApiKey)
            queryClient.setQueryData(["apiKey"], newApiKey)
            return newApiKey
        },
        onSettled: () => {
            queryClient.invalidateQueries()
        },
    })
