import ReduxState from '../ReduxStateMother';
import {
  completedNeedsAssesment,
  completedJointNeedsAssesment
} from '../../src/Selectors/session';
import { STATES_ENUM } from '../ReduxStateMother/const';
import { USER_TYPES } from '../../src/utils/const';

describe('Test completedNeedsAssesment selector', () => {
  let stateObj1;
  beforeEach(() => {
    stateObj1 = new ReduxState(STATES_ENUM.DEFAULT);
  });

  test('Should return True', () => {
    stateObj1.primary.hdSession.recmd_cov_amt = 100000;
    expect(completedNeedsAssesment(stateObj1, USER_TYPES.PRIMARY, 'hd')) === true;
  });

  test('Should return False', () => {
    stateObj1.primary.hdSession.recmd_cov_amt = '';
    expect(completedNeedsAssesment(stateObj1, USER_TYPES.PRIMARY, 'hd')) === false;
  });
});

describe('Test completedJointNeedsAssesment selector', () => {
  let stateObj1;
  beforeEach(() => {
    stateObj1 = new ReduxState(STATES_ENUM.DEFAULT);
  });

  test('Should return True', () => {
    stateObj1.primary.hdSession.recmd_cov_amt = 100000;
    stateObj1.secondary.hdSession.recmd_cov_amt = 100000;
    expect(completedJointNeedsAssesment(stateObj1, 'hd')) === true;
  });

  test('Should return False', () => {
    stateObj1.primary.hdSession.recmd_cov_amt = 100000;
    stateObj1.secondary.hdSession.recmd_cov_amt = '';
    expect(completedJointNeedsAssesment(stateObj1, 'hd')) === false;
  });

  test('Should return False', () => {
    stateObj1.primary.hdSession.recmd_cov_amt = '';
    stateObj1.secondary.hdSession.recmd_cov_amt = 100000;
    expect(completedJointNeedsAssesment(stateObj1, 'hd')) === false;
  });


  test('Should return False', () => {
    stateObj1.primary.hdSession.recmd_cov_amt = '';
    stateObj1.secondary.hdSession.recmd_cov_amt = '';
    expect(completedJointNeedsAssesment(stateObj1, 'hd')) === false;
  });
});
