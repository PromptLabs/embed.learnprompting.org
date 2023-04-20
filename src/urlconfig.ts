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
    maxTokens: yup.number().integer().min(1).max(4000).default(256),
    temperature: yup.number().min(0).max(1).default(0.7),
    topP: yup.number().min(0).max(1).default(1),
})
export type UrlConfig = yup.InferType<typeof urlConfigSchema>

export const decodeUrlConfig = (config: string): UrlConfig =>
    urlConfigSchema.validateSync(JSON.parse(atob(decodeURIComponent(config))))

export const encodeUrlConfig = (obj: UrlConfig): string => {
    return encodeURIComponent(btoa(JSON.stringify(obj)))
}
