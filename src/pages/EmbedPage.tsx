import { useEffect, useState } from "react"
import { BsFillPlayFill } from "react-icons/bs"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, UrlConfig } from "../urlconfig"
import {
    Flex,
    Button,
    Mark,
    Alert,
    Heading,
    Link,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Spacer,
    Textarea,
    LightMode,
} from "@chakra-ui/react"

const Playground = ({ config }: { config?: UrlConfig }) => {
    const [prompt, setPrompt] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    useEffect(() => {
        if (!config) {
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
        <Flex direction={{ base: "column", sm: "row" }} p="2" h="100%" gap="5">
            <Flex direction="column" gap="3" flex="1 1 0px">
                <Heading size="md">Prompt</Heading>
                <Textarea
                    placeholder="Write your prompt here"
                    flexBasis="100%"
                    flexShrink="1"
                    boxSizing="border-box"
                    resize="none"
                    value={prompt}
                    onChange={(event) => setPrompt(event.currentTarget.value)}
                />
                <LightMode>
                    <Button
                        size="lg"
                        leftIcon={<BsFillPlayFill size="2rem" />}
                        onClick={handleGenerate}
                        disabled={config == null}
                        colorScheme="red"
                    >
                        Generate
                    </Button>
                </LightMode>
            </Flex>
            <Flex direction="column" gap="3" flex="1 1 0px">
                <Heading size="md">Output</Heading>
                <Mark
                    backgroundColor="green.100"
                    overflowWrap="break-word"
                    whiteSpace="pre-wrap"
                    boxDecorationBreak="clone"
                >
                    {output}
                </Mark>
            </Flex>
        </Flex>
    )
}

const Footer = ({ editUrl }: { editUrl: string }) => {
    return (
        <Flex p="sm" textDecoration="underline" backgroundColor="gray.700" padding="2" fontSize="sm">
            <Link href="https://learnprompting.org" isExternal>
                learnprompting.org
            </Link>
            <Spacer />
            <Link href={editUrl} isExternal>
                edit this embed
            </Link>
        </Flex>
    )
}

const EmbedPage = () => {
    const { config, error } = useSearchParamConfig()

    if (error != null) {
        console.error("failed to parse config", error)
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Failed to load config</AlertTitle>
                <AlertDescription>
                    Failed to load the provided config ({error.message}). Please check console for more information.
                </AlertDescription>
            </Alert>
        )
    }
    return (
        <Box pos="relative">
            <Flex direction="column" h="100vh">
                <Playground config={config} />
                <Footer editUrl={config ? `${BASE_URL}/?config=${encodeUrlConfig(config)}` : BASE_URL} />
            </Flex>
        </Box>
    )
}

export default EmbedPage
