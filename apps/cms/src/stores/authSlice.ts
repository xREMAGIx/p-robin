import { StateCreator } from "zustand";

type AuthProfileData = {
  id: number;
  username: string;
};

export interface AuthSlice {
  authProfile?: AuthProfileData;
  setAuthProfile: (authProfileData: AuthProfileData) => void;
  clearAuthProfile: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set
) => ({
  authProfile: undefined,
  setAuthProfile: (authProfileData) =>
    set(() => ({ authProfile: authProfileData })),
  clearAuthProfile: () => set({ authProfile: undefined }),
});
