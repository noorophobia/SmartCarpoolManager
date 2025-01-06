import React, { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

import { Button, Box, Grid,Grid2, Card, CardContent, Typography, Divider, CardMedia, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import the carousel styles

const DriverDetails = () => {
  const { id } = useParams();
  const [driver1, setDriver1] = useState(null); // Store fetched driver data
  const [vehicle, setVehicle] = useState(null); // Store fetched driver data
  const [openCarDialog, setOpenCarDialog] = useState(false); // Dialog open state
  const [carouselImages, setCarouselImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [rateSettings, setRateSettings] = useState(null); // Store rate settings

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();
  
  console.log('Driver ID:', id);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
   if (!token) {
    navigate('/login');
    return;
  }
    const fetchDriver = async () => {
      try {
        const response = await fetch(`http://localhost:5000/drivers/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
            'Content-Type': 'application/json',
          },
        });
                if (!response.ok) {
          throw new Error('Failed to fetch driver details');
        }
        const data = await response.json();
        console.log(data);
console.log(response);
        setDriver1(data);
       } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/vehicles/driver/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
            'Content-Type': 'application/json',
          },
        });        const data = await response.json();
        console.log('Fetched Vehicle Data:', data);
        
        // Access the first item in the array (if there is any data)
        if (data && data.length > 0) {
          setVehicle(data[0]); // Set vehicle state to the first object in the array
 
        } else {
          setVehicle(null); // Handle case where no vehicle data is found
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchDriver();
    fetchVehicle();
 
  }, [id]);
  useEffect(() => {
    if (vehicle) {
      // Fetch rate settings once the vehicle is available
      fetchRateSettings();
    }
  }, [vehicle]);  
  const fetchRateSettings = async () => {
    if (vehicle && vehicle.vehicleType) {
      try {
        const response = await axios.get(`http://localhost:5000/api/rate-settings/${vehicle.vehicleType}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
                console.log('Fetched Rate Settings:', response.data); // Debug log for fetched rate settings
        setRateSettings(response.data);  // Set rate settings
      } catch (error) {
        console.error('Error fetching rate settings:', error);
        setError('Error fetching rate settings');
      }
    }
  };
  if(driver1){
  console.log("driver 1 "+ driver1.name)
 }
 if(vehicle){
console.log("vehicle"+vehicle.driverPhoto
);
console.log("brand"+vehicle.brand);
 }
 
 const handleOpenCarDialog = () => {
  setOpenCarDialog(true);
};

const handleCloseCarDialog = () => {
  setOpenCarDialog(false);
};
  
  
;  const driver = {
    id: 1,
     
    totalSeatsCapacity: 5,
    totalRides: 2,
    completedRides: 2,
    cancelledRides: 0,
    distanceRatePerKm: 72,
    timeRatePerMinute: 10,
    fixedDriverFee: 50,
    peakRateMultiplier: 1.2,
    discounts: 5,
    carImage: '/car.jpg',
    driverImage: '/driver.jpg',
    dateOfBirth: '1990-05-15',
    documents: [
      { id: 1, name: 'CNIC', url: 'https://example.com/cnic' },
      { id: 2, name: 'Driver License', url: 'https://example.com/license' },
      { id: 3, name: 'Vehicle Registration', url: 'https://example.com/registration' },
    ],
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleOpenDialog = (doc) => {
     setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
   };
  const handleCategoryChange = (category) => {
    if (category === 'CNIC') {
 
      setCarouselImages([ `http://localhost:5000/uploads/${vehicle.cnicFront}` , `http://localhost:5000/uploads/${vehicle.cnicBack}`]);
      setSelectedCategory('CNIC');
    } else if (category === 'Vehicle Registration') {
      setCarouselImages([ `http://localhost:5000/uploads/${vehicle.vehicleRegistrationFront}` , `http://localhost:5000/uploads/${vehicle.vehicleRegistrationBack}`]);

       setSelectedCategory('Vehicle Registration');
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Driver Details
      </Typography>
  
      {/* Driver and Vehicle Information Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px' }}>
        {/* Driver Details Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '16px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Driver Information</Typography>
              </Box>
              <Divider />
              <Box display="flex" alignItems="center">
                {/* Driver Image */}
                <Box sx={{ width: '25%' }}>
                  {driver1 && vehicle && (
                    <Avatar
                      alt={driver1.name}
                      src={`http://localhost:5000/uploads/${vehicle.driverPhoto}`}
                      sx={{ width: 150, height: 150, marginLeft: 4 }}
                    />
                  )}
                </Box>
                {/* Driver Details */}
                <Box sx={{ width: '75%',marginLeft:4 }}>
                  {driver1 && (
                    <div>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1, marginTop: 3 }}>
                        <strong>Driver ID:</strong> {driver1.compositeId}
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Name:</strong> {driver1.name}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Gender:</strong> {driver1.gender}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Email:</strong> {driver1.email}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Phone Number:</strong> {driver1.phoneNumber}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>CNIC:</strong> {driver1.cnic}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Date of Birth:</strong> {driver1.dateOfBirth}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Ratings:</strong> {driver1.ratings}</Typography>
                    </div>
                  )}
                </Box>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                  View Documents
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
  
        {/* Vehicle Details Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '16px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
              </Box>
              <Divider />
              <Box display="flex" alignItems="center">
                {/* Car Image */}
                <Box sx={{ width: '25%' }}>
                  {vehicle && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:5000/uploads/${vehicle.vehiclePhotos[0]}`}
                      alt="Car Image"
                    />
                  )}
                </Box>
                {/* Vehicle Details */}
                <Box sx={{ width: '75%' ,marginLeft:4 }}>
                  {vehicle &&
                  <div style={{ marginLeft: 16 }}>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1, marginTop: 4 }}>
                      <strong>Brand:</strong> {vehicle.brand}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Name:</strong> {vehicle.vehicleName}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Color:</strong> {vehicle.vehicleColor}
                    </Typography>
                    
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Type:</strong> {vehicle.vehicleType}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Production Year:</strong> {vehicle.vehicleProductionYear}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>License Number:</strong> {vehicle.licenseNumber}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 4 }}>
                      <strong>Total Seats Capacity:</strong> {vehicle.vehicleType}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">
                      <Button variant="contained" color="primary" onClick={handleOpenCarDialog}>
                        See Vehicle Photos
                      </Button>
                    </Box>
                  </div>}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
  
      {/* Ride Statistics and Rates Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px', marginTop: '20px' }}>
        {/* Ride Statistics Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Rates</Typography>
              </Box>
              <Divider />
              {rateSettings &&
               <div>
                <Typography sx={{ fontSize: '1rem',marginTop:2, marginBottom: 1 ,marginLeft:4}}><strong>Vehicle Type :</strong> {vehicle.vehicleType}</Typography>

          <Typography sx={{ fontSize: '1rem', marginBottom: 1 ,marginLeft:4}}><strong>Distance Rate per Km:</strong> {rateSettings.distanceRatePerKm}</Typography>
          <Typography sx={{ fontSize: '1rem', marginBottom: 1,marginLeft:4 }}><strong>Time Rate per Minute:</strong> {rateSettings.timeRatePerMinute}</Typography>
          <Typography sx={{ fontSize: '1rem', marginBottom: 1,marginLeft:4 }}><strong>Fixed Driver Fee:</strong> {rateSettings.fixedDriverFee}</Typography>
          <Typography sx={{ fontSize: '1rem', marginBottom: 1,marginLeft:4 }}><strong>Peak Rate Multiplier:</strong> {rateSettings.peakRateMultiplier}</Typography>
          <Typography sx={{ fontSize: '1rem', marginBottom: 1,marginLeft:4 }}><strong>Discounts:</strong> {rateSettings.discounts}</Typography>
               </div>}
            </CardContent>
          </Card>
        </Box>
  
        {/* Rates Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Ride Statistics</Typography>
              </Box>
              <Divider />
              <div>
              <Typography sx={{ fontSize: '1rem', marginBottom: 1, marginTop: 2,marginLeft:4}}><strong>Total Rides:</strong> {driver.totalRides}</Typography>
                 <Typography sx={{ fontSize: '1rem', marginBottom: 1,marginTop: 2,marginLeft:4}}><strong>Completed Rides:</strong> {driver.completedRides}</Typography>
                 <Typography sx={{ fontSize: '1rem',marginTop: 2,marginLeft:4,marginBottom:11}}><strong>Cancelled Rides:</strong> {driver.cancelledRides}</Typography>
              </div>
            </CardContent>
          </Card>
        </Box>
      </Box>
    <Dialog open={openCarDialog} onClose={handleCloseCarDialog} fullWidth maxWidth="md">
    <DialogTitle>Vehicle Photos</DialogTitle>
    <DialogContent>
      {vehicle?.vehiclePhotos?.length === 1 ? (
        // Single image view
        <img
           src={`http://localhost:5000/uploads/${vehicle.vehiclePhotos[0]}`}
          alt={`Vehicle Photo 1`}
          style={{ width: '100%', height: 'auto' }}
        />
      ) : (
        // Multiple images carousel
        vehicle?.vehiclePhotos?.length > 1 && (
          <Carousel>
            {vehicle.vehiclePhotos.map((photo, index) => (
              <div key={index}>
                <img
                  src={`http://localhost:5000/uploads/${photo}`}
                  alt={`Vehicle Photo ${index + 1}`}
                  style={{ width: '50%', height: 'auto' }}
                />
              </div>
            ))}
          </Carousel>
        )
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseCarDialog} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
      {/* Document Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{`Documents - ${selectedCategory}`}</DialogTitle>
        <DialogContent>
          {/* Carousel displaying selected images */}
          <Carousel>
            {carouselImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`carousel-item-${index}`} style={{ width: '100%' }} />
              </div>
            ))}
          </Carousel>
        </DialogContent>
        <DialogActions>
          {/* Buttons to switch between different categories of images */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px' }}>
            <Button variant="outlined" onClick={() => handleCategoryChange('CNIC')}>CNIC</Button>
            <Button variant="outlined" onClick={() => handleCategoryChange('Vehicle Registration')} style={{ marginLeft: '10px' }}>Vehicle Registration</Button>
          </Box>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
  
      {/* Back Button */}
      <Button variant="contained" color="primary" onClick={() => window.history.back()} style={{ marginTop: '20px' }}>
        Back
      </Button>
    </div>
  );
};  

export default DriverDetails;
