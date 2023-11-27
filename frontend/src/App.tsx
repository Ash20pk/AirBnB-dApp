import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import ListProperty from './components/ListProperty';
import NavigationBar from './components/NavigationBar';
import { Container, Typography } from '@mui/material';

const App: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
 
  const connectWallet = async () => {
    if (window.fuel) {
        try {
            await window.fuel.connect();
            const accounts = await window.fuel.accounts();
            if (accounts.length === 0) {
                throw new Error('No accounts found.');
            }
            setAccount(accounts[0]);
            setConnected(true);
        } catch (err) {
            console.error('error connecting: ', err);
        }
    } else {
        console.error('Fuel wallet is not available');
    }
  }

    // Disconnect wallet logic
  const disconnectWallet = () => {
      setConnected(false);
      setAccount("");
  }

  return (
    <Router>
        <NavigationBar 
            connected={connected} 
            onConnect={connectWallet} 
            onDisconnect={disconnectWallet} 
        />
        <Routes>
            <Route path="/" element={
                <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to BlockStay
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {connected ? `Connected as ${account}` : 'Connect your wallet to start'}
                    </Typography>
                    {/* ... other content ... */}
                </Container>
            } />
            <Route path="/book" element={<PropertyList account={account}/>} />
            <Route path="/list" element={<ListProperty account={account} />} />
            <Route path="/property/:id" element={<PropertyDetail account={account} />} />
        </Routes>
    </Router>
);
};

export default App;
