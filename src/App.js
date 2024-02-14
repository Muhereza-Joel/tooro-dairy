import React, { useState, useEffect } from 'react';
import { CustomProvider, Container } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Users from './components/Users';
import ManageUsers from './components/ManageUsers';
import Profile from './components/Profile';
import ManageStock from './components/ManageStock';
import ViewCollections from './components/ViewCollections';
import AddStock from './components/AddStock';
import ManageSales from './components/ManageSales';
import AddSale from './components/AddSale';
import ViewSales from './components/ViewSales';

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
            <Route path='/' element={<Login />} />
            <Route path='/auth/login' element={<Login />} />
            <Route path='/auth/register' element={<Register />} />

            <Route path='/dashboard' element={<Dashboard theme={theme} onChangeTheme={toggleTheme} />} />

            <Route path='/dashboard/users' element={<Users theme={theme} onChangeTheme={toggleTheme} />}/>
            <Route path='/dashboard/users/manage' element={<ManageUsers theme={theme} onChangeTheme={toggleTheme} />}/>
            <Route path='/dashboard/users/my-profile' element={<Profile theme={theme} onChangeTheme={toggleTheme} />}/>

            <Route path='/dashboard/stock' element={<ViewCollections theme={theme} onChangeTheme={toggleTheme} />}/>
            <Route path='/dashboard/stock/add' element={<AddStock theme={theme} onChangeTheme={toggleTheme} />}/>
            <Route path='/dashboard/stock/manage' element={<ManageStock theme={theme} onChangeTheme={toggleTheme} />}/>

            <Route path='/dashboard/sales' element={<ViewSales theme={theme} onChangeTheme={toggleTheme} />}/>
            <Route path='/dashboard/sales/add' element={<AddSale theme={theme} onChangeTheme={toggleTheme} />}/>
            <Route path='/dashboard/sales/manage' element={<ManageSales theme={theme} onChangeTheme={toggleTheme} />}/>


          </Routes>
        </Router>
      </Container>
    </CustomProvider>
  );
}

export default App;
