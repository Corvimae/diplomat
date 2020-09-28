import { Pokemon } from "../../utils/Dex";
import { SpriteSet } from "../../views/settings/SpriteSets";

export const SAVE_PROFILE = 'SAVE_PROFILE';

export interface TrackerStateDefinition {
  name: string;
  color: string;
  showCount?: boolean;
  isPrimary?: boolean;
}

export interface Profile {
  name: string;
  spriteSet: SpriteSet;
  states: TrackerStateDefinition[];
  pokemon: Pokemon[];
}

export interface ProfilesState {
  profiles: Profile[];
}

interface SaveProfileAction {
  type: typeof SAVE_PROFILE,
  payload: {
    oldProfile: Profile;
    newProfile: Profile;
  };
}

export type ProfilesAction =
  SaveProfileAction;
