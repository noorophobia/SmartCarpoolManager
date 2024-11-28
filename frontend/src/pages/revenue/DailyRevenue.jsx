import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import { format } from 'date-fns';
import Box from "@mui/material/Box";

// Sample data for rides
const ridesData = [
  {
    id: 1,
    rideID: "RIDE123",
    pickUpLocation: "Model Town",
    dropOffLocation: "Liberty Market",
    date: "2024-11-28",
    revenue: 738.8 * 0.05,
  },
  {
    id: 2,
    rideID: "RIDE124",
    pickUpLocation: "DHA",
    dropOffLocation: "Gulberg",
    date: "2024-11-28",
    revenue: 738.8 * 0.05,
  },
];

// Filter for today's rides
const filterDailyRides = () => {
  const today = new Date();
  return ridesData.filter(ride => format(new Date(ride.date), "yyyy-MM-dd") === format(today, "yyyy-MM-dd"));
};

const DailyRevenue = () => {
  const filteredRides = filterDailyRides();
  const totalDailyRevenue = filteredRides.reduce((acc, ride) => acc + ride.revenue, 0).toFixed(2);

  const columns = [
    { field: 'rideID', headerName: 'Ride ID', width: 150 },
    { field: 'pickUpLocation', headerName: 'Pick-Up Location', width: 200 },
    { field: 'dropOffLocation', headerName: 'Drop-Off Location', width: 200 },
    { field: 'revenue', headerName: 'Revenue (Rs)', width: 150, type: 'number' },
  ];

  return (
    <div>
      <Card sx={{ minWidth: 275, backgroundColor: "#ffcccc" }}>
        <CardContent>
          <Typography variant="h6" component="div">Daily Revenue</Typography>
          <Typography variant="h5">{totalDailyRevenue} Rs</Typography>
        </CardContent>
      </Card>

      <Box sx={{ height: 500, width: "100%", marginTop: "20px" }}>
        <DataGrid rows={filteredRides} columns={columns} pageSize={5} checkboxSelection />
      </Box>
    </div>
  );
};

export default DailyRevenue;
