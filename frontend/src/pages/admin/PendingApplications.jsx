import  { useEffect, useState } from 'react';
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
              name: driver.driverFirstName +" "+ driver.driverLastName,
              gender: driver.driverGender,
              email: driver.driverEmail,
              phoneNumber: driver.driverPhone,
              cnic: driver.driverCnicNumber,
              dateOfBirth: driver.driverDOB,
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

 
    const handleEdit = async (id,email) => {
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
      const emailResponse = await fetch("http://localhost:5000/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientType: "specificEmail",
        email,
        subject: "Smart Carpool - Application Approved 🚀",
        message: `<p>Dear Driver,</p>
                  <p>Congratulations! Your application has been <strong>approved</strong>. You can now start using the Smart Carpool platform.</p>
                  <p>Login to your account and start accepting rides.</p>
                  <p>Best Regards,<br>Smart Carpool Team</p>`,
      }),
    });

    if (!emailResponse.ok) {
      console.error("Failed to send approval email");
    }

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
    
  

    const handleDelete = async (id,email) => {
      alert(`Reject row with ID: ${id}`);
    
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You are not authenticated');
          navigate('/login');
          return;
        }
         // STEP 1: Update approval status
        const response = await fetch(`http://localhost:5000/drivers/application/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isApproved: false }),
        });
    
        if (!response.ok) {
          const data = await response.json();
          alert(`Error updating approval status: ${data.message}`);
          return;
        }
    
        // STEP 2: Delete driver only if the status update was successful
        const res = await fetch(`http://localhost:5000/drivers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (res.ok) {
          alert('Driver rejected and removed!');
          const emailResponse = await fetch("http://localhost:5000/send-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipientType: "specificEmail",
              email,
              subject: "Smart Carpool - Application Rejected ❌",
              message: `<p>Dear Driver,</p>
                        <p>We regret to inform you that your application has been <strong>rejected</strong>. If you believe this was a mistake, please contact support.</p>
                        <p>Thank you for your interest in Smart Carpool.</p>
                        <p>Best Regards,<br>Smart Carpool Team</p>`,
            }),
          });
      
          if (!emailResponse.ok) {
            console.error("Failed to send rejection email");
          }
          setDrivers((prev) => prev.filter(driver => driver.id !== id)); 
        } else {
          const data = await res.json();
          alert(`Error deleting driver: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to reject driver:', error);
        alert('Failed to reject driver. Please try again.');
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
            onClick={() => handleEdit(params.row.id, params.row.email)}  
            style={{ marginRight: 8 }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id, params.row.email)}
            >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  columns.forEach((column) => (column.align = 'center')); // Set all columns to 'center' alignment
  columns.forEach((column) => (column.headerAlign = 'center')); // Set all headers to 'center' alignment

   

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
             disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default PendingApplications;
