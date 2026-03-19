import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { LOCALE } from '@policyme/global-libjs-utils';

import { createTestStore, renderWithProviders } from '../util';
import { STATES_ENUM } from '../ReduxStateMother/const';
import { updateUserControlProp } from '../../src/NewActions/userControl';
import AffiliateLogoRow from '../../src/components/AffiliateLogoRow';
import { AFFILIATE_NAMES, AFFILIATE_CATEGORIES } from '../../src/utils/const';

describe('AffiliateLogoRow', () => {
  let store;

  beforeEach(() => {
    const testStore = createTestStore(STATES_ENUM.DEFAULT);
    store = testStore.store;
  });

  it('renders affiliate logo when affiliate has a logo', () => {
    store.dispatch(updateUserControlProp('affiliate', {
      affiliateName: AFFILIATE_NAMES.HUMI,
    }));

    renderWithProviders(<AffiliateLogoRow />, {
      store,
      locale: LOCALE.EN_CA,
    });

    expect(screen.getByAltText('PolicyMe Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Humi Logo')).toBeInTheDocument();
  });

  it('renders only PolicyMe logo when affiliate has no logo (unknown affiliate)', () => {
    store.dispatch(updateUserControlProp('affiliate', {
      affiliateName: 'UnknownAffiliate',
    }));

    renderWithProviders(<AffiliateLogoRow />, {
      store,
      locale: LOCALE.EN_CA,
    });

    expect(screen.getByAltText('PolicyMe Logo')).toBeInTheDocument();
    expect(screen.queryByAltText('UnknownAffiliate Logo')).not.toBeInTheDocument();
  });

  it('renders only PolicyMe logo for existing affiliate without logo (UNISTAR)', () => {
    store.dispatch(updateUserControlProp('affiliate', {
      affiliateName: AFFILIATE_NAMES.UNISTAR,
    }));

    renderWithProviders(<AffiliateLogoRow />, {
      store,
      locale: LOCALE.EN_CA,
    });

    expect(screen.getByAltText('PolicyMe Logo')).toBeInTheDocument();
    expect(screen.queryByAltText('Unistar Logo')).not.toBeInTheDocument();
  });
});
