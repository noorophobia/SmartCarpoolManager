import  { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

import { Button, Box,  Card, CardContent, Typography, Divider, CardMedia, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import the carousel styles

const DriverDetails = () => {
  const { id } = useParams();
  const [driver1, setDriver1] = useState(null); // Store fetched driver data
   const [openCarDialog, setOpenCarDialog] = useState(false); // Dialog open state
  const [carouselImages, setCarouselImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [rateSettings, setRateSettings] = useState(null); // Store rate settings
  const [ridesData, setRidesData] = useState(null); // Store rate settings
  const [totalRides, setTotalRides] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);
  const [cancelledRides, setCancelledRides] = useState(0);

  
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Driver API Response:', response); // Check status code
  
      if (!response.ok) {
        throw new Error('Failed to fetch driver details');
      }
  
      const data = await response.json();
      console.log('Driver Data:', data); // Ensure data is correct
  
      setDriver1(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching driver:', err);
    } finally {
      setLoading(false);
    }
  };
   
   
    
    

    fetchDriver();
  
  }, [id]);
  useEffect(() => {
    if (driver1) {
      const fetchRateSettings = async () => {
        try {
            if (!driver1 || !driver1.carType) {
                console.warn("Driver1 or carType is null, skipping API call.");
                return;
            }
    
            console.log("Driver vehicle type: " + driver1.carType);
            const response = await axios.get(`http://localhost:5000/api/rate-settings/${driver1.carType}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            console.log('Fetched Rate Settings:', response.data);
            setRateSettings(response.data);
        } catch (error) {
            console.error('Error fetching rate settings:', error);
            setError('Error fetching rate settings');
        }
    };
    const fetchRides = async () => {
      try {
          
  
           const response = await axios.get(`http://localhost:5000/rides/driver/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
  
          console.log('Fetched Rides:', response.data);
          setRidesData(response.data);
      } catch (error) {
          console.error('Error fetching rate settings:', error);
          setError('Error fetching rate settings');
      }
  };
  
          fetchRateSettings();
          fetchRides();
    }
  }, [driver1]);  
 
useEffect(() => {
  if (ridesData) {
    let total = 0;
    let completed = 0;
    let cancelled = 0;

    // Count single rides
    if (ridesData.singleRides && Array.isArray(ridesData.singleRides)) {
      total += ridesData.singleRides.length;
      completed += ridesData.singleRides.filter(ride => ride.completedAt).length;
    }

    // Count carpool rides
    if (ridesData.carpoolRides && Array.isArray(ridesData.carpoolRides)) {
      total += ridesData.carpoolRides.length;
      completed += ridesData.carpoolRides.filter(ride => ride.completedAt).length;
    }
  
    // Check single rides
    if (ridesData.singleRides && Array.isArray(ridesData.singleRides)) {
      cancelled += ridesData.singleRides.filter(ride =>ride.cancelledAt&& ride.cancelledAt !== null).length;
    }
  
    // Check carpool rides
    if (ridesData.carpoolRides && Array.isArray(ridesData.carpoolRides)) {
      cancelled += ridesData.carpoolRides.filter(ride =>ride.cancelledAt&& ride.cancelledAt !== null).length;
    }
    // Update state
    setTotalRides(total);
    setCompletedRides(completed);
    setCancelledRides(cancelled);
  }
}, [ridesData]);
   
   
const handleGoBack = () => {
  const lastRoute = localStorage.getItem("lastVisitedRoute") || "/";
  
   navigate(lastRoute);
};
 const handleOpenCarDialog = () => {
  setOpenCarDialog(true);
};

const handleCloseCarDialog = () => {
  setOpenCarDialog(false);
};
  
  
;  

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
 
      setCarouselImages([ `${driver1.driverCnicFront}` , `${driver1.driverCnicBack}`]);
      setSelectedCategory('CNIC');
    } else if (category === 'Vehicle Registration') {
      setCarouselImages([ `${driver1.vehicleRegisterationFront}` , `${driver1.vehicleRegisterationBack}`]);

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
                  {driver1  && (
                    <Avatar
                      alt={driver1.driverFirstName}
                      src={`${driver1.driverSelfie}`}
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
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Name:</strong> {driver1.driverFirstName+" "+driver1.driverLastName}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Gender:</strong> {driver1.driverGender}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Email:</strong> {driver1.driverEmail}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Phone Number:</strong> {driver1.driverPhone}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>CNIC:</strong> {driver1.driverCnicNumber}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Date of Birth:</strong> {driver1.driverDOB}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}><strong>Ratings:</strong> {driver1.rating}</Typography>
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
                  {driver1 && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${driver1.vehiclePhotos[0]}`}
                      alt="Car Image"
                    />
                  )}
                </Box>
                {/* Vehicle Details */}
                <Box sx={{ width: '75%' ,marginLeft:4 }}>
                  {driver1 &&
                  <div style={{ marginLeft: 16 }}>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1, marginTop: 4 }}>
                      <strong>Brand:</strong> {driver1.brand}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Name:</strong> {driver1.vehicleName}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Color:</strong> {driver1.vehicleColor}
                    </Typography>
                    
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Type:</strong> {driver1.carType}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>Production Year:</strong> {driver1.vehicleProductionYear}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 1 }}>
                      <strong>License Number:</strong> {driver1.licenseNumber}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', marginBottom: 4 }}>
                      <strong>Total Seats Capacity:</strong> {driver1.vehicleType}
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
                <Typography sx={{ fontSize: '1rem',marginTop:2, marginBottom: 1 ,marginLeft:4}}><strong>Vehicle Type :</strong> {driver1.vehicleType}</Typography>

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
            <Typography sx={{ fontSize: '1rem', marginBottom: 1, marginTop: 2,marginLeft:4}}><strong>Total Rides:</strong> {totalRides}</Typography>
                 <Typography sx={{ fontSize: '1rem', marginBottom: 1,marginTop: 2,marginLeft:4}}><strong>Completed Rides:</strong> {completedRides}</Typography>
                 <Typography sx={{ fontSize: '1rem',marginTop: 2,marginLeft:4,marginBottom:11}}><strong>Cancelled Rides:</strong> {cancelledRides}</Typography>
              </div>
            </CardContent>
          </Card>
        </Box>
      </Box>
    <Dialog open={openCarDialog} onClose={handleCloseCarDialog} fullWidth maxWidth="md">
    <DialogTitle>Vehicle Photos</DialogTitle>
    <DialogContent>
      {driver1?.vehiclePhotos?.length === 1 ? (
        // Single image view
        <img
           src={`${driver1.vehiclePhotos[0]}`}
          alt={`Vehicle Photo 1`}
          style={{ width: '100%', height: 'auto' }}
        />
      ) : (
        // Multiple images carousel
        driver1?.vehiclePhotos?.length > 1 && (
          <Carousel>
            {driver1.vehiclePhotos.map((photo, index) => (
              <div key={index}>
                <img
                  src={`${photo}`}
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

export default DriverDetails;
