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
            <HStack gap={5}>
                <Slider onChange={(value) => onChange(value)} value={value} min={min} max={max} step={step}>
                    <SliderTrack h='6px'>
                        <SliderFilledTrack background='#685DF8' borderRadius={8}/>
                    </SliderTrack>
                    <SliderThumb background='#4329F5' borderRadius={4} />
                </Slider>
                <NumberInput onChange={(_, value) => onChange(value)} value={value} min={min} max={max} step={step} variant='filled' size='sm' w={120}>
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
