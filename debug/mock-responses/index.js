/* eslint-disable */
import fetchMock from 'fetch-mock'; // eslint-disable-line no-use-before-define import/no-extraneous-dependencies
/* eslint-enable */

import household_infos from './household_infos';
import coverages from './coverages';
import life_sessions from './life_sessions';
import quotes from './quotes';

fetchMock.config.fallbackToNetwork = true;

fetchMock.post(/.*\/api\/life-main\/v1.0\/household_infos/, household_infos);
fetchMock.put(/.*\/api\/life-main\/v1.0\/household_infos\/(.)+/, coverages);
fetchMock.patch(/.*\/api\/life-main\/v1.0\/household_infos\/(.)+/, { success: 1 });

fetchMock.post(/.*\/api\/life-main\/v1.0\/life_sessions$/, life_sessions);
fetchMock.post(/.*\/api\/life-main\/v1.0\/life_sessions.*\/coverages/, coverages);

fetchMock.get(/.*\/api\/life-quotes\/v1.0\/quotes.*/, quotes);
