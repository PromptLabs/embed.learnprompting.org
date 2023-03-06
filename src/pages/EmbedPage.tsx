import { Anchor, AppShell, Box, Button, Flex, Mark, ScrollArea, Space, Text, Textarea, Title } from "@mantine/core"
import { FC, useEffect, useMemo, useState } from "react"
import { BsFillPlayFill } from "react-icons/bs"
import { useAsyncMemo } from "../hooks/useAsyncMemo"
import { decodeUrlConfig, UrlConfig } from "../urlconfig"

type PromptEditorProps = { prompt: string; onGenerate: (prompt: string) => void }
const PromptEditor: FC<PromptEditorProps> = ({ prompt: defaultPrompt, onGenerate }) => {
    const [prompt, setPrompt] = useState(defaultPrompt)
    return (
        <>
            <Title order={2}>Prompt</Title>
            <textarea
                placeholder="Write your prompt here"
                style={{ flexBasis: "100%", flexShrink: 1, boxSizing: "border-box", resize: "none" }}
                value={prompt ?? ""}
                onSubmit={(event) => setPrompt(event.currentTarget.value)}
            />
            <Button size="lg" leftIcon={<BsFillPlayFill size="2rem" />} onClick={() => onGenerate(prompt)}>
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
    const { value: config, error } = useAsyncMemo(
        async () => {
            const params = new URLSearchParams(window.location.search)
            const config = params.get("config")
            if (config == null) {
                throw new Error(`query param "config" does not exist in url`)
            }

            try {
                return decodeUrlConfig(config)
            } catch (error) {
                throw new Error(`failed to parse config`, { cause: error })
            }
        },
        [],
        null
    )

    const handleGenerate = () => {}

    if (error != null) {
        console.error("failed to parse config", error)
        return <span>error: {error.message}</span>
    }
    if (config == null) {
        return <span>loading...</span>
    }
    return (
        <Flex direction="column" h="100vh">
            <Playground prompt={config.prompt} onGenerate={handleGenerate} />
            <Space mt="auto" />
            <Footer editUrl="lol.com" />
        </Flex>
    )
}

export default EmbedPage
