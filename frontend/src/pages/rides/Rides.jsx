 
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import RidesService from "../../services/RideService"; // import service

const Rides = () => {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    const fetchRidesData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const rideService = new RidesService(token);
        const allRides = await rideService.getAllRides();
        setRides(allRides);
      } catch (error) {
        console.error("Error fetching rides: ", error);
      }
    };

    fetchRidesData();
  }, [navigate]);

  const columns = [
    { field: "compositeId", headerName: "Ride ID", width: 100, sortable: true },
    { field: "requestOrigin", headerName: "Pick-Up Location", width: 300 },
    { field: "requestDestination", headerName: "Drop-Off Location", width: 300 },
    { field: "mode", headerName: "Ride Mode", width: 120 },
    { field: "status", headerName: "Ride Status", width: 150 },
    {
  field: "passengerCompositeId",
  headerName: "Passenger ID",
  flex: 1,
  minWidth: 180,
  renderCell: (params) => (
    <>
      {Array.isArray(params.row.passengerCompositeId) ? (
        params.row.passengerCompositeId.map((id, index) => (
          <Link
            key={index}
            to={`/passenger-details`}
            onClick={() => localStorage.setItem("id", params.row.passengerId[index])}
            style={{ marginRight: 8 }}
          >
            <Button variant="text" color="primary" size="small">
              {id}
            </Button>
          </Link>
        ))
      ) : (
        <Link
          to={`/passenger-details`}
          onClick={() => localStorage.setItem("id", params.row.passengerId)}
        >
          <Button variant="text" color="primary" size="small">
            {params.row.passengerCompositeId}
          </Button>
        </Link>
      )}
    </>
  ),
}
,
  
    {
      field: "driverCompositeId",
      headerName: "Driver ID",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Link to={`/drivers/${params.row.driverID}`}>
          <Button variant="text" color="primary" size="small">
            {params.value}
          </Button>
        </Link>
      ),
    },
    {
      field: "viewDetails",
      headerName: "View Details",
      width: 200,
      renderCell: (params) => {
        const rideId = params.row._id;
        const mode = params.row.mode;
        const destination = mode === "single" ? `/ride-details` : `/carpool-ride-details`;

        return (
          <Link
            to={destination}
            onClick={() => {
              localStorage.setItem("rideid", rideId);
              localStorage.setItem("passengerid", params.row.passengerCompositeId);
              localStorage.setItem("driverid", params.row.driverCompositeId);
            }}
          >
            <Button variant="contained" color="primary" size="small">
              View Details
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Rides</h1>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            className="dataGrid"
            rows={rides}
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
          />
        </Box>
      </div>
    </div>
  );
};

export default Rides;
