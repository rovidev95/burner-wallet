/**
 * Best-effort detection of private/incognito browsing mode.
 * Returns a Promise<boolean>.
 */
export function detectIncognito() {
  if (navigator.storage && navigator.storage.estimate) {
    return navigator.storage.estimate().then(({ quota }) => {
      if (typeof quota === 'number' && quota < 120000000) {
        return true;
      }
      return detectIncognitoLegacy();
    }).catch(() => detectIncognitoLegacy());
  }
  return detectIncognitoLegacy();
}

function detectIncognitoLegacy() {
  return new Promise((resolve) => {
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
      resolve(false);
      return;
    }
    fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
  });
}
