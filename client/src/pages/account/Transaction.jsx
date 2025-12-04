import React from 'react';
import { Link } from 'react-router-dom';
import './AccountPage.css';

function Transaction() {
  return (
    <div className="account-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Transaction History</h1>
          <p className="page-subtitle">
            Track all your NFT transactions, monitor blockchain activity, and keep detailed records 
            of your buying, selling, and trading activities.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>Your Transaction Dashboard</h2>
              <p>
                The Transaction History provides a comprehensive overview of all your NFT-related blockchain activities. 
                Every purchase, sale, transfer, and mint is recorded and displayed with detailed information 
                for easy tracking and record-keeping.
              </p>

              <h3>Transaction Types</h3>
              <ul>
                <li><strong>Purchases:</strong> NFTs you've bought from marketplaces or other users</li>
                <li><strong>Sales:</strong> NFTs you've sold, including sale price and buyer information</li>
                <li><strong>Transfers:</strong> NFTs you've sent or received as gifts or transfers</li>
                <li><strong>Mints:</strong> New NFTs you've created and minted to the blockchain</li>
                <li><strong>Bids:</strong> Your bidding activity on auction-style listings</li>
                <li><strong>Offers:</strong> Offers you've made or received on NFTs</li>
              </ul>

              <h3>Transaction Details</h3>
              <p>
                Each transaction record includes:
              </p>
              <ul>
                <li>Transaction hash and blockchain confirmation</li>
                <li>Date and time of transaction</li>
                <li>NFT details (name, collection, token ID)</li>
                <li>Transaction amount and currency</li>
                <li>Gas fees paid</li>
                <li>Counterparty addresses</li>
                <li>Transaction status and confirmations</li>
              </ul>

              <h3>Filtering and Search</h3>
              <p>
                Find specific transactions using our advanced filtering options:
              </p>
              <ul>
                <li>Filter by transaction type (buy, sell, mint, transfer)</li>
                <li>Search by NFT name or collection</li>
                <li>Filter by date range</li>
                <li>Sort by value, date, or gas fees</li>
                <li>Filter by blockchain network</li>
                <li>Search by transaction hash</li>
              </ul>

              <h3>Export and Reporting</h3>
              <ul>
                <li><strong>CSV Export:</strong> Download transaction data for tax reporting</li>
                <li><strong>PDF Reports:</strong> Generate formatted transaction summaries</li>
                <li><strong>Tax Integration:</strong> Compatible with popular crypto tax software</li>
                <li><strong>Portfolio Tracking:</strong> Monitor gains and losses over time</li>
              </ul>

              <h3>Blockchain Verification</h3>
              <p>
                Every transaction can be verified on the blockchain:
              </p>
              <ul>
                <li>Direct links to blockchain explorers (Etherscan, Polygonscan, etc.)</li>
                <li>Real-time confirmation status</li>
                <li>Gas fee breakdown and optimization suggestions</li>
                <li>Network congestion indicators</li>
              </ul>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Quick Stats</h4>
                <ul>
                  <li>Total Transactions</li>
                  <li>Total Volume Traded</li>
                  <li>Average Transaction Value</li>
                  <li>Gas Fees Paid</li>
                  <li>Portfolio Performance</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Supported Networks</h4>
                <ul>
                  <li>Ethereum Mainnet</li>
                  <li>Polygon</li>
                  <li>Binance Smart Chain</li>
                  <li>Arbitrum</li>
                  <li>Optimism</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Tax Tools</h4>
                <p>
                  Export your transaction data in formats compatible with 
                  CoinTracker, Koinly, and other crypto tax platforms.
                </p>
              </div>

              <div className="info-card">
                <h4>Security Features</h4>
                <p>
                  All transaction data is pulled directly from the blockchain 
                  for maximum accuracy and transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/profile" className="btn-primary">
            View Transactions
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Transaction;