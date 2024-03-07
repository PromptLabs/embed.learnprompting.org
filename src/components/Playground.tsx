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
        <Flex direction={{ base: "column", sm: "row" }} p="32px 24px" gap="5" minH="0" h="100%" bg='black'>
            <Flex direction="column" gap="5" flex="1 1 0" >
                <Heading size="lg" color='white'>Prompt</Heading>
                <Textarea
                    bg='#212432'
                    color='white'
                    borderRadius='2'
                    border='none'
                    placeholder="Write your prompt here"
                    flexBasis="100%"
                    flexShrink="1"
                    boxSizing="border-box"
                    resize="none"
                    value={config.prompt}
                    onChange={(event) => onUpdatePrompt(event.currentTarget.value)}
                    readOnly={generating}
                />
                <Button
                    height='64px'
                    borderRadius='2'
                    leftIcon={<BsFillPlayFill size="18px" />}
                    onClick={onGenerate}
                    disabled={config == null}
                    background='#00FFBF'
                    colorScheme="#00FFBF"
                    isLoading={generating}
                    isDisabled={generating || config.prompt.length == 0}
                    fontSize='16px'
                    justifyContent='flex-start'
                    alignItems='center'
                >
                    <span style={{ height: '40px', alignItems: 'center', display: 'flex', color: 'white' }}>Generate Output</span>
                </Button>
                <Flex direction="row" alignItems="center" justifyContent="flex-start" fontSize="xs" gap="1" color='gray'>
                    {configDisplayElements
                        .map<ReactNode>(({ label, data, icon }) => (
                            <Tooltip label={label} key={label} placement="top" hasArrow>
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
                <Heading size="lg" color='white'>Output</Heading>
                {config.output ? <Mark
                    backgroundColor="#9CFFE6"
                    overflowWrap="break-word"
                    whiteSpace="pre-wrap"
                    boxDecorationBreak="clone"
                    padding="3"
                >
                    {config.output}
                </Mark> : <></>}
            </Flex>
        </Flex>
    )
}

export default Playground
