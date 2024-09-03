import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

config();

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo-0125",
  temperature: 0,
});
