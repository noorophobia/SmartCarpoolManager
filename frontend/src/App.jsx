 import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
 } from "react-router-dom";
import  { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
 import { useLocation } from "react-router-dom";
 import CircularProgress from '@mui/material/CircularProgress';

 import Passengers from './pages/passenger/Passengers';
import Drivers from './pages/driver/Drivers';
import Settings from './pages/admin/Settings';
import Rides from './pages/rides/Rides';
import Default from './pages/Default';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
 import Login from './pages/auth/Login';
 import Home from './pages/Home'
import Menu from './components/Menu'
 import PendingApplications from './pages/admin/PendingApplications';
import '../src/styles/global.css';  
 import RatingsAndReviews from './pages/admin/RatingsAndReviews';
import Revenue from './pages/revenue/OverallRevenue';
 import YearlyRevenue from './pages/revenue/YearlyRevenue';
import DriverDetails from './pages/driver/DriverDetails';
import RateSetting from './pages/admin/RateSetting';
import PassengerDetails from './pages/passenger/PassengerDetails';
import RideDetails from './pages/rides/RideDetails';
 import AddDriver from './pages/driver/AddDriver';
import EditDriver from './pages/driver/EditDriver';
import ContactUs from "./pages/admin/ContactUs";
import PushNotifications from "./pages/admin/PushNotification";
import Packages from "./pages/admin/Packages";
 
import EditPassenger from "./pages/passenger/EditPassenger";
import AddPassenger from "./pages/passenger/AddPassenger";
import CarpoolRides from "./pages/rides/CarpoolRideDetails";
const Layout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  
  const [theme, setTheme] = useState("light");  
  const location = useLocation();
  

  //background color change
  useEffect(() => {
    if (location.pathname === "/login") {
      document.body.style.background = "linear-gradient(to right, #3D52A0, #1F4D75, #8697C4)";  
    } else {
      document.body.style.background = "";  
    }
  }, [location]); 
  
  //token check
  useEffect(() => {
    const token = localStorage.getItem("token");  
    if (!token) {
       navigate("/login");
       return;
    }else {
       setLoading(false);
     }
    

     //theme check
      const savedTheme = localStorage.getItem("theme") || "light"; 
      setTheme(savedTheme);
      // data-theme in variable.css
      document.body.setAttribute("data-theme", savedTheme);  
  

      //token expiry check
    const decoded = jwtDecode(token); 
    console.log(decoded); 
    

     const exp = decoded.exp;
    console.log('Expiration Date:', new Date(exp * 1000)); 
    const currentTime = Date.now() / 1000;  
    if (exp < currentTime) {
       localStorage.removeItem('token');
      alert("Session Expired");
      navigate('/login')}
   
  }, [navigate]); // Runs once when the component mounts
  if (loading) {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    );}

  return (
    <div className="main">
      <Navbar />
      <div className="container">
      <div className="menuContainer">
        <Menu />
      </div>
      {/* The fragment/part which displays the content */}
      <div className="contentContainer">
        <Outlet/>
      </div>
      </div>
      <Footer />
    </div>
  );
}


function App() {
  //used to define all routes and their components.
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, 
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/passengers",
          element: <Passengers />,
        },
        {
          path: "/drivers",
          element: <Drivers />,
        },
        {
          path: "/edit-passenger", 
          element: <EditPassenger />,  
        },
        {
          path: "/add-driver", 
          element: <AddDriver />,  
        }, {
          path: "/edit-driver/:id", 
          element: <EditDriver />,  
        },
        {
          path: "/add-passenger", 
          element: <AddPassenger />,  
        },
        {
          path: "/rides",
          element: <Rides />,
        },
        {
          path: "/carpool-ride-details",
          element: <CarpoolRides />,
        },
        
        {
          path: '/image',
          element: <Image/>
        },
        {
          path: "/contact-us",
          element: <ContactUs/>,
        },
        {
          path: "/revenue",
          element: <Revenue />,
        },
        {
          path: "/packages",
          element: <Packages />,
        },
        {
          path: "/revenue-yearly",
          element: <YearlyRevenue />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        
        {
          path: "/pending-applications",
          element: <PendingApplications />,
        },
         
        {
          path: "/ratings-and-reviews",
          element: <RatingsAndReviews />,
        },
        {
          path: "/*",
          element: <Default />,
        },
        {
         path:"/drivers/:id" ,
         element:<DriverDetails />,

        },
        {
          path: "/passenger-details",
          element:<PassengerDetails/>,
         },
         {
          path: "/ride-details",
          element:<RideDetails/>,
         },
        {
          path:"/rate-setting",
          element:<RateSetting/>,
         },
         
         {
          path:"/push-notification",
          element:<PushNotifications/>,
         },
         
      ],
      
    }, {
      path: "/login",
      element: <Login />,
    },
    
  ]);
  //RouterProvider makes routes available to the whole app.
  return <RouterProvider router={router} />;
}

export default App;
