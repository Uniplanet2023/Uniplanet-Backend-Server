import React from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';

const FormContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'white',
//   padding: theme.spacing(6),
//   boxShadow: theme.shadows[3],
//   borderRadius: theme.shape.borderRadius,
}));

const ContactUsForm: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', }}>
      <FormContainer maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone number"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comment"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Send
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormContainer>
    </Box>
  );
};

export default ContactUsForm;