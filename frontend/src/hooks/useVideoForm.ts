import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { AnalysisResponse } from "../types/api";

export const useVideoForm = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUrl("");
    setError(null);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setFile(null);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file && !url) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const payloadUrl = url || file?.name || "unspecified-video-url";
      console.log(url);
      console.log(typeof url);
      const response = await axios.post<AnalysisResponse>(
        `${API_BASE_URL}/analyses`,
        {
          video_url: payloadUrl,
        },
      );

      console.log("Analysis created:", response.data);
      localStorage.setItem('lastAnalysisId', response.data.analysis_id);
      navigate(`/analysis/${response.data.analysis_id}`);
    } catch (err: unknown) {
      console.error("Error creating analysis:", err);

      // Handle specific axios error messages
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(err)) {
        if (
          err.message === "Network Error" ||
          err.code === "ERR_CONNECTION_REFUSED"
        ) {
          errorMessage = "Cannot connect to the server.";
        } else {
          errorMessage =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return {
    url,
    handleUrlChange,
    file,
    setFile,
    isLoading,
    error,
    handleFileSelect,
    handleSubmit,
  };
};
