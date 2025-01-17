import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles/passengerDetails.css';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PassengerDetails = () => {
  const id = localStorage.getItem('id');
 
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPassenger = async () => {
      try {
        const response = await fetch(`http://localhost:5000/passengers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch passenger details');
        }

        const data = await response.json();
        setPassenger(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPassenger();
  }, [id, navigate, token]);

  const handleAvatarLoad = () => {
    setAvatarLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!passenger) {
    return <div className="not-found">Passenger not found</div>;
  }

  return (
    <div className="passenger-details-container">
      <h2 className="header">Passenger Details</h2>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: '#fff',
        }}
      >
        <div className="avatar-container">
          {passenger.imageUrl && avatarLoading && <CircularProgress />}
          <Avatar
            alt={`${passenger.name}`}
            src={passenger.imageUrl || 'https://via.placeholder.com/150'}
            onLoad={handleAvatarLoad}
            sx={{ width: 300, height: 300, display: avatarLoading ? 'none' : 'block' }}
          />
        </div>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6"><strong>Full Name:</strong> {passenger.name}</Typography>
          <Typography variant="h6"><strong>Email:</strong> {passenger.email}</Typography>
          <Typography variant="h6"><strong>Phone Number:</strong> {passenger.phone}</Typography>
          <Typography variant="h6"><strong>Gender:</strong> {passenger.gender}</Typography>
          <Typography variant="h6"><strong>Total Rides:</strong> {passenger.totalRides}</Typography>
          <Typography variant="h6"><strong>Completed Rides:</strong> {passenger.completedRides}</Typography>
          <Typography variant="h6"><strong>Cancelled Rides:</strong> {passenger.cancelledRides}</Typography>
          <Typography variant="h6"><strong>Ratings:</strong> {passenger.ratings}</Typography>
        </Box>
        
      </Box>
      <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/passengers`)}
            sx={{
             
              padding: 2,
             marginTop:4,
            
            
            }}
          >
            Go Back
          </Button>
    </div>
  );
};

export default PassengerDetails;
