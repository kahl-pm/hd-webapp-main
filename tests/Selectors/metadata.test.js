import ReduxState from '../ReduxStateMother';
import {
  showQuotesToast,
  getQuotesToastData,
} from '../../src/Selectors/metadata';
import { STATES_ENUM } from '../ReduxStateMother/const';
describe.each([
  [STATES_ENUM.DEFAULT],
  [STATES_ENUM.DEV_INIT],
  [STATES_ENUM.JOINT]
])('Metadata with state strategy %s', (stateStrategy) => {
  describe('showQuotesToast', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });

    test('The utm_source is parentlifenetwork and should return the associated january campign', () => {
      stateObj1.metadata.setMetadataProp('utm_source', 'parentlifenetwork')
        .setMetadataProp('utm_campaign', 'januarycontest');
      expect(showQuotesToast(stateObj1)).toEqual({
        header: 'You have been entered into the contest. We\'ll announce the winners on March 25th, thanks for participating!',
      });
    });

    test('The utm_source is borrowell and should return the associated february campign', () => {
      stateObj1.metadata.setMetadataProp('utm_source', 'borrowell')
        .setMetadataProp('utm_campaign', 'february2019emailandcontest');
      expect(showQuotesToast(stateObj1)).toEqual({
        header: 'You have been entered into the contest. We\'ll announce the winners on February 15th, thanks for participating!',
      });
    });
  });

  describe('getQuotesToastData', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });

    test('The utm_source is undefined and should return empty object', () => {
      stateObj1.metadata.setMetadataProp('utm_source');
      expect(getQuotesToastData(stateObj1)).toEqual({});
    });

    test('The utm_source is parentlifenetwork and should return the associated january campign', () => {
      stateObj1.metadata.setMetadataProp('utm_source', 'parentlifenetwork')
        .setMetadataProp('utm_campaign', 'januarycontest');
      expect(getQuotesToastData(stateObj1)).toEqual({
        header: 'You have been entered into the contest. We\'ll announce the winners on March 25th, thanks for participating!',
      });
    });

    test('The utm_source is borrowell and should return the associated february campign', () => {
      stateObj1.metadata.setMetadataProp('utm_source', 'borrowell')
        .setMetadataProp('utm_campaign', 'february2019emailandcontest');
      expect(getQuotesToastData(stateObj1)).toEqual({
        header: 'You have been entered into the contest. We\'ll announce the winners on February 15th, thanks for participating!',
      });
    });

    test('The utm_source is correct but the camoign is worong and should return empty object', () => {
      stateObj1.metadata.setMetadataProp('utm_source', 'borrowell')
        .setMetadataProp('utm_campaign', 'januarycontest');
      expect(getQuotesToastData(stateObj1)).toEqual({});
    });
  });
})