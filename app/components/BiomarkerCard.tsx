"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BiomarkerReference } from "../api/biomarkers/route";

interface ExtractedBiomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string | null;
  status: "normal" | "high" | "low" | "unknown";
  rawValue: string;
}

interface BiomarkerCardProps {
  extracted: ExtractedBiomarker;
  reference: BiomarkerReference | null;
  index: number;
}

export function BiomarkerCard({ extracted, reference, index }: BiomarkerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-success bg-success/10 border-success/20";
      case "high":
      case "low":
        return "text-warning bg-warning/10 border-warning/20";
      default:
        return "text-neutral-500 bg-neutral-100 border-neutral-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "high":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "low":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {reference?.name || extracted.name}
            </h3>
            {reference && (
              <p className="text-sm text-neutral-600">
                {reference.type} • {reference.domain.join(", ")}
              </p>
            )}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(extracted.status)}`}>
            {getStatusIcon(extracted.status)}
            <span className="capitalize">{extracted.status}</span>
          </div>
        </div>

        {/* Value Display */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-4">
          <div className="flex items-end gap-4">
            <div>
              <div className="text-sm text-neutral-600 mb-1">Your Value</div>
              <div className="text-3xl font-bold text-foreground">
                {extracted.value}
                {extracted.unit && <span className="text-xl text-neutral-600 ml-1">{extracted.unit}</span>}
              </div>
            </div>
            {extracted.referenceRange && (
              <div className="pb-2">
                <div className="text-sm text-neutral-600 mb-1">Reference Range</div>
                <div className="text-sm font-medium text-neutral-700">
                  {extracted.referenceRange}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What It Measures */}
        {reference?.whatItMeasures && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What This Measures
            </h4>
            <p className="text-neutral-700 leading-relaxed">
              {reference.whatItMeasures}
            </p>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {reference && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span>{isExpanded ? "Hide Details" : "Show Details"}</span>
            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        )}
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && reference && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-neutral-200 space-y-6">
              {/* Why It Matters */}
              {reference.whyChosen && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Why This Matters
                  </h4>
                  <p className="text-neutral-700 leading-relaxed">
                    {reference.whyChosen}
                  </p>
                </div>
              )}

              {/* Lifestyle Interventions */}
              {reference.interventions && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    How to Improve
                  </h4>
                  <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                    <p className="text-neutral-700 leading-relaxed">
                      {reference.interventions}
                    </p>
                  </div>
                </div>
              )}

              {/* Scientific Reference */}
              {reference.studyTitle && reference.pubmedLink && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Scientific Reference
                  </h4>
                  <div className="text-sm">
                    <p className="text-neutral-700 mb-2">
                      {reference.studyTitle}
                    </p>
                    <a
                      href={reference.pubmedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      View on PubMed
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
