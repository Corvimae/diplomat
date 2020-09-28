import { SettingsAction, SettingsState, SET_CELL_SIZE, SET_TRACKER_DIMENSIONS, SET_COUNT_DIMENSIONS, SET_TRACKER_BACKGROUND_COLOR, SET_COUNT_BACKGROUND_COLOR, SET_FONT_FAMILY } from "./types";
import defaultActiveProfile from '../../../assets/profiles/all-gen1.json';

export const settingsInitialState: SettingsState = {
  cellSize: 48,
  fontFamily: 'Avenir, Trebuchet MS, sans-serif',
  backgroundColors: {
    tracker: '#ffffff',
    count: '#ffffff',
  },
  dimensions: {
    tracker: {
      width: 960,
      height: 360,
    },
    count: {
      width: 150,
      height: 75,
    },
  },
  activeProfile: defaultActiveProfile,
};

export function settingsReducer(state = settingsInitialState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case SET_TRACKER_DIMENSIONS:
      return {
        ...state,
        dimensions: {
          ...state.dimensions,
          tracker: action.payload,
        },
      };
      
    case SET_COUNT_DIMENSIONS:
      return {
        ...state,
        dimensions: {
          ...state.dimensions,
          count: action.payload,
        },
      };

    case SET_CELL_SIZE:
      return {
        ...state,
        cellSize: action.payload.size,
      }

    case SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.payload.fontFamily,
      }

    case SET_TRACKER_BACKGROUND_COLOR:
      return {
        ...state,
        backgroundColors: {
          ...state.backgroundColors,
          tracker: action.payload.color,
        },
      };

    case SET_COUNT_BACKGROUND_COLOR:
      return {
        ...state,
        backgroundColors: {
          ...state.backgroundColors,
          count: action.payload.color,
        },
      };

    default:
      return state;
  }
}
