import { AtLeast } from '../utils/typeHelpers';

export type FailAction =
'JUMP_TO_START' |
'START_APP_GO_BACK' |
'REDIRECT_NOT_FOUND' |
'REDIRECT_NOT_FOUND_WITH_PARAMS' |
'QUOTES_COMPARE_GO_BACK' |
'INTENT_GO_BACK';

export interface StateValidationObject {
  validationQuery: (state: any) => boolean;
  failAction: FailAction;
}
export interface PageOptions {
  hideAffiliateLogo: boolean;
  isPaymentFormPage: boolean;
  isDisclosurePage: boolean;
  isEappStartSignPage: boolean;
  hasBackToDashboard: boolean;
  noBackButton: (product?: string) => boolean;
  stateValidation: StateValidationObject;
  useAlternateNavBackground?: boolean;
  hideProgressCardEstimateRateExpanded?: boolean;
}
export type PartialPageOptions = AtLeast<PageOptions, 'stateValidation'>;
