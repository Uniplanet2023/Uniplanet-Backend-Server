// pages/payment.tsx
import React, { useState, useEffect } from 'react';
import { Box, Grid, Snackbar, Alert } from '@mui/material';
import AdsCredit from '../components/AdsCredit';
import PaymentConfig from '../components/PaymentConfig';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
}

const PaymentPage: React.FC = () => {
  console.log('version 1-3');
  const [creditValue, setCreditValue] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchPaymentIntent = async (value: string) => {
    const response = await fetch('https://account.uniplanet.shop/api/account/payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creditValue: parseFloat(value) * 100 }), // Convert to cents
      credentials: 'include', // Include cookies in requests
    });

    const { clientSecret, token } = await response.json();
    console.log('token', token);
    console.log('clientSecret', clientSecret);
    setPaymentToken(token);
    setClientSecret(clientSecret);
  };

  const handleNext = (value: string) => {
    setCreditValue(value);
    fetchPaymentIntent(value);
  };

  useEffect(() => {
    if (clientSecret) {
      // Show the snackbar 5 seconds before the reload
      const snackbarTimeout = setTimeout(() => {
        setShowSnackbar(true);
      }, 1795000); // 30 minutes - 5 seconds

      // Reload after 30 minutes
      const reloadTimeout = setTimeout(() => {
        window.location.reload();
      }, 1800000); // 30 minutes

      return () => {
        clearTimeout(snackbarTimeout);
        clearTimeout(reloadTimeout);
      };
    }
  }, [clientSecret]);

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <AdsCredit onNext={handleNext} />
        </Grid>
        {creditValue && clientSecret && paymentToken && (
          <Grid item>
            <PaymentConfig clientSecret={clientSecret} paymentToken={paymentToken} />
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000} // 5 seconds
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at the top center
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="info">
          Please process a new payment.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentPage;