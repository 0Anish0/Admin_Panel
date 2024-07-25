import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RequestTable from './components/RequestTable';
import UserTable from './components/UserTable';
import RequestDetails from "./components/RequestDetails"
import ManageRequest from "./components/ManageRequest"
import UserDetails from "./components/UserDetails"

function App() {

  const PrivateRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('adminToken');
    return token ? <Component {...rest} /> : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="/view-and-manage-requests" element={<PrivateRoute element={RequestTable} />} />
        <Route path="/view-all-users" element={<PrivateRoute element={UserTable} />} />
        <Route path="/requests/:requestId" element={<PrivateRoute element={RequestDetails} />} />
        <Route path="/request/:requestId" element={<PrivateRoute element={ManageRequest} />} />
        <Route path="/user-details/:email" element={<PrivateRoute element={UserDetails} />} />
      </Routes>
    </Router>
  );
}

export default App;