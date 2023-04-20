import {
    HStack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text,
    Box,
} from "@chakra-ui/react"
import { FC } from "react"

const ConfigNumberInput: FC<{
    name: string
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number) => void
}> = ({ name, min, max, step, value, onChange }) => {
    return (
        <Box>
            <Text>{name}</Text>
            <HStack>
                <Slider onChange={(value) => onChange(value)} value={value} min={min} max={max} step={step}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <NumberInput onChange={(_, value) => onChange(value)} value={value} min={min} max={max} step={step}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </HStack>
        </Box>
    )
}

export default ConfigNumberInput
