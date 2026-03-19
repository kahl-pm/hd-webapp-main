import { STATES_ENUM } from '../../../ReduxStateMother/const';
import { USER_TYPES } from '../../../../src/utils/const';

export const patch_policies_expected_data = (strategy, user) => {
  let data = {};
  switch (strategy) {
    case STATES_ENUM.JOURNEY_1_INDIV_APPROVED:
      data = {
        data: {
          annual_premiums_issued: 710.11,
          monthly_premiums_issued: 58.14,
          original_annual_premiums_issued: 710.11,
          original_monthly_premiums_issued: 58.14,
          quote_breakdown: {
            annual: [
              {
                end_date: '24/02/2043',
                end_idx: 20,
                start_date: '24/02/2023',
                start_idx: 1,
                value: 710.11,
              },
            ],
            monthly: [
              {
                end_date: '24/02/2043',
                end_idx: 240,
                start_date: '24/02/2023',
                start_idx: 12,
                value: 58.14,
              },
            ],
          },
          success: 1,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_POLICYME_PARTNER:
      data = {
        data: {
          annual_premiums_issued: 825.11,
          monthly_premiums_issued: 60.47,
          original_annual_premiums_issued: 825.11,
          original_monthly_premiums_issued: 60.47,
          quote_breakdown: {
            annual: [
              {
                end_date: '05/12/2023',
                end_idx: 1,
                start_date: '05/12/2022',
                start_idx: 0,
                value: 710.79,
              },
              {
                end_date: '05/12/2047',
                end_idx: 25,
                start_date: '05/12/2023',
                start_idx: 1,
                value: 825.11,
              },
            ],
            monthly: [
              {
                end_date: '05/01/2023',
                end_idx: 1,
                start_date: '05/12/2022',
                start_idx: 0,
                value: 0.01,
              },
              {
                end_date: '05/02/2023',
                end_idx: 2,
                start_date: '05/01/2023',
                start_idx: 1,
                value: 0,
              },
              {
                end_date: '05/12/2047',
                end_idx: 300,
                start_date: '05/02/2023',
                start_idx: 2,
                value: 60.47,
              },
            ],
          },
          success: 1,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_JOINT_APPROVED:
      data = {
        data: user === USER_TYPES.SECONDARY ? {
          annual_premiums_issued: 610.77,
          monthly_premiums_issued: 49.71,
          original_annual_premiums_issued: 610.77,
          original_monthly_premiums_issued: 49.71,
          quote_breakdown: {
            annual: [
              {
                end_date: '24/02/2024',
                end_idx: 1,
                start_date: '24/02/2023',
                start_idx: 0,
                value: 549.69,
              },
              {
                end_date: '24/02/2043',
                end_idx: 20,
                start_date: '24/02/2024',
                start_idx: 1,
                value: 610.77,
              },
            ],
            monthly: [
              {
                end_date: '24/02/2024',
                end_idx: 12,
                start_date: '24/02/2023',
                start_idx: 0,
                value: 44.74,
              },
              {
                end_date: '24/02/2043',
                end_idx: 240,
                start_date: '24/02/2024',
                start_idx: 12,
                value: 49.71,
              },
            ],
          },
          success: 1,
        } : {
          annual_premiums_issued: 610.77,
          monthly_premiums_issued: 54.97,
          original_annual_premiums_issued: 610.77,
          original_monthly_premiums_issued: 54.97,
          quote_breakdown: {
            annual: [
              {
                end_date: '24/02/2024',
                end_idx: 1,
                start_date: '24/02/2023',
                start_idx: 0,
                value: 549.69,
              },
              {
                end_date: '24/02/2043',
                end_idx: 20,
                start_date: '24/02/2024',
                start_idx: 1,
                value: 610.77,
              },
            ],
            monthly: [
              {
                end_date: '24/02/2024',
                end_idx: 12,
                start_date: '24/02/2023',
                start_idx: 0,
                value: 49.47,
              },
              {
                end_date: '24/02/2043',
                end_idx: 240,
                start_date: '24/02/2024',
                start_idx: 12,
                value: 54.97,
              },
            ],
          },
          success: 1,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER:
      data = {
        data: user === USER_TYPES.SECONDARY ? {
          annual_premiums_issued: 850.54,
          monthly_premiums_issued: 33.75,
          original_annual_premiums_issued: 850.54,
          original_monthly_premiums_issued: 33.75,
          quote_breakdown: {
            annual: [
              {
                end_date: '24/02/2024',
                end_idx: 1,
                start_date: '24/02/2023',
                start_idx: 0,
                value: 550.38,
              },
              {
                end_date: '24/02/2043',
                end_idx: 20,
                start_date: '24/02/2024',
                start_idx: 1,
                value: 850.54,
              },
            ],
            monthly: [
              {
                end_date: '05/01/2023',
                end_idx: 1,
                start_date: '05/12/2022',
                start_idx: 0,
                value: 0.01,
              },
              {
                end_date: '05/02/2023',
                end_idx: 2,
                start_date: '05/01/2023',
                start_idx: 1,
                value: 0,
              },
              {
                end_date: '05/12/2023',
                end_idx: 12,
                start_date: '05/02/2023',
                start_idx: 2,
                value: 30.38,
              },
              {
                end_date: '05/12/2042',
                end_idx: 240,
                start_date: '05/12/2023',
                start_idx: 12,
                value: 33.75,
              },
            ],
          },
          success: 1,
        } : {
          annual_premiums_issued: 850.54,
          monthly_premiums_issued: 45.28,
          original_annual_premiums_issued: 850.54,
          original_monthly_premiums_issued: 45.28,
          quote_breakdown: {
            annual: [
              {
                end_date: '24/02/2024',
                end_idx: 1,
                start_date: '24/02/2023',
                start_idx: 0,
                value: 550.38,
              },
              {
                end_date: '24/02/2043',
                end_idx: 20,
                start_date: '24/02/2024',
                start_idx: 1,
                value: 850.54,
              },
            ],
            monthly: [
              {
                end_date: '05/01/2023',
                end_idx: 1,
                start_date: '05/12/2022',
                start_idx: 0,
                value: 0.01,
              },
              {
                end_date: '05/02/2023',
                end_idx: 2,
                start_date: '05/01/2023',
                start_idx: 1,
                value: 0,
              },
              {
                end_date: '05/12/2023',
                end_idx: 12,
                start_date: '05/02/2023',
                start_idx: 2,
                value: 40.75,
              },
              {
                end_date: '05/12/2042',
                end_idx: 240,
                start_date: '05/12/2023',
                start_idx: 12,
                value: 45.28,
              },
            ],
          },
          success: 1,
        },
      };
      break;
    default:
      break;
  }
  return data;
};

export const quotes_with_ratings_expected_data = (strategy) => {
  let data = {};
  switch (strategy) {
    case STATES_ENUM.JOURNEY_1_INDIV_APPROVED:
      data = {
        data: {
          primary: [
            {
              applied_discounts: [],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: false,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 58.14,
              no_medical: false,
              original_mn_prems: 58.14,
              original_yr_prems: 710.11,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '24/02/2043',
                    end_idx: 20,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 710.11,
                  },
                ],
                monthly: [
                  {
                    end_date: '24/02/2043',
                    end_idx: 240,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 58.14,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 710.11,
            },
          ],
          seq_num: 1,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_POLICYME_PARTNER:
      data = {
        data: {
          primary: [
            {
              applied_discounts: [
                'Exclusive Perk - 2 months off',
              ],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: true,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 60.47,
              no_medical: false,
              original_mn_prems: 60.47,
              original_yr_prems: 825.11,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '05/12/2023',
                    end_idx: 1,
                    start_date: '05/12/2022',
                    start_idx: 0,
                    value: 710.79,
                  },
                  {
                    end_date: '05/12/2047',
                    end_idx: 25,
                    start_date: '05/12/2023',
                    start_idx: 1,
                    value: 825.11,
                  },
                ],
                monthly: [
                  {
                    end_date: '05/01/2023',
                    end_idx: 1,
                    start_date: '05/12/2022',
                    start_idx: 0,
                    value: 0.01,
                  },
                  {
                    end_date: '05/02/2023',
                    end_idx: 2,
                    start_date: '05/01/2023',
                    start_idx: 1,
                    value: 0,
                  },
                  {
                    end_date: '05/12/2047',
                    end_idx: 300,
                    start_date: '05/02/2023',
                    start_idx: 2,
                    value: 60.47,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 825.11,
            },
          ],
          seq_num: 1,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_JOINT_APPROVED:
      data = {
        data: {
          joint: [
            {
              company: 'PM',
              id: 1,
              invalid: false,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 104.68,
              no_medical: false,
              product_enum: 0,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 1,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 1099.38,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 20,
                    start_date: '24/02/2024',
                    start_idx: 1,
                    value: 1221.54,
                  },
                ],
                monthly: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 12,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 94.21,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 240,
                    start_date: '24/02/2024',
                    start_idx: 12,
                    value: 104.68,
                  },
                ],
              },
              term: 0,
              yr_prems: 1221.54,
            },
          ],
          primary: [
            {
              applied_discounts: [
                'Joint Discount V2 - 10% Savings for 12 Months',
              ],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: true,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 54.97,
              no_medical: false,
              original_mn_prems: 54.97,
              original_yr_prems: 610.77,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 1,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 549.69,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 20,
                    start_date: '24/02/2024',
                    start_idx: 1,
                    value: 610.77,
                  },
                ],
                monthly: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 12,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 49.47,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 240,
                    start_date: '24/02/2024',
                    start_idx: 12,
                    value: 54.97,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 610.77,
            },
          ],
          secondary: [
            {
              applied_discounts: [
                'Joint Discount V2 - 10% Savings for 12 Months',
              ],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: true,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 49.71,
              no_medical: false,
              original_mn_prems: 49.71,
              original_yr_prems: 610.77,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 1,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 549.69,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 20,
                    start_date: '24/02/2024',
                    start_idx: 1,
                    value: 610.77,
                  },
                ],
                monthly: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 12,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 44.74,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 240,
                    start_date: '24/02/2024',
                    start_idx: 12,
                    value: 49.71,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 610.77,
            },
          ],
          seq_num: 1,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER:
      data = {
        data: {
          joint: [
            {
              company: 'PM',
              id: 1,
              invalid: false,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 45.28,
              no_medical: false,
              product_enum: 0,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 1,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 899.38,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 20,
                    start_date: '24/02/2024',
                    start_idx: 1,
                    value: 1001.54,
                  },
                ],
                monthly: [
                  {
                    end_date: '05/01/2023',
                    end_idx: 1,
                    start_date: '05/12/2022',
                    start_idx: 0,
                    value: 0.01,
                  },
                  {
                    end_date: '05/02/2023',
                    end_idx: 2,
                    start_date: '05/01/2023',
                    start_idx: 1,
                    value: 0,
                  },
                  {
                    end_date: '05/12/2023',
                    end_idx: 12,
                    start_date: '05/02/2023',
                    start_idx: 2,
                    value: 40.75,
                  },
                  {
                    end_date: '05/12/2042',
                    end_idx: 240,
                    start_date: '05/12/2023',
                    start_idx: 12,
                    value: 45.28,
                  },
                ],
              },
              term: 25,
              yr_prems: 1001.54,
            },
          ],
          primary: [
            {
              applied_discounts: [
                'Joint Discount V2 - 10% Savings for 12 Months',
                'Exclusive Perk - 2 months off',
              ],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: true,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              no_medical: false,
              original_mn_prems: 45.28,
              original_yr_prems: 550.38,
              product_enum: 1003,
              mn_prems: 45.28,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 1,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 550.38,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 20,
                    start_date: '24/02/2024',
                    start_idx: 1,
                    value: 850.54,
                  },
                ],
                monthly: [
                  {
                    end_date: '05/01/2023',
                    end_idx: 1,
                    start_date: '05/12/2022',
                    start_idx: 0,
                    value: 0.01,
                  },
                  {
                    end_date: '05/02/2023',
                    end_idx: 2,
                    start_date: '05/01/2023',
                    start_idx: 1,
                    value: 0,
                  },
                  {
                    end_date: '05/12/2023',
                    end_idx: 12,
                    start_date: '05/02/2023',
                    start_idx: 2,
                    value: 40.75,
                  },
                  {
                    end_date: '05/12/2042',
                    end_idx: 240,
                    start_date: '05/12/2023',
                    start_idx: 12,
                    value: 45.28,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 550.38,
            },
          ],
          secondary: [
            {
              applied_discounts: [
                'Joint Discount V2 - 10% Savings for 12 Months',
                'Exclusive Perk - 2 months off',
              ],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: true,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 33.75,
              no_medical: false,
              original_mn_prems: 33.75,
              original_yr_prems: 610.77,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '24/02/2024',
                    end_idx: 1,
                    start_date: '24/02/2023',
                    start_idx: 0,
                    value: 550.38,
                  },
                  {
                    end_date: '24/02/2043',
                    end_idx: 20,
                    start_date: '24/02/2024',
                    start_idx: 1,
                    value: 850.54,
                  },
                ],
                monthly: [
                  {
                    end_date: '05/01/2023',
                    end_idx: 1,
                    start_date: '05/12/2022',
                    start_idx: 0,
                    value: 0.01,
                  },
                  {
                    end_date: '05/02/2023',
                    end_idx: 2,
                    start_date: '05/01/2023',
                    start_idx: 1,
                    value: 0,
                  },
                  {
                    end_date: '05/12/2023',
                    end_idx: 12,
                    start_date: '05/02/2023',
                    start_idx: 2,
                    value: 30.38,
                  },
                  {
                    end_date: '05/12/2042',
                    end_idx: 240,
                    start_date: '05/12/2023',
                    start_idx: 12,
                    value: 33.75,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 610.77,
            },
          ],
          seq_num: 1,
        },
      };
      break;
    default:
      break;
  }
  return data;
};

export const quotes_expected_data = (strategy) => {
  let data = {};
  switch (strategy) {
    case STATES_ENUM.JOURNEY_1_INDIV_MORTGAGE:
      data = {
        data: {
          primary: [
            {
              applied_discounts: [],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: false,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 175.46,
              no_medical: false,
              original_mn_prems: 175.46,
              original_yr_prems: 1949.52,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '27/02/2043',
                    end_idx: 20,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 1949.52,
                  },
                ],
                monthly: [
                  {
                    end_date: '27/02/2043',
                    end_idx: 240,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 175.46,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 1949.52,
            },
          ],
          seq_num: 1,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_JOINT_MORTGAGE:
      data = {
        data: {
          joint: [
            {
              company: 'PM',
              id: 1,
              invalid: false,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 428.94,
              no_medical: false,
              product_enum: 0,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '27/02/2024',
                    end_idx: 1,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 4289.38,
                  },
                  {
                    end_date: '27/02/2043',
                    end_idx: 20,
                    start_date: '27/02/2024',
                    start_idx: 1,
                    value: 4765.98,
                  },
                ],
                monthly: [
                  {
                    end_date: '27/02/2024',
                    end_idx: 12,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 386.03999999999996,
                  },
                  {
                    end_date: '27/02/2043',
                    end_idx: 240,
                    start_date: '27/02/2024',
                    start_idx: 12,
                    value: 428.94,
                  },
                ],
              },
              term: 0,
              yr_prems: 4765.98,
            },
          ],
          primary: [
            {
              applied_discounts: [
                'Joint Discount V2 - 10% Savings for 12 Months',
              ],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: true,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 175.46,
              no_medical: false,
              original_mn_prems: 175.46,
              original_yr_prems: 1949.52,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '27/02/2024',
                    end_idx: 1,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 1754.57,
                  },
                  {
                    end_date: '27/02/2043',
                    end_idx: 20,
                    start_date: '27/02/2024',
                    start_idx: 1,
                    value: 1949.52,
                  },
                ],
                monthly: [
                  {
                    end_date: '27/02/2024',
                    end_idx: 12,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 157.91,
                  },
                  {
                    end_date: '27/02/2043',
                    end_idx: 240,
                    start_date: '27/02/2024',
                    start_idx: 12,
                    value: 175.46,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 1949.52,
            },
          ],
          secondary: [
            {
              applied_discounts: [
                'Joint Discount V2 - 10% Savings for 12 Months',
              ],
              company: 'PM',
              id: 1,
              invalid: false,
              is_discounted: true,
              is_express: true,
              is_low_approval: false,
              is_slow: false,
              low_approval: false,
              mn_prems: 253.48,
              no_medical: false,
              original_mn_prems: 253.48,
              original_yr_prems: 2816.46,
              product_enum: 1003,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '27/02/2024',
                    end_idx: 1,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 2534.81,
                  },
                  {
                    end_date: '27/02/2043',
                    end_idx: 20,
                    start_date: '27/02/2024',
                    start_idx: 1,
                    value: 2816.46,
                  },
                ],
                monthly: [
                  {
                    end_date: '27/02/2024',
                    end_idx: 12,
                    start_date: '27/02/2023',
                    start_idx: 0,
                    value: 228.13,
                  },
                  {
                    end_date: '27/02/2043',
                    end_idx: 240,
                    start_date: '27/02/2024',
                    start_idx: 12,
                    value: 253.48,
                  },
                ],
              },
              term: 20,
              term_savings: -1,
              yr_prems: 2816.46,
            },
          ],
          seq_num: 1,
        },
      };
      break;
    default:
      break;
  }
  return data;
};
