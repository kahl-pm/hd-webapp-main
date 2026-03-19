import store from '../../src/store';
import { EMAIL_REF_VERSIONS } from '../../src/utils/const';
import { getStore } from '../utils';

const storeName = 'metadata';
const data = getStore(storeName);
const initialState = data || {
  abTestBand: 'control',
  backPressed: undefined,
  currRoute: '/docusign-app',
  dateTime: '',
  debugFlag: false,
  docusignUrl: undefined,
  emailIsDeliverable: true,
  emailRefVers: undefined,
  fbEventQueue: [],
  fbInitFlag: true,
  forwardPressed: undefined,
  fromQuoteCompare: false,
  fromStartApp: false,
  hasCustomError: false,
  hasError: false,
  hasLocalHistory: true,
  initialized: true,
  isBookingAdvisorReview: undefined,
  isChatbotInitialized: false,
  isConfirmationOpen: false,
  isContactModalOpen: false,
  isLoading: false,
  isQuoting: false,
  name: '',
  question: '',
  sendAnalyticsCb: undefined,
  sentEappsMessage: false,
  seq_num: 3,
  suggestedEmail: null,
  user_lead_source: 'Online Article',
  user_lead_source_other: '',
  utm_campaign: undefined,
  utm_content: undefined,
  utm_extras: undefined,
  utm_global_id: '368275c7-3059-462e-a639-f950321370b3',
  utm_medium: undefined,
  utm_source: 'direct',
  utm_term: undefined,
  utm_tracking_id: '68a3683b-c1fb-4f21-990c-b48f2ee3e793',
  navbarFirstName: '',
  navbarLastName: '',
  isStripeDebugMode: false,
  isRebrandDesignEnabled: false,
  isPostDecision: false,
  isforceRedoStartApp: false,
  auth0Resp: '',
};

function reInitState(value) {
  return {
    type: '@@metadata/debug',
    value,
  };
}

store.dispatch(reInitState(initialState));
