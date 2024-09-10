import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Box, Container, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import AdCheckoutForm from '../components/AdCheckForm';

const stripePromise = loadStripe('pk_live_51PRNjiCWNFZrh8eI88o3o9y5aAWInIFyjFzVLBtv2lNAWWP91A4djOjdY12quU4LEnzFdjLvjbxHITxWyHabtjXc00YsXGXsvm');


const PaymentPage = () => {
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const clientSecretParam = searchParams.get('clientSecret');
    const tokenParam = searchParams.get('token');

    if (clientSecretParam && tokenParam) {
      setClientSecret(clientSecretParam);
      setToken(tokenParam);
    }
  }, [searchParams]);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Review payment
        </Typography>
        {clientSecret && token ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <AdCheckoutForm clientSecret={clientSecret} token={token} />
          </Elements>
        ) : (
          <Typography variant="body1" color="error">
            Loading payment details...
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default PaymentPage;