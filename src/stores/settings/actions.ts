import { SET_CELL_SIZE, SettingsAction, SET_TRACKER_DIMENSIONS, SET_COUNT_DIMENSIONS, SET_TRACKER_BACKGROUND_COLOR, SET_COUNT_BACKGROUND_COLOR, SET_FONT_FAMILY } from "./types";

export function setCellSize(size: number): SettingsAction {
  return {
    type: SET_CELL_SIZE,
    payload: {
      size,
    }
  };
}

export function setFontFamily(fontFamily: string): SettingsAction {
  return {
    type: SET_FONT_FAMILY,
    payload: {
      fontFamily,
    }
  };
}

export function setTrackerBackgroundColor(color: string): SettingsAction {
  return {
    type: SET_TRACKER_BACKGROUND_COLOR,
    payload: {
      color,
    }
  };
}

export function setCountBackgroundColor(color: string): SettingsAction {
  return {
    type: SET_COUNT_BACKGROUND_COLOR,
    payload: {
      color,
    }
  };
}

export function setTrackerDimensions(width: number, height: number): SettingsAction {
  return {
    type: SET_TRACKER_DIMENSIONS,
    payload: {
      width,
      height,
    }
  };
}

export function setCountDimensions(width: number, height: number): SettingsAction {
  return {
    type: SET_COUNT_DIMENSIONS,
    payload: {
      width,
      height,
    }
  };
}