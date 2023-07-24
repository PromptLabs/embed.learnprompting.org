import * as yup from "yup"

export const MODELS = [
    "gpt-4",
    "gpt-4-0613",
    "gpt-4-32k",
    "gpt-4-32k-0613",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-16k-0613",
    "text-davinci-003",
    "text-davinci-002",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001"
]

export const urlConfigSchema = yup.object({
    model: yup.string().oneOf(MODELS).default(MODELS[4]),
    prompt: yup.string().default(""),
    output: yup.string().default(""),
    maxTokens: yup.number().integer().min(1).max(4000).default(256),
    temperature: yup.number().min(0).max(1).default(0.7),
    topP: yup.number().min(0).max(1).default(1),
})
export type UrlConfig = yup.InferType<typeof urlConfigSchema>

export const encodeUrlConfig = (obj: UrlConfig): string => {
    let str = JSON.stringify(obj);
    let encoder = new TextEncoder();
    let data = encoder.encode(str);
    let base64 = btoa(String.fromCharCode.apply(null, data as any));
    return encodeURIComponent(base64);
}

export const decodeUrlConfig = (config: string): UrlConfig => {
    let str = decodeURIComponent(config);
    let data = Uint8Array.from(atob(str), c => c.charCodeAt(0));
    let decoder = new TextDecoder();
    let json = decoder.decode(data);
    return urlConfigSchema.validateSync(JSON.parse(json));
}