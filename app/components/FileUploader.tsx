"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/heic",
      "image/heif"
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or image file (JPEG, PNG, HEIC)");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return;
    }

    onFileSelect(file);
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-neutral-300 bg-white hover:border-primary/50 hover:bg-neutral-50"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
        onChange={handleFileInput}
      />

      <motion.div
        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center justify-center text-center"
      >
        {/* Upload Icon */}
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300",
          isDragging ? "bg-primary/20" : "bg-neutral-100"
        )}>
          <svg
            className={cn(
              "w-8 h-8 transition-colors duration-300",
              isDragging ? "text-primary" : "text-neutral-400"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {isDragging ? "Drop your file here" : "Drag & drop your lab report"}
        </h3>
        <p className="text-neutral-600 mb-6">
          or click to browse from your device
        </p>

        {/* Button */}
        <button
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse Files
        </button>

        {/* Supported Formats */}
        <p className="text-xs text-neutral-500 mt-6">
          Supported formats: PDF, JPEG, PNG, HEIC (max 10MB)
        </p>
      </motion.div>
    </div>
  );
}
