import { MantineProvider, MantineThemeOverride } from "@mantine/core"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import EmbedPage from "./pages/EmbedPage"
import HomePage from "./pages/HomePage"

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

const theme: MantineThemeOverride = {
    colorScheme: "light",
    fontFamily: `system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <RouterProvider router={router} />
        </MantineProvider>
    </React.StrictMode>
)
