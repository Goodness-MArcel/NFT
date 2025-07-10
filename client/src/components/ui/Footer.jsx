import react from "react";
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
                <a href="#" className="text-white-50 text-decoration-none">
                  Arts
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Gaming
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  PFPS
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Membership
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Photography
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Exhibition
                </a>
              </li>
            </ul>
          </div>

          {/* <Company  */}
          <div className="col-md-3">
            <h5 className="fw-bold">Company</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Terms of service
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-md-3">
            <h5 className="fw-bold">Account</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Account Overview
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Mint Nft
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50 text-decoration-none">
                  Transaction
                </a>
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
          © Copyright 2024 ARTREEM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer ;