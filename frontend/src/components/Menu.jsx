import React from 'react';
 import {Link} from 'react-router-dom';
import '../styles/menu.css'
const Menu = () => {
  return (
    <div className="menu">
         <div className="item">
          <div className="title">Main</div>
          <Link to="/" className="listItem"> 
            <img src="home.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Home </span>
          </Link>

          <Link to="/profile" className="listItem"> 
            <img src="profile.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Profile </span>
          </Link>
         </div>
       
         <div className="item">
          <div className="title">Lists</div>
          <Link to="/passengers" className="listItem"> 
            <img src="passenger.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Passengers </span>
          </Link>

          <Link to="/drivers" className="listItem"> 
            <img src="driver.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Drivers </span>
          </Link>
          <Link to="/rides" className="listItem"> 
            <img src="ride.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Ride History </span>
          </Link>
          <Link to="/pending-applications" className="listItem"> 
            <img src="pending_icon.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Pending Applications </span>
          </Link>
          <Link to="/ratings-and-reviews" className="listItem"> 
            <img src="ratings_icon.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Ratings and Reviews </span>
          </Link>
         </div>

         <div className="item">
 
          <div className="title">Revenue Report</div>
          <Link to="/revenue" className="listItem"> 
            <img src="revenue.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Overall Revenue </span>
          </Link>
          
          <Link to="/revenue-yearly" className="listItem"> 
            <img src="revenue.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Yearly Revenue </span>
          </Link>
         
         </div>
         <div className="item">
          <div className="title">General</div>
          <Link to="/settings" className="listItem"> 
            <img src="settings.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Settings </span>
          </Link>

         
         </div>
         
    </div>
  );
}

export default Menu;
