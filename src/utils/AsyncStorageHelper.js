import AsyncStorage from '@react-native-async-storage/async-storage';

// --------- AUTHENTICATION METHODS ---------

// Save authentication status
export const saveAuthStatus = async (status) => {
    try {
        await AsyncStorage.setItem('isAuthenticated', status ? 'true' : 'false');
    } catch (error) {
        console.error('Error saving auth status:', error);
    }
};

// Get authentication status
export const getAuthStatus = async () => {
    try {
        const status = await AsyncStorage.getItem('isAuthenticated');
        return status === 'true';
    } catch (error) {
        console.error('Error fetching auth status:', error);
        return false;
    }
};

// Save first-time launch status
export const saveFirstTimeStatus = async (status) => {
    try {
        await AsyncStorage.setItem('isFirstTime', status ? 'true' : 'false');
    } catch (error) {
        console.error('Error saving first-time status:', error);
    }
};

// Get first-time launch status
export const getFirstTimeStatus = async () => {
    try {
        const status = await AsyncStorage.getItem('isFirstTime');
        return status === 'true';
    } catch (error) {
        console.error('Error fetching first-time status:', error);
        return false;
    }
};

// Clear all data (For Logout)
export const clearAuthData = async () => {
    try {
        await AsyncStorage.multiRemove(['isAuthenticated', 'isFirstTime']);
    } catch (error) {
        console.error('Error clearing auth data:', error);
    }
};

// --------- FAVORITES METHODS ---------

// Save a movie to favorites
export const saveFavorite = async (movie) => {
    try {
        let favorites = await AsyncStorage.getItem('favorites');
        favorites = favorites ? JSON.parse(favorites) : [];
        favorites.push(movie);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error(error);
    }
};

// Get favorites
export const getFavorites = async () => {
    try {
        const favorites = await AsyncStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error(error);
        return [];
    }
};
