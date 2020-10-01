import { ProfilesState, ProfilesAction, Profile, SAVE_PROFILE, DELETE_PROFILE } from './types';

export const profilesInitialState: ProfilesState = {
  profiles: []
};

export function profilesReducer(state = profilesInitialState, action: ProfilesAction): ProfilesState {
  switch (action.type) {
    case SAVE_PROFILE:
      return {
        ...state,
        profiles: state.profiles.reduce<Profile[]>((acc, profile) => [
          ...acc,
          profile.id === action.payload.profile.id ? action.payload.profile : profile,
        ], []),
      };

    case DELETE_PROFILE:      
      return {
        ...state,
        profiles: state.profiles.reduce<Profile[]>((acc, profile) => (
          profile.id === action.payload.profileId ? acc : [...acc, profile]
        ), []),
      };

    default:
      return state;
  }
}
