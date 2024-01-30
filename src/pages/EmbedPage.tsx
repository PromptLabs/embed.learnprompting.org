import { useEffect, useState } from "react"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, UrlConfig, urlConfigSchema } from "../urlconfig"
import { Flex, Alert, AlertDescription, AlertIcon, AlertTitle, useToast, useDisclosure } from "@chakra-ui/react"
import { verifyApiKey } from "../openai"
import { Configuration, OpenAIApi } from "openai"
import AuthModal from "../components/AuthModal"
import Footer from "../components/Footer"
import Playground from "../components/Playground"
import ApiKeyInputModal from '../components/ApiKeyInputModal'
import { queryClient, useEditApiKey, useIsLoggedIn, useApiKey, client } from '../util'
import { useEffectOnce } from 'usehooks-ts'



const EmbedPage = () => {
    const toast = useToast()
    const { config: initialConfig, error } = useSearchParamConfig()
    const [config, setConfig] = useState<UrlConfig>(initialConfig ?? urlConfigSchema.getDefault())
    const [generating, setGenerating] = useState(false)

    const apiKey = useApiKey()
    const isLoggedIn = useIsLoggedIn()
    const { mutate } = useEditApiKey()


    const setApiKey = async () => {
        const res = await client().get('apiKey')
        const apiKey = await res.text()
        if (await verifyApiKey(apiKey)) {
            mutate(apiKey)
            queryClient.invalidateQueries({ queryKey: ['apiKey'] })
        }
    }

    useEffectOnce(() => {
        setApiKey()
    })

    // generate the openai completion and place it into the configuration.
    // handles if the api key is invalid and opens the modal.
    const handleGenerate = () => {
        const actionAsync = async () => {
            if (apiKey == null || !(await verifyApiKey(apiKey))) {
                mutate('')
                return
            }

            let openaiConfig = new Configuration({ apiKey })
            delete openaiConfig.baseOptions.headers['User-Agent']
            const openai = new OpenAIApi(openaiConfig)


            var responseText: string | undefined = "";
            if (config.model.includes("gpt-4") || config.model.includes("gpt-3.5")) {
                const response = await openai.createChatCompletion({
                    model: config.model,
                    messages: [
                        { "role": "user", "content": config.prompt }
                    ],
                })
                responseText = response.data?.['choices']?.[0]?.['message']?.['content']
                if (!responseText) {
                    throw new Error("no response text available")
                }
            } else {
                const response = await openai.createCompletion({
                    model: config.model,
                    prompt: config.prompt,
                    max_tokens: config.maxTokens,
                    temperature: config.temperature,
                    top_p: config.topP,
                })
                responseText = response.data?.choices?.[0]?.text
                if (!responseText) {
                    throw new Error("no response text available")
                }
                client().post('log', { json: { log: responseText } })

            }
            setConfig({ ...config, output: responseText })
            setGenerating(false)
        }

        setGenerating(true)
        actionAsync().catch((err) => {
            // mutate('') Maybe provide option for user to reset their key?
            queryClient.invalidateQueries({ queryKey: ['apiKey'] })
            console.error("Unexpected generation error", err)
            toast({
                status: "error",
                title: "Failed to generate",
                description: "Unexpected error. Check console for more information. Make sure that you have a credit card attached to your OpenAI playground (https://platform.openai.com/playground), not ChatGPT account. This is usually the cause of this problem.",
            })
            setGenerating(false)
        })
    }
    useEffect(() => {
        // if the input has just closed & we are still generating,
        // then that means they inputted their API key and now we
        // need to complete the generation task.
        if (apiKey && isLoggedIn && generating) {
            handleGenerate()
        }
    }, [apiKey, isLoggedIn])

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
                isOpen={!apiKey && isLoggedIn && generating}
                onComplete={(newKey) => {
                    mutate(newKey)
                }}
                onClose={console.log}
            />
            <AuthModal
                isOpen={!isLoggedIn && generating}
                onClose={console.log}
                onComplete={(token) => {
                    localStorage.setItem('token', token)
                    queryClient.invalidateQueries()
                }}
            />
        </>
    )
}

export default EmbedPage
