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
    const fetchConfig = async () => {
      try {
        const response = await fetch('https://account.uniplanet-back.autos/api/account/stripe-public-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers your backend requires
          },
          body: JSON.stringify({}), // convert to cents
          credentials: 'include', // Include cookies in requests
        });
        const { stripePublicKey } = await response.json();

        if (stripePublicKey) {
          setStripePromise(loadStripe(stripePublicKey));
        }
      } catch (e) {
        console.log("Error fetching stripe public key", e);
      }
    };

    fetchConfig();
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