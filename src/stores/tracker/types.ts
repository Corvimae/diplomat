import { Pokemon } from "../../utils/Dex";

export const SET_POKEMON_STATE = 'SET_POKEMON_STATE';

export interface TrackerItem {
  definition: Pokemon,
  state: string,
}

export interface TrackerState {
  pokemon: TrackerItem[];
}

interface SetPokemonStateAction {
  type: typeof SET_POKEMON_STATE,
  payload: {
    id: number;
    state: string;
  };
}

export type TrackerAction =
  SetPokemonStateAction;