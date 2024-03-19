import React, { useState, useEffect } from "react";
import { CustomProvider, Container } from "rsuite";
import "rsuite/dist/rsuite.min.css";

import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { isAuthenticated } from "./auth";
import { AuthProvider, useAuth } from "./AuthContext";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import Users from "./components/Users";
import ManageUsers from "./components/ManageUsers";
import Profile from "./components/Profile";
import ManageStock from "./components/ManageStock";
import ViewCollections from "./components/ViewCollections";
import AddStock from "./components/AddStock";
import ManageSales from "./components/ManageSales";
import AddSale from "./components/AddSale";
import ViewSales from "./components/ViewSales";
import SalesReports from "./components/SalesReports";
import StockReports from "./components/StockReports";
import Subscriptions from "./components/Subscriptions";
import CreateProfile from "./components/CreateProfile";

const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/auth/login/" state={{ from: path }} />
  );
};

const App = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("appTheme") || "light"
  );

  useEffect(() => {
    // Set the theme in localStorage when it changes
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    
    <CustomProvider theme={theme}>
      <Container className="app">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute
                    element={
                      <Dashboard theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />

              <Route
                path="/dashboard/users"
                element={
                  <PrivateRoute
                    element={
                      <Users theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/users/manage"
                element={
                  <PrivateRoute
                    element={
                      <ManageUsers theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/users/my-profile"
                element={
                  <PrivateRoute
                    element={
                      <Profile theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />

              <Route
                path="/dashboard/users/create-profile"
                element={
                  <PrivateRoute
                    element={
                      <CreateProfile theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />

              <Route
                path="/dashboard/stock"
                element={
                  <PrivateRoute
                    element={
                      <ViewCollections
                        theme={theme}
                        onChangeTheme={toggleTheme}
                      />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/stock/add"
                element={
                  <PrivateRoute
                    element={
                      <AddStock theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/stock/manage"
                element={
                  <PrivateRoute
                    element={
                      <ManageStock theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/stock/reports"
                element={
                  <PrivateRoute
                    element={
                      <StockReports theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />

              <Route
                path="/dashboard/sales"
                element={
                  <PrivateRoute
                    element={
                      <ViewSales theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/sales/add"
                element={
                  <PrivateRoute
                    element={
                      <AddSale theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/sales/manage"
                element={
                  <PrivateRoute
                    element={
                      <ManageSales theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/sales/subscriptions/add/"
                element={
                  <PrivateRoute
                    element={
                      <Subscriptions theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
              <Route
                path="/dashboard/sales/reports"
                element={
                  <PrivateRoute
                    element={
                      <SalesReports theme={theme} onChangeTheme={toggleTheme} />
                    }
                  />
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </Container>
    </CustomProvider>
  );
};

export default App;
