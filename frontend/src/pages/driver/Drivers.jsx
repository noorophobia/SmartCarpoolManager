import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import '../../styles/tables.css';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]); // State to hold the fetched drivers data
   const navigate = useNavigate();

  // Fetch drivers data from the Express server when the component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token');  // Or sessionStorage.getItem('token')
        
        //   alert('You are not authenticated');
          if (!token) {
            // If no token is found, redirect to the login page
            navigate('/login');
            return;
          }
          
          console.log('Token:', token);

        const response = await fetch('http://localhost:5000/drivers/approved', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        console.log(data);

        const mappedData = Array.isArray(data)
        ? data.map(driver => ({
            id: driver._id,
            compositeId: driver.compositeId, // Add compositeId here
            name: driver.name,
            gender: driver.gender,
            email: driver.email,
            phoneNumber: driver.phoneNumber,
            cnic: driver.cnic,
            dateOfBirth: driver.dateOfBirth,
          }))
        : [];
      

        setDrivers(mappedData); // Update state with the mapped data
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };
  
    fetchDrivers(); // Call the function to fetch data
  }, []);

  // Handle navigation to the driver's details page
  const handleViewDetails = (id) => {
    navigate(`/drivers/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-driver/${id}`);
    console.log("editing "+id);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this driver?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');  // Retrieve token for delete request
        
        if (!token) {
          alert('You are not authenticated');
          return;
        }

        const response = await fetch(`http://localhost:5000/drivers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
            
              const res_vehicle = await fetch(`http://localhost:5000/vehicles/driver/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
                  'Content-Type': 'application/json',
                },
              });
            
          setDrivers(drivers.filter(driver => driver.id !== id)); // Remove the deleted driver from state
        } else {
          alert('Failed to delete driver.');
        }
      } catch (error) {
        console.error('Error deleting driver:', error);
        alert('Error deleting driver.');
      }
    }
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
            style={{
              padding: 0,
              minWidth: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => handleDelete(params.row.id)}
          >
            <img
              src="/delete_icon.svg"
              alt="Delete Button"
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
              }}
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
        <Button variant="contained" color="primary" onClick={() => navigate('/add-driver')}>
          Add New Driver
        </Button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={drivers}
            columns={columns}
            getRowId={(row) => row.compositeId || row._id}  // Fallback to _id if compositeId is missing
            slots={{ toolbar: GridToolbar }}
            pageSizeOptions={[5, 10, 20, 100]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default Drivers;
