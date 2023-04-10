import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "YOUR-API-KEY",
});
const openai = new OpenAIApi(configuration);

export async function getResponse(messages: ChatCompletionRequestMessage[]) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 512,
  });

  return completion.data.choices[0].message;
}
