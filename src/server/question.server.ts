import '@devvit/public-api'
import { Devvit } from '@devvit/public-api'

const systemPrompt = `
You are a helpful assistant that generates questions for a game. 
Generate a simple math question in the form of "10% of 100". 
The answer should be a number. Respond in JSON format only.

Output format: {
    "question": "10% of 100",
    "answer": 10,
    "options": [1, 10, 0.1, 20]
}
`

const getQuestion = async (context: Devvit.Context) => {

    const apiKey = await context.settings.get('open-ai-api-key')
    const result = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        method: 'POST',
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }]
        })
    })

    const json = await result.json()
    const content = JSON.parse(json.choices[0].message.content)
    return content
}

export default getQuestion