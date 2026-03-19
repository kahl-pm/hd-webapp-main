import shortid from 'shortid';
import { _handleAuraHDDecisionCalc } from '../../src/NewActions/decision';
import { postAuraDecisionCalc } from '../../src/NewActions/fetch';

const fetch = require('../../src/NewActions/fetch');
const decision = require('../../src/NewActions/decision');
const helpers = require('../../src/utils/helpers');
const dependents = require('../../src/NewActions/dependents');
const { USER_TYPES } = require('../../src/utils/const');

describe('updateUserDecision tests', () => {
  let mockUpdateDependentDecision;
  const dispatchMock = jest.fn();
  const getStateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateDependentDecision = jest.spyOn(dependents, 'updateDependentDecision').mockImplementation(() => 'updateDependentDecision');
  });

  test(`Should call updateDependentDecision`, () => {
    decision.updateUserDecision('test', 'value', USER_TYPES.DEPENDENT)(dispatchMock, getStateMock);
    expect(mockUpdateDependentDecision).toHaveBeenCalled();
  });

  test(`Should call MakeUpdateSessionProp for primary`, () => {
    decision.updateUserDecision('test', 'value', USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
    expect(mockUpdateDependentDecision).not.toHaveBeenCalled();
  });
});

describe('Validate _handleAuraHDDecisionCalc calls postAuraDecisionCalc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const primary_hh_info_id = shortid.generate();
  const secondary_hh_info_id = shortid.generate();
  const dep1_hh_info_id = shortid.generate();
  const policy_id = shortid.generate();

  const jointUserTypes = [
    { userType: USER_TYPES.PRIMARY, dependentKey: null, household_id: primary_hh_info_id },
    { userType: USER_TYPES.SECONDARY, dependentKey: null, household_id: secondary_hh_info_id },
    { userType: USER_TYPES.DEPENDENT, dependentKey: '_XQ4FoQOg', household_id: dep1_hh_info_id },
  ];

  test.each(jointUserTypes)('for %s verify postAuraDecisionCalc was called with the correct req obj', async ({
    userType,
    dependentKey,
    household_id,
  }) => {
    const mockDispatch = jest.fn();
    const mocGetState = jest.fn(() => ({
      primary: {
        session: {
          hd_policy_id: policy_id,
          household_id: primary_hh_info_id,
        },
        hdDecision: {
          active_decision: 'Approved',
        },
      },
      secondary: {
        session: {
          hd_policy_id: policy_id,
          household_id: secondary_hh_info_id,
        },
        hdDecision: {
          active_decision: 'Approved',
        },
      },
      dependents: {
        dependents: {
          _XQ4FoQOg: {
            session: {
              hd_policy_id: policy_id,
              household_id: dep1_hh_info_id,
            },
            hdDecision: { active_decision: 'Approved' },
          },
        },
      },
      existingPolicies: {
        hasExistingPolicies: false,
        hasReplacingPolicies: false,
        hasPendingPolicies: false,
        existingPoliciesPendingKeepingFlag: false,
      },
    }));

    const postAuraDecisionCalcSpy =
        jest.spyOn(fetch, 'postAuraDecisionCalc');
    postAuraDecisionCalcSpy.mockResolvedValue({
      health_dental: { decision: { id: shortid.generate() } },
    });

    await _handleAuraHDDecisionCalc(userType, dependentKey)(mockDispatch, mocGetState);
    expect(postAuraDecisionCalcSpy).toHaveBeenCalledTimes(1);
    expect(postAuraDecisionCalcSpy).toHaveBeenCalledWith(
      policy_id, { hh_info_id: household_id },
    );
  });
});
