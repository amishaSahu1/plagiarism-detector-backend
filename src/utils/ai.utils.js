import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
export const model = genAI.getGenerativeModel({ model: process.env.API_MODEL });

// Method 1: Generate text from text-only input
export const generateTextFromText = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error(error);
  }
};
