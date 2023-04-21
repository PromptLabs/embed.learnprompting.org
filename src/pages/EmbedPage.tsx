import { useEffect, useState } from "react"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, UrlConfig, urlConfigSchema } from "../urlconfig"
import { Flex, Alert, AlertDescription, AlertIcon, AlertTitle, useToast, useDisclosure } from "@chakra-ui/react"
import { useLocalStorage } from "usehooks-ts"
import { verifyApiKey } from "../openai"
import { Configuration, OpenAIApi } from "openai"
import ApiKeyInputModal from "../components/ApiKeyInputModal"
import Footer from "../components/Footer"
import Playground from "../components/Playground"

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
