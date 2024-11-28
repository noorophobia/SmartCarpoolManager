import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import { startOfWeek } from 'date-fns';
import Box from "@mui/material/Box";

// Sample data for rides
const ridesData = [
  {
    id: 1,
    rideID: "RIDE123",
    pickUpLocation: "Model Town",
    dropOffLocation: "Liberty Market",
    date: "2024-11-25", // date of the ride
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  {
    id: 2,
    rideID: "RIDE124",
    pickUpLocation: "DHA",
    dropOffLocation: "Gulberg",
    date: "2024-11-28", // date of the ride
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
];

// Filter for rides of the current week
const filterWeeklyRides = () => {
  const startOfCurrentWeek = startOfWeek(new Date()); // Start of the current week
  return ridesData.filter(ride => new Date(ride.date) >= startOfCurrentWeek);
};

const WeeklyRevenue = () => {
  const filteredRides = filterWeeklyRides(); // Filtered weekly rides
  const totalWeeklyRevenue = filteredRides.reduce((acc, ride) => acc + ride.revenue, 0).toFixed(2); // Calculate weekly revenue

  const columns = [
    { field: 'rideID', headerName: 'Ride ID', width: 150 },
    { field: 'pickUpLocation', headerName: 'Pick-Up Location', width: 200 },
    { field: 'dropOffLocation', headerName: 'Drop-Off Location', width: 200 },
    { field: 'revenue', headerName: 'Revenue (Rs)', width: 150, type: 'number' },
  ];

  return (
    <div>
      {/* Weekly revenue card */}
      <Card sx={{ minWidth: 275, backgroundColor: "#d1ffd1" }}>
        <CardContent>
          <Typography variant="h6" component="div">Weekly Revenue</Typography>
          <Typography variant="h5">{totalWeeklyRevenue} Rs</Typography>
        </CardContent>
      </Card>

      {/* DataGrid table */}
      <Box sx={{ height: 500, width: "100%", marginTop: "20px" }}>
        <DataGrid
          rows={filteredRides} // Pass filtered rides to DataGrid
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </Box>
    </div>
  );
};

export default WeeklyRevenue;
