// pages/redirect.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Typography, Box } from '@mui/material';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // You can add automatic redirect logic here if needed
    // For example, after 5 seconds redirect to another page
    // const timer = setTimeout(() => {
    //   router.push('/target-page');
    // }, 5000);

    // Cleanup timer
    // return () => clearTimeout(timer);
  }, [router]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
        Please tap the ‘Open’ button at the top to access the application. If you’re on a computer, kindly switch to a mobile device to continue.
        </Typography>
      </Box>
    </Container>
  );
}