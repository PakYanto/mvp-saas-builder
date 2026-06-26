'use client';

import { ReactNode } from 'react';

interface WizardShellProps {
  currentStep: number;
  totalSteps?: number;
  onNext?: () => void;
  onBack?: () => void;
  children: ReactNode;
  nextLabel?: string;
  backLabel?: string;
  canGoNext?: boolean;
  canGoBack?: boolean;
}

export function WizardShell({
  currentStep,
  totalSteps = 5,
  onNext,
  onBack,
  children,
  nextLabel = 'Selanjutnya',
  backLabel = 'Kembali',
  canGoNext = true,
  canGoBack = true,
}: WizardShellProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Progress Indicator */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-600">
              Langkah {currentStep} dari {totalSteps}
            </h2>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Selesai
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white border-t px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack || currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {backLabel}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
