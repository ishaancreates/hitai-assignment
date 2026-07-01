"use client";

import { FaExclamationCircle } from "react-icons/fa";
import { useVideoForm } from "../hooks/useVideoForm";
import { PlaceholdersAndVanishInput } from "../components/placeholders-and-vanish-input";

const placeholders = [
  "Paste a YouTube video URL...",
  "https://youtu.be/...",
  "https://www.youtube.com/watch?v=...",
  "Paste your gameplay replay...",
];

const VideoForm = () => {
  const { url, handleUrlChange, isLoading, error, handleSubmit } =
    useVideoForm();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      {error && (
        <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 text-red-400 bg-[#1a1a1a] border border-red-500/20 rounded-md text-sm shadow-xl">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleUrlChange}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
};

export default VideoForm;
