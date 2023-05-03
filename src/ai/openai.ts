import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";

export async function getResponse(
  apiKey: string,
  messages: ChatCompletionRequestMessage[],
  onChunk?: (chunk: string) => void
): Promise<ChatCompletionResponseMessage | undefined> {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  return new Promise((resolve, reject) => {
    let content = "";
    let chunkIndex = 0;

    try {
      openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 512,
          stream: true,
        },
        {
          responseType: "stream",
          onDownloadProgress: (progressEvent) => {
            const res: string = progressEvent.target["response"];
            const chunks = res.split("data:");

            const newChunks = chunks.slice(chunkIndex);
            chunkIndex = chunks.length;

            newChunks.forEach((chunk) => {
              chunk = chunk.trim();

              if (chunk === "[DONE]") {
                resolve({
                  role: "assistant",
                  content,
                });
              }

              if (chunk !== "[DONE]" && chunk.includes("delta")) {
                const chunkMessage =
                  (JSON.parse(chunk) as any)?.choices?.[0]?.delta?.content ||
                  "";
                content += chunkMessage;

                onChunk?.(chunkMessage);
              }
            });
          },
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
