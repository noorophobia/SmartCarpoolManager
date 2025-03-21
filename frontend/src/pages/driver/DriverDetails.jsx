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
       console.error('Error fetching driver:', err);
    } 
  };
   
   
    
    

    fetchDriver();
  
  }, [id]);
  useEffect(() => {
    if (driver1) {
        
    
    const fetchRides = async () => {
      try {
        const response = await fetch(`http://localhost:5000/rides-with-composite-ids/${driver1.compositeId}`, {
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
  }, [driver1]);  
 
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
const handleUnBlockDriver = async () => {
   
  try {
    const response = await fetch(`http://localhost:5000/drivers/block/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isBlocked: false }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update driver status");
    }

    alert(`Driver has been "unblocked".`);
    setDriver1((prev) => ({
      ...prev,
      isBlocked: false,
    }));
    // You may want to refresh the driver list or update UI here
  } catch (error) {
    console.error("Error:", error.message);
    alert("Something went wrong while updating driver status.");
  }
};
   
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
 
  const handleOpenDialog = ( ) => {
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
      {driver1 && driver1.isBlocked && (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end", // Align items to the right
      alignItems: "center",
      gap: 2, // Space between text and button
      marginTop: 2,
    }}
  >
    <Typography variant="h6" sx={{ color: "red", fontWeight: "bold" }}>
      This Driver has been blocked
    </Typography>
    <Button
      variant="contained"
      color="error"
      onClick={() => handleUnBlockDriver(driver1._id)}
      sx={{ paddingX: 3, paddingY: 1 }}
    >
      Unblock Driver
    </Button>
  </Box>
)}


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
        
  
        {/* Rates Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Ride Statistics</Typography>
              </Box>
              <Divider />
              <div>
            <Typography sx={{ fontSize: '1rem', marginBottom: 1, marginTop: 4,marginLeft:4}}><strong>Total Rides:</strong> {totalRides}</Typography>
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
