// src/hooks/useAccurateProgress.ts

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccurateProgressData } from "@/services/survey/types";
import { getUserData } from "@/services/auth";
import { getAccurateProgress } from "@/services/survey/accurateProgress";

interface AccurateProgressStatus {
  isLoading: boolean;
  error: string | null;
  data: AccurateProgressData | null;
}

export function useAccurateProgress(forceRefresh = false) {
  const [status, setStatus] = useState<AccurateProgressStatus>({
    isLoading: true,
    error: null,
    data: null,
  });

  const isMounted = useRef(true);
  const { user } = useAuth();

  useEffect(() => {
    // Set mounted to true when the component mounts
    isMounted.current = true;

    // Create a new controller for this effect instance
    const controller = new AbortController();

    const fetchAccurateProgress = async () => {
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
          const accurateProgressResponse = await getAccurateProgress(
            userData.activeSurveySessionId,
            controller.signal
          );

          // Only update if still mounted
          if (isMounted.current) {
            if (accurateProgressResponse.success && accurateProgressResponse.data) {
              setStatus({
                isLoading: false,
                error: null,
                data: accurateProgressResponse.data,
              });
            } else {
              // Don't show error to user, just set data to null
              setStatus({
                isLoading: false,
                error: null,
                data: null,
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
        console.error("Error in accurate progress check:", err);

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
      fetchAccurateProgress();
    } else if (isMounted.current) {
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }

    return () => {
      isMounted.current = false;
      controller.abort();
    };
  }, [user, forceRefresh]);

  const refreshProgress = useCallback(() => {
    if (isMounted.current) {
      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));
    }
  }, []);

  const refreshProgressSilent = useCallback(() => {
    if (isMounted.current) {
      // Refresh tanpa mengubah loading state
      const fetchAccurateProgressSilent = async () => {
        try {
          const userData = getUserData();
          if (!userData || !userData.activeSurveySessionId) {
            return;
          }

          const accurateProgressResponse = await getAccurateProgress(
            userData.activeSurveySessionId
          );

          if (isMounted.current && accurateProgressResponse.success && accurateProgressResponse.data) {
            setStatus({
              isLoading: false,
              error: null,
              data: accurateProgressResponse.data,
            });
          }
        } catch (err) {
          console.error("Error in silent accurate progress check:", err);
        }
      };

      fetchAccurateProgressSilent();
    }
  }, []);

  return {
    ...status,
    refreshProgress,
    refreshProgressSilent,
  };
} 