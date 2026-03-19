import React, { useState } from 'react';

import { AURA_ENDPOINT } from '../../config';
import { fetch } from '../../utils/fetch';

export function getAuraTimeOut(timeout) {
  return fetch(`${AURA_ENDPOINT}/debug/timeout/${timeout}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(res => {
    if (!res.ok) { return Promise.reject(new Error(`getAuraTimeOut Failed ${res.statusText}`)); }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

const DebugTimeoutPage = (props) => {
  const [timeVal, setTimeVal] = useState(70);
  const handleInputChange = (val) => {
    setTimeVal(val);
  };
  const handleTimeOutClick = async () => {
    const data = await getAuraTimeOut(timeVal);
    console.log(data);
  };
  return <>
    <input
      value={timeVal}
      onChange={(e) => { handleInputChange(e.target.value); }}
    />
    <br />
    <button type="button" className="btn btn-primary" onClick={handleTimeOutClick}> Test Timeout </button>
  </>;
};

DebugTimeoutPage.displayName = 'Debug Timeout Page';

export default DebugTimeoutPage;
