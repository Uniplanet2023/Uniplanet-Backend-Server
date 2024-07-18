// pages/login.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, Link } from '@mui/material';
import { styled } from '@mui/system';

const BackgroundBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
});

const LoginBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '10px',
  padding: '40px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
});

const InputBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
  position: 'relative',
});

const InputIcon = styled(Box)({
  position: 'absolute',
  left: '10px',
  color: '#aaa',
});

const LoginButton = styled(Button)({
  marginTop: '20px',
  padding: '10px',
  width: '100%',
  background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  color: '#fff',
});

const LoginBody = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenLogin = async () => {
      try {
        const response = await fetch('https://auth.uniplanet.shop/api/auth/token-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'charset': 'UTF-8'
          },
          body: JSON.stringify({}), 
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Login successful", data);
          router.push('/payment');
        } else {
          console.log("Login failed", response.statusText);
        }
      } catch (e) {
        console.log("Error during login", e);
      }
    };

    tokenLogin();
  }, [router]);
  
  const handleLogin = async () => {
    console.log('Logging in:', { email, password, rememberMe });
    try {
      const response = await fetch('https://auth.uniplanet.shop/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'charset':'UTF-8'
        },
        body: JSON.stringify({email, password}), 
        credentials: 'include'
      });
      if(response.ok) {
        const data = await response.json();
        router.push('/payment');
      }
    } catch (e) {
      console.log("Error during login", e);
    }
  };

  return (
    <BackgroundBox>
      <LoginBox>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <InputBox>
          <InputIcon>👤</InputIcon>
          <TextField
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ paddingLeft: '30px', width: "250px" }}
          />
        </InputBox>
        <InputBox>
          <InputIcon>🔒</InputIcon>
          <TextField
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ paddingLeft: '30px', width: "250px" }}
          />
        </InputBox>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
            label="Remember me"
          />
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Box>
        <LoginButton variant="contained" onClick={handleLogin}>
          Login
        </LoginButton>
        <Typography variant="body2" sx={{ marginTop: '20px' }}>
          Don't have an account? <Link href="#">Register</Link>
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '20px' }}>
          Version 1.0
        </Typography>
      </LoginBox>
    </BackgroundBox>
  );
};

export default LoginBody;