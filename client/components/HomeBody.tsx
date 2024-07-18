import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import { Container, Button } from '@mui/material';

const MainContainer = styled(Box)({
  backgroundColor: 'rgb(161, 161, 161)',
  height: '70vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
});

const GlassContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  width: '100%',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'center',
}));

const BackgroundImage = styled('img')({
  position: 'absolute',
  width: '50%',
  height: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  opacity: 0.7, // Adjust opacity to make the background image less prominent
});

const OverlayText = styled(Typography)({
  position: 'absolute',
  top: '70%', // Adjust this value to move the text down
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
  zIndex: 3,
});

const ButtonContainer = styled(Box)({
  position: 'absolute',
  top: '83%', // Position the buttons below the text
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  gap: '16px',
  zIndex: 1,
  width: '300px',
});

const TransparentButton = styled(Button)({
  borderColor: '#fff',
  color: '#fff',
  backgroundColor: 'transparent',
  borderWidth: '2px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const WhiteButton = styled(Button)({
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default function HomeMainBody() {
  const handleGooglePlayClick = () => {
    window.location.href = 'https://play.google.com/store/apps/details?id=shop.uniplanet.uniplanet&pcampaignid=web_share';
  };
  const handleAppStoreClick = () => {
    window.location.href = 'https://apps.apple.com/us/app/uniplanet-buy-sell/id6499171342';
  }
  return (
    <MainContainer>
      <BackgroundImage src={`/static/images/welcome.png`} alt="UniPlanet" style={{ left: '0%' }} />
      <BackgroundImage src={`/static/images/character.webp`} alt="UniPlanet" style={{ right: '0%' }} />
      <OverlayText variant="h4">Connect and Trade with Campus Friends</OverlayText>
      <ButtonContainer>
        <TransparentButton variant="outlined" onClick={handleGooglePlayClick}>
          Google Play
        </TransparentButton>
        <WhiteButton variant="contained" onClick={handleAppStoreClick}>
          App Store
        </WhiteButton>
      </ButtonContainer>
      <GlassContainer>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box position="relative"></Box>
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
            <Box textAlign="center">
              <Box></Box>
            </Box>
          </Grid>
        </Grid>
      </GlassContainer>
    </MainContainer>
  );
}