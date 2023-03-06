import { Anchor, AppShell, Flex, Footer, Space, Text } from "@mantine/core"

const ShellFooter = ({ editUrl }: { editUrl: string }) => {
    return (
        <Footer height="fit-content">
            <Flex direction="row" p="sm" td="underline">
                <Text component="a" href="https://learnprompting.org" target="_blank">
                    learnprompting.org
                </Text>
                <Space ml="auto" />
                <Text component="a" href={editUrl} target="_blank">
                    edit this embed
                </Text>
            </Flex>
        </Footer>
    )
}

const EmbedPage = () => {
    return (
        <AppShell footer={<ShellFooter editUrl="lol.com" />}>
            <Flex direction="row">
                <Flex direction="column" style={{ flexGrow: 1 }}>
                    <Text>Prompt</Text>
                </Flex>
                <Flex direction="column" style={{ flexGrow: 1 }}>
                    <Text>Output</Text>
                </Flex>
            </Flex>
        </AppShell>
    )
}

export default EmbedPage
