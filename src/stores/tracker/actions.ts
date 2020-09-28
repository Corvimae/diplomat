import { SET_POKEMON_STATE, TrackerAction } from "./types";

export function setPokemonState(id: number, state: string): TrackerAction {
  return {
    type: SET_POKEMON_STATE,
    payload: {
      id,
      state,
    }
  };
}