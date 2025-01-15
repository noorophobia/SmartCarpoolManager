import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const PendingApplications = () => {
  const navigate = useNavigate();
  const [drivers,setDrivers]=useState(null);
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
  
          const response = await fetch('http://localhost:5000/drivers/not-approved', {
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

  const handleViewDetails = (id) => {
    navigate(`/drivers/${id}`);
  };

 
    const handleEdit = async (id) => {
      alert(`Accept row with ID: ${id}`);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You are not authenticated');
          navigate('/login');
          return;
        }
    
        const response = await fetch(`http://localhost:5000/drivers/application/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isApproved: true }), // Update isApproved field to true
        });
    
        if (response.ok) {
          alert('Driver approved successfully!');
          // Optionally, refetch drivers to update the UI
          setDrivers((prev) =>
            prev.map((driver) =>
              driver.id === id ? { ...driver, isApproved: true } : driver
            )
          );
        } else {
          const data = await response.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to approve driver:', error);
        alert('Failed to approve driver. Please try again.');
      }
    };
    
  

  const handleDelete =  async (id) => {
    alert(`Reject row with ID: ${id}`);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not authenticated');
        navigate('/login');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/drivers/application/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: false }), 
      });
  
      if (response.ok) {
        alert('Driver rejected !');
        // Optionally, refetch drivers to update the UI
        setDrivers((prev) =>
          prev.map((driver) =>
            driver.id === id ? { ...driver, isApproved: false } : driver
          )
        );
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to approve driver:', error);
      alert('Failed to approve driver. Please try again.');
    }
  };  

  const columns = [
    { field: 'compositeId', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
     { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'cnic', headerName: 'CNIC', width: 150 },
     // Added a new column for View Details
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
      width: 250,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={1.5}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleEdit(params.row.id)}
            style={{ marginRight: 8 }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  columns.forEach((column) => (column.align = 'center')); // Set all columns to 'center' alignment
  columns.forEach((column) => (column.headerAlign = 'center')); // Set all headers to 'center' alignment

  const rows = [
    {
      id: 1,
      name: 'John Doe',
      gender: 'Male',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      cnic: '12345-1234567-1',
      dateOfBirth: '1990-05-15',
    },
    // Add more rows as needed
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Pending Driver Applications</h1>
       </div>
      <div style={{ marginTop: '20px' }}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={drivers}
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
          />
        </Box>
      </div>
    </div>
  );
};

export default PendingApplications;
