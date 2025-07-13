import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./context/AuthContext";

const Home = lazy(() => import('./components/pages/Home'));
const Login = lazy(() => import("./components/auths/Login"));
const SignUp = lazy(() => import("./components/auths/Register"));
const ProfilePage = lazy(() => import("./components/pages/Profile"));
const PrivateRoute = lazy(() => import("./privateRoute.jsx"));
const PFPGridPage = lazy(() => import("./components/nft/PFPGridPage"));
const AdiminUsers = lazy(() => import("./components/admin/AdminUsers"));
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <div className="text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h3 className="mt-3">Loading...</h3>
    </div>
  </div>
);

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pfp-grid/:contractAddress" element={<PFPGridPage />} />
            <Route path="/admin/users" element={<AdiminUsers />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            {/* Add a catch-all route for 404s */}
            <Route path="*" element={
              <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="text-center">
                  <h1>404 - Page Not Found</h1>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};
