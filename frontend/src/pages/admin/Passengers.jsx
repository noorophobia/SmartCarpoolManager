import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'; // Import Link for routing
import '../../styles/tables.css';
import { useNavigate } from 'react-router-dom';

const Passengers = () => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/passenger-details/${id}`);
  };
  const handleEdit = (id) => {
    alert(`Edit row with ID: ${id}`);
    // Add your edit functionality here
  };

  const handleDelete = (id) => {
    alert(`Delete row with ID: ${id}`);
    // Add your delete functionality here
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
      width: 150, // Increase width if needed to accommodate both buttons
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}> {/* Add gap between buttons */}
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
              src="/edit_icon.svg" // Replace with the actual path to the edit icon
              alt="Edit Button"
              style={{
                width: '30px', // Adjust the size of the image
                height: '30px',
                objectFit: 'contain', // Ensure the image fits within the button
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

  columns.forEach((column) => (column.align = 'center')); // Set all columns to 'center' alignment
  columns.forEach((column) => (column.headerAlign = 'center')); // Set all columns to 'center' alignment

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
    // More rows...
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Passengers</h1>
        <button className="button">Add new User</button>
      </div>
      <div>
        <div style={{ marginTop: '20px' }}>
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
              pageSizeOptions={[5, 10, 20]} // Allow users to choose 5, 10, or 20 records per page
              checkboxSelection
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Passengers;
