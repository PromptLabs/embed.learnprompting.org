import * as yup from "yup"

export const MODELS = [
    "text-davinci-003",
    "text-davinci-002",
    "text-davinci-001",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001",
]

export const urlConfigSchema = yup.object({
    model: yup.string().oneOf(MODELS).default(MODELS[0]),
    prompt: yup.string().default(""),
    output: yup.string().default(""),
})
export type UrlConfig = yup.InferType<typeof urlConfigSchema>

export const decodeUrlConfig = async (config: string): Promise<UrlConfig> =>
    urlConfigSchema.validate(JSON.parse(decodeURIComponent(atob(config))))

export const encodeUrlConfig = (obj: UrlConfig): string => {
    return encodeURIComponent(btoa(JSON.stringify(obj)))
}
