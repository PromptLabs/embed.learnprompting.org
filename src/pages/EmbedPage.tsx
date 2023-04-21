import { ElementType, ReactNode, useEffect, useState } from "react"
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
    Icon,
    Tooltip,
    HStack,
    useToast,
} from "@chakra-ui/react"
import { BsDot, BsFire } from "react-icons/bs"
import { MdGeneratingTokens } from "react-icons/md"
import { AiOutlineVerticalAlignTop } from "react-icons/ai"

const Playground = ({
    config,
    onGenerate,
}: {
    config: UrlConfig
    onGenerate: (config: UrlConfig, prompt: string) => Promise<string>
}) => {
    const toast = useToast()
    const [generating, setGenerating] = useState(false)
    const [prompt, setPrompt] = useState(config.prompt)
    const [output, setOutput] = useState(config.output)

    const handleGenerate = () => {
        if (generating) {
            return
        }

        setGenerating(true)
        onGenerate(config, prompt)
            .then((output) => {
                setOutput(output)
            })
            .catch((err) => {
                console.error("failed to generate", err)
                toast({
                    status: "error",
                    title: "Failed to generate",
                    description: "Unexpected error. Check console for more information.",
                })
            })
            .finally(() => {
                setGenerating(false)
            })
    }

    const configDisplayElements: { label: string; data: ReactNode; icon?: ElementType }[] = [
        { label: "OpenAI Model", data: config.model },
        { label: "Max Tokens", data: config.maxTokens, icon: MdGeneratingTokens },
        { label: "Temperature", data: config.temperature, icon: BsFire },
        { label: "Top P", data: config.topP, icon: AiOutlineVerticalAlignTop },
    ]
    return (
        <Flex direction={{ base: "column", sm: "row" }} p="2" gap="5" minH="0" h="100%">
            <Flex direction="column" gap="3" flex="1 1 0">
                <Heading size="md">Prompt</Heading>
                <Textarea
                    placeholder="Write your prompt here"
                    flexBasis="100%"
                    flexShrink="1"
                    boxSizing="border-box"
                    resize="none"
                    value={prompt}
                    onChange={(event) => setPrompt(event.currentTarget.value)}
                    readOnly={generating}
                />
                <LightMode>
                    <Button
                        size="lg"
                        leftIcon={<BsFillPlayFill size="2rem" />}
                        onClick={handleGenerate}
                        disabled={config == null}
                        colorScheme="red"
                        isLoading={generating}
                        isDisabled={generating || prompt.length == 0}
                    >
                        Generate
                    </Button>
                </LightMode>
                <Flex direction="row" alignItems="center" justifyContent="center" fontSize="xs" gap="1">
                    {configDisplayElements
                        .map<ReactNode>(({ label, data, icon }) => (
                            <Tooltip label={label} placement="top" hasArrow>
                                <HStack>
                                    {icon && <Icon as={icon} />}
                                    <span>{data}</span>
                                </HStack>
                            </Tooltip>
                        ))
                        .reduce((acc, elem) => [acc, <Icon as={BsDot} />, elem])}
                </Flex>
            </Flex>
            <Flex direction="column" gap="3" flex="1 1 0" overflow="auto">
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

    if (!config) {
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Failed to load config</AlertTitle>
                <AlertDescription>No config parameter was provided in the URL</AlertDescription>
            </Alert>
        )
    }
    if (!!error) {
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

    const onGenerate = async (config: UrlConfig, prompt: string): Promise<string> => {
        throw new Error("unimpkemented")
    }
    return (
        <Flex direction="column" h="100vh">
            <Playground config={config} onGenerate={onGenerate} />
            <Footer editUrl={config ? `${BASE_URL}/?config=${encodeUrlConfig(config)}` : BASE_URL} />
        </Flex>
    )
}

export default EmbedPage
