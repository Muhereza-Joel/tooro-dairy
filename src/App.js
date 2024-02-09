import React, { useState, useEffect } from 'react';
import { CustomProvider, Container } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './Register';
import Login from './components/Login';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'light');

  useEffect(() => {
    // Set the theme in localStorage when it changes
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <CustomProvider theme={theme}>
      <Container className="app">
        <Router>
          <Routes>
            <Route path='/dashboard' element={<Dashboard theme={theme} onChangeTheme={toggleTheme} />} />
            <Route path='/' element={<Login />} />
            <Route path='/auth/register' element={<Register />} />
          </Routes>
        </Router>
      </Container>
    </CustomProvider>
  );
}

export default App;
