import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Portfolio from './Portfolio.jsx';
export function hydrate() {
  return new Promise(resolve => hydrateRoot(document.getElementById('app'), <Portfolio onHydrated={resolve} />));
}
