import React from 'react';
import PropTypes from 'prop-types';

export const EmailIcon = (props) => {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 2.45508H3C2.175 2.45508 1.5 3.13508 1.5 3.96619V13.0329C1.5 13.864 2.175 14.544 3 14.544H15C15.825 14.544 16.5 13.864 16.5 13.0329V3.96619C16.5 3.13508 15.825 2.45508 15 2.45508Z" stroke={props.strokeColor} stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.5 3.9668L9 9.25569L1.5 3.9668" stroke={props.strokeColor} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

EmailIcon.propTypes = {
  strokeColor: PropTypes.string.isRequired,
};

export default EmailIcon;
