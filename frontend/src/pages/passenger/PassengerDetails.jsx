import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import '../../styles/passengerDetails.css';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PassengerDetails = () => {
  const id = localStorage.getItem('id');
   const [ridesData, setRidesData] = useState(null); // Store rate settings
 const [totalRides, setTotalRides] = useState(0);
   const [completedRides, setCompletedRides] = useState(0);
   const [cancelledRides, setCancelledRides] = useState(0);
 
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


  
  useEffect(() => {
   
    const fetchRides = async () => {
      try {
          
  
           const response = await axios.get(`http://localhost:5000/rides/passenger/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
  
          console.log('Fetched Rides:', response.data);
          setRidesData(response.data);
      } catch (error) {
          console.error('Error fetching rate settings:', error);
          setError('Error fetching rate settings');
      }
  };
  fetchRides();
  }, [id]);


useEffect(() => {
  if (ridesData) {
    let total = 0;
    let completed = 0;
    let cancelled = 0;

    // Count single rides
    if (ridesData.singlePassengerRides && Array.isArray(ridesData.singlePassengerRides)) {
      total += ridesData.singlePassengerRides.length;
      completed += ridesData.singlePassengerRides.filter(ride => ride.completedAt).length;
      cancelled += ridesData.singlePassengerRides.filter(ride => ride.cancelledAt && ride.cancelledAt !== null).length;
    }
    
    // Count carpool passenger rides
    if (ridesData.carpoolPassengerRides && Array.isArray(ridesData.carpoolPassengerRides)) {
      total += ridesData.carpoolPassengerRides.length;
      completed += ridesData.carpoolPassengerRides.filter(ride => ride.completedAt).length;
      cancelled += ridesData.carpoolPassengerRides.filter(ride => ride.cancelledAt && ride.cancelledAt !== null).length;
    }
    
    // Update state
    setTotalRides(total);
    setCompletedRides(completed);
    setCancelledRides(cancelled);
  }
}, [ridesData]);

  const handleAvatarLoad = () => {
    setAvatarLoading(false);
  };
  const handleGoBack = () => {
    const lastRoute = localStorage.getItem("lastVisitedRoute") || "/";
    
    console.log(localStorage.getItem("id"))
    navigate(lastRoute);
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
          <Typography variant="h6"><strong>Total Rides:</strong> {totalRides}</Typography>
          <Typography variant="h6"><strong>Completed Rides:</strong> {completedRides}</Typography>
          <Typography variant="h6"><strong>Cancelled Rides:</strong> {cancelledRides}</Typography>
          <Typography variant="h6"><strong>Ratings:</strong> {passenger.ratings}</Typography>
        </Box>
        
      </Box>
      <Button
            variant="contained"
            color="secondary"
            onClick={handleGoBack}
            
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
