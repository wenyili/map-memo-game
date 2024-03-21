import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs'
export const runtime = 'edge'

const apiKey = process.env.AZURE_OPENAI_API_KEY
const resource = process.env.AZURE_OPENAI_RESOURCE
const model = process.env.AZURE_OPENAI_MODEL
const model4 = process.env.AZURE_OPENAI_MODEL_GPT4
const apiVersion = process.env.AZURE_OPENAI_VERSION

const messages: ChatCompletionMessageParam[] = [
    {
        'role': 'system',
        'content': `你现在是一个猜国家游戏的裁判。玩家说出国家名后，会被实时语音系统转换成文字。你需要判断这个文字结果是否正确。
        注意语音识别系统不能百分百识别正确，比如亚美尼亚，可能识别成亚梅尼亚。或者巴林，可能识别成数字80。此时你也需要判断结果为正确。
        你只需要回复，正确或者错误。`
    },
    {
        'role': 'user',
        'content': `题目："美国", 玩家回答："中国"`
    },
    {
        'role': 'assistant',
        'content': `错误`
    },
    {
        'role': 'user',
        'content': `题目："波斯尼亚和黑塞哥维那", 玩家回答："波斯尼亚和黑塞哥维纳"`
    },
    {
        'role': 'assistant',
        'content': `正确`
    },
    {
        'role': 'user',
        'content': `题目："阿尔及利亚", 玩家回答：",阿尔及利亚"`
    },
    {
        'role': 'assistant',
        'content': `正确`
    }
]

export async function POST(req: Request) {
    const json = await req.json()
    const { question, answer, modelName = "gpt-3.5-turbo" } = json

    let deployemntName = model
    if (modelName === 'gpt-4') {
        deployemntName = model4
    } 

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: `https://${resource}.openai.azure.com/openai/deployments/${deployemntName}`,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': apiKey },
    })

    try {
        const res = await openai.chat.completions.create({
            model: modelName,
            messages: [...messages, {
                'role': 'user',
                'content': `题目："${question}", 玩家回答："${answer}"`
            }],
            temperature: 0.7,
            stream: false,
        })
        console.log(res.choices[0].message)
        return new Response(JSON.stringify(res.choices[0].message))
    } catch (error: any) {
        let errorMessage = error.message || "An unexpected error occurred"
        const errorCode = error.status || 500

        console.error(errorMessage)
        return new Response(errorMessage, {
            status: errorCode
        })
    }
}
