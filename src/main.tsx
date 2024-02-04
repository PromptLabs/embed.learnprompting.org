import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import EmbedPage from "./pages/EmbedPage"
import HomePage from "./pages/HomePage"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "./theme"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { queryClient } from './util'
import { QueryClientProvider } from '@tanstack/react-query'

export const BASE_URL = `${window.location.protocol}//${window.location.host}`

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/embed",
        element: <EmbedPage />,
    },
])
const id = import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <GoogleOAuthProvider clientId={id}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </ChakraProvider>
    </React.StrictMode>
)
