import { Profile, SAVE_PROFILE, DELETE_PROFILE, ProfilesAction } from "./types";

export function saveProfile(profile: Profile): ProfilesAction {
  return {
    type: SAVE_PROFILE,
    payload: {
      profile,
    }
  };
}

export function deleteProfile(profileId: string): ProfilesAction {
  return {
    type: DELETE_PROFILE,
    payload: {
      profileId,
    }
  };
}