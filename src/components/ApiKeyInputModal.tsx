import {
    ModalProps,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    FormHelperText,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import { useState } from "react"
import { verifyApiKey } from "../openai"

const ApiKeyInputModal = ({
    onComplete,
    ...props
}: Omit<ModalProps, "children"> & { onComplete: (apiKey: string) => void }) => {
    const [apiKey, setApiKey] = useState("")
    const [failedVerify, setFailedVerify] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = () => {
        const actionAsync = async () => {
            if (!(await verifyApiKey(apiKey))) {
                setFailedVerify(true)
                return
            }

            onComplete(apiKey)
        }

        setSubmitting(true)
        actionAsync()
            .catch((err) => console.error("unexpected error", err))
            .finally(() => setSubmitting(false))
    }

    return (
        <Modal size="xl" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Your API Key</ModalHeader>
                <ModalBody>
                    <FormControl isInvalid={failedVerify}>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <Input
                            placeholder="sk...."
                            value={apiKey}
                            disabled={submitting}
                            onChange={(event) => {
                                if (failedVerify) {
                                    setFailedVerify(false)
                                }
                                setApiKey(event.currentTarget.value)
                            }}
                        />
                        {failedVerify ? (
                            <FormErrorMessage>Invalid API key</FormErrorMessage>
                        ) : (
                            <FormHelperText>We'll store this securely in the cloud</FormHelperText>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter justifyContent="flex-start">
                    <Button onClick={handleSubmit} isLoading={submitting} isDisabled={submitting}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ApiKeyInputModal
