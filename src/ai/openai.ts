import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";

export async function getResponse(
  apiKey: string,
  messages: ChatCompletionRequestMessage[]
): Promise<ChatCompletionResponseMessage | undefined> {
  return {
    role: "assistant",
    content: "sample",
  };

  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

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
