// import { rest } from 'msw';
import { CI_MAIN_ENDPOINT, CI_QUOTES_ENDPOINT } from '../../../../src/config';
import { USER_TYPES } from '../../../../src/utils/const';
import { STATES_ENUM } from '../../../ReduxStateMother/const';
import { server } from '../../server';

export const ci_quotes_with_ratings_expected_data = (strategy) => {
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
              is_discounted: false,
              mn_prems: 14.9,
              original_mn_prems: 14.9,
              original_yr_prems: 165.56,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 20,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 165.56,
                  },
                ],
                monthly: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 240,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 14.9,
                  },
                ],
              },
              yr_prems: 165.56,
            },
          ],
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
              mn_prems: 35.8,
              original_mn_prems: 35.8,
              original_yr_prems: 366.12,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 20,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 366.12,
                  },
                ],
                monthly: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 240,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 35.8,
                  },
                ],
              },
              yr_prems: 366.12,
            },
          ],
          primary: [
            {
              applied_discounts: [],
              company: 'PM',
              id: 1,
              is_discounted: false,
              mn_prems: 14.9,
              original_mn_prems: 14.9,
              original_yr_prems: 165.56,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 20,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 165.56,
                  },
                ],
                monthly: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 240,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 14.9,
                  },
                ],
              },
              yr_prems: 165.56,
            },
          ],
          secondary: [
            {
              applied_discounts: [],
              company: 'PM',
              id: 1,
              is_discounted: false,
              mn_prems: 20.9,
              original_mn_prems: 20.9,
              original_yr_prems: 200.56,
              quote_breakdown: {
                annual: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 20,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 200.56,
                  },
                ],
                monthly: [
                  {
                    end_date: '28/12/2042',
                    end_idx: 240,
                    start_date: '28/12/2022',
                    start_idx: 0,
                    value: 20.9,
                  },
                ],
              },
              yr_prems: 200.56,
            },
          ],
        },
      };
      break;
    default:
      break;
  }
  return data;
};

export const ci_patch_policies_expected_data = (strategy, user) => {
  let data = {};
  switch (strategy) {
    case STATES_ENUM.JOURNEY_1_INDIV_APPROVED:
      data = {
        data: {
          annual_premiums_issued: 165.56,
          monthly_premiums_issued: 14.9,
          quote_breakdown: {
            annual: [
              {
                end_date: '28/12/2042',
                end_idx: 20,
                start_date: '28/12/2022',
                start_idx: 0,
                value: 165.56,
              },
            ],
            monthly: [
              {
                end_date: '28/12/2042',
                end_idx: 240,
                start_date: '28/12/2022',
                start_idx: 0,
                value: 14.9,
              },
            ],
          },
          success: 1,
          undiscounted_annual_premiums_issued: 165.56,
          undiscounted_monthly_premiums_issued: 14.9,
        },
      };
      break;
    case STATES_ENUM.JOURNEY_1_JOINT_APPROVED:
      data = {
        data: user === USER_TYPES.SECONDARY ? {
          annual_premiums_issued: 200.56,
          monthly_premiums_issued: 20.9,
          quote_breakdown: {
            annual: [
              {
                end_date: '28/12/2042',
                end_idx: 20,
                start_date: '28/12/2022',
                start_idx: 0,
                value: 200.56,
              },
            ],
            monthly: [
              {
                end_date: '28/12/2042',
                end_idx: 240,
                start_date: '28/12/2022',
                start_idx: 0,
                value: 20.9,
              },
            ],
          },
          success: 1,
          undiscounted_annual_premiums_issued: 200.56,
          undiscounted_monthly_premiums_issued: 20.9,
        } : {
          annual_premiums_issued: 165.56,
          monthly_premiums_issued: 14.9,
          quote_breakdown: {
            annual: [
              {
                end_date: '28/12/2042',
                end_idx: 20,
                start_date: '28/12/2022',
                start_idx: 0,
                value: 165.56,
              },
            ],
            monthly: [
              {
                end_date: '28/12/2042',
                end_idx: 240,
                start_date: '28/12/2022',
                start_idx: 0,
                value: 14.9,
              },
            ],
          },
          success: 1,
          undiscounted_annual_premiums_issued: 165.56,
          undiscounted_monthly_premiums_issued: 14.9,
        },
      };
      break;
    default:
      break;
  }
  return data;
};

// const handlers = (strategy, user) => [
//   rest.patch(`${CI_MAIN_ENDPOINT}/ci_policies/:policyId`, async (req, res, ctx) => {
//     return res(
//       ctx.status(200),
//       ctx.json(ci_patch_policies_expected_data(strategy, user)),
//     );
//   }),
//   rest.get(`${CI_QUOTES_ENDPOINT}/quotes-with-ratings`, async (req, res, ctx) => {
//     return res(
//       // Respond with a 200 status code
//       ctx.status(200),
//       ctx.json(ci_quotes_with_ratings_expected_data(strategy)),
//     );
//   }),
//   rest.get(`${CI_QUOTES_ENDPOINT}/quotes`, async (req, res, ctx) => {
//     let data = {};
//     switch (strategy) {
//       case STATES_ENUM.JOURNEY_1_INDIV_MORTGAGE:
//         data = {
//           data: {
//             primary: [
//               {
//                 applied_discounts: [],
//                 company: 'PM',
//                 id: 1,
//                 is_discounted: false,
//                 mn_prems: 24.81,
//                 original_mn_prems: 24.81,
//                 original_yr_prems: 275.7,
//                 quote_breakdown: {
//                   annual: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 20,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 275.7,
//                     },
//                   ],
//                   monthly: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 240,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 24.81,
//                     },
//                   ],
//                 },
//                 yr_prems: 275.7,
//               },
//             ],
//           },
//         };
//         break;
//       case STATES_ENUM.JOURNEY_1_JOINT_MORTGAGE:
//         data = {
//           data: {
//             joint: [
//               {
//                 company: 'PM',
//                 id: 1,
//                 mn_prems: 29.89,
//                 quote_breakdown: {
//                   annual: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 20,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 332.14,
//                     },
//                   ],
//                   monthly: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 240,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 29.89,
//                     },
//                   ],
//                 },
//                 yr_prems: 332.14,
//               },
//             ],
//             primary: [
//               {
//                 applied_discounts: [],
//                 company: 'PM',
//                 id: 1,
//                 is_discounted: false,
//                 mn_prems: 15.27,
//                 original_mn_prems: 15.27,
//                 original_yr_prems: 169.67,
//                 quote_breakdown: {
//                   annual: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 20,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 169.67,
//                     },
//                   ],
//                   monthly: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 240,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 15.27,
//                     },
//                   ],
//                 },
//                 yr_prems: 169.67,
//               },
//             ],
//             secondary: [
//               {
//                 applied_discounts: [],
//                 company: 'PM',
//                 id: 1,
//                 is_discounted: false,
//                 mn_prems: 14.62,
//                 original_mn_prems: 14.62,
//                 original_yr_prems: 162.47,
//                 quote_breakdown: {
//                   annual: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 20,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 162.47,
//                     },
//                   ],
//                   monthly: [
//                     {
//                       end_date: '27/02/2043',
//                       end_idx: 240,
//                       start_date: '27/02/2023',
//                       start_idx: 0,
//                       value: 14.62,
//                     },
//                   ],
//                 },
//                 yr_prems: 162.47,
//               },
//             ],
//           },
//         };
//         break;
//       default:
//         break;
//     }
//     return res(
//       // Respond with a 200 status code
//       ctx.status(200),
//       ctx.json(data),
//     );
//   }),
// ];

// export const setupCIJ1Handlers = (strategy, user) => {
//   server.use(...handlers(strategy, user));
// };
