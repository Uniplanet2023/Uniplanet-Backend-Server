// components/ResponsiveAppBar.tsx

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

const pages = ['Home', 'Terms of Policy', 'Privacy Policy', 'Contact Us'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [selectedPage, setSelectedPage] = React.useState<string>('Home');
  const theme = useTheme();
  const router = useRouter();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageClick = (page: string) => {
    setSelectedPage(page);
    handleCloseNavMenu();
    if (page === 'Home') {
      router.push('/');
    } else if (page === 'Terms of Policy') {
      router.push('/terms-of-policy');
    } else if (page === 'Privacy Policy') {
      router.push('/privacy-policy');
    } else if (page === 'Contact Us') {
      router.push('/contact-us');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 0, mt: 4, mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Home text for larger screens */}
          <Box
            sx={{ display: { xs: 'none', md: 'flex', ml: 12 }, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            <img src="/static/images/uniplanet.png" alt="UniPlanet Logo" style={{ height: '70px' }} />
          </Box>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none', mr: 10 }, alignItems: 'center', flexGrow: 1 }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ color: 'black', marginRight: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
            {/* Logo for mobile screens centered */}
            <Box
              sx={{ display: { xs: 'flex', md: 'none', mr: 3 }, justifyContent: 'center', flexGrow: 1, cursor: 'pointer' }}
              onClick={() => router.push('/')}
            >
              <img src="/static/images/uniplanet.png" alt="UniPlanet Logo" style={{ height: '70px' }} />
            </Box>
          </Box>

          {/* Navigation items for larger screens */}
          <Box sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                size='small'
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  borderBottom: selectedPage === page ? '2px solid' : 'none',
                  paddingBottom: '2px',
                  paddingLeft: '0',
                  marginLeft: '30px',
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
      {/* Menu for mobile screens */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {pages.map((page) => (
          <MenuItem key={page} onClick={() => handlePageClick(page)}>
            <Typography textAlign="center" sx={{ color: 'black' }}>{page}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}

export default ResponsiveAppBar;