import { useEffect, useMemo, useState } from "react"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig, MODELS, UrlConfig, urlConfigSchema } from "../urlconfig"
import { useDebounce } from "usehooks-ts"
import {
    Box,
    Center,
    Flex,
    Heading,
    Select,
    Stack,
    Text,
    UnorderedList,
    ListItem,
    Textarea,
    useToast,
} from "@chakra-ui/react"
import PrismHighlight from "../components/PrismHighlight"
import ConfigNumberInput from "../components/ConfigNumberInput"
import { Link } from "react-router-dom"

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

const createEmbedCode = (config: UrlConfig, type: string): string => {
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
            <Flex direction={{ base: "column", md: "row" }} width="100%">
                <Stack w={{ base: "80%", md: "50%" }} p="6" gap="5" h="100%" style={{ margin: "0 2%" }}>
                    <Heading size="lg">Usage</Heading>
                    <Box>
                        <Text>
                            The Learn Prompting Embeds allow you to integrate interactive AI prompt generators directly
                            into your website. To start configure the embed by editing the default parameters:
                        </Text>
                        <br />
                        <UnorderedList>
                            <ListItem>
                                <Link
                                    to="https://learnprompting.org/docs/basics/formalizing"
                                    target="_blank"
                                    style={{ fontWeight: "bold", color: "#685DF8" }}
                                >
                                    Prompt:
                                </Link>{" "}
                                The initial text or question provided to the language model (LLM) as input.
                            </ListItem>
                            <ListItem>
                                <Link to="" target="_blank" style={{ fontWeight: "bold", color: "#685DF8" }}>
                                    Output:
                                </Link>{" "}
                                The text generated by the LLM in response to the prompt, based on its training and
                                parameters.
                            </ListItem>
                            <ListItem>
                                <Link
                                    to="https://learnprompting.org/docs/basics/world"
                                    target="_blank"
                                    style={{ fontWeight: "bold", color: "#685DF8" }}
                                >
                                    Model:
                                </Link>{" "}
                                The underlying structure and trained parameters of the LLM that determine how it
                                processes inputs and generates outputs.
                            </ListItem>
                            <ListItem>
                                <Link
                                    to="https://learnprompting.org/docs/basics/configuration_hyperparameters#header-0"
                                    target="_blank"
                                    style={{ fontWeight: "bold", color: "#685DF8" }}
                                >
                                    Temperature:
                                </Link>{" "}
                                A parameter that influences the randomness or creativity of the LLM's responses, with
                                higher values leading to more varied outputs.
                            </ListItem>
                            <ListItem>
                                <Link
                                    to="https://learnprompting.org/docs/basics/configuration_hyperparameters#header-2"
                                    target="_blank"
                                    style={{ fontWeight: "bold", color: "#685DF8" }}
                                >
                                    Max Tokens:
                                </Link>{" "}
                                The maximum number of tokens (words or subwords) that the LLM is allowed to generate in
                                its response, setting a limit on the length.
                            </ListItem>
                            <ListItem>
                                <Link
                                    to="https://learnprompting.org/docs/basics/configuration_hyperparameters#header-1"
                                    target="_blank"
                                    style={{ fontWeight: "bold", color: "#685DF8" }}
                                >
                                    Top P:
                                </Link>{" "}
                                A parameter that controls the diversity of the LLM's outputs by limiting token
                                generation to the most probable subset, balancing randomness and coherence.
                            </ListItem>
                        </UnorderedList>
                        <br />
                        <Text>
                            These options can be found on the right side under the Preview embed. Once you have
                            customized the settings to your liking, your configuration will be encoded into an iframe
                            code snippet, in either HTML or JSX.
                            <br />
                            <br />
                            Copy this iframe and paste it into the source code of your website where you want the embed
                            to appear. This will enable your site visitors to interact with the AI prompts and generate
                            their own outputs.
                        </Text>
                    </Box>
                    <br />
                    <Heading size="lg">Workflow</Heading>
                    <Box>
                        <Text>
                            When generating ouput for the first time, users will be prompted to sign in with their
                            Google account.
                        </Text>
                        <br />
                        <Text>
                            Whitelisted users, or those with an active Learn Prompting Plus membership, enjoy a
                            streamlined experience as they do not need to enter an API key. Their membership status is
                            automatically recognized when logging in with their associated email, allowing them to focus
                            on creating and testing prompts without any additional setup.
                        </Text>
                        <br />
                        <Text>
                            For users who are not Learn Prompting Plus members, an additional step is required. After
                            signing in with Google, they will be prompted to enter their OpenAI API key. This key is
                            necessary for the embed to communicate with the user's OpenAI account and can be found in
                            the user's{" "}
                            <Link
                                to="https://platform.openai.com/api-keys"
                                target="_blank"
                                style={{ fontWeight: "bold", color: "#685DF8" }}
                            >
                                OpenAI account settings
                            </Link>
                            .
                        </Text>
                        <br />
                        <Text>
                            This initial login step ensures that the user's OpenAI API key is securely stored and
                            automatically applied in future sessions, eliminating the need to re-enter the key each
                            time. After a successful login, a cookie will be stored in the user's browser. While the
                            cookie is still valid, users will automatically be authenticated. When the cookie expires,
                            the user will have to login with their google account again.
                        </Text>
                        <br />
                        <Text>
                            If you have issues getting the embed to work in your site or have any questions, please feel
                            free to contact us on{" "}
                            <Link
                                to="https://discord.com/invite/learn-prompting-1046228027434086460"
                                target="_blank"
                                style={{ fontWeight: "bold", color: "#685DF8" }}
                            >
                                Discord
                            </Link>
                            !
                        </Text>
                    </Box>
                </Stack>
                <Box w={{ base: "100%", md: "50%" }}>
                    <Stack p="6" gap="5">
                        <Flex direction="column" gap="5" flex="1 1 0px">
                            <Flex direction="column" gap="2">
                                <Heading size="lg">Preview</Heading>
                                <Box
                                    border="1px white dashed"
                                    borderRadius="5"
                                    dangerouslySetInnerHTML={{ __html: htmlCode }}
                                ></Box>
                            </Flex>
                        </Flex>
                        <Flex direction="column" gap="3" flex="1 1 0px">
                            <Heading size="lg">Configuration</Heading>
                            <Flex gap={6} direction={{ base: "column", xl: "row" }}>
                                <Box width="100%">
                                    <Box>
                                        <Text>Prompt</Text>
                                        <Textarea
                                            variant="filled"
                                            value={config.prompt}
                                            onChange={(event) =>
                                                setConfig({ ...config, prompt: event.currentTarget.value })
                                            }
                                            resize="none"
                                            placeholder="Type your prompt"
                                        />
                                    </Box>
                                    <Box>
                                        <Text>Output</Text>
                                        <Textarea
                                            variant="filled"
                                            value={config.output}
                                            onChange={(event) =>
                                                setConfig({ ...config, output: event.currentTarget.value })
                                            }
                                            resize="none"
                                            placeholder="Type the output to display"
                                        />
                                    </Box>
                                </Box>
                                <Box width="100%">
                                    <Box>
                                        <Text>Model</Text>
                                        <Select
                                            variant="filled"
                                            value={config.model}
                                            onChange={(event) =>
                                                setConfig({ ...config, model: event.currentTarget.value })
                                            }
                                        >
                                            {MODELS.map((model) => (
                                                <option key={model} value={model}>
                                                    {model}
                                                </option>
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
                                </Box>
                            </Flex>
                        </Flex>
                    </Stack>
                    <Flex direction={{ base: "column", xl: "row" }} p="2">
                        <Flex direction="column" gap="5" maxW={{ base: "100%", xl: "50%" }}>
                            <Box p={4}>
                                <Heading size="lg">HTML Code</Heading>
                                <PrismHighlight code={htmlCode} language="markup" />
                            </Box>
                        </Flex>
                        <Flex direction="column" gap="5" maxW={{ base: "100%", xl: "50%" }}>
                            <Box p={4}>
                                <Heading size="lg" style={{ display: "inline" }}>
                                    JSX Code
                                </Heading>
                                <Heading style={{ display: "inline" }} size="l">
                                    {" "}
                                    (Use for learnprompting.org)
                                </Heading>
                                <PrismHighlight code={jsxCode} language="jsx" />
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}

export default HomePage
