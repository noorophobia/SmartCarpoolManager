import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../../styles/passengerDetails.css';
import PassengerDetailsService from '../../services/PassengerDetailsService';

const PassengerDetails = () => {
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [passenger, setPassenger] = useState(null);
  const [ridesData, setRidesData] = useState([]);
  const [totalRides, setTotalRides] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);
  const [cancelledRides, setCancelledRides] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPassenger = async () => {
      try {
        const data = await PassengerDetailsService.getPassengerById(id);
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
      if (passenger) {
        try {
          const rides = await PassengerDetailsService.getRidesByPassengerId(id);
          setRidesData(rides);
        } catch (error) {
          console.error('Error fetching rides:', error);
        }
      }
    };

    fetchRides();
  }, [passenger, id]);

  useEffect(() => {
    if (ridesData.length > 0) {
      setTotalRides(ridesData.length);
      setCompletedRides(ridesData.filter((ride) => ride.status === 'completed').length);
      setCancelledRides(ridesData.filter((ride) => ride.status === 'cancelled').length);
    }
  }, [ridesData]);

  const handleAvatarLoad = () => {
    setAvatarLoading(false);
  };

  const handleGoBack = () => {
    const lastRoute = localStorage.getItem('lastVisitedRoute') || '/';
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
            alt={passenger.name}
            src={
              passenger.imageUrl ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }
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
          marginTop: 4,
        }}
      >
        Go Back
      </Button>
    </div>
  );
};

export default PassengerDetails;
