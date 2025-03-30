import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import AddPassengerService from '../../services/AddPassengerService';
import '../../styles/passengerDetails.css';

const AddPassenger = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
  });

  const [newPassenger, setNewPassenger] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPassengers = async () => {
      try {
        const data = await AddPassengerService.getAllPassengers();
        if (Array.isArray(data)) {
          setEmails(data.map(passenger => passenger.email));
          setPhoneNumbers(data.map(passenger => passenger.phone));
        }
      } catch (error) {
        console.error('Failed to fetch passengers:', error);
      }
    };

    fetchAllPassengers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!value.startsWith("+92")) {
        setNewPassenger((prev) => ({ ...prev, [name]: `+92${value.replace(/^0/, "")}` }));
        return;
      }
    }

    setNewPassenger((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessages({
      name: "",
      gender: "",
      email: "",
      phone: "",
    });

    const { name, email, phone, gender, password } = newPassenger;
    let hasError = false;

    // Validation
    if (emails.includes(email)) {
      setErrorMessages((prev) => ({ ...prev, email: "Email is already in use" }));
      hasError = true;
    }
    if (phoneNumbers.includes(phone)) {
      setErrorMessages((prev) => ({ ...prev, phone: "Phone number is already in use" }));
      hasError = true;
    }
    if (!name.trim()) {
      setErrorMessages((prev) => ({ ...prev, name: "Name is required" }));
      hasError = true;
    }
    if (!['male', 'female'].includes(gender)) {
      setErrorMessages((prev) => ({ ...prev, gender: "Gender must be male or female" }));
      hasError = true;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setErrorMessages((prev) => ({ ...prev, email: "Please provide a valid email address" }));
      hasError = true;
    }
    if (!phone.match(/^((\+92)|0)(3[0-9]{2})[0-9]{7}$/)) {
      setErrorMessages((prev) => ({ ...prev, phone: "Phone number must be a valid Pakistani number" }));
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    try {
      await AddPassengerService.addPassenger(newPassenger);
      navigate('/passengers');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="passenger-details-container">
      <h2 className="header">Add New Passenger</h2>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 1200,
          margin: '0 auto',
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: '#fff',
        }}
      >
        <TextField
          label="Full Name"
          name="name"
          value={newPassenger.name}
          onChange={handleChange}
          error={!!errorMessages.name}
          helperText={errorMessages.name}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={newPassenger.email}
          onChange={handleChange}
          error={!!errorMessages.email}
          helperText={errorMessages.email}
          fullWidth
        />
        <TextField
          label="Phone Number"
          name="phone"
          type="tel"
          value={newPassenger.phone}
          onChange={handleChange}
          error={!!errorMessages.phone}
          helperText={errorMessages.phone}
          fullWidth
        />

        <FormControl fullWidth error={!!errorMessages.gender}>
          <InputLabel>Gender</InputLabel>
          <Select
            label="Gender"
            name="gender"
            value={newPassenger.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">male</MenuItem>
            <MenuItem value="female">female</MenuItem>
          </Select>
          {errorMessages.gender && (
            <Typography variant="caption" color="error">{errorMessages.gender}</Typography>
          )}
        </FormControl>

        <TextField
          label="Password"
          name="password"
          type="password"
          value={newPassenger.password}
          onChange={handleChange}
          fullWidth
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/passengers')}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Add Passenger'}
          </Button>
        </Box>
      </Box>

      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
    </div>
  );
};

export default AddPassenger;
