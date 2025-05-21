import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './AuthSlice'; // Import the auth reducer

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer, // Add auth reducer here
    },
});
