import cloneDeep from 'lodash/cloneDeep';

import { disclosureState, makeDisclosureHelper } from './helpers/disclosure';

const SLICE_NAME = 'partnerDisclosure';
const initialState = cloneDeep(disclosureState);

export default (state = initialState, action) => (
  makeDisclosureHelper(SLICE_NAME)(state, action));
