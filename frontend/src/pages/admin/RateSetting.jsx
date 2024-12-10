import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import '../../styles/tables.css';

const RateSetting = () => {
  const [rateSettings, setRateSettings] = useState({
    ACCar: {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,
      fixedDriverFee: 0,
      peakRateMultiplier: 0,
      discounts: 0,
    },
    EconomyCar: {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,
      fixedDriverFee: 0,
      peakRateMultiplier: 0,
      discounts: 0,
    },
    Rickshaw: {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,
      fixedDriverFee: 0,
      peakRateMultiplier: 0,
      discounts: 0,
    },
    Bike: {
      distanceRatePerKm: 0,
      timeRatePerMinute: 0,
      fixedDriverFee: 0,
      peakRateMultiplier: 0,
      discounts: 0,
    },
  });

  const [errors, setErrors] = useState({
    ACCar: {},
    EconomyCar: {},
    Rickshaw: {},
    Bike: {},
  });

  useEffect(() => {
    // Simulate fetching data by setting dummy data
    const dummyData = {
      ACCar: {
        distanceRatePerKm: 5,
        timeRatePerMinute: 2,
        fixedDriverFee: 10,
        peakRateMultiplier: 1.2,
        discounts: 0.1,
      },
      EconomyCar: {
        distanceRatePerKm: 4,
        timeRatePerMinute: 1.5,
        fixedDriverFee: 8,
        peakRateMultiplier: 1.1,
        discounts: 0.05,
      },
      Rickshaw: {
        distanceRatePerKm: 3,
        timeRatePerMinute: 1.2,
        fixedDriverFee: 5,
        peakRateMultiplier: 1.3,
        discounts: 0.08,
      },
      Bike: {
        distanceRatePerKm: 2,
        timeRatePerMinute: 1,
        fixedDriverFee: 4,
        peakRateMultiplier: 1.1,
        discounts: 0.02,
      },
    };
    
    // Set the dummy data
    setRateSettings(dummyData);
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
