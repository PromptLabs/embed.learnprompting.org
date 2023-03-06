import { Anchor, AppShell, Box, Flex, Mark, ScrollArea, Space, Text, Textarea } from "@mantine/core"

const PromptEditor = () => {
    return (
        <>
            <Text>Prompt</Text>
            <textarea style={{ flexBasis: "100%", flexShrink: 1, boxSizing: "border-box" }} />
        </>
    )
}

const OutputDisplay = ({ output }: { output: string }) => {
    return (
        <>
            <Text>Output</Text>
            <Mark
                color="cyan"
                w="fit-content"
                style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap", boxDecorationBreak: "clone" }}
            >
                {output}
            </Mark>
        </>
    )
}

const Playground = () => {
    return (
        <Flex direction="row" p="sm" h="100%">
            <Flex direction="column" w="50%">
                <PromptEditor />
            </Flex>
            <Space p="xs" />
            <Flex direction="column" w="50%">
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
    return (
        <Flex direction="column" h="100vh">
            <Playground />
            <Space mt="auto" />
            <Footer editUrl="lol.com" />
        </Flex>
    )
}

export default EmbedPage
