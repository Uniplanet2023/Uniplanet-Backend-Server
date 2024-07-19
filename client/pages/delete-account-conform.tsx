import React from 'react';
import { useRouter } from 'next/router';
import { useProtectRoute } from '../hooks/useProtectRoute';

import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/auth_provider';

const DeleteAccount: React.FC = () => {
  const isLoggedIn = useProtectRoute('/login');
  const router = useRouter();
  const { logout } = useAuth();

  if (!isLoggedIn) {
    return null; // Optionally, you can return a loading spinner here
  }

  const handleContinue = () => {
    
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Delete Account
      </Typography>
      <Typography variant="body1" paragraph>
        Are you sure you want to delete your account? This action cannot be undone.
      </Typography>
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="contained" color="secondary" onClick={handleContinue}>
          Confirm
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default DeleteAccount;