import reduxJson from './data-templates/updatedReduxTree.json';

export function alwaysFail(fn) {
  return (sometimesFail(fn, 1));
}

export function sometimesFail(fn, threshold) {
  return (...args) => {
    let result = fn(...args);
    if (Math.random() > threshold) {
      console.warn(`DEBUG OVERRIDE - resolved promise as usual`);
      return Promise.resolve(result);
    }
    console.warn(`DEBUG OVERRIDE - rejected promise`);
    return Promise.reject(Error('debug - mock fail'));
  };
}

export function delayRandom(fn, milis) {
  return (...args) => {
    return new Promise((resolve) => {
      console.warn(`DEBUG OVERRIDE - delaying up to ${milis}ms`);
      let realResult = fn(...args);
      setTimeout(() => {
        resolve(realResult);
      }, Math.random() * milis);
    });
  };
}

export function getStore(storeName) {
  const reduxObj = JSON.parse(JSON.stringify(reduxJson));
  const keyNames = storeName.split('/');
  let newReduxObj = reduxObj;
  keyNames.forEach(key => {
    newReduxObj = newReduxObj[key];
  });
  return newReduxObj;
}
