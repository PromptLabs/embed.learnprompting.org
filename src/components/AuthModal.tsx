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
                    <Button onClick={() => login()}>Log in with Google</Button>
                    <Center> or </Center>
                    <Text>Enter your Learn Prompting Plus email</Text>
                    <InputGroup size="sm">
                        <Input placeholder="example@mail.com" type="email" ref={emailInput} />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={async () => await checkWhitelisted()}>
                                Submit
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    )
}

export default AuthModal
