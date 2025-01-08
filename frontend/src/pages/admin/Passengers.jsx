import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import '../../styles/tables.css'; // Keeping your original styles
import { useNavigate } from 'react-router-dom';

const Passengers = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track whether we are editing or adding
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
  });

  const handleViewDetails = (id) => {
    navigate(`/passenger-details/${id}`);
  };

  const handleEdit = (passenger) => {
    setIsEditing(true);
    setFormData({
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      email: passenger.email,
      phoneNumber: passenger.phoneNumber,
      gender: passenger.gender,
    });
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    alert(`Delete row with ID: ${id}`);
    // Add your delete functionality here
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: 'Male',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormErrors({});  // Reset form errors

  };

  const handleSubmit = () => {
    // Validate the form fields
    const errors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[+]?[0-9]{10,13}$/;

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number format';
    }
    if (!formData.gender) errors.gender = 'Gender is required';

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (isEditing) {
        // Edit logic
        alert(`Updated Passenger: ${JSON.stringify(formData)}`);
      } else {
        // Add new passenger logic
        alert(`Added New Passenger: ${JSON.stringify(formData)}`);
      }
      handleCloseDialog();
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: false, // Make it editable if required
    },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
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
            onClick={() => handleEdit(params.row.id)}
          >
            <img
              src="/edit_icon.svg"
              alt="Edit Button"
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
              }}
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
              src="/delete_icon.svg"
              alt="Delete Button"
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
              }}
            />
          </Button>
        </div>
      ),
    },
  ];

  columns.forEach((column) => (column.align = 'center'));
  columns.forEach((column) => (column.headerAlign = 'center'));

  const rows = [
    {
      id: 1,
      lastName: 'Snow',
      firstName: 'Jon',
      email: 'someone@gmail.com',
      totalRides: 2,
      completedRides: 2,
      cancelledRides: 0,
      phoneNumber: '+1234567890',
      ratings: 3.5,
      gender: 'Female',
    },
    {
      id: 2,
      lastName: 'Lannister',
      firstName: 'Cersei',
      email: 'someone2@gmail.com',
      totalRides: 2,
      completedRides: 1,
      cancelledRides: 1,
      phoneNumber: '+1234364890',
      ratings: 5,
      gender: 'Male',
    },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Passengers</h1>
        <button className="button" onClick={handleAddNew}>Add New Passenger</button>
      </div>
      <div>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        </Box>
        
        {/* Add/Edit Passenger Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{isEditing ? 'Edit Passenger' : 'Add New Passenger'}</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                error={!!formErrors.gender}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
              {formErrors.gender && <div style={{ color: 'red', fontSize: '12px' }}>{formErrors.gender}</div>}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary">{isEditing ? 'Save Changes' : 'Add Passenger'}</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Passengers;
