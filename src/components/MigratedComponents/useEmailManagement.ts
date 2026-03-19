import { useState, useEffect } from 'react';

/**
 * Custom hook for managing email state with automatic updates from props
 * @param propsEmail - The current email value from props (can change over time)
 * @returns Object containing localEmail, updateLocalEmail function, and userHasUpdatedEmail flag
 */
export const useEmailManagement = (propsEmail: string) => {
  const [userHasUpdatedEmail, setUserHasUpdatedEmail] = useState(false);
  const [localEmail, setLocalEmail] = useState(propsEmail);

  const updateLocalEmail = (email: string) => {
    if (!userHasUpdatedEmail) {
      setUserHasUpdatedEmail(true);
    }
    setLocalEmail(email);
  };

  // Update local email as props.email can change over rerenders as user info populates and
  // retriggers a rerender
  useEffect(() => {
    if (!userHasUpdatedEmail && propsEmail !== localEmail) {
      setLocalEmail(propsEmail);
    }
  }, [propsEmail, userHasUpdatedEmail, localEmail]);

  return {
    localEmail,
    updateLocalEmail,
    userHasUpdatedEmail,
  };
};
