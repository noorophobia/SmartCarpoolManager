import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DriverService from '../../services/DriverService';  // Importing the service
import '../../styles/tables.css';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await DriverService.getApprovedDrivers();
        const mappedData = Array.isArray(data)
          ? data.map(driver => ({
              id: driver._id,
              compositeId: driver.compositeId,
              name: `${driver.driverFirstName} ${driver.driverLastName}`,
              gender: driver.gender || 'male',
              email: driver.driverEmail,
              phoneNumber: driver.driverPhone,
              cnic: driver.driverCnic,
              dateOfBirth: driver.driverDOB,
              isBlocked: driver.isBlocked
            }))
          : [];
        setDrivers(mappedData);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/drivers/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-driver/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this driver?');
    if (confirmDelete) {
      try {
        await DriverService.deleteDriver(id);
        setDrivers(drivers.filter(driver => driver.id !== id));
      } catch (error) {
        console.error('Error deleting driver:', error);
        alert('Error deleting driver.');
      }
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const columns = [
    { field: 'compositeId', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    {
      field: 'viewDetails',
      headerName: 'View Details',
      width: 180,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleViewDetails(params.row.id)}
        >
          View Details
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            style={{ padding: 0, minWidth: '40px', height: '40px', backgroundColor: 'transparent' }}
            onClick={() => handleEdit(params.row.id)}
          >
            <img
              src="/edit_icon.svg"
              alt="Edit Button"
              style={{ width: '30px', height: '30px', objectFit: 'contain' }}
            />
          </Button>
          <Button
            style={{ padding: 0, minWidth: '40px', height: '40px', backgroundColor: 'transparent' }}
            onClick={() => handleDelete(params.row.id)}
          >
            <img
              src="/delete_icon.svg"
              alt="Delete Button"
              style={{ width: '30px', height: '30px', objectFit: 'contain' }}
            />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Drivers</h1>
        <button className="button" onClick={() => navigate('/add-driver')}>
          Add New Driver
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <FormControl variant="outlined" sx={{ minWidth: 120, background: "white" }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterStatus}
            label="Filter"
            onChange={handleFilterChange}
            sx={{ width: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={
              filterStatus === "blocked"
                ? drivers.filter(driver => driver.isBlocked)
                : drivers
            }
            columns={columns}
            getRowId={(row) => row.compositeId || row.id}
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
    </div>
  );
};

export default Drivers;
