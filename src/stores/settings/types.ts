import { Profile } from "../profiles/types";

export const SET_CELL_SIZE = 'SET_CELL_SIZE';
export const SET_FONT_FAMILY = 'SET_FONT_FAMILY';
export const SET_TRACKER_DIMENSIONS = 'SET_TRACKER_DIMENSIONS';
export const SET_COUNT_DIMENSIONS = 'SET_COUNT_DIMENSIONS';
export const SET_TRACKER_BACKGROUND_COLOR = 'SET_TRACKER_BACKGROUND_COLOR';
export const SET_COUNT_BACKGROUND_COLOR = 'SET_COUNT_BACKGROUND_COLOR';

export interface SettingsState {
  cellSize: number; 
  fontFamily: string;
  backgroundColors: {
    tracker: string;
    count: string;
  };
  dimensions: {
    tracker: {
      width: number;
      height: number;
    };
    count: {
      width: number;
      height: number;
    };
  };
  activeProfile: Profile;
}

interface SetCellSizeAction {
  type: typeof SET_CELL_SIZE,
  payload: {
    size: number;
  };
}

interface SetFontFamilyAction {
  type: typeof SET_FONT_FAMILY,
  payload: {
    fontFamily: string;
  };
}

interface SetTrackerDimensionsAction {
  type: typeof SET_TRACKER_DIMENSIONS,
  payload: {
    width: number;
    height: number;
  };
}

interface SetCountDimensionsAction {
  type: typeof SET_COUNT_DIMENSIONS,
  payload: {
    width: number;
    height: number;
  };
}

interface SetTrackerBackgroundColorAction {
  type: typeof SET_TRACKER_BACKGROUND_COLOR,
  payload: {
    color: string;
  };
}

interface SetCountBackgroundColorAction {
  type: typeof SET_COUNT_BACKGROUND_COLOR,
  payload: {
    color: string;
  };
}

export type SettingsAction =
  SetCellSizeAction | 
  SetFontFamilyAction |
  SetTrackerDimensionsAction |
  SetCountDimensionsAction |
  SetTrackerBackgroundColorAction |
  SetCountBackgroundColorAction;
