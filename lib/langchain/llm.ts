import { ChatGroq } from "@langchain/groq";

export const createGroqModel = () => {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant", 
    temperature: 0.1,
  });
};