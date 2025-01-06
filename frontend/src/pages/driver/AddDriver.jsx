import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Paper, Box, Typography, Alert, Grid, Card, CardContent, CardMedia, CardHeader } from '@mui/material';
import '../../styles/addDriver.css';
import axios from 'axios';
const AddDriver = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
   const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ratings, setRatings] = useState(0);
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
  const navigate = useNavigate();
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
 // Fetch drivers data from the Express server when the component mounts
 useEffect(() => {
      
  const fetchAllDrivers = async () => {
    try {
      const token = localStorage.getItem('token'); // Adjust according to how you're storing the token

       const response = await fetch(`http://localhost:5000/drivers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setEmails(data.map(driver => driver.email));
        setPhoneNumbers(data.map(driver => driver.phoneNumber));
        setCnics(data.map(driver => driver.cnic));
      }
      

    } catch (error) {
      console.error('Failed to fetch driver:', error);
    }
  };

  fetchAllDrivers(); // Call the function to fetch data
}, []);

const currentYear = new Date().getFullYear();
 
 
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

    if (emails.includes(email)) {
       
         
      setErrorMessages((prev) => ({ ...prev, email: "Email is already in use" }));
      hasError = true;
      
    }
    if (phoneNumbers.includes(phoneNumber)) {
        
      setErrorMessages((prev) => ({ ...prev, phoneNumber: "Phone Number is already in use" }));
      hasError = true;
    }
    if (cnics.includes(cnic)) {
      setErrorMessages((prev) => ({ ...prev, cnic: "CNIC is already in use" }));
      hasError = true;
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
     
     if (vehiclePhotos.length === 0) {
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
  formData.append('vehicleRegistrationFront', vehicleRegistrationFront);
  formData.append('vehicleRegistrationBack', vehicleRegistrationBack);
  formData.append('cnicFront', cnicFront);
  formData.append('driverPhoto', driverPhoto);
  formData.append('cnicBack', cnicBack);
  vehiclePhotos.forEach(photo => {
    formData.append('vehiclePhotos', photo); // Append each file
  });
      console.log(vehiclePhotos)
 
      try {
        // Retrieve the token (example: from local storage)
        const token = localStorage.getItem('token'); // Adjust according to how you're storing the token
      alert(newDriver);
      alert(token)
      const driverResponse = await axios.post(
        'http://localhost:5000/drivers',
        { ...newDriver }, // Data to be sent in the body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token here
          },
        }
      );
    
      const driverResult = driverResponse.data;
    
      if (driverResponse.status === 201) {
          formData.append('driverId', driverResult._id);
          console.log(formdata)
      
          const vehicleResponse = await axios.post('http://localhost:5000/vehicles', formData, {
            headers: {
              'Authorization': `Bearer ${token}`, // Add the token to headers
              'Content-Type': 'multipart/form-data', // Inform server about formData
            },
          });
      
          // Handle the response
          if (vehicleResponse.status === 201) {
            navigate('/drivers'); // Navigate back to the drivers list after success
          } else {
            setError(vehicleResponse.data.message || 'Error saving vehicle. Please try again.');
          }
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
    console.log('Images selected:', files); // Log the files directly

  };
 

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', padding: 2 }}>
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
       
        <h2 className="header">Add New Driver</h2>


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
        <div
          className={`upload ${dragOver ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
           onDrop={(e) => handleDrop(e, setDriverPhoto)} // Pass a different updater
           
        >
          <p>
            Drag driver photo here or{' '}
           </p>
          <input
            type="file"
            accept="image/*"
              onChange={e => { setDriverPhoto(e.target.files[0]) }}
              
            style={{ display: 'none' }}
            id="driver-photo-upload"
          />
          <label htmlFor="driver-photo-upload" className="upload__button">
            Browse
          </label>
        </div>

        {driverPhoto && (
             <Box sx={{ marginTop: 1 }}>
              <img src={URL.createObjectURL(driverPhoto)} alt="Driver Photo  Preview" width="100%" />
            </Box>
         
               )}
               {/* Displaying error if any */}
        {errorMessages.driverPhoto && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {errorMessages.driverPhoto}
          </Typography>
        )}
      </div>
    </div>
  </div>
  </Box>

  <Box sx={{ marginTop: 2 }}>
  <Typography variant="h6">Cnic Photos</Typography>
  <div className="App">
    <div id="FileUpload">
      <div className="wrapper">
        <div
          className={`upload ${dragOver ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
           onDrop={(e) => handleDrop(e, setCnicFront)} // Pass a different updater

        >
          <p>
            Drag Cnic Front photo here or{' '}
           </p>
          <input
            type="file"
            accept="image/*"
              onChange={e => { setCnicFront(e.target.files[0]) }}
            style={{ display: 'none' }}
            id="cnicfront-photo-upload"
          />
          <label htmlFor="cnicfront-photo-upload" className="upload__button">
            Browse
          </label>
        </div>

        {cnicFront && (
             <Box sx={{ marginTop: 1 }}>
              <img src={URL.createObjectURL(cnicFront)} alt="Driver Photo  Preview" width="100%" />
            </Box>
         
               )}
                 {errorMessages.cnicFront && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {errorMessages.cnicFront}
          </Typography>
        )}
      </div>
    </div>
  </div>


  <div className="App">
    <div id="FileUpload">
      <div className="wrapper">
        <div
          className={`upload ${dragOver ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
           onDrop={(e) => handleDrop(e, setCnicBack)} // Pass a different updater

        >
          <p>
            Drag Cnic Back photo here or
           </p>
          <input
            type="file"
            accept="image/*"
              onChange={e => { setCnicBack(e.target.files[0]) }}
            style={{ display: 'none' }}
            id="cnicback-photo-upload"
          />
          <label htmlFor="cnicback-photo-upload" className="upload__button">
            Browse
          </label>
        </div>

        {cnicBack && (
             <Box sx={{ marginTop: 1 }}>
              <img src={URL.createObjectURL(cnicBack)} alt="Driver Photo  Preview" width="100%" />
            </Box>
         
               )}
                 {errorMessages.cnicBack && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {errorMessages.cnicBack}
          </Typography>
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
        <div
          className={`upload ${dragOver ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
           onDrop={(e) => handleDrop(e, setVehicleRegistrationFront)} // Pass a different updater

        >
          <p>
            Drag Vehicle Registration Front photo here or
           </p>
          <input
            type="file"
            accept="image/*"
              onChange={e => { setVehicleRegistrationFront(e.target.files[0]) }}
            style={{ display: 'none' }}
            id="registrationFront-photo-upload"
          />
          <label htmlFor="registrationFront-photo-upload" className="upload__button">
            Browse
          </label>
        </div>

        {vehicleRegistrationFront && (
             <Box sx={{ marginTop: 1 }}>
              <img src={URL.createObjectURL(vehicleRegistrationFront)} alt="Driver Photo  Preview" width="100%" />
            </Box>
         
               )}
                 {errorMessages.vehicleRegistrationFront && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {errorMessages.vehicleRegistrationFront}
          </Typography>
        )}
      </div>
    </div>
  </div>
 
              <div className="App">
    <div id="FileUpload">
      <div className="wrapper">
        <div
          className={`upload ${dragOver ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
           onDrop={(e) => handleDrop(e, setVehicleRegistrationBack)} // Pass a different updater

        >
          <p>
            Drag Vehicle Registration Back photo here or
           </p>
          <input
            type="file"
            accept="image/*"
              onChange={e => { setVehicleRegistrationBack(e.target.files[0]) }}
            style={{ display: 'none' }}
            id="registrationBack-photo-upload"
          />
          <label htmlFor="registrationBack-photo-upload" className="upload__button">
            Browse
          </label>
        </div>

        {vehicleRegistrationBack && (
             <Box sx={{ marginTop: 1 }}>
              <img src={URL.createObjectURL(vehicleRegistrationBack)} alt="Driver Photo  Preview" width="100%" />
            </Box>
         
               )}
                 {errorMessages.vehicleRegistrationBack && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {errorMessages.vehicleRegistrationBack}
          </Typography>
        )}
      </div>
    </div>
  </div>
  </Box>

            
                </CardContent>
              </Card>
            </Grid>
          </Grid>

           
                
         

        {/* Vehicle Photos */}
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Vehicle Photos</Typography>
          
            <div className="App">
  <div id="FileUpload">
    <div className="wrapper">
      <div
        className={`upload ${dragOver ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, setVehiclePhotos)} // Handle drop for multiple photos
      >
        <p>Drag Vehicle Photos here or</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleVehiclePhotosChange}

          style={{ display: 'none' }}
          id="vehicle-photos-upload"
        />
        <label htmlFor="vehicle-photos-upload" className="upload__button">
          Browse
        </label>
      </div>
       

      {vehiclePhotos.length > 0 && (
        <Box sx={{ marginTop: 1 }}>
          <Typography variant="body2">Selected Photos:</Typography>
          <ul style={{ display: 'flex', padding: 0, listStyleType: 'none', flexWrap: 'wrap' }}>
            {vehiclePhotos.map((photo, index) => (
              <li key={index} style={{ marginRight: 10, marginBottom: 10 }}>
                <img
                  src={URL.createObjectURL(photo)} // Show image preview
                  alt={`Vehicle Photo ${index + 1}`}
                  width="250px" // Adjust width as needed
                  style={{ borderRadius: '8px', marginBottom: 10 }}
                />
              </li>
            ))}
          </ul>
        </Box>
      )}
           
    </div>
  </div>
</div>
{errorMessages.vehiclePhotos && (
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
      width: '250px',  // Fixed width
      padding: '10px 20px',  // Add padding
    }}
  >
    Add Driver
  </Button>
</Box>


      </form>
    </Paper>
  </Box>
);
};

 
export default AddDriver;
  