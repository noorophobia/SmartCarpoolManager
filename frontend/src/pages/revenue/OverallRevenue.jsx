import { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbar
} from "@mui/x-data-grid";
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  subWeeks,
  subMonths,
  isWithinInterval
} from "date-fns";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../../styles/tables.css';

import { fetchRevenueData } from "../../services/revenueService"; // Import service

const Revenue = () => {
  const [filter, setFilter] = useState("all");
  const [revenueData, setRevenueData] = useState([]);
  const [totalRides, setTotalRides] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);
  const [cancelledRides, setCancelledRides] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    const data = await fetchRevenueData(token);
    setRevenueData(data);
  };

  const filterRides = () => {
    const currentDate = new Date();

    switch (filter) {
      case "daily":
        return revenueData.filter((ride) => {
          if (!ride.date) return false;
          const rideDate = new Date(ride.date);
          return (
            rideDate.getFullYear() === currentDate.getFullYear() &&
            rideDate.getMonth() === currentDate.getMonth() &&
            rideDate.getDate() === currentDate.getDate()
          );
        });
      case "weekly":
        return revenueData.filter((ride) =>
          ride.date && isWithinInterval(new Date(ride.date), {
            start: subWeeks(currentDate, 1),
            end: currentDate
          })
        );
      case "monthly":
        return revenueData.filter((ride) =>
          ride.date && isWithinInterval(new Date(ride.date), {
            start: subMonths(currentDate, 1),
            end: currentDate
          })
        );
      default:
        return revenueData;
    }
  };

  const filteredRides = filterRides();

  useEffect(() => {
    const completed = filteredRides.filter((ride) => ride.rideStatus === "completed");
    const cancelled = filteredRides.filter((ride) => ride.rideStatus === "cancelled");

    setTotalRides(filteredRides.length);
    setCompletedRides(completed.length);
    setCancelledRides(cancelled.length);
    setTotalRevenue(
      filteredRides.reduce((acc, ride) => acc + (ride.revenue || 0), 0).toFixed(2)
    );
  }, [revenueData, filter]);

  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 150 },
    {
      field: "driverCompositeId", headerName: "Driver ID", width: 200,
      renderCell: (params) => (
        <Link to={`/drivers/${params.row.driverID}`}>
          <Button variant="text" color="primary" size="small">
            {params.value}
          </Button>
        </Link>
      ),
    },
    { field: "rideStatus", headerName: "Ride Status", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "mode", headerName: "Ride Mode", width: 150 },
    { field: "fare", headerName: "Ride Fare", width: 150 },
    {
      field: "revenue",
      headerName: "Revenue (Rs)",
      width: 150,
      type: "number"
    }
  ];

  columns.forEach(column => {
    column.align = "center";
    column.headerAlign = "center";
  });

  return (
    <div className="main-content_revenue">
      <div className="header">
        <h1>Rides Revenue Report</h1>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <Card sx={{ minWidth: 275, backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h6">Total Rides</Typography>
            <Typography variant="h5">{totalRides}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, backgroundColor: "#d1ffd1" }}>
          <CardContent>
            <Typography variant="h6">Completed Rides</Typography>
            <Typography variant="h5">{completedRides}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, backgroundColor: "#ffcccc" }}>
          <CardContent>
            <Typography variant="h6">Cancelled Rides</Typography>
            <Typography variant="h5">{cancelledRides}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, backgroundColor: "#d1e7fd" }}>
          <CardContent>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h5">{totalRevenue} Rs</Typography>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: "20px", maxWidth: 200 }}>
        <FormControl fullWidth variant="outlined" sx={{ background: "white" }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Box sx={{ height: 500, width: "100%", backgroundColor: "#ffffff", padding: 2 }}>
        <DataGrid
          sx={{
            backgroundColor: "#ffffff",
            border: "none",
            "& .MuiDataGrid-cell": {
              backgroundColor: "#ffffff",
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
              borderBottom: "none",
            },
            "& .MuiDataGrid-toolbarContainer": {
              flexDirection: "row-reverse",
            },
            "& .MuiDataGrid-columnHeader": {
              borderRight: "none",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row": {
              border: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              border: "none",
            },
          }}
          rows={filteredRides}
          columns={columns}
          getRowId={(row) => row.rideID || row.id}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 100]}
          disableRowSelectionOnClick
          disableColumnSelector
        />
      </Box>
    </div>
  );
};

export default Revenue;
