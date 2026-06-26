#!/usr/bin/env node

/**
 * Test script to verify wizard components exist and are properly structured
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const filesToCheck = [
  'app/builder/page.tsx',
  'components/wizard/WizardShell.tsx',
  'components/wizard/StepBrand.tsx',
  'components/wizard/StepTemplate.tsx',
  'components/wizard/LivePreviewPane.tsx',
  'lib/useWizard.ts',
];

console.log('=== Wizard Component Verification ===\n');

let allPassed = true;

filesToCheck.forEach((file) => {
  const fullPath = join(process.cwd(), file);
  const exists = existsSync(fullPath);
  
  if (exists) {
    const content = readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n').length;
    console.log(`✓ ${file} (${lines} lines)`);
  } else {
    console.log(`✗ ${file} - NOT FOUND`);
    allPassed = false;
  }
});

console.log('\n=== Testing localStorage Key ===');
const useWizardPath = join(process.cwd(), 'lib/useWizard.ts');
const useWizardContent = readFileSync(useWizardPath, 'utf-8');
if (useWizardContent.includes("STORAGE_KEY = 'wizard-state'")) {
  console.log('✓ localStorage key "wizard-state" defined');
} else {
  console.log('✗ localStorage key not found');
  allPassed = false;
}

console.log('\n=== Testing Debounce ===');
if (useWizardContent.includes('DEBOUNCE_MS = 800')) {
  console.log('✓ Debounce set to 800ms');
} else {
  console.log('✗ Debounce not set to 800ms');
  allPassed = false;
}

console.log('\n=== Testing Initial State Structure ===');
const requiredFields = [
  'storeName',
  'tagline',
  'category',
  'logoUrl',
  'themeColor',
  'templateId',
  'products',
  'contact',
];

requiredFields.forEach((field) => {
  if (useWizardContent.includes(`${field}:`)) {
    console.log(`✓ WizardState has ${field}`);
  } else {
    console.log(`✗ WizardState missing ${field}`);
    allPassed = false;
  }
});

console.log('\n=== Testing Step Components ===');
const stepBrandPath = join(process.cwd(), 'components/wizard/StepBrand.tsx');
const stepBrandContent = readFileSync(stepBrandPath, 'utf-8');

if (stepBrandContent.includes('react-hook-form')) {
  console.log('✓ StepBrand uses react-hook-form');
} else {
  console.log('✗ StepBrand missing react-hook-form');
  allPassed = false;
}

if (stepBrandContent.includes('/api/upload')) {
  console.log('✓ StepBrand has logo upload integration');
} else {
  console.log('✗ StepBrand missing logo upload');
  allPassed = false;
}

const stepTemplatePath = join(process.cwd(), 'components/wizard/StepTemplate.tsx');
const stepTemplateContent = readFileSync(stepTemplatePath, 'utf-8');

if (stepTemplateContent.includes('/api/templates')) {
  console.log('✓ StepTemplate fetches from /api/templates');
} else {
  console.log('✗ StepTemplate missing API integration');
  allPassed = false;
}

console.log('\n=== Testing Preview Integration ===');
const previewPath = join(process.cwd(), 'components/wizard/LivePreviewPane.tsx');
const previewContent = readFileSync(previewPath, 'utf-8');

if (previewContent.includes('StoreRenderer')) {
  console.log('✓ LivePreviewPane uses StoreRenderer');
} else {
  console.log('✗ LivePreviewPane missing StoreRenderer');
  allPassed = false;
}

console.log('\n=== Final Result ===');
if (allPassed) {
  console.log('✓ ALL TESTS PASSED');
  process.exit(0);
} else {
  console.log('✗ SOME TESTS FAILED');
  process.exit(1);
}
