
import { createStore, combineReducers, applyMiddleware, Middleware } from 'redux';
import {
  forwardToMain,
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
  replayActionRenderer,
} from 'electron-redux';
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { trackerReducer, trackerInitialState } from "./stores/tracker/reducer";
import { TrackerState } from "./stores/tracker/types";
import { settingsReducer, settingsInitialState } from './stores/settings/reducer';
import { SettingsState } from './stores/settings/types';
import { profilesReducer, profilesInitialState } from './stores/profiles/reducer';
import { ProfilesState } from './stores/profiles/types';

export interface RootState {
  tracker: TrackerState,
  settings: SettingsState,
  profiles: ProfilesState,
}

export function getRootInitialState() {
  return {
    tracker: trackerInitialState,
    settings: settingsInitialState,
    profiles: profilesInitialState,
  }
}

export function getRootReducer() {
  return combineReducers<RootState>({
    tracker: trackerReducer,
    settings: settingsReducer,
    profiles: profilesReducer,
  });
}

export type AppState = ReturnType<ReturnType<typeof getRootReducer>>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function configureStore(initialState: RootState, scope = 'main') {
  let middleware: Middleware[] = [];

  if (scope === 'renderer') {
    middleware = [
      forwardToMain,
    ];
  }

  if (scope === 'main') {
    middleware = [
      triggerAlias,
      forwardToRenderer,
    ];
  }

  const rootReducer = getRootReducer();
  const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  if (scope === 'main') {
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
}