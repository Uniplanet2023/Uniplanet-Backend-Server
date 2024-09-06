import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button, TextField, Typography, Grid, Paper, MenuItem } from '@mui/material';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setErrorMessage(error.message ?? 'An error occurred');
      } else {
        setErrorMessage(null);
        // Process payment here
        console.log(paymentMethod);
      }
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Subscribe to 1 month Ad
      </Typography>
      <Typography variant="h4" align="center" gutterBottom>
        $98.00 per month
      </Typography>
      <Button variant="outlined" fullWidth style={{ marginBottom: '16px' }}>
        View details
      </Button>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          required
        />
        <Typography variant="subtitle1" gutterBottom>
          Payment method
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button fullWidth variant="outlined">Card</Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth variant="outlined">Amazon Pay</Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth variant="outlined">Cash App Pay</Button>
          </Grid>
        </Grid>
        <div style={{ marginTop: '16px' }}>
          <Typography variant="subtitle1" gutterBottom>
            Card information
          </Typography>
          <div style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <CardElement />
          </div>
        </div>
        <TextField
          fullWidth
          label="Cardholder name"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          select
          label="Billing address"
          variant="outlined"
          margin="normal"
          required
        >
          <MenuItem value="US">United States</MenuItem>
          {/* Add more countries as needed */}
        </TextField>
        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '24px' }}
          disabled={!stripe}
        >
          Subscribe
        </Button>
        {errorMessage && <Typography color="error" variant="body2">{errorMessage}</Typography>}
      </form>
    </Paper>
  );
};

export default PaymentForm;