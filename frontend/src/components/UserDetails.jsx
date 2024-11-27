import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const UserDetails = () => {
  const navigate = useNavigate();
  const { id, type } = useParams(); // Retrieve id and type (passenger/driver) from route

  // Mock data for demonstration
  const mockData = {
    1: { name: 'Ali Khan', phone: '123-456-7890', email: 'ali@example.com' },
    2: { name: 'John Doe', phone: '987-654-3210', email: 'john@example.com' },
  };

  const details = mockData[id]; // Fetch details using the ID

  return (
    <Card sx={{ maxWidth: 500, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {type === 'passenger' ? 'Passenger Details' : 'Driver Details'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Name:</strong> {details?.name || 'N/A'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Phone:</strong> {details?.phone || 'N/A'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Email:</strong> {details?.email || 'N/A'}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back to Rides
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
