import React from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Box } from '@mui/material';

const DeleteAccount: React.FC = () => {
  const router = useRouter();


  const handleConfirm = () => {
    router.push('/delete-account-conform');
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
        <Button variant="contained" color="secondary" onClick={handleConfirm}>
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