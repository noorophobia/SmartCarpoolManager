import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';  
import TextField from '@mui/material/TextField';
import '../../styles/tables.css';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]); // State to hold the fetched drivers data
  const [open, setOpen] = useState(false); // State for opening and closing the dialog
  const [isEditing, setIsEditing] = useState(false); // Flag for edit mode
  const [driverToEdit, setDriverToEdit] = useState(null); // Store driver data when editing
  const [name, setName] = useState('');
  const [emails, setEmails] = useState([]); // Store all the emails
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]); // Store all phone numbers
  const [cnics, setCnics] = useState([]); // Store all CNICs
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // State for Date of Birth
  const [ratings, setRatings] = useState(0); // Default rating set to 0
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch drivers data from the Express server when the component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5000/drivers');
        const data = await response.json();
        
        const mappedData = data.map(driver => ({
          id: driver._id,
          name: driver.name,
          gender: driver.gender,
          email: driver.email,
          phoneNumber: driver.phoneNumber,
          cnic:driver.cnic,
          dateOfBirth:driver.dateOfBirth,
        }));

        setDrivers(mappedData); // Update state with the mapped data
        
        const driverEmails = data.map(driver => driver.email);
        const driverPhoneNumbers = data.map(driver => driver.phoneNumber);
        const driverCnics = data.map(driver => driver.cnic);

        setEmails(driverEmails);
        setPhoneNumbers(driverPhoneNumbers);
        setCnics(driverCnics);
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
    setIsEditing(false);
  };

 // Handle closing the dialog box
const handleClose = () => {
  setOpen(false);
  setError(''); // Clear error message on close
  setIsEditing(false); // Reset the editing flag
  setDriverToEdit(null); // Clear the driver being edited
  setName('');
  setGender('');
  setCnic('');
  setEmail('');
  setPhoneNumber('');
  setDateOfBirth('');
  setRatings(0);
};


  // Handle opening the dialog in edit mode
  const handleEdit = (id) => {
    const driver = drivers.find(d => d.id === id);
    setDriverToEdit(driver); // Store the driver data to be edited
    setName(driver.name);
    setEmail(driver.email);
    setPhoneNumber(driver.phoneNumber);
    setCnic(driver.cnic);
    setGender(driver.gender);
    setDateOfBirth(driver.dateOfBirth ? driver.dateOfBirth.split('T')[0] : ''); // Format to YYYY-MM-DD
    setRatings(driver.ratings || 0); // Set default ratings if not present
    setOpen(true);
    setIsEditing(true); // Set edit mode to true
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
  
    // Validation logic (same as before)
    if (!name.trim()) {
      setError('Name is required and cannot be empty.');
      return;
    }
    if (!['Male', 'Female'].includes(gender)) {
      setError('Gender must be either "Male" or "Female".');
      return;
    }
    if(!isEditing){
    if (emails.includes(email)) {
      setError('Email is already in use. Please choose another email.');
      return;
    }
    if (phoneNumbers.includes(phoneNumber)) {
      setError('Phone number is already in use. Please choose another phone number.');
      return;
    }
    if (cnics.includes(cnic)) {
      setError('CNIC is already in use. Please choose another CNIC.');
      return;
    }
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
    if (!dateOfBirth) {
      setError('Date of Birth is required.');
      return;
    }

    const newDriver = { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings };

    try {
      let response;
      if (isEditing) {
        // If editing, update the driver
        response = await fetch(`http://localhost:5000/drivers/${driverToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDriver),
        });
      } else {
        // If adding new, create the driver
        response = await fetch('http://localhost:5000/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDriver),
        });
      }

      const result = await response.json();

      if (response.ok) {
        if (isEditing) {
          // Update existing driver in the list
          const updatedDrivers = drivers.map(driver =>
            driver.id === driverToEdit.id ? { ...driver, ...newDriver } : driver
          );
          setDrivers(updatedDrivers);
        } else {
          // Add new driver to the list
          setDrivers([...drivers, result]);
        }
        handleClose(); // Close the dialog
        setName('');
        setGender('');
        setCnic('');
        setEmail('');
        setPhoneNumber('');
        setDateOfBirth('');
        setRatings(0);
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
   // Handle delete action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this driver?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/drivers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setDrivers(drivers.filter(driver => driver.id !== id)); // Remove the deleted driver from state
        } else {
          alert('Failed to delete driver.');
        }
      } catch (error) {
        console.error('Error deleting driver:', error);
        alert('Error deleting driver.');
      }
    }
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    {
      field: 'viewDetails',
      headerName: 'View Details',
      width: 180,
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button
            style={{ padding: 0, minWidth: '40px', height: '40px', backgroundColor: 'transparent' }}
            onClick={() => handleEdit(params.row.id)}
          >
            <img
              src="/edit_icon.svg"
              alt="Edit Button"
              style={{ width: '30px', height: '30px', objectFit: 'contain' }}
            />
          </Button>
          <Button
            style={{
              padding: 0,
              minWidth: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => handleDelete(params.row.id)}
          >
            <img
              src="/delete_icon.svg" // Replace with the actual path to the delete icon
              alt="Delete Button"
              style={{
                width: '30px', // Adjust the size of the image
                height: '30px',
                objectFit: 'contain', // Ensure the image fits within the button
              }}
            />
          </Button>
        </div>
      ),
    }
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
            rows={drivers}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>

      {/* Add/Edit Driver Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
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
              InputLabelProps={{
                shrink: true,
              }}
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? 'Update Driver' : 'Add Driver'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Drivers;
