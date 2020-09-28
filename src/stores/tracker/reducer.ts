import { TrackerAction, TrackerState, SET_POKEMON_STATE, TrackerItem } from "./types";

export const trackerInitialState: TrackerState = {
  pokemon: [],
};

export function trackerReducer(state = trackerInitialState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case SET_POKEMON_STATE:
      return {
        ...state,
        pokemon: state.pokemon.reduce<TrackerItem[]>((acc, item) => {
          if (item.definition.id === action.payload.id) {
            return [...acc, {
              ...item,
              state: action.payload.state,
            }];
          }

          return [...acc, item];
        }, []),
      }
    default:
      return state;
  }
}
