import React from "react";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  // If is authenticated is "true" let the user navigate else get him out to the register page
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  // console.log("this", isAuthenticated);

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