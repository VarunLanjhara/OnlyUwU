import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import AuthPrivateRoute from "./routes/AuthPrivateRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import YourPosts from "./pages/YourPosts";
import Search from "./pages/Search";
import Followers from "./pages/Followers";
import Create from "./pages/Create";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthPrivateRoute>
              <Login />
            </AuthPrivateRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <PrivateRoute>
              <Explore />
            </PrivateRoute>
          }
        />
        <Route
          path="/library"
          element={
            <PrivateRoute>
              <Library />
            </PrivateRoute>
          }
        />
        <Route
          path="/your_posts"
          element={
            <PrivateRoute>
              <YourPosts />
            </PrivateRoute>
          }
        />
        <Route
          path="/search/:caption"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:uuid"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/followers"
          element={
            <PrivateRoute>
              <Followers />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <Create />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
