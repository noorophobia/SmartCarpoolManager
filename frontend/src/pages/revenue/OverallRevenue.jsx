import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { shouldQuickFilterExcludeHiddenColumns } from '@mui/x-data-grid/hooks/features/filter/gridFilterUtils';
import '../../styles/tables.css'

// Sample data for rides
const ridesData = [
  {
    id: 1,
    rideID: "RIDE123",
    pickUpLocation: "Model Town",
    dropOffLocation: "Liberty Market",
    distance: 7.9,
    time: 12,
    rideStatus: "Completed",
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  {
    id: 2,
    rideID: "RIDE124",
    pickUpLocation: "DHA",
    dropOffLocation: "Gulberg",
    distance: 2.8,
    time: 6,
    rideStatus: "Cancelled",
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  // Add more rides as needed
];

const Revenue = () => {
  // Calculate total rides, completed rides, cancelled rides and revenue
  const totalRides = ridesData.length;
  const completedRides = ridesData.filter((ride) => ride.rideStatus === "Completed").length;
  const cancelledRides = ridesData.filter((ride) => ride.rideStatus === "Cancelled").length;
  const totalRevenue = ridesData.reduce((acc, ride) => acc + ride.revenue, 0).toFixed(2);

  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 150 },
    { field: "pickUpLocation", headerName: "Pick-Up Location", width: 200 },
    { field: "dropOffLocation", headerName: "Drop-Off Location", width: 200 },
    { field: "rideStatus", headerName: "Ride Status", width: 150 },
    { field: "revenue", headerName: "Revenue (Rs)", width: 150, type: "number" },
  ];

  return (
    <div className="main-content_revenue">
      <div className="header">
        <h1>Rides Revenue Report</h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <Card sx={{ minWidth: 275, backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h6" component="div">Total Rides</Typography>
            <Typography variant="h5">{totalRides}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, backgroundColor: "#d1ffd1" }}>
          <CardContent>
            <Typography variant="h6" component="div">Completed Rides</Typography>
            <Typography variant="h5">{completedRides}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, backgroundColor: "#ffcccc" }}>
          <CardContent>
            <Typography variant="h6" component="div">Cancelled Rides</Typography>
            <Typography variant="h5">{cancelledRides}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, backgroundColor: "#d1e7fd" }}>
          <CardContent>
            <Typography variant="h6" component="div">Total Revenue</Typography>
            <Typography variant="h5">{totalRevenue} Rs</Typography>
          </CardContent>
        </Card>
      </div>
      <div style={{ marginTop: '20px' }}>

      {/* DataGrid Table */}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid     className="dataGrid"

          rows={ridesData}
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
};

export default Revenue;
