import { ChatOpenAI } from "@langchain/openai";
import { benchmark } from "./src/lib/llm-benchmark";
import { LawLLM } from "./src/llm";
import csv from "csv-parser";
import fs from "fs";

type Data = {
  id: string;
  question: string;
  level: string;
  solution: string;
  chulaKt: string;
  gpt4o: string;
  gpt4oWithContext: string;
};

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const llm = new LawLLM(model);

const run = async (benchmarkData: Data[]) => {
  const benchmarkResult: {
    input: string;
    llmResult: string;
    similarity: number;
  }[] = [];

  for (const data of benchmarkData) {
    const currentBenchmark = await benchmark(data.question, data.solution, llm);
    console.log(currentBenchmark);
    benchmarkResult.push(currentBenchmark);
  }

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
};

const benchmarkData: Data[] = [];

fs.createReadStream("benchmark/question.csv")
  .pipe(csv())
  .on("data", (data: Data) => benchmarkData.push(data))
  .on("end", () => {
    console.log("Benchmark Data Loaded");
    run(benchmarkData.slice(0, 10));
  });
