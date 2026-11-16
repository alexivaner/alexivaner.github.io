import React from 'react';
import { renderToString } from 'react-dom/server';
import Portfolio from './Portfolio.jsx';
import Resume from './Resume.jsx';
export function render(page = 'portfolio') {
  return renderToString(page === 'resume' ? <Resume /> : <Portfolio />);
}
