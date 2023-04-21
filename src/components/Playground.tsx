import { Flex, Heading, Textarea, LightMode, Button, Tooltip, HStack, Icon, Mark } from "@chakra-ui/react"
import { ReactNode, ElementType } from "react"
import { AiOutlineVerticalAlignTop } from "react-icons/ai"
import { BsFire, BsFillPlayFill, BsDot } from "react-icons/bs"
import { MdGeneratingTokens } from "react-icons/md"
import { UrlConfig } from "../urlconfig"

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

export default Playground
