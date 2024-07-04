import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { useState } from 'react';

const AdsCredit: React.FC<{ onNext: (value: string) => void }> = ({ onNext }) => {
  const [creditValue, setCreditValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (validateCreditValue(creditValue)) {
      setIsSubmitted(true);
      setError(null);
      onNext(creditValue);
    } else {
      setError('Please enter a valid amount above $1.00 (e.g., 10.00)');
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const validateCreditValue = (value: string): boolean => {
    const floatRegex = /^\d+(\.\d{1,2})?$/;
    const floatValue = parseFloat(value);
    return floatRegex.test(value) && floatValue >= 1;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateCreditValue(value) || value.endsWith('.')) {
      setCreditValue(value);
      setError(null);
    } else {
      setError('Please enter a valid amount above $1.00 (e.g., 10.00)');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        my: 5,
        textAlign: 'center'
      }}
    >
      {isSubmitted ? (
        <>
          <Typography variant="h6" gutterBottom>
            UniPlanet Ads Credit
          </Typography>
          <Typography variant="h4" gutterBottom>
            ${parseFloat(creditValue).toFixed(2)}
          </Typography>
          <Button variant="contained" onClick={handleEdit} sx={{ mb: 2 }}>
            Change amount
          </Button>
          <Box
            component="img"
            sx={{
              height: 'auto',
              width: '100%',
              maxWidth: 300,
              mt: 3
            }}
            alt="UniPlanet Logo"
            src="/static/images/uniplanet.png"
          />
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            UniPlanet Ads Credit
          </Typography>
          <TextField
            variant="outlined"
            value={creditValue}
            onChange={handleChange}
            label="Enter Credit Amount"
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
          <Box
            component="img"
            sx={{
              height: 'auto',
              width: '100%',
              maxWidth: 300,
              mt: 3
            }}
            alt="UniPlanet Logo"
            src="/static/images/uniplanet.png"
          />
        </>
      )}
    </Box>
  );
};

export default AdsCredit;