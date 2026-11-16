import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Resume from './Resume.jsx';
hydrateRoot(document.getElementById('app'), <Resume />);
