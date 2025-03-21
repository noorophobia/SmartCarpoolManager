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
    if (passenger) {
        
    
    const fetchRides = async () => {
      try {
        const response = await fetch(`http://localhost:5000/rides-with-composite-ids/passenger/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
    
        const data = await response.json(); // Parse JSON response
        console.log('Fetched Rides:', data.rides);
        setRidesData(data.rides); // use data.rides based on the backend response
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };
    
  
           fetchRides();
    }
  }, [passenger]);  
 
useEffect(() => {
  if (ridesData) {
    

    const totalRides = ridesData.length;
const completedRides = ridesData.filter((ride) => ride.status === "completed").length;
const cancelledRides = ridesData.filter((ride) => ride.status === "cancelled").length;
 
    // Update state
    setTotalRides(totalRides);
    setCompletedRides(completedRides);
    setCancelledRides(cancelledRides);
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
            src={passenger.imageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
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
          <Typography variant="h6"><strong>Ratings:</strong> {passenger.ratings || '0'}</Typography>
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
