import react from "react";

function Footer() {
  return (
    <footer class="bg-dark text-white pt-5 mt-5 pb-3">
      <div class="container">
        <div class="row gy-4">
          {/* Categories  */}
          <div class="col-md-3">
            <h5 class="fw-bold">Categories</h5>
            <ul class="list-unstyled">
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Arts
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Gaming
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  PFPS
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Membership
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Photography
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Exhibition
                </a>
              </li>
            </ul>
          </div>

          {/* <Company  */}
          <div class="col-md-3">
            <h5 class="fw-bold">Company</h5>
            <ul class="list-unstyled">
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Terms of service
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div class="col-md-3">
            <h5 class="fw-bold">Account</h5>
            <ul class="list-unstyled">
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Account Overview
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Mint Nft
                </a>
              </li>
              <li>
                <a href="#" class="text-white-50 text-decoration-none">
                  Transaction
                </a>
              </li>
            </ul>
          </div>

          <div class="col-md-3">
            <h5 class="fw-bold">Stay in touch</h5>
            <p class="text-white-50 small">
              Don't miss anything, Stay in touch with us and get real time
              update.
            </p>
            <form class="d-flex">
              <input
                type="email"
                class="form-control rounded-start"
                placeholder="Email Address"
              />
              <button class="btn btn-light ms-2 rounded-end" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>

        <hr class="border-secondary my-4" />

        <div class="text-center text-white-50 small">
          © Copyright 2024 ARTREEM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer ;