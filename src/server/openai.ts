import OpenAI from "openai"
const openai = new OpenAI()

const systemPrompt = `
You are a helpful assistant that generates questions for a game. 
Generate a simple math question in the form of "10% of 100". 
The answer should be a number. 
Respond in JSON format including the word "JSON" in your response.

Output format:
{
    "question": "10% of 100",
    "answer": 10,
    "options": [1, 10, 0.1, 20]
}
`

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object"},
    messages: [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: "Generate a simple math question."
        },
    ]
})

const responseText = completion.choices[0].message.content;
console.log(responseText);

export const getQuestion = async () => {
    return JSON.parse(responseText);
}