import { useEffect, useMemo, useState } from "react"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, MODELS, UrlConfig, urlConfigSchema } from "../urlconfig"
import { useDebounce } from "usehooks-ts"
import { Box, Flex, Heading, Select, Text, Textarea, useToast } from "@chakra-ui/react"
import PrismHighlight from "../components/PrismHighlight"
import ConfigNumberInput from "../components/ConfigNumberInput"

const HTML_TEMPLATE = `<iframe
    src="%URL%"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>`

const JSX_TEMPLATE = `<iframe
    src="%URL%"
    style={{width:"100%", height:"500px", border:"0", borderRadius:"4px", overflow:"hidden"}}
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>`

const createEmbedCode = (config: UrlConfig, type:string): string => {
    const query = encodeUrlConfig(config)
    const url = `${BASE_URL}/embed?config=${query}`
    if (type == "jsx") {
        return JSX_TEMPLATE.replace("%URL%", url)
    } else {
        return HTML_TEMPLATE.replace("%URL%", url)
    }
}

const HomePage = () => {
    const toast = useToast()
    const [config, setConfig] = useState<UrlConfig>(urlConfigSchema.getDefault())
    const debouncedConfig = useDebounce(config, 750)
    const htmlCode = useMemo(() => createEmbedCode(debouncedConfig, "html"), [debouncedConfig])
    const jsxCode = useMemo(() => createEmbedCode(debouncedConfig, "jsx"), [debouncedConfig])

    const { config: parsedConfig, error } = useSearchParamConfig()
    useEffect(() => {
        if (error != null) {
            console.error("failed to load config from url", error)
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

    return (
        <Box>
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
                    <Textarea
                        value={config.output}
                        onChange={(event) => setConfig({ ...config, output: event.currentTarget.value })}
                        resize="none"
                        placeholder="Type the output to display"
                    />
                </Box>
                <Box>
                    <Text>Model</Text>
                    <Select
                        value={config.model}
                        onChange={(event) => setConfig({ ...config, model: event.currentTarget.value })}
                    >
                        {MODELS.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </Select>
                </Box>
                <ConfigNumberInput
                    name="Max Tokens"
                    value={config.maxTokens}
                    min={1}
                    max={4000}
                    step={1}
                    onChange={(maxTokens) => setConfig({ ...config, maxTokens })}
                />
                <ConfigNumberInput
                    name="Temperature"
                    value={config.temperature}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={(temperature) => setConfig({ ...config, temperature })}
                />
                <ConfigNumberInput
                    name="Top P"
                    value={config.topP}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={(topP) => setConfig({ ...config, topP })}
                />
            </Flex>
        </Flex>
        <Flex direction={{ base: "column", md: "row" }} p="2" gap="5">
            <Flex direction="column" gap="5" flex="1 1 0px" maxW={{ base: "100%", md: "50%" }}>
                <Box>
                    <Heading size="xl">HTML Code</Heading>
                    <PrismHighlight code={htmlCode} language="markup" />
                </Box>
            </Flex>
            <Flex direction="column" gap="5" flex="1 1 0px" maxW={{ base: "100%", md: "50%" }}>
                <Box>
                    <Heading size="xl" style={{display:"inline"}}>JSX Code</Heading><Heading style={{display:"inline"}} size="l"> (Use for learnprompting.org)</Heading>
                    <PrismHighlight code={jsxCode} language="jsx" />
                </Box>
            </Flex>
        </Flex>
        
        </Box>
    )
}

export default HomePage
