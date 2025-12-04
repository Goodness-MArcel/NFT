import React from "react";
import { Link } from 'react-router-dom';
import './Footer.css'

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 mt-5 pb-3">
      <div className="container">
        <div className="row gy-4">
          {/* Categories  */}
          <div className="col-md-3">
            <h5 className="fw-bold">Categories</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/categories/arts" className="text-white-50 text-decoration-none">
                  Arts
                </Link>
              </li>
              <li>
                <Link to="/categories/gaming" className="text-white-50 text-decoration-none">
                  Gaming
                </Link>
              </li>
              <li>
                <Link to="/categories/pfps" className="text-white-50 text-decoration-none">
                  PFPS
                </Link>
              </li>
              <li>
                <Link to="/categories/membership" className="text-white-50 text-decoration-none">
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/categories/photography" className="text-white-50 text-decoration-none">
                  Photography
                </Link>
              </li>
              <li>
                <Link to="/categories/exhibition" className="text-white-50 text-decoration-none">
                  Exhibition
                </Link>
              </li>
            </ul>
          </div>

          {/* Company  */}
          <div className="col-md-3">
            <h5 className="fw-bold">Company</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/privacy-policy" className="text-white-50 text-decoration-none">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-white-50 text-decoration-none">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-md-3">
            <h5 className="fw-bold">Account</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/account-overview" className="text-white-50 text-decoration-none">
                  Account Overview
                </Link>
              </li>
              <li>
                <Link to="/mint-nft" className="text-white-50 text-decoration-none">
                  Mint Nft
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-white-50 text-decoration-none">
                  Transaction
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="fw-bold">Stay in touch</h5>
            <p className="text-white-50 small">
              Don't miss anything, Stay in touch with us and get real time
              update.
            </p>
            <form className="d-flex">
              <input
                type="email"
                className="form-control rounded-start"
                placeholder="Email Address"
              />
              <button className="btn btn-light ms-2 rounded-end" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-white-50 small">
          © Copyright 2025 ARTMAGIC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer ;