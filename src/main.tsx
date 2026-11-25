import React from 'react';
import {createRoot} from 'react-dom/client';
import {Capacitor} from '@capacitor/core';
import {App} from './ui/App';
import './ui/game.css';
createRoot(document.getElementById('root')!).render(<App/>);
if(import.meta.env.PROD&&!Capacitor.isNativePlatform()&&'serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register(new URL('./sw.js',document.baseURI)).catch(e=>console.warn('Offline cache unavailable',e))})}
