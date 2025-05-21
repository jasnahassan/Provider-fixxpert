import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';

const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  button: '#007bff',
};

const darkTheme = {
  background: '#000000',
  text: '#ffffff',
  button: '#17a2b8',
};

export default function ThemeWrapper({ children }) {
  const theme = useSelector((state) => state.theme.theme);
  return <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>{children}</ThemeProvider>;
}
