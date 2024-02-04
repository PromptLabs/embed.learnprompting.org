import { Flex, Link, Spacer } from "@chakra-ui/react"

const Footer = ({ editUrl }: { editUrl: string }) => {
    return (
        <Flex p="sm" textDecoration="underline" backgroundColor="gray.700" padding="2" fontSize="sm">
            <Link href="https://learnprompting.org" isExternal>
                learnprompting.org
            </Link>
            <Spacer />
            <Link href={editUrl} isExternal>
                edit this embed
            </Link>
        </Flex>
    )
}

export default Footer
