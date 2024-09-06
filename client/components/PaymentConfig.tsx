import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { Box } from '@mui/material';

interface PaymentProps {
  clientSecret: string;
  paymentToken: string;
}

const PaymentConfig: React.FC<PaymentProps> = ({ clientSecret, paymentToken }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    setStripePromise( loadStripe('pk_test_51PRNjiCWNFZrh8eIhgiCqEkUz9efXY4ppBCusr3fzosyO17zne7rP6WH1ct38zRkHzK5gq1rbA97VYOZH6ZTahEm00mIn0yZxQ'));
  }, []);

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      {stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm paymentToken={paymentToken}/>
        </Elements>
      )}
    </Box>
  );
};

export default PaymentConfig;