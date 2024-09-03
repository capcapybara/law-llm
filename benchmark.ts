import { ChatOpenAI } from "@langchain/openai";
import { benchmark } from "./src/lib/llm-benchmark";
import { LawLLM } from "./src/llm";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const llm = new LawLLM(model);

const benchmarkResult = [
  await benchmark(
    "What is Chula Engineering Computer Department? Answer in one paragraph.",
    `The Computer Engineering Department at Chulalongkorn University, 
  commonly referred to as "Chula Engineering," 
  is part of the Faculty of Engineering at Chulalongkorn University in Bangkok, Thailand.
  This department offers undergraduate and graduate programs in computer engineering,
  providing students with a comprehensive education in areas such as 
  software development, computer systems, artificial intelligence, data science, networking, and cybersecurity.`,
    llm
  ),
];

const avgSimilarity =
  benchmarkResult.reduce((prev, curr) => prev + curr.similarity, 0) /
  benchmarkResult.length;

console.log(
  JSON.stringify([
    {
      name: "Result Average Similarity",
      unit: "Percent",
      value: avgSimilarity * 100,
    },
  ])
);
