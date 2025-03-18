import  { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
      // Store the current route in localStorage
      localStorage.setItem("lastVisitedRoute", location.pathname);
    }, [location]);
  useEffect(() => {
    
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
  
        console.log("Token:", token);
  
        // Fetch composite IDs from the backend
const compositeIdResponse = await fetch("http://localhost:5000/rides-with-composite-ids", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
const { allMappings } = await compositeIdResponse.json();
const compositeMap = {};
allMappings.forEach(mapping => {
  compositeMap[mapping.rideID] = mapping.compositeId;
});

        
        // Fetch single rides
        const ridesResponse = await fetch("http://localhost:5000/single-rides", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        let ridesData = await ridesResponse.json();
        ridesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        // Fetch carpool rides
        const carpoolRidesResponse = await fetch("http://localhost:5000/carpool-rides", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        let carpoolRidesData = await carpoolRidesResponse.json();
   
        // Extract unique passenger and driver IDs from single rides
        const passengerIds = [...new Set(ridesData.map((ride) => ride.passengerId))];
        const driverIds = [...new Set(ridesData.map((ride) => ride.driverID))];
  
        // Extract unique passenger and driver IDs from carpool rides
        const carpoolPassengerIds = [
          ...new Set(carpoolRidesData.flatMap((ride) => ride.passengerId))
        ];
        const carpoolDriverIds = [...new Set(carpoolRidesData.map((ride) => ride.driverID))];
  
        // Function to fetch composite IDs for passengers and drivers
        const fetchCompositeIds = async (ids, type) => {
          const idMap = {};
          await Promise.all(
            ids.map(async (id) => {
              try {
                const response = await fetch(`http://localhost:5000/${type}/${id}`, {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                });
  
                const data = await response.json();
                if (data && data.compositeId) {
                  idMap[id] = data.compositeId;
                }
              } catch (error) {
                console.error(`Failed to fetch ${type} ${id}:`, error);
              }
            })
          );
          return idMap;
        };
  
        // Fetch composite IDs for single ride passengers and drivers
        const [passengerMap, driverMap] = await Promise.all([
          fetchCompositeIds(passengerIds, "passengers"),
          fetchCompositeIds(driverIds, "drivers"),
        ]);
  
        // Fetch composite IDs for carpool passengers and drivers
        const [carpoolPassengerMap, carpoolDriverMap] = await Promise.all([
          fetchCompositeIds(carpoolPassengerIds, "passengers"),
          fetchCompositeIds(carpoolDriverIds, "drivers"),
        ]);
  
        // Add compositeId mapping for single rides
        const updatedRides = ridesData.map((ride) => ({
          ...ride,
          mode: ride.requestType || "Unknown",
          passengerCompositeId: passengerMap[ride.passengerId] || "N/A",
          driverCompositeId: driverMap[ride.driverID] || "N/A",
          compositeId: compositeMap[ride._id] || "N/A",

        }));
  
        // Add compositeId mapping for carpool rides (passengers array and driver)
        const updatedCarpoolRides = carpoolRidesData.map((ride) => ({
          ...ride,
          passengerCompositeId: ride.passengerId.map((id) => carpoolPassengerMap[id] || "N/A"),
          driverCompositeId: carpoolDriverMap[ride.driverID] || "N/A",
          compositeId: compositeMap[ride._id] || "N/A",

        }));
  
        // Merge both arrays
        const allRides = [...updatedRides, ...updatedCarpoolRides];
        allRides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Update state
        setRides(allRides);
  
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      }
    };
  
    fetchRides();
  }, []);
  

  const columns = [
    { field: "compositeId", headerName: "Ride ID", width: 100 ,    sortable: true , // This is the default
    },

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

        const destination =
          mode === "single"
            ? `/ride-details`
            : `/carpool-ride-details`;

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
