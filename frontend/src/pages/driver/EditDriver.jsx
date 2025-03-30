import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, MenuItem, Paper, Box, Typography, Alert, Grid, Card, CardContent, CardMedia, CardHeader } from '@mui/material';
import '../../styles/addDriver.css'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DriverService from '../../services/DriverService';


const EditDriver = () => {
    const [driverFirstName, setFirstName] = useState('');
     const [driverLastName, setLastName] = useState('');
     const [driverGender, setGender] = useState('');
      const [driverEmail, setEmail] = useState('');
      const [driverCnicNumber, setCnic] = useState('');
      const [driverPassword, setPassword] = useState('');
      const [driverPhone, setPhoneNumber] = useState('');
     const [driverDOB, setDateOfBirth] = useState('');
     const [rating, setRatings] = useState(0);
     const [brand, setVehicleBrand] = useState('');
     const [vehicleName, setVehicleName] = useState('');
     const [vehicleColor, setVehicleColor] = useState('');
     const [vehicleType, setVehicleType] = useState('');
     const [carType, setCarType] = useState('');
     const [vehicleProductionYear, setVehicleProductionYear] = useState('');
     const [licenseNumber, setLicenseNumber] = useState('');
     const [vehiclePhotos, setVehiclePhotos] = useState([]);
     const [vehicleRegistrationFront, setVehicleRegistrationFront] = useState(null);
     const [vehicleRegistrationBack, setVehicleRegistrationBack] = useState(null);
     const [driverCnicFront, setCnicFront] = useState(null);
     const [driverCnicBack, setCnicBack] = useState(null);
     const [driverSelfie, setDriverPhoto] = useState(null);
     const [oldEmail, setOldEmail] = useState(null);
     const [oldCnic, setOldCnic] = useState(null);
     const [oldPhone, setOldPhone] = useState(null);
    

    
    
      const currentYear = new Date().getFullYear();
  
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
        
      driverFirstName: "",
      driverLastName: "",
  
      driverGender: "",
      driverEmail: "",
      driverPhone: "",
      driverCnicNumber: "",
      driverDOB: "",
      vehicleName: "",
      brand:"",
      vehicleColor:"",
      vehicleType:"",
      carType:"",
      driverPassword:"",
      vehicleProductionYear: "",
      licenseNumber: "",
      vehiclePhotos : "",
      vehicleRegistrationFront: "",
     vehicleRegistrationBack: "",
     driverCnicFront: "",
     driverCnicBack: "",
     driverSelfie: "",      });
  const { id } = useParams(); // Get the driver ID from URL params (if editing)
  const navigate = useNavigate();
 
  useEffect(() => {
    if (id) {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token');  // Or sessionStorage.getItem('token')
        
           if (!token) {
            // If no token is found, redirect to the login page
            navigate('/login');
            return;
          }
          
      // Fetch the driver data if editing
      const fetchDriver = async () => {
        try {
          const data = await DriverService.getDriverById(id);
          if (data) {
            setFirstName(data.driverFirstName || '');
            setLastName(data.driverLastName || '');
            setGender(data.driverGender || '');
            setEmail(data.driverEmail || '');
            setCnic(data.driverCnicNumber || '');
            setOldCnic(data.driverCnicNumber || '');
            setOldEmail(data.driverEmail || '');
            setOldPhone(data.driverPhone || '');
            setPhoneNumber(data.driverPhone || '');
            setDateOfBirth(data.driverDOB ? data.driverDOB.split('T')[0] : '');
            setRatings(data.rating || 0);
            setVehicleBrand(data.brand || '');
            setVehicleName(data.vehicleName || '');
            setVehicleColor(data.vehicleColor || '');
            setVehicleType(data.vehicleType || '');
            setCarType(data.carType || '');
            setVehicleProductionYear(data.vehicleProductionYear || '');
            setLicenseNumber(data.licenseNumber || '');
            setVehiclePhotos(data.vehiclePhotos || []);
            setVehicleRegistrationFront(data.vehicleRegistrationFront || null);
            setVehicleRegistrationBack(data.vehicleRegistrationBack || null);
            setCnicFront(data.driverCnicFront || null);
            setCnicBack(data.driverCnicBack || null);
            setDriverPhoto(data.driverSelfie || null);
          }
        } catch (error) {
          console.error('Failed to fetch driver:', error);
        }
      };
      

      const fetchAllDrivers = async () => {
        try {
          const data = await DriverService.getAllDrivers();
          setEmails(data.map(driver => driver.email));
          setPhoneNumbers(data.map(driver => driver.phoneNumber));
          setCnics(data.map(driver => driver.cnic));
        } catch (error) {
          console.error('Failed to fetch drivers:', error);
        }
      };
      
      
      
      fetchDriver();
      fetchAllDrivers();
      

    }
  }, [id]);

    
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasError) return;
  
    const updatedDriver = {
      driverFirstName,
      driverLastName,
      driverGender,
      driverEmail,
      driverPhone,
      driverCnicNumber,
      driverDOB,
      rating,
      driverCnicFront,
      driverCnicBack,
      driverSelfie,
      vehicleProductionYear,
      vehicleType,
      carType,
      vehicleName,
      vehicleColor,
      licenseNumber,
      brand,
      vehicleRegistrationFront,
      vehicleRegistrationBack,
      vehiclePhotos
    };
  
    try {
      await DriverService.updateDriver(id, updatedDriver);
      console.log('Driver updated successfully');
      navigate('/drivers');
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
  
  
  
  
  const uploadImageToImgbb = async (file) => {
    const apiKey = "068837d15525cd65b1c49b07e618821b";
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data && response.data.data && response.data.data.url) {
         return response.data.data.url; // ✅ Return the uploaded image URL
      } else {
        console.error("Imgbb response is missing URL:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Image upload to Imgbb failed:", error);
      return null;
    }
  };
  
  
  const handleFileChange = async (e, setState) => {
    const file = e.target.files[0];
    if (!file) return;
  
    console.log(`Uploading: ${file.name}`);
    const uploadedUrl = await uploadImageToImgbb(file);
    console.log("uploaded url "+uploadedUrl)
    if (uploadedUrl) {
      console.log(`Uploaded URL (${file.name}):`, uploadedUrl); // ✅ Debugging
      setState(uploadedUrl); // ✅ Store URL instead of file object
    } else {
      console.error("Image upload failed for:", file.name);
    }
  };
  
  
    
  
  
  const handleVehiclePhotosChange = async (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    const uploadedUrls = await Promise.all(files.map(file => uploadImageToImgbb(file)));
  
    setVehiclePhotos(prevPhotos => [...prevPhotos, ...uploadedUrls.filter(url => url)]); // Append new photos
  };
  
  const handleDrop = async (e, setFileCallback) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await handleImageUpload(file, setFileCallback);
    } else {
      console.warn("Invalid file type.");
    }
  };
  
  const handleImageUpload = async (file, setState) => {
    if (!file) return;
  
    const uploadedUrl = await uploadImageToImgbb(file);
    if (uploadedUrl) {
      setState(uploadedUrl); // ✅ Set the URL, not the file object
    } else {
      console.error("Image upload failed for:", file.name);
    }
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
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                value={driverFirstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                margin="normal"
                                error={!!errorMessages.driverFirstName}
                                helperText={errorMessages.driverFirstName}
            
                              />
                              <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                value={driverLastName}
                                onChange={(e) => setLastName(e.target.value)}
                                margin="normal"
                                error={!!errorMessages.driverLastName}
                                helperText={errorMessages.driverLastName}
            
                              />
                              <TextField
                                label="Gender"
                                variant="outlined"
                                fullWidth
                                select
                                value={driverGender}
                                onChange={(e) => setGender(e.target.value)}
                                margin="normal"
                                error={!!errorMessages.driverGender}
                                helperText={errorMessages.driverGender}
                              >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                              </TextField>
                              <TextField
                                label="Email"
                                variant="outlined"
                                type="email"
                                fullWidth
                                value={driverEmail}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errorMessages.driverEmail}
                                helperText={errorMessages.driverEmail}
                                margin="normal"
                              />
                              <TextField
                                label="Phone Number"
                                variant="outlined"
                                type="tel"
                                fullWidth
                                value={driverPhone}
                                onChange={(e) => {
                                  const input = e.target.value;
                                  
                                  // Only modify if it's a valid number and doesn't start with +92
                                  if (!input.startsWith("+92") && input) {
                                    setPhoneNumber(`+92${input.replace(/^0/, "")}`); // Prepend +92 and remove leading 0 if present
                                  } else {
                                    setPhoneNumber(input); // Otherwise, just set the value as is
                                  }
                                }}                    margin="normal"
                                error={!!errorMessages.driverPhone}
                                helperText={errorMessages.driverPhone}
                              />
                              {/* <TextField
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={driverPassword}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                      />*/} 
                              <TextField
                                label="CNIC"
                                variant="outlined"
                                fullWidth
                                value={driverCnicNumber}
                                onChange={handleCnicChange}
                                margin="normal"
                                error={!!errorMessages.driverCnicNumber}
                                helperText={errorMessages.driverCnicNumber}
                              />
                              <TextField
                                label="Date of Birth"
                                variant="outlined"
                                type="date"
                                fullWidth
                                value={driverDOB}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                margin="normal"
                                error={!!errorMessages.driverDOB}
                                helperText={errorMessages.driverDOB}
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
                            onChange={(e) => handleFileChange(e, setDriverPhoto)}
            
                        style={{ display: 'none' }}
                        id="driver-photo-upload"
                      />
                      <label htmlFor="driver-photo-upload" className="upload__button">
                        Browse
                      </label>
                    </div>
            
                    {driverSelfie && (
                         <Box sx={{ marginTop: 1 }}>
                          
                          <img 
                  src={typeof driverSelfie === "string" ? driverSelfie : URL.createObjectURL(driverSelfie)} 
                  alt="Driver Photo Preview" 
                  width="100%" 
                />            </Box>
                     
                           )}
                           {/* Displaying error if any */}
                    {errorMessages.driverSelfie && (
                      <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                        {errorMessages.driverSelfie}
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
                           onChange={(e) => handleFileChange(e, setCnicFront)}
            
                        style={{ display: 'none' }}
                        id="cnicfront-photo-upload"
                      />
                      <label htmlFor="cnicfront-photo-upload" className="upload__button">
                        Browse
                      </label>
                    </div>
            
                    {driverCnicFront && (
                         <Box sx={{ marginTop: 1 }}>
                           <img 
                  src={typeof driverCnicFront === "string" ? driverCnicFront : URL.createObjectURL(driverCnicFront)} 
                  alt="cnicFront Photo Preview" 
                  width="100%" 
                />
                         </Box>
                     
                           )}
                             {errorMessages.driverCnicFront && (
                      <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                        {errorMessages.driverCnicFront}
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
                           onChange={(e) => handleFileChange(e, setCnicBack)}
            
                        style={{ display: 'none' }}
                        id="cnicback-photo-upload"
                      />
                      <label htmlFor="cnicback-photo-upload" className="upload__button">
                        Browse
                      </label>
                    </div>
            
                    {driverCnicBack && (
                         <Box sx={{ marginTop: 1 }}>
                                  <img 
                  src={typeof driverCnicBack === "string" ? driverCnicBack : URL.createObjectURL(driverCnicBack)} 
                  alt="cnicBack Photo Preview" 
                  width="100%" 
                />
                         </Box>
                     
                           )}
                             {errorMessages.driverCnicBack && (
                      <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                        {errorMessages.driverCnicBack}
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
             
                                <MenuItem value="car">Car</MenuItem>
                                <MenuItem value="bike">Bike</MenuItem>
                                
                              </TextField>
                               <TextField
                                label="Car Type"
                                variant="outlined"
                                fullWidth
                                select
                                value={carType}
                                onChange={(e) => setCarType(e.target.value)}
                                margin="normal"
                                error={!!errorMessages.carType}
                                helperText={errorMessages.carType}
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
                           onChange={(e) => handleFileChange(e, setVehicleRegistrationFront)}
            
                        style={{ display: 'none' }}
                        id="registrationFront-photo-upload"
                      />
                      <label htmlFor="registrationFront-photo-upload" className="upload__button">
                        Browse
                      </label>
                    </div>
            
                    {vehicleRegistrationFront && (
                         <Box sx={{ marginTop: 1 }}>
                                   <img 
                  src={typeof vehicleRegistrationFront === "string" ? vehicleRegistrationFront : URL.createObjectURL(vehicleRegistrationFront)} 
                  alt="vehicleRegistrationFront Photo Preview" 
                  width="100%" 
                />
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
                           onChange={(e) => handleFileChange(e, setVehicleRegistrationBack)}
            
                        style={{ display: 'none' }}
                        id="registrationBack-photo-upload"
                      />
                      <label htmlFor="registrationBack-photo-upload" className="upload__button">
                        Browse
                      </label>
                    </div>
            
                    {vehicleRegistrationBack && (
                         <Box sx={{ marginTop: 1 }}>
                                          <img 
                  src={typeof vehicleRegistrationBack === "string" ? vehicleRegistrationBack : URL.createObjectURL(vehicleRegistrationBack)} 
                  alt="vehicleRegistrationBack Photo Preview" 
                  width="100%" 
                />
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
              src={typeof photo === "string" ? photo : URL.createObjectURL(photo)} 
              alt={`Vehicle Photo ${index + 1}`} 
              width="250px"
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
                Update Driver
              </Button>
            </Box>
            
            
                  </form>
                </Paper>
              </Box>
            );
            };
            
             
            export default EditDriver;
              