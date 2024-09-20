import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import fs from "fs";
import { parseOfficeAsync } from "officeparser";
import { generateTextFromText } from "../utils/ai.utils.js";

// Route 1: Upload Document
export const uploadDocument = asyncHandler(async (req, res) => {
  const documentLocalPath = req.file?.path;
  console.log("Document path: ", documentLocalPath);

  if (!documentLocalPath) {
    throw new ApiError(400, "Document not found");
  }

  if (!req.file || !req.file?.mimetype.startsWith("application/pdf")) {
    if (documentLocalPath != undefined) {
      // Remove the local file if it is not a PDF
      fs.unlinkSync(documentLocalPath);
    }
    throw new ApiError(400, "Only PDF files are allowed");
  }

  // Extract text from the uploaded PDF file using officeparser
  const documentText = await parseOfficeAsync(documentLocalPath);

  // Pass documentText to plagiarism detection API (this is the next step)
  const plagiarismResult = await detectPlagiarismWithAI(documentText);

  // After document is uploaded successfully, delete the local file
  fs.unlinkSync(documentLocalPath);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { DocumentText: documentText, plagiarismAnalysis: plagiarismResult },
        "Document analyzed and plagiarism detected successfully"
      )
    );
});

// Detect Plagiarism with AI
export const detectPlagiarismWithAI = async (documentText) => {
  try {
    const analysisStructure = {
      isPlagiarism: false,
      howMany: 0,
      confidenceScore: 0,
      suspiciousPassages: [],
      originalityScore: 0,
      analysis: "",
    };

    const prompt = `Analyze the following text for plagiarism:\n\n${documentText}\n\nPlease provide a detailed analysis in the following structure:\n${JSON.stringify(
      analysisStructure,
      null,
      2
    )} only.`;

    const geminiResponse = await generateTextFromText(prompt);
    // console.log("Gemini Response: ", geminiResponse);
    // Convert response to an object if it's a stringified JSON
    let geminiAnalysis;
    try {
      geminiAnalysis = JSON.parse(geminiResponse);
    } catch (error) {
      geminiAnalysis = geminiResponse;
    }

    // console.log("Gemini Analysis: ", geminiAnalysis);

    return geminiAnalysis;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to detect plagiarism");
  }
};
