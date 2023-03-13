import { Alert, Box, Button, Flex, LoadingOverlay, Mark, Space, Text, Title } from "@mantine/core"
import { useEffect, useState } from "react"
import { BsFillPlayFill } from "react-icons/bs"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, UrlConfig } from "../urlconfig"
import { FiAlertCircle } from "react-icons/fi"

const Playground = ({ config }: { config: UrlConfig | null }) => {
    const [prompt, setPrompt] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    useEffect(() => {
        if (config == null) {
            return
        }

        setPrompt(config.prompt)
        setOutput(config.output)
    }, [config])

    const handleGenerate = () => {
        // config must be loaded in order to generate
        if (config == null) {
            return
        }
    }
    return (
        <Flex direction="row" p="sm" h="100%">
            <Flex direction="column" w="50%" gap="xs">
                <Title order={2}>Prompt</Title>
                <textarea
                    placeholder="Write your prompt here"
                    style={{ flexBasis: "100%", flexShrink: 1, boxSizing: "border-box", resize: "none" }}
                    value={prompt}
                    onChange={(event) => setPrompt(event.currentTarget.value)}
                />
                <Button
                    size="lg"
                    leftIcon={<BsFillPlayFill size="2rem" />}
                    onClick={handleGenerate}
                    disabled={config == null}
                >
                    Generate
                </Button>
            </Flex>
            <Space p="xs" />
            <Flex direction="column" w="50%" gap="xs">
                <Title order={2}>Output</Title>
                <Mark
                    color="green"
                    style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap", boxDecorationBreak: "clone" }}
                >
                    {output}
                </Mark>
            </Flex>
        </Flex>
    )
}

const Footer = ({ editUrl }: { editUrl: string }) => {
    return (
        <Flex direction="row" p="sm" td="underline">
            <Text component="a" href="https://learnprompting.org" target="_blank">
                learnprompting.org
            </Text>
            <Space ml="auto" />
            <Text component="a" href={editUrl} target="_blank">
                edit this embed
            </Text>
        </Flex>
    )
}

const EmbedPage = () => {
    const { value: config, error } = useSearchParamConfig()

    if (error != null) {
        console.error("failed to parse config", error)
        return (
            <Alert icon={<FiAlertCircle size="1rem" />} title="Failed to load config" color="red">
                Failed to load the provided config ({error.message}). Please check console for more information.
            </Alert>
        )
    }
    return (
        <Box pos="relative">
            <LoadingOverlay visible={config == null} overlayBlur={2} />
            <Flex direction="column" h="100vh">
                <Playground config={config} />
                <Space mt="auto" />
                <Footer editUrl={config ? `${BASE_URL}/?config=${encodeUrlConfig(config)}` : BASE_URL} />
            </Flex>
        </Box>
    )
}

export default EmbedPage
