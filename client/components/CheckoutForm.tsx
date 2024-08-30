import { useState, FormEvent } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Box, Button, Typography, Alert } from '@mui/material';

interface PaymentProps {
  paymentToken: string;
}

const CheckoutForm: React.FC<PaymentProps> = ({ paymentToken }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    

    try {
      const response = await fetch('https://account.uniplanet.shop/api/account/increase-credit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${paymentToken}`, // Include the authorization header
        },
        credentials: 'include', // Include cookies in requests
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Credit increased successfully', data);
      setMessage("Credit increased successfully!");
    } catch (e) {
      console.error('Error increasing credit', e);
      setMessage('An unexpected error occurred.');
    }

    setIsProcessing(false);
  };

  return (
    <Box
      component="form"
      id="payment-form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
        mx: 'auto',
        my: 5
      }}
    >
      <PaymentElement id="payment-element" />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isProcessing || !stripe || !elements}
        sx={{ mt: 3 }}
      >
        {isProcessing ? "Processing ..." : "Pay now"}
      </Button>
      {message && (
        <Alert severity={message.includes('success') ? "success" : "error"} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default CheckoutForm;