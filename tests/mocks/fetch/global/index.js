import { rest } from 'msw';
import { ANALYTICS_ENDPOINT, GLOBAL_MAIN_ENDPOINT } from '../../../../src/config';

export const handlers = [
  rest.patch(`${ANALYTICS_ENDPOINT}/utm/:globalId/tracking/:trackingId`, async (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
    );
  }),
  rest.post(`${GLOBAL_MAIN_ENDPOINT}/crm`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: { success: 1 } }),
    );
  }),
];
