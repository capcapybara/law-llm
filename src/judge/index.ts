import { ChatOpenAI } from "@langchain/openai";
import { benchmark } from "../lib/llm-benchmark";
import { LawLLM } from "../llm";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.5,
});

const llm = new LawLLM(model);

const filterPrompt = (question: string, brief: string) => {
  return `
        ${brief}
        ${question}
    `;
};

const judge = async (
  question: string,
  brief: string,
  score: number,
  llmResponse: string,
  expectedResponse: string
) => {
  const newBrief = await model.invoke(`
    current system prompt is ${brief} and current question is ${question} and 
    current response from llm is ${llmResponse} and expected response is ${expectedResponse} and
    this response got benchmark score of ${score}
    You must create new system prompt to get better score
    You must only provide the new system prompt
  `);
  return newBrief.content;
};

const question =
  "พระราชบัญญัติภาษีที่ดินและสิ่งปลูกสร้างมีผลบังคับใช้ตั้งแต่เมื่อใด";
const expectedResponse =
  "มีผลบังคับตั้งแต่วันที่ 13 มีนาคม 2562 สำหรับการจัดเก็บภาษีให้ใช้บังคับตั้งแต่วันที่ 1 มกราคม 2563";
let brief = `You are a legal expert. You are asked about the effective date of the Land and Building Tax Act of Thailand. Provide the effective date of the Land and Building Tax Act of Thailand`;

let currentResult: {
  input: string;
  llmResult: string;
  similarity: number;
} | null = null;

const run = async () => {
  do {
    const result = await benchmark(
      filterPrompt(question, brief),
      expectedResponse,
      {
        chat: async (input: string) => {
          const result = await llm.chat(input);
          return (
            await model.invoke(
              `current response from llm for question ${question} is ${result} you should revise and translate it to Thai`
            )
          ).content as string;
        },
      }
    );
    currentResult = result;
    console.log(result);
    const newBrief = await judge(
      question,
      brief,
      result.similarity,
      result.llmResult,
      expectedResponse
    );
    brief = newBrief as string;
    console.log(newBrief);
  } while (currentResult && currentResult.similarity < 0.7);
};

run();
