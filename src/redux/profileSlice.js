import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,  
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoading, setError } = profileSlice.actions;

// ✅ Fetch Profile API
export const fetchProfile = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axios.get('https://dummyjson.com/users/1'); // Replace with actual API
    dispatch(setUser(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default profileSlice.reducer;
