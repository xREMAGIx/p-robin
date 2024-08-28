import { create } from "zustand";
import { AuthSlice, createAuthSlice } from "./authSlice";

export const useBoundStore = create<AuthSlice>()((...a) => ({
  ...createAuthSlice(...a),
}));
