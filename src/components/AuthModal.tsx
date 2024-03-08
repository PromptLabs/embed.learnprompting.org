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
} from "@chakra-ui/react"
import { useGoogleLogin } from "@react-oauth/google"
import { queryClient, useCheckWhitelist } from "../util"
import { useRef } from "react"

const AuthModal = ({
    onComplete,
    ...props
}: Omit<ModalProps, "children"> & { onComplete: (apiKey: string) => void }) => {
    const emailInput = useRef<HTMLInputElement>(null!)

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            localStorage.setItem("token", tokenResponse.access_token)
            queryClient.invalidateQueries()
            location.reload()
        },
    })

    const checkWhitelisted = (email: string) => {
        const whitelisted = useCheckWhitelist(email)

        if (whitelisted) {
            localStorage.setItem("whitelisted_email", email)
            queryClient.invalidateQueries({ queryKey: ["checkWhitelisted"] })
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
                            <Button
                                h="1.75rem"
                                size="sm"
                                onClick={(e) => checkWhitelisted(emailInput.current.value || "")}
                            >
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
