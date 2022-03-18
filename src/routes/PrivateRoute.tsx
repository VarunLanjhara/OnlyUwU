import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../components/Loader";

const PrivateRoute = ({ children }: any) => {
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);
  return loading ? <Loader /> : user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
