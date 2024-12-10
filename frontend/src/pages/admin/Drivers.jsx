import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import '../../styles/tables.css';

const Drivers = () => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/drivers/${id}`); // Navigate to the detailed page with the driver ID
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

  const rows = [
    {
      id: 1,
      name: 'John Doe',
      gender: 'Male',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      ratings: 4,
      completedRides: 2,
      cancelledRides: 0,
    },
    // Add more rows as needed
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Drivers</h1>
        <button className="button">Add New Driver</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default Drivers;
