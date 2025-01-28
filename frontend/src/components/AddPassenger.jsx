import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Typography from '@mui/material/Typography';
import '../styles/passengerDetails.css';

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

  // Fetch passengers data when the component mounts
  useEffect(() => {
    const fetchAllPassengers = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust according to how you're storing the token

        const response = await fetch(`http://localhost:5000/passengers`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setEmails(data.map(passenger => passenger.email));
          setPhoneNumbers(data.map(passenger => passenger.phone));
        }
      } catch (error) {
        console.error('Failed to fetch passengers:', error);
      }
    };

    fetchAllPassengers(); // Call the function to fetch data
  }, []);

  const [newPassenger, setNewPassenger] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // If the phone number is being updated, prepend +92 if it's not already there
    if (name === "phone") {
      if (!value.startsWith("+92")) {
        setNewPassenger((prev) => ({ ...prev, [name]: `+92${value.replace(/^0/, "")}` })); // Ensure no leading zero
        return; // Exit early if phone number is being modified
      }
    }
  
    // For other fields, update the state as usual
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

    // Check for existing email or phone
    if (emails.includes(email)) {
      setErrorMessages((prev) => ({ ...prev, email: "Email is already in use" }));
      hasError = true;
    }
    if (phoneNumbers.includes(phone)) {
      setErrorMessages((prev) => ({ ...prev, phone: "Phone Number is already in use" }));
      hasError = true;
    }

    // Validate required fields and format
    if (!name.trim()) {
      setErrorMessages((prev) => ({ ...prev, name: "Name is required" }));
      hasError = true;
    }
    if (!['Male', 'Female'].includes(gender)) {
      setErrorMessages((prev) => ({ ...prev, gender: "Gender must be Male or Female" }));
      hasError = true;
    }
    if (!email.match(/^\S+@\S+\.\S+$/) || !email) {
      setErrorMessages((prev) => ({ ...prev, email: "Please provide a valid email address" }));
      hasError = true;
    }
    if (!phone.match(/^((\+92)|0)(3[0-9]{2})[0-9]{7}$/)) {
      setErrorMessages((prev) => ({ ...prev, phone: "Phone number must be a valid Pakistani number" }));
      hasError = true;
    }

    if (hasError) {
      setSaving(false); 
      return;}

    try {
      const response = await fetch('http://localhost:5000/passengers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token if required
        },
        body: JSON.stringify(newPassenger), // Send the form data
      });

      if (!response.ok) {
        throw new Error('Failed to add passenger');
      }

      navigate('/passengers'); // Redirect to the list of passengers
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

        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            label="Gender"
            name="gender"
            value={newPassenger.gender}
            onChange={handleChange}
            error={!!errorMessages.gender}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
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
