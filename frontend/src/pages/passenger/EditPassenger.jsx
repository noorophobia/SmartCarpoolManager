import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../../styles/passengerDetails.css';
import EditPassengerService from '../../services/EditPassengerService';

const EditPassenger = () => {
  const id = localStorage.getItem('id');
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPassenger = async () => {
      try {
        const data = await EditPassengerService.getPassengerById(id);
        setPassenger(data);
        setImagePreview(data.imageUrl || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPassenger();
  }, [id, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassenger((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await EditPassengerService.updatePassenger(id, passenger, selectedFile);
      localStorage.setItem('id', id);
      navigate(`/passenger-details`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading"><CircularProgress /></div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="passenger-details-container">
      <h2 className="header">Edit Passenger Details</h2>
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
          value={passenger.name || ''}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          value={passenger.email || ''}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Phone Number"
          name="phone"
          value={passenger.phone || ''}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Gender"
          name="gender"
          value={passenger.gender || ''}
          onChange={handleChange}
          fullWidth
          required
        />

        <div>
          <Typography variant="h6">Photo</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: '50%', marginTop: 10, borderRadius: 8 }}
            />
          )}
        </div>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/passengers')}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default EditPassenger;
