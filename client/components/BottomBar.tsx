import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';
import Divider from '@mui/material/Divider';

const BottomBarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  textAlign: 'left', // Align text to the left
  padding: '10px 20px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center',
  height: '60px', // Set the height of the bottom bar
  position: 'relative', // Ensure it's positioned relative to its parent
  
}));

const BottomBar: React.FC = () => {
  return (
    <Box sx={{ mt: 'auto', width: '100%' }}>
      <Divider />
      <BottomBarContainer>
        <Typography variant="body2" color="textSecondary" sx={{ ml: 12 }}>
          © 2024, Uniplanet
        </Typography>
      </BottomBarContainer>
    </Box>
  );
};

export default BottomBar;