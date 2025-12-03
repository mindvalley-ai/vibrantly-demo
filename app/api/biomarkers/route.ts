import { NextResponse } from "next/server";
import Airtable from "airtable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Disable caching for fresh data

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY || "",
}).base(process.env.AIRTABLE_BASE_ID || "");

export interface BiomarkerReference {
  id: string;
  name: string;
  domain: string[];
  gender: string;
  ageRange: string;
  type: string;
  role: string;
  whatItMeasures: string;
  whyChosen: string;
  interventions: string;
  pubmedLink?: string;
  studyTitle?: string;
}

export async function GET() {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ID || "")
      .select({
        view: process.env.AIRTABLE_VIEW_ID || "Men (45-60)",
        maxRecords: 100,
      })
      .all();

    const biomarkers: BiomarkerReference[] = records.map((record) => ({
      id: record.id,
      name: record.get("Measure / Index") as string || "",
      domain: (record.get("Domain") as string[]) || [],
      gender: record.get("Gender") as string || "",
      ageRange: record.get("Age Range") as string || "",
      type: record.get("Type") as string || "",
      role: record.get("Role") as string || "",
      whatItMeasures: record.get("What it measures (lay terms)") as string || "",
      whyChosen: record.get("Why chosen") as string || "",
      interventions: record.get("Lifestyle-only key intervention") as string || "",
      pubmedLink: record.get("PubMed link") as string,
      studyTitle: record.get("Study title") as string,
    }));

    return NextResponse.json({
      success: true,
      biomarkers,
      count: biomarkers.length,
    });
  } catch (error) {
    console.error("Error fetching biomarkers from Airtable:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch biomarker reference data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
