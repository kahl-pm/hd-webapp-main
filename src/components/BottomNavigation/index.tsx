import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Typography,
  LeftArrowIcon,
  TextButton,
  Spacer,
  isMobile,
  StickyNav,
} from '@policyme/global-libjs-designsystem';
import { goBack } from 'connected-react-router';
import { State } from '../../store/types/State';
import { getUserFromURL } from '../../utils/helpers';
import { checkForBackToDashButton, checkForShowBackButton } from '../../Selectors/router';
import { journeyIngress } from '../../NewActions/session';
import { JOURNEY_INGRESS_POINTS } from '../../utils/const';

interface BottomNavigationProps {
  /**
   * The body of the highlighted row
   */
  buttonRef: React.RefObject<HTMLButtonElement>;
  position?: 'fixed' | 'sticky';
  /**
   * Ref only gives access to the DOM element,
   * not the dynamic updates to the values. We must set them explicitly.
   */
  isLoading?: boolean,
  isDisabled?: boolean,
}

/**
 * Hook to observe changes to a button's text content
 * @param buttonRef - Reference to the button element to observe
 * @returns The current button text
 */
const useButtonContentObserver = (
  buttonRef: React.RefObject<HTMLButtonElement>,
  isMobileView: boolean,
) => {
  const [buttonText, setButtonText] = useState<string>('');

  useEffect(() => {
    // Only observe on mobile/tablet viewports
    if (!isMobileView) {
      return undefined;
    }

    const updateContent = () => {
      if (!buttonRef?.current) return;

      const newText = buttonRef.current.textContent || '';
      setButtonText(prev => {
        if (prev === newText) {
          return prev;
        }
        return newText;
      });
    };

    // Initial update
    updateContent();

    // WARNING: MutationObserver should only be used when
    // absolutely necessary as it can impact performance.
    const observer = new MutationObserver(updateContent);

    if (buttonRef?.current) {
      // Only observe text content changes
      observer.observe(buttonRef.current, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [buttonRef, isMobileView]);

  return buttonText;
};

/**
 * This component is used for mobile navigation.
 * It takes in the buttonRef of the main CTA action on a page to trigger the next action.
 * For example:
 * - On the Intent page, the main CTA is the "Next" button.
 * Original button -
 *  <Button variant="primary" type="submit" name="Next Button" dataCy="submit">Next</Button>
 *
 * Position: sticky -> use with PageContainer fullHeight
 *
 * Position: fixed -> use with PageContainer NO fullHeight
 *
 * With Bottom navigation - add the hidden prop on mobile and assign the ref to the buttonRef.
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * <Button
 *  variant="primary"
 *  type="submit"
 *  name="Next Button"
 *  dataCy="submit"
 *  ref={buttonRef}
 *  hidden={isMobile()}>
 *    Next
*  </Button>
* At the bottom of the page, add the BottomNavigation component.
* !!! This component has to be added OUTSIDE of page containers
* since it relies on relative positioning.
 * <BottomNavigation buttonRef={buttonRef} />
 * @param buttonRef - The ref of the main CTA button on the page.
 */
const BottomNavigation = ({
  buttonRef,
  position = 'fixed',
  isLoading,
  isDisabled,
}: BottomNavigationProps) => {
  const isMobileView = isMobile();
  const buttonText = useButtonContentObserver(buttonRef, isMobileView);
  const currPath = useSelector<State, string>((state) => state.router.location.pathname);
  const userType =
    useSelector<State, string>((state) => getUserFromURL(currPath) ??
      state.userControl.currentUser);
  const showBackToDash =
    useSelector<State, boolean>((state) => checkForBackToDashButton(userType, currPath, state));
  const showBack = useSelector<State, boolean>((state) => checkForShowBackButton(
    userType, currPath, state, showBackToDash,
  ));

  const handleClick = () => {
    // Trigger click on the original button
    buttonRef.current?.click();
  };
  const dispatch = useDispatch();
  return isMobileView ? (
    <>
      {position === 'fixed' && <Spacer size="space4XL" />}
      <StickyNav
        flexDirection="row"
        justifyContent={buttonRef ? 'space-between' : 'flex-start'}
        alignItems="center"
        position={position}
      >
        {(showBack || showBackToDash) && (
          <TextButton
            label={<Typography variant="CTALargePrimary" message={<FormattedMessage id="global.back.Est6xJ" />} />}
            name="back"
            aria-label="back"
            startIcon={<LeftArrowIcon variant="transparent" interactive size="accordionSmall" />}
            onClick={() => dispatch(showBackToDash ?
              journeyIngress(JOURNEY_INGRESS_POINTS.DECISION)
              : goBack())}
          />
        )}
        {buttonRef && buttonRef.current && (<Button
          name="nav-button"
          variant="primary"
          onClick={handleClick}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          loading={isLoading}
          maxWidth={(showBack || showBackToDash) && '14.9375rem'}
          dataCy={buttonRef.current?.attributes.getNamedItem('data-cy')?.value}
        >
          <Typography
            variant="CTALargePrimary"
            message={buttonText}
          />
        </Button>)}
      </StickyNav>
    </>
  ) : null;
};

export default BottomNavigation;
