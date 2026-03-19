import React, { useEffect } from 'react';

/**
 * TenantCustomisationSlots / CustomisableComponents with this as the default component
 * will throw an error if not overridden.
 * Use this if you require an override to be specified for a component.
 * Overrides are either PAAS Config based (via flags) or
 * Tenant Customisation based (via TenantCustomiseOverrides).
 * If you see this error, it means that the component is not being overridden.
 * when it should.
 * @returns null
 */
const NotImplementedDefaultExceptionThrower = () => {
  useEffect(() => {
    throw new Error('Default override is not allowed! Please provide a custom override for this component.');
  }, []);
  return <></>;
};

export default NotImplementedDefaultExceptionThrower;
