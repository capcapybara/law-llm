import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { cosineSimilarity } from "@langchain/core/utils/math";
import { OpenAIEmbeddings } from "@langchain/openai";

export interface BenchmarkAble {
  chat(input: string): Promise<string>;
}

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

export const benchmark = async (
  input: string,
  output: string,
  benchmarkAble: BenchmarkAble
) => {
  const llmResult = await benchmarkAble.chat(input);
  const embedOutput = await embeddings.embedQuery(output);
  const embedLLM = await embeddings.embedQuery(llmResult);
  const similarity = cosineSimilarity([embedOutput], [embedLLM])[0][0];
  return {
    input,
    llmResult,
    similarity,
  };
};
