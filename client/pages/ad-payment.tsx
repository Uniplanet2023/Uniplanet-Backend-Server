import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Box, Button, Container, TextField, Typography, Card, CardContent } from '@mui/material';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';

const stripePromise = loadStripe('pk_test_51PRNjiCWNFZrh8eIhgiCqEkUz9efXY4ppBCusr3fzosyO17zne7rP6WH1ct38zRkHzK5gq1rbA97VYOZH6ZTahEm00mIn0yZxQ');

const CheckoutForm = ({ clientSecret, token }: { clientSecret: string, token: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `https://uniplanet.shop`, // Adjusted return URL
        receipt_email: email,
      },
      redirect: 'if_required', // Handle redirection based on the requirement
    });

    if (error) {
      setError(error.message || 'An unexpected error occurred.');
    } else {
      try {
        // Send the payment confirmation to the backend
        const response = await fetch(`https://product.uniplanet.shop/api/products/ad-payment-success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            paymentIntentId: paymentIntent?.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to confirm payment on the server.');
        }

        // Redirect to the main site after successful payment and backend processing
        // router.push(`https://uniplanet.shop/payment-success?token=${token}`);
      } catch (err) {
        setError('An error occurred while processing your payment.');
      }
    }
  };
1
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Subscribe to 1 month Ad
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            $98.00 per month
          </Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Cardholder name"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box my={2}>
            <PaymentElement />
          </Box>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!stripe}
          >
            Publish
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};


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

  useEffect(() => {
    if (clientSecret) {
      console.log('clientSecret:', clientSecret);
    }
    if (token) {
      console.log('token:', token);
    }
  }, [clientSecret, token]);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Review payment
        </Typography>
        {clientSecret && token ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} token={token} />
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