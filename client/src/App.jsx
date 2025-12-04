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

// Category Pages
const Arts = lazy(() => import("./pages/categories/Arts"));
const Gaming = lazy(() => import("./pages/categories/Gaming"));
const PFPS = lazy(() => import("./pages/categories/PFPS"));
const Membership = lazy(() => import("./pages/categories/Membership"));
const Photography = lazy(() => import("./pages/categories/Photography"));
const Exhibition = lazy(() => import("./pages/categories/Exhibition"));

// Company Pages
const PrivacyPolicy = lazy(() => import("./pages/company/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/company/TermsOfService"));

// Account Pages
const AccountOverview = lazy(() => import("./pages/account/AccountOverview"));
const MintNft = lazy(() => import("./pages/account/MintNft"));
const Transaction = lazy(() => import("./pages/account/Transaction"));
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
            
            {/* Category Routes */}
            <Route path="/categories/arts" element={<Arts />} />
            <Route path="/categories/gaming" element={<Gaming />} />
            <Route path="/categories/pfps" element={<PFPS />} />
            <Route path="/categories/membership" element={<Membership />} />
            <Route path="/categories/photography" element={<Photography />} />
            <Route path="/categories/exhibition" element={<Exhibition />} />
            
            {/* Company Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* Account Routes */}
            <Route path="/account-overview" element={<AccountOverview />} />
            <Route path="/mint-nft" element={<MintNft />} />
            <Route path="/transactions" element={<Transaction />} />
            
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
