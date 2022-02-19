import React from 'react'
import { Outlet,Navigate } from 'react-router-dom';
// import { useAuth } from "./use-auth.js";

const ProtectedRoute = (props) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log(props);
  if(!isAuthenticated)
  {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default ProtectedRoute
