import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, MenuItem, Paper, Box, Typography, Alert, Grid, Card, CardContent, CardMedia, CardHeader } from '@mui/material';
import '../../styles/addDriver.css'
const EditDriver = () => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
     const [email, setEmail] = useState('');
    const [cnic, setCnic] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const[driverEmail,setDriverEmail]=useState('');
    const[driverCnic,setDriverCnic]=useState('');
    const[driverPhoneNumber,setDriverPhoneNumber]=useState('');
    
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [ratings, setRatings] = useState(0);
      const [vehicle, setVehicle] = useState(null); // Store fetched driver data
      const currentYear = new Date().getFullYear();
 const [brand, setVehicleBrand] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
   const [vehicleType, setVehicleType] = useState('');
  const [vehicleProductionYear, setVehicleProductionYear] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehiclePhotos, setVehiclePhotos] = useState([]);
  const [vehicleRegistrationFront, setVehicleRegistrationFront] = useState(null);
  const [vehicleRegistrationBack, setVehicleRegistrationBack] = useState(null);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [driverPhoto, setDriverPhoto] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [emails,setEmails]=useState("")
    const [phoneNumbers,setPhoneNumbers]=useState("")
    const [cnics,setCnics]=useState("")

    const [state, setState] = useState({
      cnicFrontBool: false,
      cnicBackBool: false,
      vehicleRegistrationFrontBool: false,
      vehicleRegistrationBackBool: false,
      driverPhotoBool: false,
      vehiclePhotosBool:false,
  });

  // Function to update individual state values
const updateState = (key, value) => {
  setState(prevState => ({ ...prevState, [key]: value }));
};

    
    
     const [errorMessages, setErrorMessages] = useState({
        name: "",
        gender: "",
        email: "",
        phoneNumber: "",
        cnic: "",
        dateOfBirth: "",
        vehicleName: "",
        brand:"",
        vehicleColor:"",
        vehicleType:"",
    
        vehicleProductionYear: "",
        licenseNumber: "",
        vehiclePhotos : "",
        vehicleRegistrationFront: "",
       vehicleRegistrationBack: "",
        cnicFront: "",
      cnicBack: "",
        driverPhoto: "",
      });
  const { id } = useParams(); // Get the driver ID from URL params (if editing)
  const navigate = useNavigate();
 
  useEffect(() => {
    if (id) {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token');  // Or sessionStorage.getItem('token')
        
        //   alert('You are not authenticated');
          if (!token) {
            // If no token is found, redirect to the login page
            navigate('/login');
            return;
          }
          
      // Fetch the driver data if editing
      const fetchDriver = async () => {
        try {
           const response = await fetch(`http://localhost:5000/drivers/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setName(data.name);
          setEmail(data.email);
          setPhoneNumber(data.phoneNumber);
          setCnic(data.cnic);
          setGender(data.gender);
          setDateOfBirth(data.dateOfBirth.split('T')[0]);
          setRatings(data.ratings || 0);
        setDriverEmail(data.email);
          setDriverCnic(data.cnic);
         setDriverPhoneNumber(data.phoneNumber);
        } catch (error) {
          console.error('Failed to fetch driver:', error);
        }
      };

      const fetchAllDrivers = async () => {
        try {
           const response = await fetch(`http://localhost:5000/drivers`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
         
         setEmails( data.map(driver => driver.email))
          setPhoneNumbers (data.map(driver => driver.phoneNumber));
          setCnics(data.map(driver => driver.cnic));

        } catch (error) {
          console.error('Failed to fetch driver:', error);
        }
      };
      const fetchVehicle = async () => {
           const response = await fetch(`http://localhost:5000/vehicles/driver/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
              'Content-Type': 'application/json',
            },
          });        const data = await response.json();
          console.log('Fetched Vehicle Data:', data);
          
          // Access the first item in the array (if there is any data)
          if (data) {
            console.log(data[0]);
            setVehicle(data[0]); // Set vehicle state to the first object in the array
          
          } else {
            setVehicle(null); // Handle case where no vehicle data is found
          }
         
      };
      
      
      fetchDriver();
      fetchAllDrivers();
      fetchVehicle();
      console.log("vehicle is"+vehicle)
      if(vehicle){
    }

    }
  }, [id]);

   useEffect(()=>{
    if(vehicle){
    setVehicleBrand(vehicle.brand);
    setVehicleColor(vehicle.vehicleColor);
    setVehicleName(vehicle.vehicleName);

    setVehicleType(vehicle.vehicleType);
    setVehicleProductionYear(vehicle.vehicleProductionYear);
    setLicenseNumber(vehicle.licenseNumber);
    setCnicFront(vehicle.cnicFront);
     setCnicBack(vehicle.cnicBack);
setDriverPhoto(vehicle.driverPhoto);
setVehicleRegistrationBack(vehicle.vehicleRegistrationBack);
setVehicleRegistrationFront(vehicle.vehicleRegistrationFront);
 setVehiclePhotos(vehicle.vehiclePhotos);
    
 }
   },vehicle)
   
   const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
     // Reset errors before starting validation
     setErrorMessages({
      name: "",
      gender: "",
      email: "",
      phoneNumber: "",
      cnic: "",
      dateOfBirth: "",
      vehicleName: "",
      brand:"",
    vehicleColor:"",
    vehicleType:"",
      vehicleProductionYear: "",
      licenseNumber: "",
      vehiclePhotos : "",
    vehicleRegistrationFront: "",
   vehicleRegistrationBack: "",
    cnicFront: "",
  cnicBack: "",
    driverPhoto: "",
    });
    let hasError = false;

    if(!email===driverEmail){

    if (emails.includes(email)) {
       
         
      setErrorMessages((prev) => ({ ...prev, email: "Email is already in use" }));
      hasError = true;
      
    }}
    if(!phoneNumber===driverPhoneNumber){
    if (phoneNumbers.includes(phoneNumber)) {
        
      setErrorMessages((prev) => ({ ...prev, phoneNumber: "Phone Number is already in use" }));
      hasError = true;
    }
  }
  if(!cnic===driverCnic){
    if (cnics.includes(cnic)) {
      setErrorMessages((prev) => ({ ...prev, cnic: "CNIC is already in use" }));
      hasError = true;
    }
  }
    // Validation logic for driver fields
    if (!name.trim()) {
       
      setErrorMessages((prev) => ({ ...prev, name: "Name is required" }));
      hasError = true;
    }
    if (!['Male', 'Female'].includes(gender)) {
      setErrorMessages((prev) => ({ ...prev, gender: "Gender must be Male or Female" }));
      hasError = true;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)|| (!email)) {
      setErrorMessages((prev) => ({ ...prev, email: "Please provide a valid email address" }));
      hasError = true;
    }
    
    if (!phoneNumber.match(/^((\+92)|0)(3[0-9]{2})[0-9]{7}$/)) {
      setErrorMessages((prev) => ({ ...prev, phoneNumber: "Phone number must be a valid Pakistani number" }));
      hasError = true;
    }
    if (!cnic.match(/^\d{5}-\d{7}-\d{1}$/)) {
      setErrorMessages((prev) => ({ ...prev, cnic: "CNIC must be in the format XXXXX-XXXXXXX-X" }));
      hasError = true;
    }
    if (!dateOfBirth) {
      setErrorMessages((prev) => ({ ...prev, dateOfBirth: "Date of Birth is required" }));
      hasError = true;
    }

    // Validation logic for vehicle fields
    if (!vehicleName.trim()) {
      setErrorMessages((prev) => ({ ...prev, vehicleName: "Vehicle Name is required" }));
      hasError = true;
    }
    if(!brand){
      setErrorMessages((prev) => ({ ...prev, brand: "Vehicle Brand is required" }));
      hasError = true;
    }
    if(!vehicleColor){
      setErrorMessages((prev) => ({ ...prev, vehicleColor: "Vehicle Color is required" }));
      hasError = true;
    }
    if(!vehicleType){
      setErrorMessages((prev) => ({ ...prev, vehicleType: "Vehicle Type is required" }));
      hasError = true;
    }
    if (!licenseNumber.trim()) {
      setErrorMessages((prev) => ({ ...prev, licenseNumber: "License Number is required" }));
      hasError = true;
    }
    if (!vehicleProductionYear  || (vehicleProductionYear < 1900 && vehicleProductionYear > currentYear)) {
      setErrorMessages((prev) => ({ ...prev, vehicleProductionYear: "Please enter a valid production year" }));
      hasError = true;
     }
     
     if (!vehiclePhotos) {
      setErrorMessages((prev) => ({
        ...prev,
        vehiclePhotos: 'Please upload at least one vehicle photo.',
      }));
    }
    
     if(!vehicleRegistrationFront){
      setErrorMessages((prev) => ({ ...prev, vehicleRegistrationFront: "Please add Vehicle Registration Front Photo" }));
      hasError = true;
     }
     if(!vehicleRegistrationBack){
      setErrorMessages((prev) => ({ ...prev, vehicleRegistrationBack: "Please add Vehicle Registration Back Photo" }));
      hasError = true;
     }
     if(!cnicFront){
      setErrorMessages((prev) => ({ ...prev, cnicFront: "Please add CNIC Front Photo" }));
      hasError = true;
     }
     if(!cnicBack){
      setErrorMessages((prev) => ({ ...prev, cnicBack: "Please add CNIC Back Photo" }));
      hasError = true;
     }
     if(!driverPhoto){
      setErrorMessages((prev) => ({ ...prev, driverPhoto: "Please add Driver Photo" }));
      hasError = true;
     }
      
      if (hasError) return;


    const newDriver = { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings };
   
    
    const formData = new FormData();
  

    // Append vehicle fields to formData
    
  formData.append('brand', brand);
  formData.append('vehicleName', vehicleName);
  formData.append('vehicleColor', vehicleColor);
   formData.append('vehicleType', vehicleType);
  formData.append('vehicleProductionYear', vehicleProductionYear);
  formData.append('licenseNumber', licenseNumber);
  formData.append('driverId', id);
  formData.append('cnicFront', cnicFront);
  formData.append('cnicBack', cnicBack);
  formData.append('driverPhoto', driverPhoto);

  formData.append('vehicleRegistrationFront', vehicleRegistrationFront);
  formData.append('vehicleRegistrationBack', vehicleRegistrationBack);
    vehiclePhotos.forEach(photo => {
    formData.append('vehiclePhotos', photo); // Append each file
  });
      console.log(vehiclePhotos)

      const vehicleData = {
        brand: brand,
        vehicleName: vehicleName,
        vehicleColor: vehicleColor,
        vehicleType: vehicleType,
        vehicleProductionYear: vehicleProductionYear,
        licenseNumber: licenseNumber,
        driverId: id,  // Assuming `id` is the driver's ID
        cnicFront: cnicFront, // File URLs or base64 data
        cnicBack: cnicBack,
        driverPhoto: driverPhoto,
        vehicleRegistrationFront: vehicleRegistrationFront,
        vehicleRegistrationBack: vehicleRegistrationBack,
        vehiclePhotos: vehiclePhotos // Array of URLs or base64 strings
      };
   console.log(vehiclePhotos)
    try {
      const token = localStorage.getItem('token');  // Or sessionStorage.getItem('token')
        
      //   alert('You are not authenticated');
        if (!token) {
          // If no token is found, redirect to the login page
          navigate('/login');
          return;
        }

         
      const response = await axios.put(
        `http://localhost:5000/drivers/${id}`,  
        newDriver,
        {
          headers: {
            'Content-Type': 'application/json', // Important for FormData
            'Authorization': `Bearer ${token}`,  
          }
        }
      );

      // Handle response
      if (response.status === 200) {
        console.log('Driver updated successfully');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Error saving data. Please try again.');
    }

   try {
      const token = localStorage.getItem('token');  // Or sessionStorage.getItem('token')
        
      //   alert('You are not authenticated');
        if (!token) {
          // If no token is found, redirect to the login page
          navigate('/login');
          return;
        }
        alert(formData)
    
        const response = await axios.put(
          `http://localhost:5000/vehicles/${vehicle._id}`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      
        if (response.status === 200) {
          console.log('Vehicle updated successfully');
        }
      
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Error saving data. Please try again.');
    }
  };

  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5); // Insert first hyphen
    if (value.length > 14) value = value.slice(0, 14); // Limit to 13 characters
    if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13); // Insert second hyphen
    setCnic(value); // Update CNIC value
  };

   
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  
 
  const handleDrop = (e, setFileCallback) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileCallback(file);
    } else {
      console.warn('Invalid file type.');
    }
  };
  
  

  const handleVehiclePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setVehiclePhotos(files);
    updateState('vehiclePhotosBool', true); // Mark as edited

     console.log('Images selected:', files); // Log the files directly

  };
  const removePhoto = (index) => {
    const updatedPhotos = [...vehiclePhotos];
    updatedPhotos.splice(index, 1); // Remove the photo at the given index
    setVehiclePhotos(updatedPhotos); // Update the state with the new list of photos
  };
  
 

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', padding: 2 }}>
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
       
        <h2 className="header">Update Driver</h2>


        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Driver Details */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                <Typography variant="h6" component="div" align='center'  sx={{ fontWeight: 'bold' }}  // Makes the text bold
 gutterBottom>
      Driver Details
    </Typography>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.name}
                    helperText={errorMessages.name}

                  />
                  <TextField
                    label="Gender"
                    variant="outlined"
                    fullWidth
                    select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.gender}
                    helperText={errorMessages.gender}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errorMessages.email}
                    helperText={errorMessages.email}
                    margin="normal"
                  />
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    type="tel"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.phoneNumber}
                    helperText={errorMessages.phoneNumber}
                  />
                  <TextField
                    label="CNIC"
                    variant="outlined"
                    fullWidth
                    value={cnic}
                    onChange={handleCnicChange}
                    margin="normal"
                    error={!!errorMessages.cnic}
                    helperText={errorMessages.cnic}
                  />
                  <TextField
                    label="Date of Birth"
                    variant="outlined"
                    type="date"
                    fullWidth
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.dateOfBirth}
                    helperText={errorMessages.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                  />
                   {/* Image Uploads */}
                   <Box sx={{ marginTop: 2 }}>
                   <Typography variant="h6">Driver Photo </Typography>
                   
                   <div className="App">
        <div id="FileUpload">
            <div className="wrapper">
                {/* Drag-and-Drop Area */}
                <div
                    className={`upload ${dragOver ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, setCnicFront)}
                >
                    <p>Drag Driver photo here or </p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setCnicFront(file); // Update with selected file
                            console.log('Selected file:', file);
                            updateState('driverPhotoBool', true); // Mark as edited
                        }}
                        style={{ display: 'none' }}
                        id="driver-photo-upload"
                    />
                    <label htmlFor="driver-photo-upload" className="upload__button">
                        Browse
                    </label>
                </div>

                {/* Image Preview Logic */}
                {driverPhoto && state.driverPhotoBool ? (
    // Preview for newly selected image
    <Box sx={{ marginTop: 1 }}>
        <img
            src={URL.createObjectURL(driverPhoto)} // Create preview URL for selected image
            alt="CNIC Front Photo Preview"
            width="100%"
        />
    </Box>
) : driverPhoto ? (
    // Preview for existing image from backend if cnicFront is not null
    <Box sx={{ marginTop: 1 }}>
        <img
            src={`http://localhost:5000/uploads/${encodeURIComponent(driverPhoto)}`} // Backend URL
            alt="CNIC Front Preview"
            width="100%"
        />
    </Box>
) : (
    // Fallback or message if cnicFront is null
    <Box sx={{ marginTop: 1 }}>
        <p>No Driver Image</p>
    </Box>
)}

            </div>
        </div>
    </div>
  </Box>

  <Box sx={{ marginTop: 2 }}>
    <Typography variant="h6">CNIC Photos</Typography>
    <div className="App">
        <div id="FileUpload">
            <div className="wrapper">
                {/* Drag-and-Drop Area */}
                <div
                    className={`upload ${dragOver ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, setCnicFront)}
                >
                    <p>Drag CNIC Front photo here or </p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setCnicFront(file); // Update with selected file
                            console.log('Selected file:', file);
                            updateState('cnicFrontBool', true); // Mark as edited
                        }}
                        style={{ display: 'none' }}
                        id="cnicfront-photo-upload"
                    />
                    <label htmlFor="cnicfront-photo-upload" className="upload__button">
                        Browse
                    </label>
                </div>

                {/* Image Preview Logic */}
                {cnicFront && state.cnicFrontBool ? (
    // Preview for newly selected image
    <Box sx={{ marginTop: 1 }}>
        <img
            src={URL.createObjectURL(cnicFront)} // Create preview URL for selected image
            alt="CNIC Front Photo Preview"
            width="100%"
        />
    </Box>
) : cnicFront ? (
    // Preview for existing image from backend if cnicFront is not null
    <Box sx={{ marginTop: 1 }}>
        <img
            src={`http://localhost:5000/uploads/${encodeURIComponent(cnicFront)}`} // Backend URL
            alt="CNIC Front Preview"
            width="100%"
        />
    </Box>
) : (
    // Fallback or message if cnicFront is null
    <Box sx={{ marginTop: 1 }}>
        <p>No CNIC Front Image</p>
    </Box>
)}

            </div>
        </div>
    </div>


    <div className="App">
        <div id="FileUpload">
            <div className="wrapper">
                {/* Drag-and-Drop Area */}
                <div
                    className={`upload ${dragOver ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, setCnicBack)}
                >
                    <p>Drag CNIC Back photo here or </p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setCnicBack(file); // Update with selected file
                            console.log('Selected file:', file);
                            updateState('cnicBackBool', true); // Mark as edited
                        }}
                        style={{ display: 'none' }}
                        id="cnicBack-photo-upload"
                    />
                    <label htmlFor="cnicBack-photo-upload" className="upload__button">
                        Browse
                    </label>
                </div>

                {/* Image Preview Logic */}
                {cnicBack && state.cnicBackBool ? (
    // Preview for newly selected image
    <Box sx={{ marginTop: 1 }}>
        <img
            src={URL.createObjectURL(cnicBack)} // Create preview URL for selected image
            alt="CNIC Back Photo Preview"
            width="100%"
        />
    </Box>
) : cnicBack ? (
    // Preview for existing image from backend if cnicFront is not null
    <Box sx={{ marginTop: 1 }}>
        <img
            src={`http://localhost:5000/uploads/${encodeURIComponent(cnicBack)}`} // Backend URL
            alt="CNIC Back Preview"
            width="100%"
        />
    </Box>
) : (
    // Fallback or message if cnicFront is null
    <Box sx={{ marginTop: 1 }}>
        <p>No CNIC Back Image</p>
    </Box>
)}

            </div>
        </div>
    </div>
    
  
 
  </Box>
          
                </CardContent>
              </Card>
            </Grid>

            {/* Vehicle Details */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                <Typography variant="h6" component="div" align='center'   sx={{ fontWeight: 'bold' }}  // Makes the text bold
 gutterBottom>
      Vehicle Details
    </Typography>
                  <TextField
                    label="Vehicle Brand"
                    variant="outlined"
                    fullWidth
                    value={brand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.brand}
                    helperText={errorMessages.brand}
                  />
                  <TextField
                    label="Vehicle Name"
                    variant="outlined"
                    fullWidth
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.vehicleName}
                    helperText={errorMessages.vehicleName}
                  />
                  <TextField
                    label="Vehicle Color"
                    variant="outlined"
                    fullWidth
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.vehicleColor}
                    helperText={errorMessages.vehicleColor}
                  />
                  
                  <TextField
                    label="Vehicle Type"
                    variant="outlined"
                    fullWidth
                    select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.vehicleType}
                    helperText={errorMessages.vehicleType}
                  >
                    <MenuItem value="AC Car">AC Car</MenuItem>
                                       <MenuItem value="Economy Car">Economy
                                        Car</MenuItem>
                                       <MenuItem value="Rickshaw">Rickshaw</MenuItem>
                                       <MenuItem value="Bike">Bike</MenuItem>
                  </TextField>
                  <TextField
      label="Vehicle Production Year"
      type="outlined"
      fullWidth
      value={vehicleProductionYear}
      onChange={(e) => setVehicleProductionYear(e.target.value)}
       

       margin="normal"
      inputProps={{
        min: 1900,
        max: currentYear,
      }}
      helperText={`Year must be between 1900 and ${currentYear}`}
      error={!!errorMessages.vehicleProductionYear}
     />
                  <TextField
                    label="License Number"
                    variant="outlined"
                    fullWidth
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    margin="normal"
                    error={!!errorMessages.licenseNumber}
                    helperText={errorMessages.licenseNumber}
                  />
                   <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Vehicle Registration Photos</Typography>
              <div className="App">
        <div id="FileUpload">
            <div className="wrapper">
                {/* Drag-and-Drop Area */}
                <div
                    className={`upload ${dragOver ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, setVehicleRegistrationFront)}
                >
                    <p>Drag Registration Front photo here or </p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setVehicleRegistrationFront(file); // Update with selected file
                            console.log('Selected file:', file);
                            updateState('vehicleRegistrationFrontBool', true); // Mark as edited
                        }}
                        style={{ display: 'none' }}
                        id="RegistrationFront-photo-upload"
                    />
                    <label htmlFor="RegistrationFront-photo-upload" className="upload__button">
                        Browse
                    </label>
                </div>

                {/* Image Preview Logic */}
                {vehicleRegistrationFront && state.vehicleRegistrationFrontBool ? (
    // Preview for newly selected image
    <Box sx={{ marginTop: 1 }}>
        <img
            src={URL.createObjectURL(vehicleRegistrationFront)} // Create preview URL for selected image
            alt="CNIC Back Photo Preview"
            width="100%"
        />
    </Box>
) : vehicleRegistrationFront ? (
    // Preview for existing image from backend if cnicFront is not null
    <Box sx={{ marginTop: 1 }}>
        <img
            src={`http://localhost:5000/uploads/${encodeURIComponent(vehicleRegistrationFront)}`} // Backend URL
            alt="vehicleRegistrationFront  Preview"
            width="100%"
        />
    </Box>
) : (
    // Fallback or message if cnicFront is null
    <Box sx={{ marginTop: 1 }}>
        <p>No vehicle Registration Front Image</p>
    </Box>
)}

            </div>
        </div>
    </div>
    
 
    <div className="App">
        <div id="FileUpload">
            <div className="wrapper">
                {/* Drag-and-Drop Area */}
                <div
                    className={`upload ${dragOver ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, setVehicleRegistrationBack)}
                >
                    <p>Drag Registration Back photo here or </p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setVehicleRegistrationBack(file); // Update with selected file
                            console.log('Selected file:', file);
                            updateState('vehicleRegistrationBackBool', true); // Mark as edited
                        }}
                        style={{ display: 'none' }}
                        id="RegistrationBack-photo-upload"
                    />
                    <label htmlFor="RegistrationBackphoto-upload" className="upload__button">
                        Browse
                    </label>
                </div>

                {/* Image Preview Logic */}
                {vehicleRegistrationBack && state.vehicleRegistrationBackBool ? (
    // Preview for newly selected image
    <Box sx={{ marginTop: 1 }}>
        <img
            src={URL.createObjectURL(vehicleRegistrationBack)} // Create preview URL for selected image
            alt="Registration Back Photo Preview"
            width="100%"
        />
    </Box>
) : vehicleRegistrationBack ? (
    // Preview for existing image from backend if cnicFront is not null
    <Box sx={{ marginTop: 1 }}>
        <img
            src={`http://localhost:5000/uploads/${encodeURIComponent(vehicleRegistrationBack)}`} // Backend URL
            alt="vehicleRegistrationFront  Preview"
            width="100%"
        />
    </Box>
) : (
    // Fallback or message if cnicFront is null
    <Box sx={{ marginTop: 1 }}>
        <p>No vehicle Registration Back Image</p>
    </Box>
)}

            </div>
        </div>
    </div>
    
  </Box>

            
                </CardContent>
              </Card>
            </Grid>
          </Grid>

           
                
         

          <Card sx={{ marginBottom: 2 }}>
  <CardContent>
    <Typography variant="h6">Vehicle Photos</Typography>

    <div className="App">
      <div id="FileUpload">
        <div className="wrapper">
          <div
            className={`upload ${dragOver ? 'dragging' : ''}`}
            onDragOver={(e) => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => handleDrop(e, setVehiclePhotosState)} // Handle drop for multiple photos
          >
            <p>Drag Vehicle Photos here or</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleVehiclePhotosChange} // Handle file selection
              style={{ display: 'none' }}
              id="vehicle-photos-upload"
            />
            <label htmlFor="vehicle-photos-upload" className="upload__button">
              Browse
            </label>
          </div>

          {/* Display existing photos if vehiclePhotosBool is false */}
          {state.vehiclePhotosBool === false && vehicle?.vehiclePhotos?.length > 0 && (
            <Box sx={{ marginTop: 1 }}>
               <ul style={{ display: 'flex', padding: 0, listStyleType: 'none', flexWrap: 'wrap' }}>
                {vehicle.vehiclePhotos.map((photo, index) => (
                  <li key={index} style={{ marginRight: 10, marginBottom: 10, position: 'relative' }}>
                    <img
                      src={`http://localhost:5000/uploads/${encodeURIComponent(photo)}`} // Backend URL for existing images
                      alt={`Existing Vehicle Photo ${index + 1}`}
                      width="250px" // Adjust width as needed
                      style={{ borderRadius: '8px', marginBottom: 10 }}
                    />
                    <button
                      onClick={() => removePhoto(index)} // Remove photo on click
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'transparent',
                        border: 'none',
                        color: 'red',
                        fontSize: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {/* Display selected photos if vehiclePhotosBool is true */}
          {state.vehiclePhotosBool === true && vehiclePhotos.length > 0 && (
            <Box sx={{ marginTop: 1 }}>
              <Typography variant="body2">Selected Photos:</Typography>
              <ul style={{ display: 'flex', padding: 0, listStyleType: 'none', flexWrap: 'wrap' }}>
                {vehiclePhotos.map((photo, index) => (
                  <li key={index} style={{ marginRight: 10, marginBottom: 10, position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(photo)} // Create preview URL for selected photo
                      alt={`Vehicle Photo ${index + 1}`}
                      width="250px" // Adjust width as needed
                      style={{ borderRadius: '8px', marginBottom: 10 }}
                    />
                    <button
                      onClick={() => removePhoto(index)} // Remove photo on click
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'transparent',
                        border: 'none',
                        color: 'red',
                        fontSize: '24px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </div>
      </div>
    </div>

    {errorMessages?.vehiclePhotos && (
      <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
        {errorMessages.vehiclePhotos}
      </Typography>
    )}
  </CardContent>
</Card>

<Box sx={{ display: 'flex', justifyContent: 'center' }}>
  <Button
    variant="contained"
    color="primary"
    type="submit"
    sx={{
      width: '250px', // Fixed width
      padding: '10px 20px', // Add padding
    }}
  >
    Update Driver
  </Button>
</Box>


      </form>
    </Paper>
  </Box>
);
};


export default EditDriver;
  