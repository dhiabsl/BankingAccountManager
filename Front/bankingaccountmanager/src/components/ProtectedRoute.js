import React from "react";
import { Redirect, Route } from "react-router-dom";
import { toast } from "react-toastify";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  console.log("this", isAuthenticated);
  toast.info("You need to Create an account")

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/register" />
      }
    />
  );
}

export default ProtectedRoute;