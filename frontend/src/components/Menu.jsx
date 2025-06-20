import React from 'react';
 import {Link} from 'react-router-dom';
import '../styles/menu.css'
const Menu = () => {
  return (
    <div className="menu">
         <div className="item">
          <div className="title">Main</div>
          <Link to="/home" className="listItem"> 
            <img src="/public/home.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Home </span>
          </Link>

       {/*  <Link to="/profile" className="listItem"> 
            <img src="profile.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Profile </span>
          </Link>
         </div> */ } 
         </div>
       
         <div className="item">
          <div className="title">Lists</div>
          <Link to="/passengers" className="listItem"> 
            <img src="/public/passenger.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Passengers </span>
          </Link>

          <Link to="/drivers" className="listItem"> 
            <img src="/public/driver.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Drivers </span>
          </Link>
          <Link to="/rides" className="listItem"> 
            <img src="/public/ride.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Ride History </span>
          </Link>
          <Link to="/pending-applications" className="listItem"> 
            <img src="/public/pending_icon.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Pending Applications </span>
          </Link>
          <Link to="/ratings-and-reviews" className="listItem"> 
            <img src="/public/ratings_icon.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Ratings and Reviews </span>
          </Link>
          <Link to="/rate-setting" className="listItem"> 
            <img src="/public/rate_setting.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Vehicle Rate Settings </span>
          </Link>
         </div>

         <div className="item">
 
          <div className="title">Revenue Report</div>
          <Link to="/revenue" className="listItem"> 
            <img src="/public/revenue.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Overall Revenue </span>
          </Link>
          
          <Link to="/revenue-yearly" className="listItem"> 
            <img src="/public/revenue.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Yearly Revenue </span>
          </Link>
         
         </div>
         <div className="item">
          <div className="title">General</div>
          <Link to="/settings" className="listItem"> 
            <img src="/public/settings.svg" alt="icon" className="icon" />
             <span className="listItemTitle">Settings </span>
          </Link>

         
         </div>
         
    </div>
  );
}

export default Menu; 
