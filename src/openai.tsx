import { Configuration, OpenAIApi } from "openai"
import { MODELS } from "./urlconfig"

export const verifyApiKey = async (apiKey?: string | null): Promise<boolean> => {
    if(!apiKey){
        return false
    }
    try {
        const configuration = new Configuration({ apiKey })
        const openai = new OpenAIApi(configuration)
        await openai.retrieveModel(MODELS[5])
        return true
    } catch (error) {
        return false
    }
}
