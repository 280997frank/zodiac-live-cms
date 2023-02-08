import { removeAccessToken } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  profile: {
    id: string;
  };
  loading: boolean;
  error: unknown;
}

const initialState: InitialState = {
  profile: {
    id: "",
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clear: () => initialState,
    setUserId: (state, action) => {
      state.profile.id = action.payload;
    },
    logout: () => {
      // document.cookie = 'mfs_token=; max-age=0; path=/;'
      /* cookies.remove(process.env.REACT_APP_COOKIE_NAME as string, {
        maxAge: 0,
        path: '/'
      }) */

      removeAccessToken();

      return initialState;
    },
  },
});

export const actions = {
  ...authSlice.actions,
};

export const reducer = authSlice.reducer;
