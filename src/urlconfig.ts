import * as yup from "yup"

export const urlConfigSchema = yup.object({
    model: yup
        .string()
        .oneOf([
            "text-davinci-003",
            "text-davinci-002",
            "text-davinci-001",
            "text-curie-001",
            "text-babbage-001",
            "text-ada-001",
        ])
        .default("text-davinci-003"),
    prompt: yup.string().default(""),
})
export type UrlConfig = yup.InferType<typeof urlConfigSchema>

export const decodeUrlConfig = async (config: string): Promise<UrlConfig> => {
    return urlConfigSchema.validate(JSON.parse(decodeURIComponent(atob(config))))
}

export const encodeUrlConfig = (obj: UrlConfig): string => {
    return encodeURIComponent(btoa(JSON.stringify(obj)))
}
