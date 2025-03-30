import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RatingsAndReviewsService from "../../services/RatingsAndReviewsService"; // ✅ Service import
import "../../styles/ratingAndReviews.css";

const RatingsAndReviews = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [passengerRatings, setPassengerRatings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const CACHE_KEY = "cachedPassengerRatings";
  const CACHE_EXPIRY_MINUTES = 5;

  useEffect(() => {
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);
    const isCacheFresh = timestamp && Date.now() - Number(timestamp) < CACHE_EXPIRY_MINUTES * 60 * 1000;

    if (cached && isCacheFresh) {
      setPassengerRatings(JSON.parse(cached));
    } else {
      fetchRatings();
    }
  }, []);

  const fetchRatings = async () => {
    try {
      const reviews = await RatingsAndReviewsService.getPassengerRideReviews(); // ✅ use service
      setPassengerRatings(reviews);
      localStorage.setItem(CACHE_KEY, JSON.stringify(reviews));
      localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}_timestamp`);
    window.location.reload();
  };

  const handleViewDetails = async (row) => {
    setSelectedRide(row);
    setOpenDialog(true);

    if (row.resolved === true) return;

    try {
      await RatingsAndReviewsService.markReviewResolved(row._id); // ✅ use service
      const updated = passengerRatings.map((item) =>
        item._id === row._id ? { ...item, resolved: true } : item
      );
      setPassengerRatings(updated);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error updating review resolved status:", error);
    }
  };

  const handleBlockDriver = async (driverId) => {
    try {
      await RatingsAndReviewsService.blockDriver(driverId); // ✅ use service
      alert(`Driver has been "blocked".`);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while updating driver status.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    {
      field: "rideCompositeId",
      headerName: "Ride ID",
      width: 120,
    },
    {
      field: "passengerCompositeId",
      headerName: "Passenger ID",
      width: 120,
      renderCell: (params) => (
        <Link
          to={`/passenger-details`}
          onClick={() => localStorage.setItem("id", params.row.passengerId)}
        >
          <Button variant="text" color="primary" size="small">
            {params.value}
          </Button>
        </Link>
      ),
    },
    {
      field: "driverCompositeId",
      headerName: "Driver ID",
      width: 120,
      renderCell: (params) => (
        <Link to={`/drivers/${params.row.driverId}`}>
          <Button variant="text" color="primary" size="small">
            {params.value}
          </Button>
        </Link>
      ),
    },
    {
      field: "rating",
      headerName: "Passenger Rating",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ whiteSpace: "pre" }}>{'  ' + params.value}</span>
      ),
    },
    {
      field: "review",
      headerName: "Passenger Review",
      width: 500,
    },
    {
      field: "resolved",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "Resolved" : "New"}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewDetails(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  columns.forEach((column) => (column.headerAlign = "left"));

  return (
    <div className="main-content">
      <div className="header">
        <h1>Ratings and Reviews</h1>
        <button className="button" onClick={handleRefresh}>
          Refresh Reviews
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            getRowClassName={(params) =>
              params.row.status === "new" ? "new-complaint-row" : ""
            }
            className="dataGrid"
            rows={passengerRatings}
            columns={columns}
            getRowId={(row) => row._id}
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
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        </Box>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Ratings and Reviews Details</DialogTitle>
        <DialogContent sx={{ padding: "40px", marginTop: "40px" }}>
          {selectedRide && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Card style={{ width: "48%", background: "#E0E0E0" }}>
                <CardContent sx={{ padding: "20px" }}>
                  <Typography variant="body1">
                    <strong>Passenger ID:</strong>{" "}
                    <Link
                      to={`/passenger-details`}
                      onClick={() => localStorage.setItem("id", selectedRide.passengerId)}
                    >
                      <Button variant="text" color="primary" size="small">
                        {selectedRide.passengerCompositeId}
                      </Button>
                    </Link>
                  </Typography>
                  <Typography variant="body1">
                    <strong>Driver ID:</strong>{" "}
                    <Link to={`/drivers/${selectedRide.driverId}`}>
                      <Button variant="text" color="primary" size="small">
                        {selectedRide.driverCompositeId}
                      </Button>
                    </Link>
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "16px", mb: 2 }}>
                    <strong>Passenger Rating:</strong> {selectedRide.rating}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "16px", mb: 2 }}>
                    <strong>Passenger Review:</strong> {selectedRide.review}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "16px", mb: 2 }}>
                    <strong>Driver Name:</strong> {selectedRide.driverName}
                  </Typography>
                  {selectedRide.rating < 3 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleBlockDriver(selectedRide.driverId)}
                      sx={{ mt: 2 }}
                    >
                      Block Driver
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RatingsAndReviews;
