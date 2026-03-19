import React from 'react';
import LoadingComponent from '../LoadingOverlay';
import RUCError from '../RUCError';

export const getLoadingConfig = (chunkName) => ({
  loading: <LoadingComponent />,
  error: (error) => <RUCError error={error} />,
  chunkName,
  timeout: 60000, // 60 seconds before showing error component
});

// List of pages migrated to new design system to remove the container
// class from the page
const migratedPages = [
  '/effective-date',
  '/payment-in-progress',
  '/payment-received',
  '/payment-form',
  '/thankyou',
  '/application/consent',
  '/full-address',
  '/employment-income-annual-self',
  '/common-primary-beneficiaries',
  '/common-secondary-beneficiaries',
  '/primary-beneficiaries',
  '/secondary-beneficiaries',
  '/interest',
  '/referrer',
  '/questions/kids-housing',
  '/questions/income',
  '/questions/residence',
  '/questions/expenses',
  '/questions/existing-coverage',
  '/questions/intro',
  '/questions/partner',
  '/questions/kids',
  '/questions/birthdate',
  '/questions/gender',
  '/questions/smoke',
  '/questions/health',
  '/questions/savings',
  '/questions/debts',
  '/questions/email',
];

export const checkIfMigratedPage = (currentLocation) => {
  return migratedPages.some(page => currentLocation.pathname.endsWith(page));
};
