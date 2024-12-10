import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Card, CardContent, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { startOfWeek, startOfMonth, startOfYear, isWithinInterval, subDays, subWeeks, subMonths } from "date-fns";
import Box from "@mui/material/Box";

// Sample data for rides
const ridesData = [
  {
    id: 1,
    rideID: "RIDE123",
    pickUpLocation: "Model Town",
    dropOffLocation: "Liberty Market",
    date: "2024-11-28",
    rideStatus:"completed",
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  {
    id: 2,
    rideID: "RIDE124",
    pickUpLocation: "DHA",
    dropOffLocation: "Gulberg",
    rideStatus:"completed",

    date: "2024-11-28",
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  {
    id: 3,
    rideID: "RIDE125",
    pickUpLocation: "DHA",
    dropOffLocation: "Liberty Market",
    rideStatus:"completed",

    date: "2024-11-01",
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  // Add more rides as needed
];

const Revenue = () => {
  const [filter, setFilter] = useState("all"); // Default filter to show all data

  // Function to filter rides based on the selected filter (daily, weekly, or monthly)
  const filterRides = (filter) => {
    const currentDate = new Date();

    switch (filter) {
      case "daily":
        return ridesData.filter((ride) => isWithinInterval(new Date(ride.date), { start: subDays(currentDate, 1), end: currentDate }));
      case "weekly":
        return ridesData.filter((ride) => isWithinInterval(new Date(ride.date), { start: subWeeks(currentDate, 1), end: currentDate }));
      case "monthly":
        return ridesData.filter((ride) => isWithinInterval(new Date(ride.date), { start: subMonths(currentDate, 1), end: currentDate }));
      default:
        return ridesData; // No filter, show all data
    }
  };

  const filteredRides = filterRides(filter);

  // Calculate total rides, completed rides, cancelled rides and revenue
  const totalRides = filteredRides.length;
  const completedRides = filteredRides.filter((ride) => ride.rideStatus === "Completed").length;
  const cancelledRides = filteredRides.filter((ride) => ride.rideStatus === "Cancelled").length;
  const totalRevenue = filteredRides.reduce((acc, ride) => acc + ride.revenue, 0).toFixed(2);

  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 150 },
    { field: "pickUpLocation", headerName: "Pick-Up Location", width: 200 },
    { field: "dropOffLocation", headerName: "Drop-Off Location", width: 200 },
    { field: "rideStatus", headerName: "Ride Status", width: 150 },
    { field: "date", headerName: "Date ", width: 150 },

    { field: "revenue", headerName: "Revenue (Rs)", width: 150, type: "number" },
  ];
  columns.forEach(column => column.align = 'center'); // Set all columns to 'center' alignment
  columns.forEach(column => column.headerAlign = 'center'); // Set all columns to 'center' alignment
   
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
      </div> {/* Filter Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 ,background:"white"}}>
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter By"
            fullWidth
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </div>


      <div style={{ marginTop: '20px' }}>
        {/* DataGrid Table */}
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            className="dataGrid"
            rows={filteredRides}
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
