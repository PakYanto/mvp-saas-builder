'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WizardState {
  storeName: string;
  tagline: string;
  category: string;
  logoUrl: string;
  themeColor: string;
  templateId: string;
  products: Array<{
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
  }>;
  contact: {
    whatsapp: string;
    instagram: string;
    address: string;
  };
}

const STORAGE_KEY = 'wizard-state';
const DEBOUNCE_MS = 800;

const initialState: WizardState = {
  storeName: '',
  tagline: '',
  category: 'umum',
  logoUrl: '',
  themeColor: '#3B82F6',
  templateId: '',
  products: [],
  contact: {
    whatsapp: '',
    instagram: '',
    address: '',
  },
};

export function useWizard() {
  const [state, setState] = useState<WizardState>(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch (error) {
      console.error('Failed to load wizard state:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Debounced autosave to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save wizard state:', error);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [state, isLoaded]);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 5)));
  }, []);

  const resetWizard = useCallback(() => {
    setState(initialState);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    updateState,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    resetWizard,
    isLoaded,
  };
}
