import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import EmbedPage from "./pages/EmbedPage"
import HomePage from "./pages/HomePage"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "./theme"

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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
)
