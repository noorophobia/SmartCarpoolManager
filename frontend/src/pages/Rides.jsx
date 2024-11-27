import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import UserDetails from '../components/UserDetails'
const Rides = () => {
  const columns = [
    { field: 'rideID', headerName: 'Ride ID', width: 120 },
    { field: 'pickUpLocation', headerName: 'Pick-Up Location', width: 200 },
    { field: 'dropOffLocation', headerName: 'Drop-Off Location', width: 200 },
    { field: 'rideMode', headerName: 'Ride Mode', width: 150 },
    { field: 'rideStatus', headerName: 'Ride Status', width: 150 },
    { field: 'noOfPassengers', headerName: 'Passengers', width: 150 },
    { field: 'paymentID', headerName: 'Payment ID', width: 150 },
    { field: 'amount', headerName: 'Amount (Rs)', type: 'number', width: 150 },
    { field: 'paymentType', headerName: 'Payment Type', width: 150 },
    { field: 'paymentStatus', headerName: 'Payment Status', width: 150 },
    {
      field: 'passenger',
      headerName: 'Passenger (ID)',
      width: 250,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          component={Link}
          to={`/details/passenger/${params.value}`}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: 'driver',
      headerName: 'Driver (ID)',
      width: 250,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          component={Link}
          to={`/details/driver/${params.value}`}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => alert(`Edit row with ID: ${params.row.rideID}`)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => alert(`Delete row with ID: ${params.row.rideID}`)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      rideID: 'RIDE123',
      pickUpLocation: 'Model Town',
      dropOffLocation: 'Liberty Market',
      rideMode: 'Carpool',
      rideStatus: 'Ongoing',
      noOfPassengers: 3,
      paymentID: 'PAY5678',
      amount: 150.0,
      paymentType: 'Credit Card',
      paymentStatus: 'Completed',
      passenger: '1',
      driver: '2',
    },
    {
      id: 2,
      rideID: 'RIDE124',
      pickUpLocation: 'DHA',
      dropOffLocation: 'Gulberg',
      rideMode: 'Single',
      rideStatus: 'Completed',
      noOfPassengers: 1,
      paymentID: 'PAY5679',
      amount: 500.0,
      paymentType: 'Cash',
      paymentStatus: 'Completed',
      passenger: '124',
      driver: '457',
    },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Rides</h1>
        <button className="button">Add New Ride</button>
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
            pageSizeOptions={[5, 10, 20]} // Allow users to choose 5, 10, or 20 records per page
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default Rides;
