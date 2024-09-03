import { config } from "dotenv";
config();
import { ChatOpenAI } from "@langchain/openai";
import type { BenchmarkAble } from "../lib/llm-benchmark";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0,
});

llm.invoke("");

export class LawLLM implements BenchmarkAble {
  llm: BaseChatModel;
  constructor(llm: BaseChatModel) {
    this.llm = llm;
  }
  async chat(input: string): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "I am a legal language model. I can help you with legal questions.",
      ],
      ["human", "{question}"],
    ]);

    const runnable = prompt.pipe(llm).pipe(new StringOutputParser());

    return runnable.invoke({
      question: input,
    });
  }
}
