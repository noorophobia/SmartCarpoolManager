import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
 import Passengers from './pages/Passengers';
import Drivers from './pages/Drivers';
import Settings from './pages/Settings';
import Rides from './pages/Rides';
import Default from './pages/Default';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
 import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'
import Menu from './components/Menu'
import PendingApplications from './pages/PendingApplications';
import '../src/styles/global.css';  // Import the CSS file

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
          path: "/rides",
          element: <Rides />,
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
