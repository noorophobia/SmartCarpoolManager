import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom"; // Import Link to navigate to the details page

const Rides = () => {
  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 120 },
    { field: "pickUpLocation", headerName: "Pick-Up Location", width: 200 },
    { field: "dropOffLocation", headerName: "Drop-Off Location", width: 200 },
    { field: "rideMode", headerName: "Ride Mode", width: 150 },
    { field: "rideStatus", headerName: "Ride Status", width: 150 },
    
    {
      field: "passenger",
      headerName: "Passenger (ID)",
      flex: 1,  // Use flex instead of width for dynamic width
      minWidth: 150,  // Minimum width to ensure the column is readable
      renderCell: (params) => (
        <Link to={`/passenger-details/${params.value}`}>
          <Button variant="text" color="primary" size="small">
            {params.value}
          </Button>
        </Link>
      ),
    },
    {
      field: "driver",
      headerName: "Driver (ID)",
      flex: 1,  // Use flex for dynamic width
      minWidth: 100,  // Minimum width to ensure the button is not too small
      renderCell: (params) => (
        <Link to={`/driver-details/${params.value}`}>
          <Button variant="text" color="primary" size="small">
            {params.value}
          </Button>
        </Link>
      ),
    },
    
    {
      field: "viewDetails",
      headerName: "View Details",
      width: 200,
      renderCell: (params) => (
        <Link to={`/ride-details/${params.row.rideID}`}>
          <Button variant="contained" color="primary" size="small">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      rideID: "RIDE123",
      pickUpLocation: "Model Town",
      dropOffLocation: "Liberty Market",
      rideMode: "Carpool",
      rideStatus: "Ongoing",
      noOfPassengers: 3,
      paymentID: "PAY5678",
      amount: 150.0,
      paymentType: "Credit Card",
      paymentStatus: "Completed",
      passenger: "1",
      driver: "2",
    },
    {
      id: 2,
      rideID: "RIDE124",
      pickUpLocation: "DHA",
      dropOffLocation: "Gulberg",
      rideMode: "Single",
      rideStatus: "Completed",
      noOfPassengers: 1,
      paymentID: "PAY5679",
      amount: 500.0,
      paymentType: "Cash",
      paymentStatus: "Completed",
      passenger: "124",
      driver: "457",
    },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Rides</h1>
       </div>
      <div style={{ marginTop: "20px" }}>
        <Box sx={{ height: 500, width: "100%" }}>
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
            pageSizeOptions={[5, 10, 20]} // Allow users to choose 5, 10, or 20 records per page
            //checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default Rides;