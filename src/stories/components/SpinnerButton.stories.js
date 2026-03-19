import React from 'react';
import SpinnerButton from '../../components/SpinnerButton';

export default {
  title: 'Components/SpinnerButton',
  component: SpinnerButton,
};
export const Primary = () => <SpinnerButton
  className="btn btn-primary"
  type="submit"
  busy
  data-cy="eSignDocusign"
>
  Sign Policy
</SpinnerButton>;
