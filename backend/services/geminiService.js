import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Validate API key
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Missing API key");
  throw new Error("GOOGLE_API_KEY is not set in environment variables");
}

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(apiKey);

// Configure model settings
const modelConfig = {
  model: "gemini-2.0-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
};

/**
 * Generates a response using Gemini Flash 2.0
 * @param {string} prompt - The user's input prompt
 * @returns {Promise<string>} The generated response
 */
export async function generateResponse(prompt) {
  try {
    // Input validation
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt: Must be a non-empty string");
    }

    // Get model instance
    const model = genAI.getGenerativeModel(modelConfig);

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}
