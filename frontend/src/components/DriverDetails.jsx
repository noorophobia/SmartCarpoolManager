import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Box, Grid, Card, CardContent, Typography, Divider, CardMedia, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const DriverDetails = () => {
  const { id } = useParams();
  
  // Dummy driver data
  const driver = {
    id: 1,
    name: 'John Doe',
    gender: 'Male',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    cnic: '12345-1234567-1',
    ratings: 4,
    vehicleBrand: 'Toyota',
    vehicleName: 'Corolla',
    vehicleColor: 'Red',
    vehicleID: 'V1234',
    vehicleType: 'Sedan',
    licenseNumber: 'ABC123',
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
    setSelectedDocument(doc);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocument(null);
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Driver Details
      </Typography>

      {/* Driver and Vehicle Information Section */}
      <Grid container spacing={4}>
        {/* Driver Details Section */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Driver Information</Typography>
              </Box>
              <Divider />
              <Grid container spacing={2} alignItems="center">
                {/* Driver Image */}
                <Grid item xs={4}>
                  <Avatar
                    alt={driver.name}
                    src={driver.driverImage}
                    sx={{ width: 120, height: 120 }}
                  />
                </Grid>
                {/* Driver Details */}
                <Grid item xs={8}>
                  <div>
                    <Typography><strong>Driver ID:</strong> {driver.id}</Typography>
                    <Typography><strong>Name:</strong> {driver.name}</Typography>
                    <Typography><strong>Gender:</strong> {driver.gender}</Typography>
                    <Typography><strong>Email:</strong> {driver.email}</Typography>
                    <Typography><strong>Phone Number:</strong> {driver.phoneNumber}</Typography>
                    <Typography><strong>CNIC:</strong> {driver.cnic}</Typography>
                    <Typography><strong>Date of Birth:</strong> {driver.dateOfBirth}</Typography>
                    <Typography><strong>Ratings:</strong> {driver.ratings}</Typography>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle Details Section */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
              </Box>
              <Divider />
              <Grid container spacing={2} alignItems="center">
                {/* Car Image */}
                <Grid item xs={4}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={driver.carImage}
                    alt="Car Image"
                  />
                </Grid>
                {/* Vehicle Details */}
                <Grid item xs={8}>
                  <div>
                    <Typography><strong>Brand:</strong> {driver.vehicleBrand}</Typography>
                    <Typography><strong>Name:</strong> {driver.vehicleName}</Typography>
                    <Typography><strong>Color:</strong> {driver.vehicleColor}</Typography>
                    <Typography><strong>Vehicle ID:</strong> {driver.vehicleID}</Typography>
                    <Typography><strong>Type:</strong> {driver.vehicleType}</Typography>
                    <Typography><strong>License Number:</strong> {driver.licenseNumber}</Typography>
                    <Typography><strong>Total Seats Capacity:</strong> {driver.totalSeatsCapacity}</Typography>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ride Statistics and Rates Section */}
      <Grid container spacing={4} sx={{ marginTop: '20px' }}>
        {/* Ride Statistics Section */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Ride Statistics</Typography>
              </Box>
              <Divider />
              <div>
                <Typography><strong>Total Rides:</strong> {driver.totalRides}</Typography>
                <Typography><strong>Completed Rides:</strong> {driver.completedRides}</Typography>
                <Typography><strong>Cancelled Rides:</strong> {driver.cancelledRides}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Rates Section */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
              <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Rates</Typography>
              </Box>
              <Divider />
              <div>
                <Typography><strong>Distance Rate per KM:</strong> {driver.distanceRatePerKm}</Typography>
                <Typography><strong>Time Rate per Minute:</strong> {driver.timeRatePerMinute}</Typography>
                <Typography><strong>Fixed Driver Fee:</strong> {driver.fixedDriverFee}</Typography>
                <Typography><strong>Peak Rate Multiplier:</strong> {driver.peakRateMultiplier}</Typography>
                <Typography><strong>Discounts:</strong> {driver.discounts}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Documents Section */}
      <Card sx={{ marginTop: '20px', height: '100%' }}>
        <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
          <Box sx={{ backgroundColor: '#2F4E6F', color: 'white', padding: '8px', borderRadius: '4px' }}>
            <Typography variant="h6" gutterBottom>Documents</Typography>
          </Box>
          <Divider />
          <ul>
            {driver.documents.map((doc) => (
              <li key={doc.id}>
                <Button onClick={() => handleOpenDialog(doc)}>{doc.name}</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Document Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{selectedDocument ? selectedDocument.name : 'Document View'}</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <iframe
              src={selectedDocument.url}
              width="100%"
              height="400px"
              title={selectedDocument.name}
            />
          )}
        </DialogContent>
        <DialogActions>
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
