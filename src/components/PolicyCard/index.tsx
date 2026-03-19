/* eslint-disable max-len */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';

import {
  Button, CheckboxGroup, Divider, RadioGroup, ScreenReaderOnly, Select, Spacer, Typography, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';

import RepeatedHeader from '../RepeatedHeader';

import { isJoint as isJointSelector } from '../../Selectors/userControl';

// Stubs for removed Life/CI existing policies actions and selectors
const addExistingPolicy = (_status: string) => ({ type: 'NOOP' });
const removeExistingPolicy = (_key: string) => ({ type: 'NOOP' });
const updateExistingPolicy = (_key: string, _field: string, _value: any) => ({ type: 'NOOP' });
const updateReplacePolicyReason = (_key: string, _value: string | number | boolean, _flag: boolean) => ({ type: 'NOOP' });
const getExistingPolicies = (_state: any) => [] as Array<[string, any]>;
const getPendingPolicies = (_state: any) => [] as Array<[string, any]>;
const hasReplacedPolicies = (_state: any) => false;

import {
  EXISTING_POLICY_FIELDS, INSURER_NAMES, INSURER_TYPES, PM_PRODUCT_PREFIX, POLICY_STATUSES,
  POLICY_TYPE, POLICY_TYPE_CI_FIRST,
  PolicyStatusType, REPLACE_POLICY_REASONS, SESSION_STORAGE_LOGGING, USER_TYPES, YEARS_SINCE_1900,
} from '../../utils/const';
import { updateMultipleSessionStorageKeys, updateSessionStorage } from '../../utils/helpers';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { formatCurrencyWithoutDecimalsConfig } from '../../utils/reactIntlHelpers';
import Currency from '../Currency';
import { State } from '../../store/types/State';

type PolicyType = typeof POLICY_TYPE[keyof typeof POLICY_TYPE];

const POLICY_TYPE_DISPLAY: {
  [key in PolicyType]: (intl: IntlShape) => string;
} = {
  [POLICY_TYPE.TERM_LIFE]: (intl) => intl.formatMessage({ id: 'policyType.termLife.zRhsdR' }, { isPermanentInsurance: false }),
  [POLICY_TYPE.WHOLE_LIFE]: (intl) => intl.formatMessage({ id: 'policyType.wholeLife.BV19KW' }),
  [POLICY_TYPE.UNIVERSAL_LIFE]: (intl) => intl.formatMessage({ id: 'policyType.universalLife.eHLPZn' }),
  [POLICY_TYPE.MORTGAGE_LIFE]: (intl) => intl.formatMessage({ id: 'policyType.mortgageLife.JLk0Kg' }),
  [POLICY_TYPE.GROUP_LIFE_WORK]: (intl) => intl.formatMessage({ id: 'policyType.groupLife.bdRdID' }),
  [POLICY_TYPE.CRITICAL_ILLNESS]: (intl) => intl.formatMessage({ id: 'policyType.criticalIllness.rsZq66' }),
  [POLICY_TYPE.ACCIDENTAL_DEATH]: (intl) => intl.formatMessage({ id: 'policyType.accidentalDeath.to5DiE' }),
  [POLICY_TYPE.CREDIT_PROTECTION]: (intl) => intl.formatMessage({ id: 'policyType.creditProtection.Xvfvzd' }),
};

interface PolicyCardPolicy {
    [key: string]: {
      covers_primary: boolean;
      covers_secondary: boolean;
      status: PolicyStatusType;
      company: string;
      amount: number;
      is_replacing: 'Y' | 'N'| '';
      replacing_reasons: string[];
      replacing_reasons_other: string;
      type: string;
      type_other: string;
      year_issued: string;
    }
  }

const REPLACE_POLICY_REASONS_OPTIONS = [
  {
    value: REPLACE_POLICY_REASONS.CHEAPER,
    text: <FormattedMessage id="existingPolicies.newPolicyCheaper.jEdz2O" />,
  },
  {
    value: REPLACE_POLICY_REASONS.LONGER,
    text: <FormattedMessage id="existingPolicies.longerDuration.uWIlw8" />,
  },
  {
    value: REPLACE_POLICY_REASONS.MORE_COVERAGE,
    text: <FormattedMessage id="existingPolicies.moreCoverage.FXWx7J" />,
  },
  {
    value: REPLACE_POLICY_REASONS.EXPIRING,
    text: <FormattedMessage id="existingPolicies.expiring.fia4vY" />,
  },
  {
    value: REPLACE_POLICY_REASONS.SPLIT_JOINT,
    text: <FormattedMessage id="existingPolicies.splitJoinPolicy.2lQZkl" />,
  },
  {
    value: REPLACE_POLICY_REASONS.NON_CANADIAN,
    text: <FormattedMessage id="existingPolicies.notCanadianInsurance.vrnXVO" />,
  },
];

type PolicyCardProps = {
  existing?: boolean;
  pending?: boolean;
  replaceExisting?: boolean;
}

const PolicyCard = ({
  existing,
  pending,
  replaceExisting,
}: PolicyCardProps) => {
  const dispatch = useDispatch();

  const showExistingPolicies = useSelector((state: State) => state.metadata.existingPolicies?.hasExistingPolicies);
  const showReplacingPolicies = useSelector((state: State) => state.metadata.existingPolicies?.hasReplacingPolicies);
  const showPendingPolicies = useSelector((state: State) => state.metadata.existingPolicies?.hasPendingPolicies);
  const _hasReplacedPolicies = useSelector(hasReplacedPolicies);
  const existingPolicyEntries = useSelector(getExistingPolicies);
  const pendingPolicyEntries = useSelector(getPendingPolicies);
  const isJoint = useSelector(isJointSelector);
  const myPartner = useSelector((state: State) => state.secondary.household.firstName);
  const myself = useSelector((state: State) => state.primary.household.firstName);
  const mainProduct = useSelector((state: State) => getMainProduct(state, USER_TYPES.PRIMARY));

  const dataCyCheckboxOptions = (existing && 'policy') || (pending && 'pendingPolicy');

  const intl = useIntl();

  const POLICY_TYPES_CI_FIRST = Object.entries(POLICY_TYPE_CI_FIRST)
    .map(([key, label]) => ({ value: label, label: POLICY_TYPE_DISPLAY[label](intl) }));

  const POLICY_TYPES = Object.entries(POLICY_TYPE)
    .map(([key, label]) => ({ value: label, label: POLICY_TYPE_DISPLAY[label](intl) }));

  const getPolicyLabel = (policy: PolicyCardPolicy['policy']) => {
    const amount = intl.formatNumber(policy.amount, formatCurrencyWithoutDecimalsConfig);
    return <>{INSURER_NAMES[policy.company]}{` - ${amount}`}</>;
  };

  const getSelectedValues = (policy: PolicyCardPolicy) => {
    let selectedValues = [];
    if (policy[EXISTING_POLICY_FIELDS.COVERS_PRIMARY]) {
      selectedValues.push(EXISTING_POLICY_FIELDS.COVERS_PRIMARY);
    }
    if (policy[EXISTING_POLICY_FIELDS.COVERS_SECONDARY]) {
      selectedValues.push(EXISTING_POLICY_FIELDS.COVERS_SECONDARY);
    }
    return selectedValues;
  };

  const POLICIES_CHECKBOX_OPTIONS = (key: string, index: number) => {
    return [
      {
        checkboxName: EXISTING_POLICY_FIELDS.COVERS_PRIMARY,
        text: myself !== '' ? myself : <FormattedMessage id="global.you.8d4U9b" />,
        key,
        value: EXISTING_POLICY_FIELDS.COVERS_PRIMARY,
        dataCy: `${dataCyCheckboxOptions}-${index}-Myself`,
      },
      {
        checkboxName: EXISTING_POLICY_FIELDS.COVERS_SECONDARY,
        text: myPartner !== '' ? myPartner : <FormattedMessage id="global.yourPartner.JXFy4p" />,
        key,
        value: EXISTING_POLICY_FIELDS.COVERS_SECONDARY,
        dataCy: `${dataCyCheckboxOptions}-${index}-Partner`,
      },
    ];
  };

  const slideInPolicyCard = (
    (existing
    && showExistingPolicies)
   ||
  (pending
    && showPendingPolicies)
   ||
  (replaceExisting
    && showReplacingPolicies)
  );

  const policyEntries = (existing && existingPolicyEntries)
                      || (pending && pendingPolicyEntries)
                      || (replaceExisting && existingPolicyEntries);
  if (!slideInPolicyCard) {
    return null;
  }

  const selectedReplacingOptions = policyEntries
    .filter(([_key, policy]) => policy[EXISTING_POLICY_FIELDS.IS_REPLACING] === 'Y')
    .map(([key, _policy]) => key);

  const replaceExistingOptions = policyEntries.map(([key, policy]) => ({
    value: key,
    text: getPolicyLabel(policy),
    dataCy: `policy-${policy.company}-${policy.amount}`,
    checkboxName: `check_${key}`,
    body: <>
      <Spacer size="space2XS" />
      <Divider />
      <Spacer size="spaceXS" />
      <Typography
        variant="h4"
        component="h3"
        align="left"
        id="existingPolicies.policyCardReplacingHeader.N4NEJk"
        message={<FormattedMessage
          id="existingPolicies.policyCardReplacingHeader.N4NEJk"
          values={{
            br: <br />,
          }}
        />}
      />
      <Spacer size="spaceSmall" />
      <RadioGroup
        name={`existing_policy_${key}`}
        labelledBy="existingPolicies.policyCardReplacingHeader.N4NEJk"
        options={REPLACE_POLICY_REASONS_OPTIONS}
        orientation="vertical"
        onChange={(_event, value) => {
          dispatch(updateReplacePolicyReason(key, value, true));
        }}
        value={policy[EXISTING_POLICY_FIELDS.REPLACING_REASONS]?.[0] ?? null}
        data-cy={`policy-${policy.company}-${policy.amount}-reason`}
        required
      />
    </>,
  }));

  return (
    <>
      <ScreenReaderOnly>
        <Typography
          variant="body1"
          message={
            <FormattedMessage
              id="global.selectAtLeastOneOption.P8L95H"
            />
              }
          id="global.selectAtLeastOneOption.P8L95H"
        />
      </ScreenReaderOnly>
      {replaceExisting
          && <CheckboxGroup
            ariaDescribedBy="global.selectAtLeastOneOption.P8L95H"
            ariaLabelledBy="replacePolicies.selectPoliciesHeader.mkTZal"
            name="replace-existing-policies-checkbox-group"
            options={replaceExistingOptions}
            selectedValues={selectedReplacingOptions}
            onChange={(newSelectedKeys) => {
              policyEntries.forEach(([key, _policy]) => {
                const val = newSelectedKeys.includes(key) ? 'Y' : 'N';
                dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.IS_REPLACING, val));
                // log to session storage
                updateMultipleSessionStorageKeys({
                  [SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS]: [
                    { path: [key, SESSION_STORAGE_LOGGING.IS_REPLACING], value: val },
                    { path: [SESSION_STORAGE_LOGGING.CHANGE_HISTORY], value: `User selected policy ${key} as ${val} replacing`, append: true },
                  ],
                });
              });
            }}
            size="large"
            required
            hideUnselectedBody
            seperatorComponent={
              <Spacer size="space3XS" />
          }
          />}
      <UniformSpacingLayout gap="1rem" flexDirection="column">
        {(existing || pending)
          && policyEntries.map(([key, policy], index) => <RepeatedHeader
            title={(existing && <FormattedMessage
              id="global.policy.t6lqJE"
            />) || (pending && <FormattedMessage
              id="global.pendingPolicy.vvIVld"
            />)}
            key={key}
            id={key}
            index={index}
            removeItem={() => {
              dispatch(removeExistingPolicy(key));
              // log to session storage
              updateSessionStorage(SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS, [SESSION_STORAGE_LOGGING.CHANGE_HISTORY], `User removed ${(existing && 'existing') || (pending && 'pending')} policy ${key}`, true);
            }}
            length={policyEntries.length}
            customTitle={<FormattedMessage
              id="existingPolicies.policyCardTitle.kWyNVM"
              values={{
                num: index + 1,
              }}
            />}
          >
            <UniformSpacingLayout gap="1rem" flexDirection="column">
              {isJoint &&
              <>
                <Typography
                  variant="h3"
                  align="left"
                  message={<FormattedMessage
                    id="existingPolicies.policyCardPersonCovered.KpJlhZ"
                  />}
                  id="existingPolicies.policyCardPersonCovered.KpJlhZ"
                />
                <CheckboxGroup
                  ariaDescribedBy="global.selectAtLeastOneOption.P8L95H"
                  ariaLabelledBy="existingPolicies.policyCardPersonCovered.KpJlhZ"
                  name={`joint_covers_${index}`}
                  onChange={(val) => {
                    if (val.includes(EXISTING_POLICY_FIELDS.COVERS_PRIMARY)) {
                      dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.COVERS_PRIMARY, true));
                    }
                    if (val.includes(EXISTING_POLICY_FIELDS.COVERS_SECONDARY)) {
                      dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.COVERS_SECONDARY, true));
                    }
                    if (!val.includes(EXISTING_POLICY_FIELDS.COVERS_PRIMARY)) {
                      dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.COVERS_PRIMARY, false));
                    }
                    if (!val.includes(EXISTING_POLICY_FIELDS.COVERS_SECONDARY)) {
                      dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.COVERS_SECONDARY, false));
                    }
                  }}
                  options={POLICIES_CHECKBOX_OPTIONS(key, index)}
                  errorMessage={<FormattedMessage
                    id="existingPolicies.minPerson.QmiGcM"
                  />}
                  required
                  orientation="horizontal"
                  variant="primary"
                  gapBetweenComponents="2rem"
                  selectedValues={getSelectedValues(policy)}
                />
              </>}
              <Select
                ariaLabel="Company"
                label={<FormattedMessage
                  id="global.company.C7gAIL"
                />}
                multiple={false}
                name={`insurer_${index}`}
                options={INSURER_TYPES}
                onChange={(e) => {
                  dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.COMPANY, e?.value));
                }}
                value={policy[EXISTING_POLICY_FIELDS.COMPANY]}
                required
                requiredMessage={<FormattedMessage
                  id="existingPolicies.selectCompany.Reovj7"
                />}
                dataCy={(existing && `existingInsurer-${index}`) || (pending && `pendingPolicy-${index}-company`)}
              />
              <Currency
                value={policy[EXISTING_POLICY_FIELDS.AMOUNT]}
                onChange={(e) => {
                  dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.AMOUNT, e));
                  // log to session storage
                  updateSessionStorage(
                    SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS,
                    [key, SESSION_STORAGE_LOGGING.AMOUNT],
                    e,
                  );
                }}
                required
                requiredMessage={<FormattedMessage id="global.enterAnAmount.zBMdhN" />}
                name={`last_name_search_${index}`}
                dataCy={(existing && `policyCoverageAmount-${index}`) || (pending && `pendingPolicy-${index}-coverageAmount`)}
              />
              {existing && <Select
                ariaLabel="Year Issued"
                name={`insurer_${index}_year`}
                label={<FormattedMessage
                  id="existingPolicies.yearIssued.G4EoiP"
                />}
                options={YEARS_SINCE_1900}
                multiple={false}
                onChange={(e) => dispatch(updateExistingPolicy(
                  key,
                  EXISTING_POLICY_FIELDS.YEAR_ISSUED,
                  e?.value,
                ))}
                value={policy[EXISTING_POLICY_FIELDS.YEAR_ISSUED]}
                required
                requiredMessage={<FormattedMessage
                  id="existingPolicies.selectYear.AjitB2"
                />}
                dataCy={`existingInsurerYear-${index}`}
              />}
              <Select
                ariaLabel="Policy Type"
                name={(existing && `policy_${index}_type`) || (pending && `pending_policy_${index}_type`)}
                label={<FormattedMessage id="global.policyType.VeqZnr" />}
                options={POLICY_TYPES_CI_FIRST}
                onChange={(e) => {
                  dispatch(updateExistingPolicy(key, EXISTING_POLICY_FIELDS.TYPE, e?.value));
                  // log to session storage
                  updateMultipleSessionStorageKeys({
                    [SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS]: [
                      { path: [key, SESSION_STORAGE_LOGGING.TYPE], value: e },
                      { path: [key, SESSION_STORAGE_LOGGING.CATEGORY], value: existing ? 'existing' : 'pending' },
                    ],
                  });
                }}
                value={policy[EXISTING_POLICY_FIELDS.TYPE]}
                multiple={false}
                required
                requiredMessage={<FormattedMessage id="existingPolicies.selectPolicy.rC0ARk" />}
                dataCy={(existing && `existingPolicyType-${index}`) || (pending && `pendingPolicyType-${index}`)}
              />
            </UniformSpacingLayout>
          </RepeatedHeader>)}
      </UniformSpacingLayout>
      {(pending || existing)
        && (
          <>
            <Spacer size="spaceMedium" />
            <Button
              name="addPolicy"
              variant="secondary"
              type="button"
              onClick={
                () => {
                  (existing && dispatch(addExistingPolicy(POLICY_STATUSES.IN_FORCE)))
                    || (pending && dispatch(addExistingPolicy(POLICY_STATUSES.PENDING)));
                  // log to session storage
                  updateSessionStorage(SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS, [SESSION_STORAGE_LOGGING.CHANGE_HISTORY], `User added ${(existing && 'existing') || (pending && 'pending')} policy`, true);
                }
              }
              data-cy={`add${(existing && 'Existing') || (pending && 'Pending')}Policy`}
            >
              <Typography variant="CTALargeSecondary" message={<FormattedMessage id="existingPolicies.addPolicy.ct72Ai" />} />
            </Button>
            <Spacer size="spaceSmall" />
          </>
        )}
    </>
  );
};

export default PolicyCard;
