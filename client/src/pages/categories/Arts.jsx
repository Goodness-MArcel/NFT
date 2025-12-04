import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';

function Arts() {
  return (
    <div className="category-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Art NFTs</h1>
          <p className="page-subtitle">
            Discover unique digital artworks created by talented artists from around the world. 
            Each piece represents a one-of-a-kind digital collectible stored on the blockchain.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>What are Art NFTs?</h2>
              <p>
                Art NFTs (Non-Fungible Tokens) represent digital artworks that are authenticated and secured on the blockchain. 
                They provide artists with a new way to monetize their digital creations while giving collectors 
                proof of authenticity and ownership of unique digital art pieces.
              </p>

              <h3>Types of Art NFTs</h3>
              <ul>
                <li><strong>Digital Paintings:</strong> Original digital artwork created using digital tools</li>
                <li><strong>Generative Art:</strong> Art created through algorithmic processes and code</li>
                <li><strong>3D Art:</strong> Three-dimensional digital sculptures and installations</li>
                <li><strong>Animated Art:</strong> Moving artworks including GIFs and video art</li>
                <li><strong>Mixed Media:</strong> Combinations of traditional and digital art forms</li>
              </ul>

              <h3>Why Collect Art NFTs?</h3>
              <p>
                Art NFTs offer collectors the opportunity to own unique digital assets while supporting artists directly. 
                They provide provenance, rarity verification, and the potential for appreciation in value. 
                Additionally, many art NFTs come with exclusive benefits like access to artist communities or physical prints.
              </p>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Featured Collections</h4>
                <ul>
                  <li>Abstract Expressions</li>
                  <li>Digital Renaissance</li>
                  <li>Cyber Landscapes</li>
                  <li>Minimalist Wonders</li>
                  <li>Colorful Chaos</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Artist Spotlights</h4>
                <p>
                  Discover emerging and established digital artists making waves in the NFT space. 
                  From traditional artists transitioning to digital to native crypto artists.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/discover" className="btn-primary">
            Explore Art NFTs
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Arts;