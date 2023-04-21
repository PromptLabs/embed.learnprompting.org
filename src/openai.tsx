import { Configuration, OpenAIApi } from "openai"
import { MODELS } from "./urlconfig"

export const verifyApiKey = async (apiKey: string): Promise<boolean> => {
    try {
        const configuration = new Configuration({ apiKey })
        const openai = new OpenAIApi(configuration)
        await openai.retrieveModel(MODELS[0])
        return true
    } catch (error) {
        return false
    }
}
