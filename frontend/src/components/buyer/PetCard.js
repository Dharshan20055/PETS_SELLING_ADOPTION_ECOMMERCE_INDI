import React, { useState } from 'react';
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Chip, Button, Box, Snackbar, Alert, Tooltip
} from '@mui/material';
import { ShoppingCart, Pets, LocationOn, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=280&fit=crop';

const PetCard = ({ pet }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      
      await addToCart(pet.petId);
      setSnack({ open: true, msg: 'Added to cart!', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Failed to add to cart', severity: 'error' });
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'transform .2s, box-shadow .2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
        <CardMedia component="img" height={200}
          image={pet.imageUrl || PLACEHOLDER}
          alt={pet.breed}
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => navigate(`/pets/${pet.petId}`)} />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight={700} noWrap>{pet.breed}</Typography>
            <Chip size="small"
              label={pet.type === 'ADOPTION' ? 'Adoption' : `$${pet.price}`}
              color={pet.type === 'ADOPTION' ? 'success' : 'secondary'} />
          </Box>

          {pet.category && (
            <Chip icon={<Pets />} label={pet.category} size="small" variant="outlined" sx={{ mb: 1 }} />
          )}
          {pet.age && (
            <Typography variant="body2" color="text.secondary">{pet.age} year{pet.age !== 1 ? 's' : ''} old</Typography>
          )}
          {pet.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>{pet.location}</Typography>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<Visibility />}
            onClick={() => navigate(`/pets/${pet.petId}`)}>View</Button>
          {pet.availability ? (
            <Tooltip title={!user ? 'Login to add to cart' : ''}>
              <Button size="small" variant="contained" startIcon={<ShoppingCart />}
                onClick={handleAddToCart}>Add to Cart</Button>
            </Tooltip>
          ) : (
            <Chip label="Unavailable" color="default" size="small" />
          )}
        </CardActions>
      </Card>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({...p, open: false}))}>
        <Alert severity={snack.severity} onClose={() => setSnack(p => ({...p, open: false}))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PetCard;