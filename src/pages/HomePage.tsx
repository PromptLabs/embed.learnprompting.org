import { useEffect, useMemo, useState } from "react"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, UrlConfig } from "../urlconfig"
import { useDebounce } from "usehooks-ts"
import { Box, Flex, Heading, Text, Textarea, useToast } from "@chakra-ui/react"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/nightOwl"

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
        <Flex direction="row" p="2" gap="5">
            <Flex direction="column" w="50%" gap="5">
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
                    <Highlight {...defaultProps} code={htmlCode} language="markup" theme={theme}>
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <Box
                                as="pre"
                                p="3"
                                borderRadius="5"
                                overflowY="hidden"
                                _hover={{ overflowY: "scroll" }}
                                className={className}
                                style={style}
                            >
                                {tokens.map((line, i) => (
                                    <div {...getLineProps({ line, key: i })}>
                                        {line.map((token, key) => (
                                            <span {...getTokenProps({ token, key })} />
                                        ))}
                                    </div>
                                ))}
                            </Box>
                        )}
                    </Highlight>
                </Box>
            </Flex>
            <Flex direction="column" gap="3">
                <Heading size="xl">Configuration</Heading>
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
