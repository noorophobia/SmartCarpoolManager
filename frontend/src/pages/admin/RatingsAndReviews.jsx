import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const RatingsAndReviews = () => {
  // Mock data
  const rows = [
    {
      id: 1,
      rideID: "RIDE123",
      passengerID: "1",
      passengerName: "Ali Khan",
      passengerRating: 4.5,
      passengerReview: "Great experience!",
      driverID: "2",
      driverName: "John Doe",
      driverRating: 4.8,
      driverReview: "Smooth ride, friendly driver!",
    },
    {
      id: 2,
      rideID: "RIDE124",
      passengerID: "124",
      passengerName: "Sara Ahmed",
      passengerRating: 3.7,
      passengerReview: "Decent ride, could be better.",
      driverID: "457",
      driverName: "Emily Clark",
      driverRating: 4.2,
      driverReview: "Good passenger, but a bit late.",
    },
  ];

  // Columns for the DataGrid
  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 120 },
    { field: "passengerName", headerName: "Passenger Name", width: 180 },
    { field: "driverName", headerName: "Driver Name", width: 180 },
    {
      field: "passengerRating",
      headerName: "Passenger Rating",
      width: 180,
      type: "number",
    },
    {
      field: "driverRating",
      headerName: "Driver Rating",
      width: 180,
      type: "number",
    },
    {
      field: "passengerReview",
      headerName: "Passenger Review",
      width: 250,
    },
    {
      field: "driverReview",
      headerName: "Driver Review",
      width: 250,
    },
    
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Ratings and Reviews</h1>
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
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]} // Allow users to choose 5, 10, or 20 records per page
             disableRowSelectionOnClick
           
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            
          />
        </Box>
        </div>
            </div>
           
          );
        }
        
        export default RatingsAndReviews;
 