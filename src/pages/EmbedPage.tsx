import { Box, Button, Flex, LoadingOverlay, Mark, Space, Text, Title } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { BsFillPlayFill } from "react-icons/bs"
import { useSearchParamConfig } from "../hooks/useSearchParamConfig"
import { BASE_URL } from "../main"
import { encodeUrlConfig } from "../urlconfig"

type PromptEditorProps = { prompt?: string; onGenerate: (prompt: string) => void }
const PromptEditor: FC<PromptEditorProps> = ({ prompt: defaultPrompt, onGenerate }) => {
    const [prompt, setPrompt] = useState(defaultPrompt)
    useEffect(() => {
        setPrompt(defaultPrompt)
    }, [defaultPrompt])
    return (
        <>
            <Title order={2}>Prompt</Title>
            <textarea
                placeholder="Write your prompt here"
                style={{ flexBasis: "100%", flexShrink: 1, boxSizing: "border-box", resize: "none" }}
                value={prompt ?? ""}
                onChange={(event) => setPrompt(event.currentTarget.value)}
            />
            <Button size="lg" leftIcon={<BsFillPlayFill size="2rem" />} onClick={() => onGenerate(prompt ?? "")}>
                Generate
            </Button>
        </>
    )
}

const OutputDisplay = ({ output }: { output: string }) => {
    return (
        <>
            <Title order={2}>Output</Title>
            <Mark
                color="green"
                style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap", boxDecorationBreak: "clone" }}
            >
                {output}
            </Mark>
        </>
    )
}

const Playground: FC<PromptEditorProps> = (props) => {
    return (
        <Flex direction="row" p="sm" h="100%">
            <Flex direction="column" w="50%" gap="xs">
                <PromptEditor {...props} />
            </Flex>
            <Space p="xs" />
            <Flex direction="column" w="50%" gap="xs">
                <OutputDisplay output="test output test output test output test output test output test output test output test output test output test output test output test output test output " />
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

    const handleGenerate = () => {}

    if (error != null) {
        console.error("failed to parse config", error)
        return <span>error: {error.message}</span>
    }
    return (
        <Box pos="relative">
            <LoadingOverlay visible={config == null} overlayBlur={2} />
            <Flex direction="column" h="100vh">
                <Playground prompt={config?.prompt} onGenerate={handleGenerate} />
                <Space mt="auto" />
                <Footer editUrl={config ? `${BASE_URL}/?config=${encodeUrlConfig(config)}` : BASE_URL} />
            </Flex>
        </Box>
    )
}

export default EmbedPage
