import { createStore } from "zustand/vanilla";
import { AuthSlice, createAuthSlice } from "./authSlice";

const store = createStore<AuthSlice>((...a) => ({
  ...createAuthSlice(...a),
}));

export default store;
