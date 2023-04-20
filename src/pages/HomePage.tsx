import { useEffect, useMemo, useState } from "react"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, MODELS, UrlConfig } from "../urlconfig"
import { useDebounce } from "usehooks-ts"
import { Box, Flex, Heading, Select, Text, Textarea, useToast } from "@chakra-ui/react"
import PrismHighlight from "../components/PrismHighlight"
import ConfigNumberInput from "../components/ConfigNumberInput"

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
    const toast = useToast()
    const [config, setConfig] = useState<UrlConfig>({
        model: "text-davinci-003",
        prompt: "",
        output: "",
    })
    const debouncedConfig = useDebounce(config, 750)
    const htmlCode = useMemo(() => createEmbedCode(debouncedConfig), [debouncedConfig])

    const { value: parsedConfig, error } = useSearchParamConfig(true)
    useEffect(() => {
        if (error != null) {
            toast({
                status: "error",
                title: "Failed to load URL config",
                description: "Using default config. Check console for more information.",
            })
        }

        // note that we don't check here at all of the user started editing
        // anything... thats really an edge case though. useSearchParamConfig
        // should be instant
        if (parsedConfig != null) {
            setConfig(parsedConfig)
        }
    }, [parsedConfig, error])
    if (error != null) {
        console.error("failed to load config from url", error)
    }

    return (
        <Flex direction={{ base: "column", md: "row" }} p="2" gap="5">
            <Flex direction="column" gap="5" flex="1 1 0px" maxW={{ base: "100%", md: "50%" }}>
                <Flex direction="column" gap="2">
                    <Heading size="xl">Preview</Heading>
                    <Box
                        border="1px white dashed"
                        borderRadius="5"
                        dangerouslySetInnerHTML={{ __html: htmlCode }}
                    ></Box>
                </Flex>
                <Box>
                    <Heading size="xl">HTML Code</Heading>
                    <PrismHighlight code={htmlCode} language="markup" />
                </Box>
            </Flex>
            <Flex direction="column" gap="3" flex="1 1 0px">
                <Heading size="xl">Configuration</Heading>
                <Box>
                    <Text>Prompt</Text>
                    <Textarea
                        value={config.prompt}
                        onChange={(event) => setConfig({ ...config, prompt: event.currentTarget.value })}
                        resize="none"
                        placeholder="Type your prompt"
                    />
                </Box>
                <Box>
                    <Text>Output</Text>
                    <Textarea resize="none" placeholder="Type the output to display" />
                </Box>
                <Box>
                    <Text>Model</Text>
                    <Select>
                        {MODELS.map((model) => (
                            <option value="model">{model}</option>
                        ))}
                    </Select>
                </Box>
                <ConfigNumberInput name="Max Tokens" value={5} min={1} max={4000} step={1} onChange={() => {}} />
                <ConfigNumberInput name="Temperature" value={0.2} min={0} max={1} step={0.1} onChange={() => {}} />
                <ConfigNumberInput name="Top P" value={0.3} min={0} max={1} step={0.1} onChange={() => {}} />
            </Flex>
        </Flex>
    )
}

export default HomePage
