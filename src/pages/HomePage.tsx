import { Flex, Text, Textarea, Title } from "@mantine/core"
import { Prism } from "@mantine/prism"
import { useEffect, useMemo, useState } from "react"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, UrlConfig } from "../urlconfig"

const HTML_TEMPLATE = `<iframe
    src="%URL%"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>`

const createEmbedCode = (config: UrlConfig): string => {
    const query = encodeUrlConfig(config)
    const url = `${BASE_URL}/embed?config=${query}`
    return HTML_TEMPLATE.replace("%URL%", url)
}

const HomePage = () => {
    const [config, setConfig] = useState<UrlConfig>({
        model: "text-davinci-003",
        prompt: "",
    })
    const htmlCode = useMemo(() => createEmbedCode(config), [config])

    const { value: parsedConfig, error } = useSearchParamConfig()
    useEffect(() => {
        // note that we don't check here at all of the user started editing
        // anything... thats really an edge case though. useSearchParamConfig
        // should be instant
        if (parsedConfig != null) {
            setConfig(parsedConfig)
        }
    }, [parsedConfig])

    if (error != null) {
        // TODO: should we notify the user that this happened visually?
        console.error("failed to load config from url", error)
    }
    return (
        <Flex direction="column">
            <Title order={2}>Create an Embed</Title>
            <Text>Prompt</Text>
            <Textarea
                value={config.prompt}
                onChange={(event) => setConfig({ ...config, prompt: event.currentTarget.value })}
            />

            <Title order={2}>Embed HTML Code</Title>
            <Prism language="markup" withLineNumbers>
                {htmlCode}
            </Prism>
        </Flex>
    )
}

export default HomePage
