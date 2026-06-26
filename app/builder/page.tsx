'use client';

import { useWizard } from '@/lib/useWizard';
import { WizardShell } from '@/components/wizard/WizardShell';
import { StepBrand } from '@/components/wizard/StepBrand';
import { StepTemplate } from '@/components/wizard/StepTemplate';
import { StepProducts } from '@/components/wizard/StepProducts';
import { StepContact } from '@/components/wizard/StepContact';
import { StepPreview } from '@/components/wizard/StepPreview';
import { LivePreviewPane } from '@/components/wizard/LivePreviewPane';

export default function BuilderPage() {
  const { state, updateState, currentStep, nextStep, prevStep, isLoaded } = useWizard();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Validation for each step
  const canProceedFromStep1 = state.storeName.length >= 3;
  const canProceedFromStep2 = !!state.templateId;
  const canProceedFromStep3 = true; // Products are optional
  const canProceedFromStep4 = !!state.contact.whatsapp && state.contact.whatsapp.length > 0;

  const canGoNext = () => {
    if (currentStep === 1) return canProceedFromStep1;
    if (currentStep === 2) return canProceedFromStep2;
    if (currentStep === 3) return canProceedFromStep3;
    if (currentStep === 4) return canProceedFromStep4;
    return true;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Buat Website Toko Kamu
          </h1>
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Keluar
          </a>
        </div>
      </header>

      {/* Main Content: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Wizard Steps */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white border-r">
          <WizardShell
            currentStep={currentStep}
            totalSteps={5}
            onNext={nextStep}
            onBack={prevStep}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            {currentStep === 1 && (
              <StepBrand
                initialData={{
                  storeName: state.storeName,
                  tagline: state.tagline,
                  category: state.category,
                  logoUrl: state.logoUrl,
                  themeColor: state.themeColor,
                }}
                onUpdate={updateState}
              />
            )}

            {currentStep === 2 && (
              <StepTemplate
                selectedTemplateId={state.templateId}
                category={state.category}
                onSelectTemplate={(templateId) =>
                  updateState({ templateId })
                }
              />
            )}

            {currentStep === 3 && (
              <StepProducts
                initialData={state.products}
                onUpdate={(products) => updateState({ products })}
              />
            )}

            {currentStep === 4 && (
              <StepContact
                initialData={state.contact}
                onUpdate={(contact) => updateState({ contact })}
              />
            )}

            {currentStep === 5 && (
              <StepPreview wizardState={state} />
            )}
          </WizardShell>
        </div>

        {/* Right: Live Preview */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-100">
          <LivePreviewPane wizardState={state} />
        </div>
      </div>
    </div>
  );
}
