import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
    useSystemColorMode: false,
    initialColorMode: "dark",
}

const theme = extendTheme({
    config,
    fonts: {
        heading: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
        body: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
    },
})

export default theme
