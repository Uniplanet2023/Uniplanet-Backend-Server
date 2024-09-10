import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useState } from "react";

const AdCheckoutForm = ({ clientSecret, token }: { clientSecret: string, token: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
  
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      if (!stripe || !elements) {
        setError('Stripe has not loaded properly.');
        return;
      }
    
      try {
        // Submit the form to validate and gather payment method details
        const { error: submitError } = await elements.submit();
    
        if (submitError) {
          throw new Error(submitError.message || 'An error occurred during form submission.');
        }
    
        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `https://uniplanet.shop/payment-success`, // Adjusted return URL
            // receipt_email: 'qkrtlwp1111@gmail.com', // Optional: Add receipt email if needed
          },
          redirect: 'if_required', // Handle redirection based on the requirement
        });
    
        if (error) {
          throw new Error(error.message || 'An unexpected error occurred during payment confirmation.');
        }
    
        // Send payment confirmation to the backend
        const response = await fetch('https://products.uniplanet.shop/api/products/ad-payment-success', {
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
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to confirm payment on the server.');
        }
    
        // Redirect to the payment success page after successful processing
        await router.push('https://uniplanet.shop/payment-success');
      } catch (err) {
        console.error('Payment processing error:', err);
        setError(String(err) || 'An error occurred while processing your payment.');
      }
    };
    
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
            <Box my={2}>
              <PaymentElement id="payment-element"/>
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

  export default AdCheckoutForm;