// src/hooks/useSurveyStatus.ts

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SurveySessionStatus } from '@/services/survey/types';
import { getUserData } from '@/services/auth';
import { getSurveyStatus } from '@/services/survey/surveyStatus';

interface SurveyStatus {
  isLoading: boolean;
  error: string | null;
  sessionData: SurveySessionStatus | null;
}

export function useSurveyStatus(forceRefresh = false) {
  const [status, setStatus] = useState<SurveyStatus>({
    isLoading: true,
    error: null,
    sessionData: null
  });

  const { user } = useAuth();
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const checkSurveyStatus = async () => {
      try {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }));

        const userData = getUserData();
        if (!userData) {
          throw new Error('Tidak ada data pengguna');
        }
        
        if (!userData.activeSurveySessionId) {
          throw new Error('Tidak ada ID sesi');
        }
        
        const surveySession = await getSurveyStatus(userData.activeSurveySessionId, signal);
        
        setStatus({
          isLoading: false,
          error: null,
          sessionData: surveySession.data ?? null
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error checking survey status:', err);
          setStatus(prev => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Unknown error occurred'
          }));
        }
      }
    };
    
    // Run the check if we have a user or if force refresh is requested
    if (user || forceRefresh) {
      checkSurveyStatus();
    } else {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
    
    return () => {
      controller.abort();
    };
  }, [user, forceRefresh]);
  
  // Function to manually refresh status
  const refreshStatus = () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    // Trigger the useEffect by updating the state
    setStatus(prev => ({ ...prev, isLoading: true, error: null, sessionData: null }));
  };
  
  return {
    ...status,
    refreshStatus
  };
}