# Burner Wallet — Special URL Schemes

This document describes the URL patterns that Burner Wallet recognizes on load and when scanning QR codes. Implementation lives primarily in `src/App.js` (`applyPathFromUrl`, `parseAndCleanPath`) and `src/components/SendByScan.js`.

## Base URL

The wallet is typically served at `https://xdai.io/` (or domain-specific variants such as `buffidai.io`, `burnerwallet.io`). Paths below are relative to the site root.

## Private key import

| Pattern | Example | Behavior |
|---------|---------|----------|
| Raw hex in path | `/{64-or-66-char-hex}` | Imports a private key (with or without `0x` prefix). Path length 65–67 characters, no semicolons. |
| Raw hex in hash | `/#{64-or-66-char-hex}` | Same as above when the key is in the URL fragment. |
| Base64 `/pk` route | `/pk#{base64url-encoded-private-key}` | Decodes base64url payload from the hash into a private key. |

After processing, the URL is normalized to `/` via `history.pushState` (no full page reload when scanned from the in-app QR reader).

## Send to address

| Pattern | Example | Behavior |
|---------|---------|----------|
| Address only | `/{42-char-ethereum-address}` | Opens **Send to Address** with recipient prefilled (path length 43 including leading `/`). |
| Address + amount + message | `/{address};{amount};{message}` | Opens **Send to Address** with parsed fields. Optional 4th segment `;{extraMessage}`. |
| Address + amount (no message) | `/{address};{amount}` | Opens send flow when amount > 0 and address is 42 characters. |

Semicolon-separated segments are parsed by `parseAndCleanPath`. Message segments are URI-decoded with replacements for `%23`, `%3B`, `%3A`, `%2F`.

## Claim links

| Pattern | Example | Behavior |
|---------|---------|----------|
| Claim ID + key | `/{claimId};{claimKey}` | Path length 134 characters. Sets `claimId` and `claimKey` in app state and opens the claimer flow. |

## Vendors

| Pattern | Example | Behavior |
|---------|---------|----------|
| Vendor list | `/vendors;` | Opens the **Vendors** view. |

## Deep links (QR scan)

The scanner in `SendByScan.js` strips protocol prefixes (`ethereum:`, `https://...`) and uses the path portion. Status.im payment links (`get.status.im`) are handled separately and return structured payment data to the calling view.

## Ethereum URI scheme

QR codes may encode `ethereum:{address}` or `ethereum:{address}@{chainId}`. The scanner extracts the segment after the last `:` or `/` before applying the patterns above.

## Related code

- `src/App.js` — `applyPathFromUrl`, `applyPathFromScan`, `componentDidMount` initial routing
- `src/components/SendToAddress.js` — reads `window.location.pathname` on mount (legacy); prefers `scannerState` from parent when set after scan
- `src/components/SendByScan.js` — QR handler; delegates to `applyPathFromScan` instead of `window.location` reload (see issue #200)

## Security notes

- Private keys in URLs may appear in browser history and server logs if shared as links. Prefer in-app QR scan or encrypted claim links when possible.
- Always use HTTPS in production.
