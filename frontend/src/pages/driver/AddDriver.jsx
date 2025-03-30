
  
  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { TextField, Button, MenuItem, Paper, Box, Typography, Alert, Grid, Card, CardContent } from '@mui/material';
  import '../../styles/addDriver.css';
  import DriverService from '../../services/DriverService'; // ✅ Import the service
  
  const AddDriver = () => {
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
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [emails, setEmails] = useState([]);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [cnics, setCnics] = useState([]);
    const navigate = useNavigate();
  
    const [errorMessages, setErrorMessages] = useState({
      driverFirstName: "",
      driverLastName: "",
      driverGender: "",
      driverEmail: "",
      driverPhone: "",
      driverCnicNumber: "",
      driverDOB: "",
      vehicleName: "",
      brand: "",
      vehicleColor: "",
      vehicleType: "",
      carType: "",
      driverPassword: "",
      vehicleProductionYear: "",
      licenseNumber: "",
      vehiclePhotos: "",
      vehicleRegistrationFront: "",
      vehicleRegistrationBack: "",
      driverCnicFront: "",
      driverCnicBack: "",
      driverSelfie: "",
    });
  
    useEffect(() => {
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
      fetchAllDrivers();
    }, []);
  
    const currentYear = new Date().getFullYear();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setErrorMessages({});
      let hasError = false;
  
      if (emails.includes(driverEmail)) {
        setErrorMessages((prev) => ({ ...prev, driverEmail: "Email is already in use" }));
        hasError = true;
      }
      if (phoneNumbers.includes(driverPhone)) {
        setErrorMessages((prev) => ({ ...prev, driverPhone: "Phone number is already in use" }));
        hasError = true;
      }
      if (cnics.includes(driverCnicNumber)) {
        setErrorMessages((prev) => ({ ...prev, driverCnicNumber: "CNIC is already in use" }));
        hasError = true;
      }
  
      // Add all your other field validations here (already present)
  
      if (hasError) return;
  
      const newDriver = {
        driverFirstName,
        driverLastName,
        driverGender,
        driverEmail,
        driverPhone,
        driverCnicNumber,
        driverDOB,
        rating,
        driverPassword,
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
        vehicleRegisterationFront: vehicleRegistrationFront,
        vehicleRegisterationBack: vehicleRegistrationBack,
        vehiclePhotos,
      };
  
      try {
        const driverResponse = await DriverService.addDriver(newDriver);
        if (driverResponse) {
          navigate('/drivers');
        }
      } catch (error) {
        console.error('Error saving data:', error);
        setError('Error saving data. Please try again.');
      }
    };
  
    // ✅ Use image upload from service
    const handleFileChange = async (e, setState) => {
      const file = e.target.files[0];
      if (!file) return;
      const uploadedUrl = await DriverService.uploadImageToImgbb(file);
      if (uploadedUrl) {
        setState(uploadedUrl);
      } else {
        console.error("Image upload failed.");
      }
    };
  
    const handleVehiclePhotosChange = async (e) => {
      const files = Array.from(e.target.files);
      const uploadedUrls = await Promise.all(files.map(file => DriverService.uploadImageToImgbb(file)));
      setVehiclePhotos(prev => [...prev, ...uploadedUrls.filter(Boolean)]);
    };
  
    const handleCnicChange = (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
      if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
      setCnic(value);
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
                      <TextField
                              label="Password"
                              name="password"
                              type="password"
                              value={driverPassword}
                              onChange={(e) => setPassword(e.target.value)}
                              fullWidth
                            />
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
      Add Driver
    </Button>
  </Box>
  
  
        </form>
      </Paper>
    </Box>
  );
  };
  
   
  export default AddDriver;
    