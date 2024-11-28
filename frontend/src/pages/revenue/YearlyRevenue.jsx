import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import { startOfYear } from 'date-fns';
import Box from "@mui/material/Box";

// Sample data for rides
const ridesData = [
  {
    id: 1,
    rideID: "RIDE123",
    pickUpLocation: "Model Town",
    dropOffLocation: "Liberty Market",
    date: "2024-11-28",
    rideStatus: "Completed",
    passengerID: "1",
    driverID: "2",
    revenue: 738.8 * 0.05,
  },
  {
    id: 2,
    rideID: "RIDE124",
    pickUpLocation: "DHA",
    dropOffLocation: "Gulberg",
    date: "2023-11-01",
    rideStatus: "Cancelled",
    passengerID: "124",
    driverID: "457",
    revenue: 738.8 * 0.05,
  },
  // Add more rides as needed
];

// Function to calculate yearly stats for a specific year
const calculateYearlyStats = (filteredRides, year) => {
  const yearRides = filteredRides.filter((ride) => new Date(ride.date).getFullYear() === year);
  
  const totalRides = yearRides.length;
  const completedRides = yearRides.filter((ride) => ride.rideStatus === "Completed").length;
  const cancelledRides = yearRides.filter((ride) => ride.rideStatus === "Cancelled").length;
  const totalRevenue = yearRides.reduce((acc, ride) => acc + ride.revenue, 0).toFixed(2);

  // Track unique drivers and passengers
  const uniqueDrivers = new Set(yearRides.map((ride) => ride.driverID));
  const uniquePassengers = new Set(yearRides.map((ride) => ride.passengerID));

  return {
  
    year,
    totalRides,
    completedRides,
    cancelledRides,
    totalRevenue,
    totalDrivers: uniqueDrivers.size,
    totalPassengers: uniquePassengers.size,
  };
};

const YearlyRevenue = () => {
  const columns = [
    { field: 'id', headerName: 'Id', width: 90 },

    { field: 'year', headerName: 'Year', width: 150 },
    { field: 'totalRides', headerName: 'Total Rides', width: 180 },
    { field: 'completedRides', headerName: 'Completed Rides', width: 180 },
    { field: 'cancelledRides', headerName: 'Cancelled Rides', width: 180 },
    { field: 'totalRevenue', headerName: 'Revenue (Rs)', width: 180, type: 'number' },
    { field: 'totalDrivers', headerName: 'Total Drivers', width: 180 },
    { field: 'totalPassengers', headerName: 'Total Passengers', width: 180 },
  ];

  // Process ridesData for both 2023 and 2024
  const ridesDataForYear = [2023, 2024].map((year) =>
    calculateYearlyStats(ridesData, year)
  );

  return (
    <div>
      <Typography variant="h6" component="div" style={{ marginBottom: "20px" }}>
        Yearly Revenue Report
      </Typography>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={ridesDataForYear}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default YearlyRevenue;
