import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import '../../styles/tables.css'; // Keeping your original styles
import { useNavigate } from 'react-router-dom';

const Passengers = () => {
  const navigate = useNavigate();
   const [passengers,setPassengers]=useState(null);
   const token = localStorage.getItem('token');  // Or sessionStorage.getItem('token')
    

  // Fetch drivers data from the Express server when the component mounts
    useEffect(() => {
     
      fetchPassengers(); // Call the function to fetch data
    }, []);
    const fetchPassengers = async () => {
      try {
        // Get the token from localStorage (or sessionStorage)
         
        //   alert('You are not authenticated');
          if (!token) {
            // If no token is found, redirect to the login page
            navigate('/login');
            return;
          }
          
          console.log('Token:', token);

        const response = await fetch('http://localhost:5000/passengers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        console.log(data);

        const mappedData = Array.isArray(data)
        ? data.map(passenger => ({
             id: passenger._id,
            compositeId: passenger.compositeId, // Add compositeId here
            name: passenger.name,
            gender: passenger.gender,
            email: passenger.email,
            phone: passenger.phone,
           }))
        : [];

       

        setPassengers(mappedData); // Update state with the mapped data
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };
  
  const handleViewDetails = (id) => {
    localStorage.setItem('id', id);

     navigate(`/passenger-details`);
  };

  const handleEdit = (id) => {
    localStorage.setItem('id', id);

    navigate(`/edit-passenger`);

  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete the passenger with ID: ${id}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/passengers/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete passenger');
        }
  
        // Optionally, refresh the page or update the state to reflect the deletion
        alert('Passenger deleted successfully');
        fetchPassengers();
        // Reload or remove the deleted passenger from the UI, depending on your state structure
      } catch (error) {
        console.error(error);
        alert('Failed to delete passenger');
      }
    }
  };
  

  const handleAddPassenger= () => {
    navigate(`/add-passenger`);

   };

   
   
    

  const columns = [
    { field: 'compositeId', headerName: 'ID', width: 90 },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      editable: false, // Make it editable if required
    },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
    },
    {
      field: 'name',
      headerName: 'Name',
       sortable: true,
      width: 200,
     },
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
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
            onClick={() => handleEdit(params.row.id)}
          >
            <img
              src="/edit_icon.svg"
              alt="Edit Button"
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
              }}
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
    },
  ];

  columns.forEach((column) => (column.align = 'left'));
  columns.forEach((column) => (column.headerAlign = 'left'));

   

  return (
    <div className="main-content">
      <div className="header">
        <h1>Welcome to Passengers</h1>
        <button className="button" onClick={handleAddPassenger}>Add New Passenger</button>
      </div>
      <div>
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
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        </Box>
        
      
      </div>
    </div>
  );
};

export default Passengers;
