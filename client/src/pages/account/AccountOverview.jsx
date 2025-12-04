import React from 'react';
import { Link } from 'react-router-dom';
import './AccountPage.css';

function AccountOverview() {
  return (
    <div className="account-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Account Overview</h1>
          <p className="page-subtitle">
            Manage your NFT portfolio, track your collections, and monitor your blockchain activity 
            all in one convenient dashboard.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>Your NFT Dashboard</h2>
              <p>
                The Account Overview provides a comprehensive view of your NFT portfolio and activity. 
                Connect your wallet to view your collections, track market values, and manage your digital assets.
              </p>

              <h3>Portfolio Features</h3>
              <ul>
                <li><strong>Collection View:</strong> Browse all your NFTs organized by collection</li>
                <li><strong>Value Tracking:</strong> Monitor the estimated value of your portfolio</li>
                <li><strong>Transaction History:</strong> View your complete buying and selling activity</li>
                <li><strong>Market Analytics:</strong> Track floor prices and market trends for your holdings</li>
                <li><strong>Rarity Rankings:</strong> See the rarity scores of your NFTs within their collections</li>
              </ul>

              <h3>Account Management</h3>
              <ul>
                <li><strong>Wallet Connection:</strong> Securely connect and manage multiple wallets</li>
                <li><strong>Profile Settings:</strong> Customize your display name and preferences</li>
                <li><strong>Privacy Controls:</strong> Choose what information to make public</li>
                <li><strong>Notification Settings:</strong> Configure alerts for price changes and new drops</li>
              </ul>

              <h3>Security Features</h3>
              <p>
                Your security is our priority. The account overview includes:
              </p>
              <ul>
                <li>Two-factor authentication setup</li>
                <li>Login activity monitoring</li>
                <li>Suspicious activity alerts</li>
                <li>Secure wallet connection protocols</li>
              </ul>

              <h3>Getting Started</h3>
              <p>
                To access your account overview:
              </p>
              <ol>
                <li>Connect your cryptocurrency wallet</li>
                <li>Verify your wallet ownership</li>
                <li>Complete your profile setup</li>
                <li>Enable security features</li>
                <li>Start exploring your NFT portfolio</li>
              </ol>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Quick Actions</h4>
                <ul>
                  <li>Connect Wallet</li>
                  <li>View Collections</li>
                  <li>Track Portfolio Value</li>
                  <li>Export Data</li>
                  <li>Update Profile</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Supported Wallets</h4>
                <ul>
                  <li>MetaMask</li>
                  <li>Coinbase Wallet</li>
                  <li>WalletConnect</li>
                  <li>Phantom</li>
                  <li>Trust Wallet</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Need Help?</h4>
                <p>
                  Visit our support center for tutorials on wallet connection, 
                  portfolio management, and account security.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/profile" className="btn-primary">
            Access Dashboard
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountOverview;