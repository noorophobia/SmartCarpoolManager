import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
 import Passengers from './pages/admin/Passengers';
import Drivers from './pages/admin/Drivers';
import Settings from './pages/admin/Settings';
import Rides from './pages/admin/Rides';
import Default from './pages/Default';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
 import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home'
import Menu from './components/Menu'
import Map from './pages/Map'
import PendingApplications from './pages/admin/PendingApplications';
import '../src/styles/global.css';  // Import the CSS file
import UserDetails from './components/UserDetails';
import RatingsAndReviews from './pages/admin/RatingsAndReviews';
import Revenue from './pages/revenue/OverallRevenue';
 import YearlyRevenue from './pages/revenue/YearlyRevenue';

function Layout() {
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
          path: "",
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
          path: "/details/:type/:id", // New route for details page
          element: <UserDetails />,  // DetailsPage component
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
      ],
      
    }, {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
