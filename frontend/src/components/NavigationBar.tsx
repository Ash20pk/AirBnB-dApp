import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './style/NavigationBar.css';
interface NavigationBarProps {
    connected: boolean;
    onConnect: () => Promise<void>; // Assuming connect/disconnect are async functions
    onDisconnect: () => void; 

}

const NavigationBar: React.FC<NavigationBarProps> = ({ connected, onConnect, onDisconnect }) => {
  return (
    <AppBar position="static" className="navbar"> {/* Apply the navbar class */}
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }} className="logo"> {/* Apply the logo class */}
        🏠 BlockStay
        </Typography>
        <Button color="inherit" component={Link} to="/" className="nav-link">Home</Button>
        <Button color="inherit" component={Link} to="/book" className="nav-link">Book</Button>
        <Button color="inherit" component={Link} to="/list" className="nav-link">List</Button>
        {connected ? (
          <Button color="inherit" onClick={onDisconnect} className="disconnect-button">Disconnect Wallet</Button>
        ) : (
          <Button color="inherit" onClick={onConnect} className="connect-button">Connect Wallet</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
