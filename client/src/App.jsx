import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./context/AuthContext";
// import ProfilePage from "./components/pages/Profile";
const Home = lazy(() => import('./components/pages/Home'));
const Login = lazy(() => import("./components/auths/Login"));
const SignUp = lazy(() => import("./components/auths/Register"));
const ProfilePage = lazy(() => import("./components/pages/Profile"));
const PrivateRoute = lazy(() => import("./privateRoute.jsx"));

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </Suspense>
  )};