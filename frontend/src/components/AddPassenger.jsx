import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, MenuItem, Paper, Box, Typography, Alert } from '@mui/material';

const AddEditDriver = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ratings, setRatings] = useState(0);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams(); // Get the driver ID from URL params (if editing)
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch the driver data if editing
      const fetchDriver = async () => {
        try {
          const response = await fetch(`http://localhost:5000/drivers/${id}`);
          const data = await response.json();
          setName(data.name);
          setEmail(data.email);
          setPhoneNumber(data.phoneNumber);
          setCnic(data.cnic);
          setGender(data.gender);
          setDateOfBirth(data.dateOfBirth.split('T')[0]);
          setRatings(data.ratings || 0);
          setIsEditing(true);
        } catch (error) {
          console.error('Failed to fetch driver:', error);
        }
      };
      fetchDriver();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    // Validation logic
    if (!name.trim()) {
      setError('Name is required and cannot be empty.');
      return;
    }
    if (!['Male', 'Female'].includes(gender)) {
      setError('Gender must be either "Male" or "Female".');
      return;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!phoneNumber.match(/^((\+92)|0)(3[0-9]{2})[0-9]{7}$/)) {
      setError('Phone number must be a valid Pakistani number.');
      return;
    }
    if (!cnic.match(/^\d{5}-\d{7}-\d{1}$/)) {
      setError('CNIC must be in the format XXXXX-XXXXXXX-X.');
      return;
    }
    if (!dateOfBirth) {
      setError('Date of Birth is required.');
      return;
    }

    const newDriver = { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings };

    try {
      let response;
      if (isEditing) {
        response = await fetch(`http://localhost:5000/drivers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDriver),
        });
      } else {
        response = await fetch('http://localhost:5000/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDriver),
        });
      }

      const result = await response.json();
      if (response.ok) {
        navigate('/drivers'); // Navigate back to drivers list page after success
      } else {
        setError(result.message || 'Error saving driver. Please try again.');
      }
    } catch (error) {
      console.error('Error saving driver:', error);
      setError('Error saving driver. Please try again.');
    }
  };

  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5); // Insert first hyphen
    if (value.length > 14) value = value.slice(0, 14); // Limit to 13 characters
    if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13); // Insert second hyphen
    setCnic(value); // Update CNIC value
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {isEditing ? 'Edit Driver' : 'Add New Driver'}
        </Typography>

        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Gender"
            variant="outlined"
            fullWidth
            select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            margin="normal"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            type="tel"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="normal"
          />
          <TextField
            label="CNIC"
            variant="outlined"
            fullWidth
            value={cnic}
            onChange={handleCnicChange}
            margin="normal"
          />
          <TextField
            label="Date of Birth"
            variant="outlined"
            type="date"
            fullWidth
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button color="secondary" onClick={() => navigate('/drivers')} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Update Driver' : 'Add Driver'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddEditDriver;
