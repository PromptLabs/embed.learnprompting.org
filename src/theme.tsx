import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
    useSystemColorMode: false,
    initialColorMode: "light",
}

const theme = extendTheme({
    config,
    fonts: {
        heading: `Be Vietnam Pro`,
        body: `Be Vietnam Pro`,
    },
})

export default theme
