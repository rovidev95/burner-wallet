import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App';

/**
 * Router shell extracted from dmihal/burner-wallet#194 (PR #194),
 * without TransactionStore or config.js — see issue #215.
 */
const Container = () => (
  <Router>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Router>
);

export default Container;
