import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';

function Membership() {
  return (
    <div className="category-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Membership NFTs</h1>
          <p className="page-subtitle">
            Access exclusive communities, events, and experiences with membership NFTs. 
            Your token is your key to premium services and exclusive benefits.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>What are Membership NFTs?</h2>
              <p>
                Membership NFTs function as digital keys that grant holders access to exclusive communities, 
                services, events, and experiences. Unlike traditional memberships, these are tradeable assets 
                that can be bought, sold, and transferred on the blockchain.
              </p>

              <h3>Types of Membership Benefits</h3>
              <ul>
                <li><strong>Exclusive Communities:</strong> Private Discord servers and social groups</li>
                <li><strong>Events Access:</strong> VIP tickets to conferences, meetups, and virtual events</li>
                <li><strong>Product Discounts:</strong> Special pricing on partner products and services</li>
                <li><strong>Early Access:</strong> Priority access to new NFT drops and beta features</li>
                <li><strong>Educational Content:</strong> Premium courses, tutorials, and market insights</li>
                <li><strong>Networking:</strong> Connect with industry leaders and like-minded collectors</li>
              </ul>

              <h3>Popular Membership Models</h3>
              <ul>
                <li><strong>Lifetime Access:</strong> One-time purchase for permanent benefits</li>
                <li><strong>Tiered Memberships:</strong> Different levels with varying benefits</li>
                <li><strong>Utility Tokens:</strong> NFTs that can be "burned" for specific services</li>
                <li><strong>Staking Rewards:</strong> Earn additional benefits by holding long-term</li>
              </ul>

              <h3>Why Choose Membership NFTs?</h3>
              <p>
                Membership NFTs offer unique value propositions:
              </p>
              <ul>
                <li>Transferable ownership - sell or trade your membership</li>
                <li>Potential appreciation in value as communities grow</li>
                <li>Transparent and automated benefit distribution</li>
                <li>Global access without geographic restrictions</li>
                <li>Immutable proof of membership status</li>
              </ul>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Popular Membership NFTs</h4>
                <ul>
                  <li>VeeFriends</li>
                  <li>Bored Ape Yacht Club</li>
                  <li>World of Women Galaxy</li>
                  <li>Proof Collective</li>
                  <li>Deadfellaz</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Membership Benefits</h4>
                <p>
                  Access exclusive content, networking opportunities, and real-world experiences 
                  that money alone can't buy.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/discover" className="btn-primary">
            Explore Memberships
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Membership;