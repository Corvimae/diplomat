import { Profile, SAVE_PROFILE, ProfilesAction } from "./types";

export function saveProfile(oldProfile: Profile, newProfile: Profile): ProfilesAction {
  return {
    type: SAVE_PROFILE,
    payload: {
      oldProfile,
      newProfile
    }
  };
}