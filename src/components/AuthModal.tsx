import {
    ModalProps,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import { useGoogleLogin } from '@react-oauth/google'
import { queryClient } from '../util'

const AuthModal = ({
    onComplete,
    ...props
}: Omit<ModalProps, "children"> & { onComplete: (apiKey: string) => void }) => {

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            localStorage.setItem('token', tokenResponse.access_token)
            queryClient.invalidateQueries()
            location.reload()
        },
    });


    return (
        <Modal size="xl" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Please log in</ModalHeader>
                <ModalBody>
                    <Button onClick={() => login()}>
                        Log in with Google
                    </Button>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    )
}

export default AuthModal
