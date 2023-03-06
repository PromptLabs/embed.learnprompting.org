import { Anchor, AppShell, Box, Button, Flex, Mark, ScrollArea, Space, Text, Textarea, Title } from "@mantine/core"
import { BsFillPlayFill } from "react-icons/bs"

const PromptEditor = () => {
    return (
        <>
            <Title order={2}>Prompt</Title>
            <textarea
                placeholder="Write your prompt here"
                style={{ flexBasis: "100%", flexShrink: 1, boxSizing: "border-box" }}
            />
            <Button size="lg" leftIcon={<BsFillPlayFill size="2rem" />}>
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

const Playground = () => {
    return (
        <Flex direction="row" p="sm" h="100%">
            <Flex direction="column" w="50%" gap="xs">
                <PromptEditor />
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
    return (
        <Flex direction="column" h="100vh">
            <Playground />
            <Space mt="auto" />
            <Footer editUrl="lol.com" />
        </Flex>
    )
}

export default EmbedPage
