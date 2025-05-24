import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  id: string;
  role: string;
  created_at: string;
  profile_picture: string;
}

interface UserInfoState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserInfoState = {
  profile:
    typeof window !== 'undefined' && localStorage.getItem('profile')
      ? JSON.parse(localStorage.getItem('profile')!)
      : null,
  loading: false,
  error: null,
};

// Async thunk for logout
export const logout = createAsyncThunk(
  'userInfo/logout',
  async (_, { rejectWithValue }) => {
    if (typeof window === 'undefined') return rejectWithValue('No window object');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        return rejectWithValue(text);
      }

      localStorage.removeItem('profile');

      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('profile', JSON.stringify(action.payload));
      }
    },
    clearProfile(state) {
      state.profile = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('profile');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors for easy access to user info properties
export const selectProfile = (state: RootState) => state.userInfo.profile;
export const selectName = (state: RootState) => {
  const p = state.userInfo.profile;
  if (!p) return '';
  return `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim();
};
export const selectRole = (state: RootState) => state.userInfo.profile?.role ?? '';
export const selectPfp = (state: RootState) => state.userInfo.profile?.profile_picture ?? '';

export const { setProfile, clearProfile } = userInfoSlice.actions;
export default userInfoSlice.reducer;
