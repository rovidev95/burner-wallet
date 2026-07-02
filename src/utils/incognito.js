/**
 * Best-effort detection of private/incognito browsing mode.
 * Returns a Promise<boolean>. Defaults to false when inconclusive (#244).
 */
export function detectIncognito() {
  return detectIncognitoLegacy()
    .then((legacyPrivate) => {
      if (legacyPrivate) {
        return true;
      }
      return detectFirefoxPrivateMode();
    })
    .catch(() => false);
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

function detectFirefoxPrivateMode() {
  return new Promise((resolve) => {
    if (!window.indexedDB || !/Firefox/i.test(navigator.userAgent)) {
      resolve(false);
      return;
    }

    let settled = false;
    const finish = (isPrivate) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(isPrivate);
    };

    try {
      const request = window.indexedDB.open('burner-wallet-incognito-probe');
      request.onerror = () => finish(true);
      request.onsuccess = () => {
        request.result.close();
        try {
          window.indexedDB.deleteDatabase('burner-wallet-incognito-probe');
        } catch (e) {
          // ignore cleanup errors
        }
        finish(false);
      };
      window.setTimeout(() => finish(false), 500);
    } catch (e) {
      finish(true);
    }
  });
}
