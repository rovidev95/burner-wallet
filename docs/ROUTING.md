# React Router integration (#215)

Extracted from [dmihal/burner-wallet#194](https://github.com/austintgriffith/burner-wallet/pull/194) **without** `config.js` or `TransactionStore`.

## Architecture

- `src/Container.js` — `BrowserRouter` + `I18nextProvider`
- `src/index.js` — mounts `Container` instead of `App`
- `src/App.js` — wrapped with `withRouter`; navigation via `history.push`

## URL → view mapping

`resolveViewFromPath()` maps paths like `/exchange`, `/send_to_address`, and legacy send URLs (`/0x…;amount`) to the existing view switch. Special cold-start URLs (private keys, `/pk#…`) remain handled by `applyPathFromUrl()`.

## Not included (by design)

- `src/config.js` — hostname config stays in `App.js`
- `src/contexts/TransactionStore.js` — localStorage tx parsing unchanged

A future PR can replace the `switch(view)` block with `<Switch>` / `<Route>` components as in #194.
