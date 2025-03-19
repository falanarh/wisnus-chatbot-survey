// src/hooks/useSurveyStatus.ts

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { SurveySessionStatus } from "@/services/survey/types";
import { getUserData } from "@/services/auth";
import { getSurveyStatus } from "@/services/survey/surveyStatus";

interface SurveyStatus {
  isLoading: boolean;
  error: string | null;
  sessionData: SurveySessionStatus | null;
}

export function useSurveyStatus(forceRefresh = false) {
  const [status, setStatus] = useState<SurveyStatus>({
    isLoading: true,
    error: null,
    sessionData: null,
  });

  const isMounted = useRef(true);
  const { user } = useAuth();

  useEffect(() => {
    // Set mounted to true when the component mounts
    isMounted.current = true;

    // Create a new controller for this effect instance
    const controller = new AbortController();

    const checkSurveyStatus = async () => {
      // Skip if component is unmounted
      if (!isMounted.current) return;

      try {
        setStatus((prev) => ({ ...prev, isLoading: true, error: null }));

        const userData = getUserData();
        if (!userData || !userData.activeSurveySessionId) {
          // Silent failure - just set loading to false without error message
          setStatus((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        // Use try-catch but don't display AbortError
        try {
          const surveySessionResponse = await getSurveyStatus(
            userData.activeSurveySessionId,
            controller.signal
          );

          // Only update if still mounted
          if (isMounted.current) {
            if (surveySessionResponse.success && surveySessionResponse.data) {
              setStatus({
                isLoading: false,
                error: null,
                sessionData: surveySessionResponse.data,
              });
            } else {
              // Don't show error to user, just set data to null
              setStatus({
                isLoading: false,
                error: null,
                sessionData: null,
              });
            }
          }
        } catch {
          // Silently fail on all fetch errors
          if (isMounted.current) {
            setStatus((prev) => ({
              ...prev,
              isLoading: false,
              error: null,
            }));
          }
        }
      } catch (err) {
        // Only log errors but don't display to user
        console.error("Error in survey status check:", err);

        if (isMounted.current) {
          setStatus((prev) => ({
            ...prev,
            isLoading: false,
            error: null,
          }));
        }
      }
    };

    if (user || forceRefresh) {
      checkSurveyStatus();
    } else if (isMounted.current) {
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }

    return () => {
      isMounted.current = false;
      controller.abort();
    };
  }, [user, forceRefresh]);

  const refreshStatus = () => {
    if (isMounted.current) {
      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));
    }
  };

  return {
    ...status,
    refreshStatus,
  };
}
