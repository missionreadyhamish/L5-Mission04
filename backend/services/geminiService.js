import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Missing API key");
  throw new Error("GOOGLE_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const modelConfig = {
  model: "gemini-2.0-flash",
  temperature: 0.7,
};

// Insurance products data
const INSURANCE_PRODUCTS = {
  MBI: {
    name: "Mechanical Breakdown Insurance (MBI)",
    description: "Covers repair costs for mechanical and electrical failures",
    restrictions: "Not available for trucks and racing cars",
  },
  COMPREHENSIVE: {
    name: "Comprehensive Car Insurance",
    description: "Full coverage for your vehicle including accident, theft, and third-party damage",
    restrictions: "Only available for vehicles less than 10 years old",
  },
  THIRD_PARTY: {
    name: "Third Party Car Insurance",
    description: "Basic coverage for damage caused to other vehicles or property",
    restrictions: "Available for all vehicle types",
  },
};

const SYSTEM_PROMPT = `
You are Tina, an insurance consultant AI. Your role is to help users choose the right insurance policy.
Follow these rules:
1. Start with introducing yourself and asking for permission to ask personal questions
2. Only proceed with questions if user agrees
3. Ask relevant questions about their vehicle and needs
4. Don't ask directly what insurance they want
5. Use the conversation to determine the best product(s)
6. Consider these business rules:
   - MBI is not available for trucks and racing cars
   - Comprehensive Insurance only for vehicles less than 10 years old
7. End with product recommendations and clear reasons why

Products available:
${JSON.stringify(INSURANCE_PRODUCTS, null, 2)}

Keep responses friendly and professional. If user doesn't agree to questions, politely end the conversation.
Maintain conversation context between messages.
`;

// Initialize chat model
const model = genAI.getGenerativeModel(modelConfig);

// Store previous context
let previousContext = "";

export async function generateResponse(prompt) {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt: Must be a non-empty string");
    }

    // Combine previous context with new prompt
    const fullPrompt = `
${SYSTEM_PROMPT}

Previous conversation:
${previousContext}

User's new message:
${prompt}

Assistant (remember to maintain Tina's persona and previous context):`;

    // Generate content using the flash model
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text();

    // Update context with this interaction
    previousContext += `\nUser: ${prompt}\nTina: ${responseText}\n`;

    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}
