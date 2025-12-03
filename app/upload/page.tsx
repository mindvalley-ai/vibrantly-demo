"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileUploader } from "../components/FileUploader";

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);

    try {
      // Create FormData and upload file
      const formData = new FormData();
      formData.append("file", uploadedFile);

      // Call API
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze file");
      }

      const data = await response.json();

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("analysisResults", JSON.stringify(data));

      // Navigate to results page
      window.location.href = "/results";
    } catch (error) {
      console.error("Error analyzing file:", error);
      alert("Failed to analyze file. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="text-xl font-semibold text-primary hover:text-primary-dark transition-colors">
            Vibrantly
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12 lg:py-20">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                1
              </div>
              <span className="ml-3 text-sm font-medium text-foreground">Upload</span>
            </div>
            <div className="h-px w-16 bg-neutral-300" />
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                isAnalyzing ? "bg-primary text-white" : "bg-neutral-200 text-neutral-500"
              }`}>
                2
              </div>
              <span className={`ml-3 text-sm font-medium ${
                isAnalyzing ? "text-foreground" : "text-neutral-500"
              }`}>
                Analyze
              </span>
            </div>
            <div className="h-px w-16 bg-neutral-300" />
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-3 text-sm font-medium text-neutral-500">Results</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Upload Your Lab Report
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Upload your medical lab report in PDF or image format. Our AI will analyze it and extract the key biomarkers.
          </p>
        </div>

        {/* File Uploader */}
        <FileUploader onFileSelect={handleFileSelect} />

        {/* File Preview & Actions */}
        <AnimatePresence>
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-neutral-500 hover:text-error transition-colors"
                    aria-label="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </motion.div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Analyze Report</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-neutral-500 text-center mt-4">
                  Analysis typically takes 10-30 seconds
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy Notice */}
        <div className="mt-12 p-6 bg-accent/10 border border-accent/20 rounded-xl">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-accent flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Your Privacy is Protected
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Your medical data is processed securely and is not stored permanently. Files are encrypted during analysis and automatically deleted after you view your results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
