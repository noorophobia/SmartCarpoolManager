import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../styles/default.css';

const Default = () => {
  return (
    <div className="display">
      <div className="display__img">
        <img src="/Scarecrow.png" alt="404-Scarecrow" />
      </div>
      <div className="display__content">
        <h2 className="display__content--info">I have bad news for you</h2>
        <p className="display__content--text">
          404 NOT FOUND
        </p>
        <Link to="/" >
          <Button className="btn" variant="contained">Back to homepage</Button>
        </Link>
      </div>
    </div>
  );
};

export default Default;
