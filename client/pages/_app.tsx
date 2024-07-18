// pages/_app.tsx
import { AppProps } from 'next/app';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import ResponsiveAppBar from '../components/AppBar';
import BottomBar from '../components/BottomBar';

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
      <Component {...pageProps} />
      <BottomBar />
    </ThemeProvider>
  );
}

export default MyApp;