import { Box, Text } from "@chakra-ui/react"
import Highlight, { defaultProps, Language } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/nightOwl"

const PrismHighlight = ({ code, language }: { code: string; language: Language }) => {
    return (
        <Highlight {...defaultProps} theme={theme} code={code} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <Text
                    p="3"
                    whiteSpace="pre"
                    borderRadius="5"
                    overflowY="hidden"
                    _hover={{ overflowY: "scroll" }}
                    className={className}
                    style={style}
                >
                    {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </Text>
            )}
        </Highlight>
    )
}

export default PrismHighlight
