import {
    ModalProps,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Text,
    InputRightElement,
    InputGroup,
    Center,
    useToast,
    Heading,
    Stack,
    Flex,
} from "@chakra-ui/react"
import { useGoogleLogin } from "@react-oauth/google"
import { queryClient, client } from "../util"
import { useRef } from "react"

const AuthModal = ({
    onComplete,
    ...props
}: Omit<ModalProps, "children"> & { onComplete: (apiKey: string) => void }) => {
    const emailInput = useRef<HTMLInputElement>(null!)
    const toast = useToast()

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            localStorage.setItem("token", tokenResponse.access_token)
            queryClient.invalidateQueries()
            location.reload()
        },
    })

    const checkWhitelisted = async () => {
        const email = emailInput.current?.value || ""
        const res = client().post("whitelisted", { json: { email } })
        const { whitelisted }: { whitelisted: boolean } = await res.json()

        if (whitelisted) {
            localStorage.setItem("whitelisted_email", email)
            queryClient.invalidateQueries()
            location.reload()
        } else {
            toast({
                status: "error",
                title: "Invalid Email",
                description:
                    "It seems like the email you entered is not associated with a valid Learn Prompting Plus account. Please enter a valid email, or use your gmail to authenticate!",
            })
        }
    }

    return (
        <Modal size="xl" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Please log in</ModalHeader>
                <ModalBody>
                    <Stack>
                        <Flex direction={"column"} align={"center"}>
                            <Heading size="sm">Enter your Learn Prompting Plus email</Heading>
                            <InputGroup size="sm" w={"60%"} mt={2} borderRadius={"md"}>
                                <Input
                                    placeholder="example@mail.com"
                                    type="email"
                                    ref={emailInput}
                                    variant="filled"
                                    p={2}
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            await checkWhitelisted()
                                        }
                                    }}
                                />
                                <InputRightElement width="4.5rem" p={1}>
                                    <Button h="1.75rem" size="sm" onClick={async () => await checkWhitelisted()}>
                                        Submit
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <br />
                            <Heading size="sm"> or </Heading>
                            <br />
                            <Button onClick={() => login()}>Log in with Google</Button>
                        </Flex>
                    </Stack>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    )
}

export default AuthModal
