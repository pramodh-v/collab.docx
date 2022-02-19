import React from 'react'
import { useNavigate,Route } from 'react-router-dom';
// import { useAuth } from "./use-auth.js";

const ProtectedRoute = (props) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if(!isAuthenticated)
  {
    return navigate('/');
  }
  return <Route {...props}  />
}

export default ProtectedRoute
