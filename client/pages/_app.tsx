// pages/_app.tsx
import { AppProps } from 'next/app';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import ResponsiveAppBar from '../components/AppBar';
import BottomBar from '../components/BottomBar';
import { AuthProvider } from '../context/auth_provider';

const theme = createTheme({
  palette: {
    background: {
      default: '#fff',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveAppBar />
      <AuthProvider>
      <Component {...pageProps} />
      </AuthProvider>
      <BottomBar />
    </ThemeProvider>
  );
}

export default MyApp;