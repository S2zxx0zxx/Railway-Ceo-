import React from 'react';
import {createRoot} from 'react-dom/client';
import {initPwa} from './platform/pwa';
import {App} from './ui/App';
import './ui/game.css';
createRoot(document.getElementById('root')!).render(<App/>);
initPwa();
