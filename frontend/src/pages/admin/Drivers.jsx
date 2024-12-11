import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import '../../styles/tables.css';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]); // State to hold the fetched drivers data
  const [open, setOpen] = useState(false); // State for opening and closing the dialog
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [cnic,setcnic]=useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch drivers data from the Express server when the component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5000/drivers');
        const data = await response.json();
        
        // Map the MongoDB _id to id for the DataGrid
        const mappedData = data.map(driver => ({
          id: driver.id,  // Map _id to id
          name: driver.name,
          gender: driver.gender,
          email: driver.email,
          phoneNumber: driver.phoneNumber,
        }));

        setDrivers(mappedData); // Update state with the mapped data
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    fetchDrivers(); // Call the function to fetch data
  }, []);

  // Handle navigation to the driver's details page
  const handleViewDetails = (id) => {
    navigate(`/drivers/${id}`);
  };

  // Handle opening the dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handle closing the dialog box
  const handleClose = () => {
    setOpen(false);
    setError(''); // Clear error message on close
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
  
    // Validation for each field
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
      setError(
        'Phone number must be a valid Pakistani number in the format +92XXXXXXXXXX or 03XXXXXXXXX.'
      );
      return;
    }
    if (!cnic.match(/^\d{5}-\d{7}-\d{1}$/)) {
      setError('CNIC must be in the format XXXXX-XXXXXXX-X.');
      return;
    }
  
    const newDriver = { name, gender, email, phoneNumber, cnic };
  
    try {
      const response = await fetch('http://localhost:5000/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setDrivers([...drivers, result]); // Add the new driver to the state
        handleClose(); // Close the dialog
        setName('');
        setGender('');
        setcnic('');
        setEmail('');
        setPhoneNumber('');
      } else {
        setError(result.message || 'Error adding driver. Please try again.');
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      setError('Error adding driver. Please try again.');
    }
  };
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleViewDetails(params.row.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Drivers</h1>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add New Driver
        </Button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={drivers} // Use the mapped data here
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>

      {/* Add New Driver Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />
           <div>
  <label>Gender</label>
  <div>
    <input
      type="radio"
      value="Male"
      checked={gender === 'Male'}
      onChange={() => setGender('Male')}
    /> Male
    <input
      type="radio"
      value="Female"
      checked={gender === 'Female'}
      onChange={() => setGender('Female')}
    /> Female
  </div>
</div>

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
              type="outlined"
              fullWidth
              value={cnic}
              onChange={(e) => setcnic(e.target.value)}
              margin="normal"
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Add Driver
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Drivers;
