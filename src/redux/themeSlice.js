


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';


export const loadPreferences = createAsyncThunk('theme/loadPreferences', async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    const savedFontSize = await AsyncStorage.getItem('fontSize');

    return {
        theme: savedTheme ? savedTheme : Appearance.getColorScheme() || 'light',
        fontSize: savedFontSize ? parseInt(savedFontSize) : 16
    };
});


export const savePreferences = createAsyncThunk('theme/savePreferences', async (_, { getState }) => {
    const { theme, fontSize } = getState().theme;
    await AsyncStorage.setItem('theme', theme);
    await AsyncStorage.setItem('fontSize', fontSize.toString());
});


const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: Appearance.getColorScheme() || 'light', 
        fontSize: 16,
        isLoading: false,
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            AsyncStorage.setItem('theme', action.payload);
        },
        setFontSize: (state, action) => {
            state.fontSize = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPreferences.fulfilled, (state, action) => {
                state.theme = action.payload.theme;
                state.fontSize = action.payload.fontSize;
            });
    }
});

export const { setTheme, setFontSize } = themeSlice.actions;
export default themeSlice.reducer;
