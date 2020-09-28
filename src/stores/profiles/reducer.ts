import { ProfilesState, ProfilesAction, Profile, SAVE_PROFILE } from './types';
import allGen1 from '../../../assets/profiles/all-gen1.json'; // todo load dynamically

export const profilesInitialState: ProfilesState = {
  profiles: [(allGen1 as unknown) as Profile]
};

export function profilesReducer(state = profilesInitialState, action: ProfilesAction): ProfilesState {
  switch (action.type) {
    case SAVE_PROFILE:
      return {
        ...state,
        profiles: state.profiles.reduce<Profile[]>((acc, profile) => [
          ...acc,
          profile === action.payload.oldProfile ? action.payload.newProfile : profile,
        ], []),
      };

    default:
      return state;
  }
}
