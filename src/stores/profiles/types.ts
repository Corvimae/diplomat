import { Pokemon } from "../../utils/Dex";
import { SpriteSet } from "../../views/settings/SpriteSets";

export const SAVE_PROFILE = 'SAVE_PROFILE';
export const DELETE_PROFILE = 'DELETE_PROFILE';

export interface TrackerStateDefinition {
  name: string;
  color: string;
  showCount?: boolean;
  isPrimary?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  spriteSet: SpriteSet;
  states: TrackerStateDefinition[];
  pokemon: Pokemon[];
  fileName?: string;
}

export interface ProfilesState {
  profiles: Profile[];
}

interface SaveProfileAction {
  type: typeof SAVE_PROFILE,
  payload: {
    profile: Profile;
  };
}

interface DeleteProfileAction {
  type: typeof DELETE_PROFILE,
  payload: {
    profileId: string;
  };
}

export type ProfilesAction =
  SaveProfileAction |
  DeleteProfileAction;
