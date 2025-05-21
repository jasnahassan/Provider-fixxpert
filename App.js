import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/Navigators/AppNavigator';
import { loadSettingsFromStorage, loadSettings, setTheme } from './src/redux/themeSlice';
import NotificationHandler from './src/NotificationHandler'; // ✅ Correct Import

export default function App() {
  return (
    <Provider store={store}>
      <ThemeLoader />
      <NotificationHandler />
      <AppNavigator />
    </Provider>
  );
}

// ✅ Load saved settings & ensure correct theme application
function ThemeLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await loadSettingsFromStorage();
      if (settings?.theme) {
        dispatch(loadSettings(settings));
      } else {
        const systemTheme = Appearance.getColorScheme();
        console.log("📌 No saved theme. Using system theme:", systemTheme);
        dispatch(setTheme(systemTheme));
      }
    };

    fetchSettings();
  }, [dispatch]);

  return null;
}
