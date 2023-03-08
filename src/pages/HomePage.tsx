import { Box, Flex, Text, Textarea, Title } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
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
    const [debouncedConfig] = useDebouncedValue(config, 750)
    const htmlCode = useMemo(() => createEmbedCode(debouncedConfig), [debouncedConfig])

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
        <Flex direction="row" p="xs" gap="md">
            <Flex direction="column" w="50%" gap="md">
                <Box>
                    <Title order={3}>Preview</Title>
                    <Box style={{ border: "1px black dashed" }} dangerouslySetInnerHTML={{ __html: htmlCode }}></Box>
                </Box>
                <Box>
                    <Title order={3}>HTML Code</Title>
                    <Prism language="markup" withLineNumbers>
                        {htmlCode}
                    </Prism>
                </Box>
            </Flex>
            <Flex direction="column" gap="md">
                <Title order={3}>Configuration</Title>
                <Text>Prompt</Text>
                <Textarea
                    value={config.prompt}
                    onChange={(event) => setConfig({ ...config, prompt: event.currentTarget.value })}
                />
            </Flex>
        </Flex>
    )
}

export default HomePage
