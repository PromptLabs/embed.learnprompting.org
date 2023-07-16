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