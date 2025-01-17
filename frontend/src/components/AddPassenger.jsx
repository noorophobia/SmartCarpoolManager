import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../styles/passengerDetails.css';

const AddPassenger = () => {
  const navigate = useNavigate();
  const [newPassenger, setNewPassenger] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
  });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPassenger((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('name', newPassenger.name);
    formData.append('email', newPassenger.email);
    formData.append('phoneNumber', newPassenger.phone);
    formData.append('gender', newPassenger.gender);
    formData.append('password', newPassenger.gender);

    if (selectedFile) {
      formData.append('photo', selectedFile); // Append the selected file
    }

    try {
      const response = await fetch('http://localhost:5000/passengers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={newPassenger.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Phone Number"
          name="phone"
          value={newPassenger.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Gender"
          name="gender"
          value={newPassenger.gender}
          onChange={handleChange}
          fullWidth
        />
        <div>
          <Typography variant="h6">Photo</Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: '100%', marginTop: 10, borderRadius: 8 }}
            />
          )}
        </div>
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
