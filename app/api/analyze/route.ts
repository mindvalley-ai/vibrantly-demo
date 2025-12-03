import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds max

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString("base64");

    // Determine media type and content structure
    let contentBlock;

    if (file.type === "application/pdf") {
      // PDF documents use document type
      contentBlock = {
        type: "document" as const,
        source: {
          type: "base64" as const,
          media_type: "application/pdf" as const,
          data: base64File,
        },
      };
    } else {
      // Images use image type
      let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        mediaType = "image/jpeg";
      } else if (file.type === "image/png") {
        mediaType = "image/png";
      } else if (file.type === "image/webp") {
        mediaType = "image/webp";
      } else if (file.type === "image/gif") {
        mediaType = "image/gif";
      } else {
        // Default to JPEG for other image types
        mediaType = "image/jpeg";
      }

      contentBlock = {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: mediaType,
          data: base64File,
        },
      };
    }

    // Call Claude API with vision/document capabilities
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: `You are a medical data extraction expert. Analyze this lab report and extract ALL biomarker values you can find.

For each biomarker found, return:
1. Biomarker name (exact name from report)
2. Value (with units)
3. Reference range (if provided)
4. Status (normal, high, low, or unknown)

Return the data as a JSON array with this structure:
[
  {
    "name": "Biomarker name",
    "value": "numeric value",
    "unit": "unit",
    "referenceRange": "min-max or text range",
    "status": "normal|high|low|unknown",
    "rawValue": "original value from report"
  }
]

Important guidelines:
- Extract EVERY biomarker you can identify, even if not commonly known
- Be precise with numeric values and units
- If reference range is not provided, set it to null
- If status cannot be determined, set it to "unknown"
- Include the raw value exactly as it appears in the document

Return ONLY the JSON array, no other text.`,
            },
          ],
        },
      ],
    });

    // Extract the response
    const response = message.content[0];
    if (response.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Parse the JSON response
    let biomarkers;
    try {
      // Remove markdown code blocks if present
      const cleanedText = response.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      biomarkers = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", response.text);
      return NextResponse.json(
        {
          error: "Failed to parse biomarker data",
          rawResponse: response.text
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      biomarkers,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        analyzedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("Error analyzing file:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze file",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
