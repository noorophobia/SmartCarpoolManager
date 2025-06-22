import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import "../../styles/tables.css";

import { fetchYearlyRevenueData } from "../../services/yearlyRevenueService"; // ✅ Import service

const YearlyRevenue = () => {
  const [ridesData, setRidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await fetchYearlyRevenueData(token);
        setRidesData(data);

        const yearsInData = [
          ...new Set(
            data
              .filter((ride) => ride.date)
              .map((ride) => new Date(ride.date).getFullYear())
          ),
        ].sort((a, b) => b - a);

        const stats = yearsInData.map((year) => calculateYearlyStats(data, year));
        setYearlyStats(stats);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [token]);

  const calculateYearlyStats = (data, year) => {
    const yearRides = data.filter((ride) => {
      const rideDate = new Date(ride.date);
      return rideDate.getFullYear() === year;
    });

    const totalRides = yearRides.length;
    const completedRides = yearRides.filter((r) => r.rideStatus === "Completed").length;
    const cancelledRides = yearRides.filter((r) => r.rideStatus === "Cancelled").length;
    const totalRevenue = yearRides.reduce((acc, r) => acc + (r.revenue || 0), 0).toFixed(2);

    const uniqueDrivers = new Set(yearRides.map((r) => r.driverID));
    const uniquePassengers = new Set(yearRides.map((r) => r.passengerID));

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

  const columns = [
    { field: "year", headerName: "Year", width: 150 },
    { field: "totalRides", headerName: "Total Rides", width: 150 },
    { field: "completedRides", headerName: "Completed Rides", width: 180 },
    { field: "cancelledRides", headerName: "Cancelled Rides", width: 180 },
    { field: "totalRevenue", headerName: "Revenue (Rs)", width: 160, type: "number" },
    { field: "totalDrivers", headerName: "Total Active Drivers ", width: 150 },
    { field: "totalPassengers", headerName: "Total Active Passengers", width: 170 },
  ];

  columns.forEach((column) => {
    column.align = "center";
    column.headerAlign = "center";
  });

  return (
    <div className="main-content_revenue">
      <div className="header">
        <h1>Yearly Rides Revenue Report</h1>
      </div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : (
        <Box sx={{ height: 500, width: "100%", backgroundColor: "#ffffff" }}>
          <DataGrid
            className="dataGrid"
            rows={yearlyStats}
            columns={columns}
            getRowId={(row) => row.year}
            pageSize={5}
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </div>
  );
};

export default YearlyRevenue;
