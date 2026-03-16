import React from 'react';
import { 
  Container, Typography, Box, Paper, List, ListItem, 
  ListItemText, IconButton, Button, Divider, Avatar 
} from '@mui/material';
import { Delete, ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, checkout, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await checkout();
      navigate('/requests');
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  // If items are 0, show the empty state
  if (!cartItems || cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" color="text.secondary">Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 3 }}>
          Browse Pets
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Back to Shopping
      </Button>
      
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Cart ({cartCount})
      </Typography>
      
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List disablePadding>
          {cartItems.map((item, idx) => (
            <React.Fragment key={item.cartItemId || idx}>
              <ListItem sx={{ py: 2, px: 3 }}>
                <Avatar 
                  src={item.pet?.imageUrl} 
                  variant="rounded" 
                  sx={{ width: 80, height: 80, mr: 2 }} 
                />
                <ListItemText 
                  primary={
                    <Typography variant="h6" fontWeight={600}>
                      {item.pet?.breed || "Pet Listing"}
                    </Typography>
                  }
                  secondary={`Price: ${item.pet?.type === 'ADOPTION' ? 'Free' : `$${item.pet?.price}`}`}
                />
                <IconButton color="error" onClick={() => removeFromCart(item.cartItemId)}>
                  <Delete />
                </IconButton>
              </ListItem>
              {idx < cartItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ p: 3, bgcolor: 'primary.50', textAlign: 'right' }}>
          <Button variant="contained" size="large" onClick={handleCheckout}>
            Submit Adoption Request
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CartPage;