import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const PendingApplications = () => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/drivers/${id}`);
  };

  const handleEdit = (id) => {
    alert(`Accept row with ID: ${id}`);
    // Add your accept functionality here
  };

  const handleDelete = (id) => {
    alert(`Reject row with ID: ${id}`);
    // Add your reject functionality here
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
     { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'cnic', headerName: 'CNIC', width: 150 },
     // Added a new column for View Details
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
      width: 250,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={1.5}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleEdit(params.row.id)}
            style={{ marginRight: 8 }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  columns.forEach((column) => (column.align = 'center')); // Set all columns to 'center' alignment
  columns.forEach((column) => (column.headerAlign = 'center')); // Set all headers to 'center' alignment

  const rows = [
    {
      id: 1,
      name: 'John Doe',
      gender: 'Male',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      cnic: '12345-1234567-1',
      dateOfBirth: '1990-05-15',
    },
    // Add more rows as needed
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Pending Driver Applications</h1>
       </div>
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
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default PendingApplications;
