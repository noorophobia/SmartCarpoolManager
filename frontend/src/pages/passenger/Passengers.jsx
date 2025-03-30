import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import '../../styles/tables.css';
import PassengerService from '../../services/PassengerService'; // Make sure to adjust path if needed

const Passengers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    localStorage.setItem('lastVisitedRoute', location.pathname);
    fetchPassengers();
  }, [location]);

  const fetchPassengers = async () => {
    try {
      const data = await PassengerService.getAllPassengers();
      setPassengers(data);
    } catch (error) {
      console.error('Failed to fetch passengers:', error);
      alert('Error fetching passengers');
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem('id', id);
    navigate('/passenger-details');
  };

  const handleEdit = (id) => {
    localStorage.setItem('id', id);
    navigate('/edit-passenger');
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete the passenger with ID: ${id}?`)) {
      try {
        await PassengerService.deletePassengerById(id);
        alert('Passenger deleted successfully');
        fetchPassengers();
      } catch (error) {
        console.error(error);
        alert('Failed to delete passenger');
      }
    }
  };

  const handleAddPassenger = () => {
    navigate('/add-passenger');
  };

  const columns = [
    { field: 'compositeId', headerName: 'ID', width: 90 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'viewDetails',
      headerName: 'View Details',
      width: 150,
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
            onClick={() => handleEdit(params.row.id)}
            style={{ minWidth: 0, padding: 0 }}
          >
            <img
              src="/edit_icon.svg"
              alt="Edit"
              style={{ width: 25, height: 25 }}
            />
          </Button>
          <Button
            onClick={() => handleDelete(params.row.id)}
            style={{ minWidth: 0, padding: 0 }}
          >
            <img
              src="/delete_icon.svg"
              alt="Delete"
              style={{ width: 25, height: 25 }}
            />
          </Button>
        </div>
      ),
    },
  ];

  columns.forEach((col) => (col.align = 'left'));
  columns.forEach((col) => (col.headerAlign = 'left'));

  return (
    <div className="main-content">
      <div className="header">
        <h1>Passengers Management</h1>
        <button className="button" onClick={handleAddPassenger}>
          Add New Passenger
        </button>
      </div>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          className="dataGrid"
          rows={passengers}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          disableColumnSelector
        />
      </Box>
    </div>
  );
};

export default Passengers;
