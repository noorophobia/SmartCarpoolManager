import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import { startOfMonth, endOfMonth } from 'date-fns';
import Box from "@mui/material/Box";

// Sample data for rides
const ridesData = [
  {
    id: 1,
    rideID: "RIDE123",
    pickUpLocation: "Model Town",
    dropOffLocation: "Liberty Market",
    date: "2023-03-10", // Date in March
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  {
    id: 2,
    rideID: "RIDE124",
    pickUpLocation: "DHA",
    dropOffLocation: "Gulberg",
    date: "2023-03-17", // Date in March
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
  {
    id: 3,
    rideID: "RIDE125",
    pickUpLocation: "Bahria Town",
    dropOffLocation: "Faisal Town",
    date: "2023-02-10", // Date in February (this will be excluded)
    revenue: 738.8 * 0.05, // 5% of total ride cost
  },
];

// Filter for rides within the current month
const filterMonthlyRides = () => {
  const startOfCurrentMonth = startOfMonth(new Date());
  const endOfCurrentMonth = endOfMonth(new Date());

  return ridesData.filter(
    (ride) =>
      new Date(ride.date) >= startOfCurrentMonth && new Date(ride.date) <= endOfCurrentMonth
  );
};

const MonthlyRevenue = () => {
  const filteredRides = filterMonthlyRides();
  const totalMonthlyRevenue = filteredRides.reduce((acc, ride) => acc + ride.revenue, 0).toFixed(2);

  const columns = [
    { field: 'rideID', headerName: 'Ride ID', width: 150 },
    { field: 'pickUpLocation', headerName: 'Pick-Up Location', width: 200 },
    { field: 'dropOffLocation', headerName: 'Drop-Off Location', width: 200 },
    { field: 'revenue', headerName: 'Revenue (Rs)', width: 150, type: 'number' },
  ];

  return (
    <div>
      <Card sx={{ minWidth: 275, backgroundColor: "#d1e7fd" }}>
        <CardContent>
          <Typography variant="h6" component="div">Monthly Revenue</Typography>
          <Typography variant="h5">{totalMonthlyRevenue} Rs</Typography>
        </CardContent>
      </Card>

      <Box sx={{ height: 500, width: "100%", marginTop: "20px" }}>
        <DataGrid rows={filteredRides} columns={columns} pageSize={5} checkboxSelection />
      </Box>
    </div>
  );
};

export default MonthlyRevenue;
