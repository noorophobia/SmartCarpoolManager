import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import '../../styles/tables.css';

const RateSetting = () => {
  const [rateSettings, setRateSettings] = useState({
    'AC Car': {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,
      fixedDriverFee: 0,
      peakRateMultiplier: 0,
      discounts: 0,
      totalSeatsCapacity:0,

    },
    'Economy Car': {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,
      fixedDriverFee: 0,
        peakRateMultiplier: 0,
      discounts: 0,
      totalSeatsCapacity:0,

    },
    Rickshaw: {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,

      fixedDriverFee: 0,
 
      peakRateMultiplier: 0,
      discounts: 0,
      totalSeatsCapacity:0,

    },
    Bike: {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,
      fixedDriverFee: 0,
 
      peakRateMultiplier: 0,
      discounts: 0,
      totalSeatsCapacity:0,

    },
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    'AC Car': {},
    'Economy Car': {},
    Rickshaw: {},
    Bike: {},
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
   if (!token) {
    // If no token is found, redirect to the login page
    navigate('/login');
    return;
  }
  

    const fetchRateSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rate-settings', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        });        const fetchedData = response.data.vehicleTypes.reduce((acc, type) => {
          acc[type.type] = {
            distanceRatePerKm: type.distanceRatePerKm,
            timeRatePerMinute: type.timeRatePerMinute,
            fixedDriverFee: type.fixedDriverFee,
            peakRateMultiplier: type.peakRateMultiplier,
            discounts: type.discounts,
            totalSeatsCapacity:type.totalSeatsCapacity,
            

          };
          return acc;
        }, {});
        setRateSettings(fetchedData);
      } catch (error) {
        console.error('Error fetching rate settings:', error);
      //  alert('Failed to fetch rate settings. Please try again later.');
      }
    };
    fetchRateSettings();
        
  }, []);

  const handleChange = (vehicleType, field, value) => {
    setRateSettings(prevState => ({
      ...prevState,
      [vehicleType]: {
        ...prevState[vehicleType],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(rateSettings).forEach(vehicleType => {
      const vehicleRates = rateSettings[vehicleType];
      const vehicleErrors = {};

      Object.keys(vehicleRates).forEach(field => {
        const value = vehicleRates[field];

        if (!value || value <= 0) {
          vehicleErrors[field] = 'This field must be a positive number.';
          isValid = false;
        } else if (isNaN(value)) {
          vehicleErrors[field] = 'This field must be a number.';
          isValid = false;
        }
      });

      newErrors[vehicleType] = vehicleErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors before submitting.');
      return;
    }
    try {
      const formattedData = {
        vehicleTypes: Object.keys(rateSettings).map(type => ({
          type,
          ...rateSettings[type],
        })),
      };
      await axios.put('http://localhost:5000/api/rate-settings', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
      });
      } catch (error) {
      console.error('Error updating rate settings:', error);
      alert('Failed to update rate settings. Please try again later.');
    }
  
    // Here we just log the data instead of sending it to a server
    console.log('Updated Rate Settings:', rateSettings);
    alert('Rate settings updated successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="header">
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Update Rate Settings</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <TableContainer style={{ marginTop: 20, background: "white" }}>
          <Table sx={{ fontSize: '1.2rem' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Vehicle Type</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Distance Rate per Km</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Time Rate per Minute</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Fixed Driver Fee</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Peak Rate Multiplier</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Discounts</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Seats</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(rateSettings).map(vehicleType => (
                <TableRow key={vehicleType}>
                  <TableCell sx={{ fontSize: '1.2rem' }}>{vehicleType}</TableCell>
                  {Object.keys(rateSettings[vehicleType]).map(field => (
                    <TableCell key={field}>
                      <TextField
                        type="number"
                        value={rateSettings[vehicleType][field]}
                        onChange={(e) => handleChange(vehicleType, field, e.target.value)}
                        error={!!errors[vehicleType][field]}
                        helperText={errors[vehicleType][field]}
                        fullWidth
                        margin="normal"
                        sx={{ fontSize: '1.2rem' }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 3, fontSize: '1.2rem' }}>
          Save Settings
        </Button>
      </form>
    </div>
  );
};

export default RateSetting;
