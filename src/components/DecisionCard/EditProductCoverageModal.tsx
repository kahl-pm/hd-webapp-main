import React from 'react';

interface Props {
  isEditProductCoverageModalOpen: boolean;
  product: string;
  userType: string;
  coverageAmt: number;
  term: number;
  updateCoverageAmountAndTermAndRequoteWithDebits:
    (userType:string, coverageAmt: number, term: number) => void;
  setIsEditProductCoverageModalOpen: (isOpen: boolean) => void;
}

export default ({
  isEditProductCoverageModalOpen,
}: Props) => {
  // Life and CI edit modals have been removed as part of HD extraction.
  // This component is kept as a stub for compatibility.
  return null;
};
