import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Rides = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDriver = async () => {
      if (!selectedDriverId) return; // Skip if no driver ID is selected

      setLoading(true);
      setError(null); // Reset error on each fetch
      setDriver(null); // Clear previous driver data

      try {
        console.log(`Fetching driver for ID: ${selectedDriverId}`);
        const response = await axios.get(
          `http://localhost:5000/drivers/composite/${selectedDriverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setDriver(response.data);
          console.log("Fetched driver data: ", response.data);
          navigate(`/drivers/${response.data._id}`);
        }
      } catch (err) {
        console.error("Error fetching driver data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [selectedDriverId, token, navigate]);

  const columns = [
    { field: "rideID", headerName: "Ride ID", width: 120 },
    { field: "pickUpLocation", headerName: "Pick-Up Location", width: 200 },
    { field: "dropOffLocation", headerName: "Drop-Off Location", width: 200 },
    { field: "rideMode", headerName: "Ride Mode", width: 150 },
    { field: "rideStatus", headerName: "Ride Status", width: 150 },
    {
      field: "passenger",
      headerName: "Passenger (ID)",
      flex: 1,
      minWidth: 150,
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
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={() => setSelectedDriverId(params.value)}
        >
          {params.value}
        </Button>
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
      passenger: "1",
      driver: "DR-003",
    },
    {
      id: 2,
      rideID: "RIDE124",
      pickUpLocation: "DHA",
      dropOffLocation: "Gulberg",
      rideMode: "Single",
      rideStatus: "Cancelled",
      passenger: "2",
      driver: "DR-003",
    },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Rides</h1>
        <button className="button">Add New Ride</button>
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
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      </div>

      {/* Display driver details */}
      {loading && <p>Loading driver details...</p>}
      {error && <p>Error: {error}</p>}
       
    </div>
  );
};

export default Rides;
