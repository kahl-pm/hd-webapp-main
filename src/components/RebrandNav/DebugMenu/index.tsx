import React, { useContext, useReducer, useState } from 'react';
import jsCookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AwardIcon, CopyIcon, DebugMenu as DebugMenuButtons, FileTextIcon, KeyIcon, PartyPopperIcon, PenIcon } from '@policyme/global-libjs-designsystem';
import { updateMetadata } from '../../../NewActions/metadata';
import { updateHDAppPropertyPrimary, updateHDAppPropertySecondary } from '../../../NewActions/hdApp';
import { COOKIE_EXPIRY_DAYS, PM_PRODUCT_PREFIX, UNDERWRITING_METHODS, USER_TYPES } from '../../../utils/const';
import { State } from '../../../store/types/State';
import CopyState from '../../CopyState';
import { getCookieDomain, isDebugEnv } from '../../../utils/helpers';
import { DISCOUNT_CODES } from '../../../utils/discounts';
import { preDecisionRequoteActual, removeQuotesDiscount } from '../../../NewActions/quotes';

type ButtonType = 'setUnderwritingMethod' | 'setStripeDebugMode' | 'setCypressStripeForm' | 'setForceDocusignJourney' | 'setDisableSept2025Promo';
type ButtonState = Record<ButtonType, boolean>;
type ButtonAction = {
  type: 'toggle',
  button: ButtonType,
};

const buttonReducer = (state:ButtonState, action: ButtonAction) => {
  switch (action.type) {
    case 'toggle':
      return { ...state, [action.button]: !state[action.button] };
    default:
      return state;
  }
};

const DebugMenu = () => {
  const [isModalOpen, setIsModal] = useState(false);
  const dispatch = useDispatch();
  const isDebugActive = useSelector((state: State) => state.metadata.debugFlag);
  const isStripeDebugMode = useSelector((state: State) => state.metadata.isStripeDebugMode);
  const isCypressStripeForm = useSelector((state: State) => state.metadata.isCypressStripeForm);
  const isRebrandDesignEnabled = useSelector(
    (state: State) => state.metadata.isRebrandDesignEnabled,
  );
  const forceDocusignJourney = useSelector(
    (state: State) => state.metadata.forceDocusignJourney,
  );
  const currState = useSelector((state: State) => (state.metadata.debugFlag ? state : null));

  const [activeButtons, setActiveButton] = useReducer(buttonReducer, {
    setUnderwritingMethod: false,
    setStripeDebugMode: false,
    setCypressStripeForm: false,
    setForceDocusignJourney: forceDocusignJourney,
    setDisableSept2025Promo: false,
  });

  const activateDebugAndCopyToClipboard = () => {
    if (isDebugActive) {
      const currentState = JSON.stringify(currState, null, 2);
      if (process.env.BROWSER) {
        navigator.clipboard.writeText(currentState).then(() => {
          setIsModal(true);
        }).catch((err) => {
          console.error('Failed to copy state to clipboard:', err);
        });
      }
    } else {
      dispatch(updateMetadata('debugFlag', true));
    }
  };

  const setUnderwritingMethod = () => {
    setActiveButton({ type: 'toggle', button: 'setUnderwritingMethod' });
    dispatch(updateHDAppPropertyPrimary('underwriting_method', UNDERWRITING_METHODS.FULLY_UNDERWRITTEN));
    dispatch(updateHDAppPropertySecondary('underwriting_method', UNDERWRITING_METHODS.FULLY_UNDERWRITTEN));
  };

  const setStripeDebugMode = () => {
    setActiveButton({ type: 'toggle', button: 'setStripeDebugMode' });
    dispatch(updateMetadata('isStripeDebugMode', !isStripeDebugMode));
  };

  const setABTestBand = () => {
    // eslint-disable-next-line no-alert
    const band = window.prompt('Set AB Test Band');
    dispatch(updateMetadata('abTestBand', band));
    jsCookie.set(
      'ab_test_band',
      band,
      { expires: COOKIE_EXPIRY_DAYS, domain: getCookieDomain(), secure: true, sameSite: 'strict' },
    );
  };

  const setCypressStripeForm = () => {
    setActiveButton({ type: 'toggle', button: 'setCypressStripeForm' });
    dispatch(updateMetadata('isCypressStripeForm', !isCypressStripeForm));
  };

  const setForceDocusignJourney = () => {
    // Override a digital consent journey to force docusign journey
    dispatch(updateMetadata('forceDocusignJourney', !forceDocusignJourney));
  };

  const setToggleNewDesign = () => {
    dispatch(updateMetadata('isRebrandDesignEnabled', !isRebrandDesignEnabled));
  };

  const setDisableSept2025Promo = () => {
    setActiveButton({ type: 'toggle', button: 'setDisableSept2025Promo' });
    dispatch(updateMetadata('disableSept2025Promo', true));
    dispatch(removeQuotesDiscount(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)(
      DISCOUNT_CODES.PM_SEPT2025_PROMO,
    ));
    dispatch(removeQuotesDiscount(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD)(
      DISCOUNT_CODES.PM_SEPT2025_PROMO,
    ));
    dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
    dispatch(preDecisionRequoteActual(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD));
  };

  return isDebugEnv ? (
    <>
      <DebugMenuButtons
        options={[
          {
            icon: <CopyIcon />,
            tooltipTitle: 'Copy State',
            onClick: activateDebugAndCopyToClipboard,
          },
          {
            icon: <KeyIcon />,
            tooltipTitle: 'Set UW fully_underwritten',
            onClick: setUnderwritingMethod,
          },
          {
            icon: <KeyIcon variant="transparent" />,
            tooltipTitle: 'Set Stripe Debug Mode',
            ariaLabel: 'Set Stripe Debug Mode',
            onClick: setStripeDebugMode,
          },
          {
            icon: <PenIcon />,
            tooltipTitle: 'Set AB Test Band',
            onClick: setABTestBand,
          },
          {
            icon: <FileTextIcon />,
            tooltipTitle: 'Set Cypress Stripe Form',
            ariaLabel: 'Set Cypress Stripe Form',
            onClick: setCypressStripeForm,
          },
          {
            icon: activeButtons.setForceDocusignJourney ?
              <PenIcon /> : <PenIcon variant="tip" />,
            tooltipTitle: activeButtons.setForceDocusignJourney ?
              'Disable Docusign Journey override' :
              'Enable Docusign Journey override',
            ariaLabel: activeButtons.setForceDocusignJourney ?
              'Disable Docusign Journey override' :
              'Enable Docusign Journey override',
            onClick: () => {
              setActiveButton({ type: 'toggle', button: 'setForceDocusignJourney' });
              setForceDocusignJourney();
            },
          },
          {
            icon: <AwardIcon />,
            tooltipTitle: 'Toggle Rebrand UI',
            onClick: setToggleNewDesign,
          },
          {
            icon: <PartyPopperIcon />,
            tooltipTitle: 'Disable September 2025 Promo',
            ariaLabel: 'Disable September 2025 Promo',
            onClick: setDisableSept2025Promo,
          },
        ]}
        isDebugActive={isDebugActive}
        onActivateDebug={activateDebugAndCopyToClipboard}
      />
      <CopyState
        isOpen={isModalOpen}
        setIsModal={setIsModal}
        currState={JSON.stringify(currState, null, 2)}
      />
    </>
  ) : null;
};

export default DebugMenu;
