import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import { Container } from '@mui/material';

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Image = styled('img')({
  width: '80%',
  height: 'auto',
});

const TextContainer = styled(Box)(({ theme }) => ({
  textAlign: 'left',
}));

const CenteredContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
}));

export default function HomeBanner() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        
      }}
    >
      <CenteredContainer sx={{ ml: 15, mr: 20}}>
        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <ImageContainer>
              <Image src={`/static/images/market_place.jpg`} alt="Marketplace" />
            </ImageContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextContainer>
              <Typography variant="h4">Online Marketplace</Typography>
              <Typography variant="body1" color="textSecondary">
                Experience reliable transactions with your trusted college pal
              </Typography>
            </TextContainer>
          </Grid>
        </Grid>
      </CenteredContainer>
    </Box>
  );
}