/**
 * This module exports a minified version of the `OptanonWrapper` function,
 * which is responsible for managing cookie consent preferences using the OneTrust platform.
 *
 * The function retrieves a consent token (either from cookies or local storage), decodes it,
 * and checks the user's enabled purposes against predefined categories. Based on the result,
 * it either allows or rejects all cookies via OneTrust.
 *
 * **Important Note:** This is a minified version of getUserConsentFromDidomi().
 * The un-minified version of this function must exist somewhere in the codebase
 * to ensure maintainability and ease of debugging.
 */

export const OptanonWrapper = `
  // prevent infinite re-entry
  window.__optanonWrapperHasRun = false;
  function OptanonWrapper() {
    if (window.__optanonWrapperHasRun) return;
    window.__optanonWrapperHasRun = true;
    // helper to read cookies
    function getCookie(name) {
      var m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return m ? m[2] : null;
    }
    var tokenName = 'didomi_token';
    var raw = getCookie(tokenName) || localStorage.getItem(tokenName);
    if (!raw) {
      return;
    }
    let data;
    try {
      data = JSON.parse(atob(raw));
    } catch (_) {
      window.OneTrust.RejectAll();
      return;
    }
    if (!data.purposes?.enabled) {
      window.OneTrust.RejectAll();
      return;
    }
    var enabled = data.purposes.enabled;
    var categories = {
      caaQuebec: ['advertisin-fg3UexhJ', 'analytics-egmZQLUg', 'functionna-Wpr3CgQn'],
      bcl: ['measurement-optimisation', 'advertising']
    };
    var anyFullMatch = Object.values(categories).some(keys =>
      keys.every(k => enabled.includes(k))
    );
    if (anyFullMatch) {
      window.OneTrust.AllowAll();
    } else {
      window.OneTrust.RejectAll();
    }
  }`;
