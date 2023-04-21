import { ElementType, ReactNode, useEffect, useState } from "react"
import { BsFillPlayFill } from "react-icons/bs"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, UrlConfig, urlConfigSchema } from "../urlconfig"
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
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Input,
    Text,
    ModalFooter,
    FormHelperText,
    FormErrorMessage,
    ModalProps,
    FormControl,
    FormLabel,
} from "@chakra-ui/react"
import { BsDot, BsFire } from "react-icons/bs"
import { MdGeneratingTokens } from "react-icons/md"
import { AiOutlineVerticalAlignTop } from "react-icons/ai"
import { useLocalStorage } from "usehooks-ts"
import { verifyApiKey } from "../openai"
import { Configuration, OpenAIApi } from "openai"

const Playground = ({
    generating,
    config,
    onGenerate,
    onUpdatePrompt,
}: {
    generating: boolean
    config: UrlConfig
    onGenerate: () => void
    onUpdatePrompt: (value: string) => void
}) => {
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
                    value={config.prompt}
                    onChange={(event) => onUpdatePrompt(event.currentTarget.value)}
                    readOnly={generating}
                />
                <LightMode>
                    <Button
                        size="lg"
                        leftIcon={<BsFillPlayFill size="2rem" />}
                        onClick={onGenerate}
                        disabled={config == null}
                        colorScheme="red"
                        isLoading={generating}
                        isDisabled={generating || config.prompt.length == 0}
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
                    {config.output}
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

const ApiKeyInputModal = ({
    onComplete,
    ...props
}: Omit<ModalProps, "children"> & { onComplete: (apiKey: string) => void }) => {
    const [apiKey, setApiKey] = useState("")
    const [failedVerify, setFailedVerify] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = () => {
        const actionAsync = async () => {
            if (!(await verifyApiKey(apiKey))) {
                setFailedVerify(true)
                return
            }

            onComplete(apiKey)
        }

        setSubmitting(true)
        actionAsync()
            .catch((err) => console.error("unexpected error", err))
            .finally(() => setSubmitting(false))
    }

    return (
        <Modal size="xl" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Your API Key</ModalHeader>
                <ModalBody>
                    <FormControl isInvalid={failedVerify}>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <Input
                            placeholder="sk...."
                            value={apiKey}
                            disabled={submitting}
                            onChange={(event) => {
                                if (failedVerify) {
                                    setFailedVerify(false)
                                }
                                setApiKey(event.currentTarget.value)
                            }}
                        />
                        {failedVerify ? (
                            <FormErrorMessage>Invalid API key</FormErrorMessage>
                        ) : (
                            <FormHelperText>We'll store this in Local Storage</FormHelperText>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter justifyContent="flex-start">
                    <Button onClick={handleSubmit} isLoading={submitting} isDisabled={submitting}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const EmbedPage = () => {
    const toast = useToast()
    const [apiKey, setApiKey] = useLocalStorage<string | null>("openai_api_key", null)
    const { config: initialConfig, error } = useSearchParamConfig()
    const [config, setConfig] = useState<UrlConfig>(initialConfig ?? urlConfigSchema.getDefault())
    const [generating, setGenerating] = useState(false)
    const { isOpen: isAPIKeyInputOpen, onOpen: onAPIKeyInputOpen, onClose: onAPIKeyInputClose } = useDisclosure()

    // generate the openai completion and place it into the configuration.
    // handles if the api key is invalid and opens the modal.
    const handleGenerate = () => {
        const actionAsync = async () => {
            if (apiKey == null || !(await verifyApiKey(apiKey))) {
                // if their api key is invalid, open the dialogue to fix
                // it up but leave generating status to true so generation
                // will complete afterwards
                onAPIKeyInputOpen()
                return
            }

            const openai = new OpenAIApi(new Configuration({ apiKey }))
            const response = await openai.createCompletion({
                model: config.model,
                prompt: config.prompt,
                max_tokens: config.maxTokens,
                temperature: config.temperature,
                top_p: config.topP,
            })
            const responseText = response.data.choices[0].text
            if (!responseText) {
                throw new Error("no response text available")
            }

            setConfig({ ...config, output: responseText })
            setGenerating(false)
        }

        setGenerating(true)
        actionAsync().catch((err) => {
            console.error("Unexpected generation error", err)
            toast({
                status: "error",
                title: "Failed to generate",
                description: "Unexpected error. Check console for more information.",
            })
            setGenerating(false)
        })
    }
    useEffect(() => {
        // if the input has just closed & we are still generating,
        // then that meats they inputted their API key and now we
        // need to complete the generation task.
        if (!isAPIKeyInputOpen && generating) {
            handleGenerate()
        }
    }, [isAPIKeyInputOpen])

    if (!initialConfig) {
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
    return (
        <>
            <Flex direction="column" h="100vh">
                <Playground
                    config={config}
                    generating={generating}
                    onGenerate={handleGenerate}
                    onUpdatePrompt={(prompt) => setConfig({ ...config, prompt })}
                />
                <Footer editUrl={config ? `${BASE_URL}/?config=${encodeUrlConfig(config)}` : BASE_URL} />
            </Flex>
            <ApiKeyInputModal
                isOpen={isAPIKeyInputOpen}
                onClose={onAPIKeyInputClose}
                onComplete={(newKey) => {
                    setApiKey(newKey)
                    onAPIKeyInputClose()
                }}
            />
        </>
    )
}

export default EmbedPage
