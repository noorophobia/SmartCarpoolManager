import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
  Link,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

 import Passengers from './pages/admin/Passengers';
import Drivers from './pages/admin/Drivers';
import Settings from './pages/admin/Settings';
import Rides from './pages/admin/Rides';
import Default from './pages/Default';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
 import Login from './pages/auth/Login';
 import Home from './pages/Home'
import Menu from './components/Menu'
import Map from './pages/Map'
import PendingApplications from './pages/admin/PendingApplications';
import '../src/styles/global.css';  // Import the CSS file
 import RatingsAndReviews from './pages/admin/RatingsAndReviews';
import Revenue from './pages/revenue/OverallRevenue';
 import YearlyRevenue from './pages/revenue/YearlyRevenue';
import DriverDetails from './components/DriverDetails';
import RateSetting from './pages/admin/RateSetting';
import PassengerDetails from './components/PassengerDetails';
import RideDetails from './components/RideDetails';
 import AddEditDriver from './components/AddPassenger';
import AddDriver from './components/AddDriver';
import EditDriver from './components/EditDriver';


   
const Layout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to track the loading state

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check if token exists
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
    }else {
      // If authenticated, stop loading
      setLoading(false);
    }

    
    const decoded = jwtDecode(token); // Decode the full JWT token (header + payload)
    console.log(decoded); // Log the full decoded token to check all claims

    // Access the 'exp' claim from the decoded payload
    const exp = decoded.exp;
    console.log('Expiration Date:', new Date(exp * 1000)); 
    const currentTime = Date.now() / 1000; // Get the current time in seconds
    if (exp < currentTime) {
      // If the token is expired, remove it from localStorage and redirect to login page
      localStorage.removeItem('token');
      alert("Session Expired");
      navigate('/login')}
   
  }, [navigate]); // Runs once when the component mounts
  if (loading) {
    // While loading, show nothing or a loading spinner
    return null; // You can also return a loading spinner here if desired
  }

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
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Use <Layout /> here
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
          path: "/add-driver/", // New route for details page
          element: <AddDriver />,  
        }, {
          path: "/edit-driver/:id", // New route for editing driver page
          element: <EditDriver />,  
        },
 
        {
          path: "/rides",
          element: <Rides />,
        },
        {
          path: "/revenue",
          element: <Revenue />,
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
          path: "/map",
          element: <Map />,
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
          path: "/passenger-details/:id",
          element:<PassengerDetails/>,
         },
         {
          path: "/ride-details/:rideID",
          element:<RideDetails/>,
         },
        {
          path:"/rate-setting",
          element:<RateSetting/>,
         },
         
         
      ],
      
    }, {
      path: "/login",
      element: <Login />,
    },
    
  ]);

  return <RouterProvider router={router} />;
}

export default App;
