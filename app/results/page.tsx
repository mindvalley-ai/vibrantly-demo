"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BiomarkerCard } from "../components/BiomarkerCard";
import type { BiomarkerReference } from "../api/biomarkers/route";

interface ExtractedBiomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string | null;
  status: "normal" | "high" | "low" | "unknown";
  rawValue: string;
}

interface AnalysisResults {
  success: boolean;
  biomarkers: ExtractedBiomarker[];
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    analyzedAt: string;
  };
}

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [biomarkerReferences, setBiomarkerReferences] = useState<BiomarkerReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedBiomarkers, setMatchedBiomarkers] = useState<any[]>([]);

  useEffect(() => {
    // Load results from sessionStorage
    const storedResults = sessionStorage.getItem("analysisResults");
    if (!storedResults) {
      window.location.href = "/upload";
      return;
    }

    const analysisData: AnalysisResults = JSON.parse(storedResults);
    setResults(analysisData);

    // Fetch biomarker reference data
    fetchBiomarkerReferences(analysisData);
  }, []);

  const fetchBiomarkerReferences = async (analysisData: AnalysisResults) => {
    try {
      const response = await fetch("/api/biomarkers");
      const data = await response.json();

      if (data.success) {
        setBiomarkerReferences(data.biomarkers);
        matchBiomarkers(analysisData.biomarkers, data.biomarkers);
      }
    } catch (error) {
      console.error("Error fetching biomarker references:", error);
    } finally {
      setLoading(false);
    }
  };

  const matchBiomarkers = (
    extracted: ExtractedBiomarker[],
    references: BiomarkerReference[]
  ) => {
    const matched = extracted.map((extractedBiomarker) => {
      // Try to find matching reference biomarker
      const reference = references.find((ref) => {
        const refName = ref.name.toLowerCase().trim();
        const extractedName = extractedBiomarker.name.toLowerCase().trim();

        // Exact match
        if (refName === extractedName) return true;

        // Partial match
        if (refName.includes(extractedName) || extractedName.includes(refName)) {
          return true;
        }

        // Common abbreviations
        const abbreviations: Record<string, string[]> = {
          "apob": ["apolipoprotein b", "apo b"],
          "hba1c": ["hemoglobin a1c", "glycated hemoglobin"],
          "vo2 max": ["vo2max", "maximal oxygen uptake"],
          "phq-9": ["phq9", "patient health questionnaire"],
          "gad-7": ["gad7", "generalized anxiety disorder"],
          "testosterone": ["total testosterone", "serum testosterone"],
        };

        for (const [abbr, variants] of Object.entries(abbreviations)) {
          if (
            (refName.includes(abbr) && variants.some((v) => extractedName.includes(v))) ||
            (extractedName.includes(abbr) && variants.some((v) => refName.includes(v)))
          ) {
            return true;
          }
        }

        return false;
      });

      return {
        extracted: extractedBiomarker,
        reference: reference || null,
      };
    });

    setMatchedBiomarkers(matched);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-lg text-neutral-600">Loading your results...</p>
        </div>
      </main>
    );
  }

  if (!results) {
    return null;
  }

  // Categorize biomarkers
  const criticalBiomarkers = matchedBiomarkers.filter(
    (m) => m.reference?.role === "Core (Medical)"
  );
  const popularBiomarkers = matchedBiomarkers.filter(
    (m) => m.reference?.role === "Popular"
  );
  const otherBiomarkers = matchedBiomarkers.filter(
    (m) => !m.reference || (m.reference.role !== "Core (Medical)" && m.reference.role !== "Popular")
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-primary hover:text-primary-dark transition-colors">
              Vibrantly
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Summary Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Analysis Complete
              </h1>
              <p className="text-neutral-600">
                {results.metadata.fileName} • {matchedBiomarkers.length} biomarkers found
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-foreground mb-1">
                {criticalBiomarkers.length}
              </div>
              <div className="text-sm text-neutral-600">Core Biomarkers</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-foreground mb-1">
                {matchedBiomarkers.filter((m) => m.extracted.status === "normal").length}
              </div>
              <div className="text-sm text-neutral-600">In Range</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-warning mb-1">
                {matchedBiomarkers.filter((m) => m.extracted.status === "high" || m.extracted.status === "low").length}
              </div>
              <div className="text-sm text-neutral-600">Need Attention</div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="text-2xl font-bold text-foreground mb-1">
                {matchedBiomarkers.filter((m) => m.reference).length}
              </div>
              <div className="text-sm text-neutral-600">Matched</div>
            </div>
          </div>
        </div>

        {/* All Biomarkers Table */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Biomarker Results
            </h2>
            <p className="text-neutral-600">
              Complete analysis of all biomarkers found in your lab report.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Biomarker
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Your Value
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Normal Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {matchedBiomarkers.map((biomarker, index) => {
                    const statusColors = {
                      normal: "bg-success/10 text-success border-success/20",
                      high: "bg-warning/10 text-warning border-warning/20",
                      low: "bg-warning/10 text-warning border-warning/20",
                      unknown: "bg-neutral-100 text-neutral-600 border-neutral-200",
                    };

                    const statusLabels = {
                      normal: "Normal",
                      high: "High",
                      low: "Low",
                      unknown: "Unknown",
                    };

                    const category = biomarker.reference?.role || "Other";
                    const categoryColors = {
                      "Core (Medical)": "bg-primary/10 text-primary",
                      "Popular": "bg-purple-50 text-purple-700",
                      "Other": "bg-neutral-100 text-neutral-600",
                    };

                    return (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {biomarker.extracted.name}
                          </div>
                          {biomarker.reference && (
                            <div className="text-xs text-neutral-500 mt-1">
                              {biomarker.reference.domain}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">
                            {biomarker.extracted.value} {biomarker.extracted.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600">
                            {biomarker.extracted.referenceRange || "Not provided"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              statusColors[biomarker.extracted.status]
                            }`}
                          >
                            {statusLabels[biomarker.extracted.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              categoryColors[category as keyof typeof categoryColors] || categoryColors["Other"]
                            }`}
                          >
                            {category}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {matchedBiomarkers.map((biomarker, index) => {
              const statusColors = {
                normal: "bg-success/10 text-success border-success/20",
                high: "bg-warning/10 text-warning border-warning/20",
                low: "bg-warning/10 text-warning border-warning/20",
                unknown: "bg-neutral-100 text-neutral-600 border-neutral-200",
              };

              const statusLabels = {
                normal: "Normal",
                high: "High",
                low: "Low",
                unknown: "Unknown",
              };

              const category = biomarker.reference?.role || "Other";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {biomarker.extracted.name}
                      </h3>
                      {biomarker.reference && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {biomarker.reference.domain}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[biomarker.extracted.status]
                      }`}
                    >
                      {statusLabels[biomarker.extracted.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">Your Value</div>
                      <div className="font-semibold text-foreground">
                        {biomarker.extracted.value} {biomarker.extracted.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">Normal Range</div>
                      <div className="text-sm text-neutral-600">
                        {biomarker.extracted.referenceRange || "Not provided"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Category:</span>
                    <span className="text-xs font-medium text-primary">
                      {category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-12 border-t border-neutral-200">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Analyze Another Report
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-foreground bg-white rounded-full border-2 border-neutral-200 hover:border-primary hover:text-primary transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Download Report
          </button>
        </div>
      </div>
    </main>
  );
}
