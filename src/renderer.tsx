import 'regenerator-runtime/runtime'

import React from 'react';
import { render } from 'react-dom';
import { Count } from './views/count/Count';
import { Tracker } from './views/Tracker';
import { Provider } from 'react-redux';
import { remote, shell } from 'electron';
import configureStore from './store';

import './index.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import '@blueprintjs/table/lib/css/table.css';


import { Settings } from './views/settings/Settings';

const initialState = remote.getGlobal('state');

const store = configureStore(initialState, 'renderer');

let ComponentToRender;

switch (window.document.title) {
  case 'Diplomat - Counts': 
    ComponentToRender = Count;
    break;

  case 'Diplomat - Settings':
    ComponentToRender = Settings;
    break;

  default:
    ComponentToRender = Tracker;
}

document.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  if (target.tagName === 'A' && (target as HTMLAnchorElement).href.startsWith('http')) {
    event.preventDefault();
    shell.openExternal((target as HTMLAnchorElement).href)
  }
});

render((
  <Provider store={store}>
    <ComponentToRender />
  </Provider>
), document.getElementById('root'));