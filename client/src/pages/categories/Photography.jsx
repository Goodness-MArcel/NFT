import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';

function Photography() {
  return (
    <div className="category-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Photography NFTs</h1>
          <p className="page-subtitle">
            Own authentic digital photographs as NFTs. Support photographers worldwide while 
            collecting stunning visual moments captured and verified on the blockchain.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>Digital Photography as NFTs</h2>
              <p>
                Photography NFTs represent a new frontier for both photographers and collectors. 
                These digital assets provide photographers with a way to monetize their work directly 
                while offering collectors authentic, limited-edition photographs with verified provenance.
              </p>

              <h3>Types of Photography NFTs</h3>
              <ul>
                <li><strong>Landscape Photography:</strong> Stunning natural vistas and scenic locations</li>
                <li><strong>Portrait Photography:</strong> Artistic portraits and character studies</li>
                <li><strong>Street Photography:</strong> Candid moments and urban life documentation</li>
                <li><strong>Abstract Photography:</strong> Experimental and artistic visual compositions</li>
                <li><strong>Wildlife Photography:</strong> Rare moments in nature and animal behavior</li>
                <li><strong>Architectural Photography:</strong> Buildings, structures, and urban design</li>
              </ul>

              <h3>Why Collect Photography NFTs?</h3>
              <p>
                Photography NFTs offer several unique advantages:
              </p>
              <ul>
                <li><strong>Authenticity:</strong> Blockchain verification ensures genuine photographer ownership</li>
                <li><strong>Rarity:</strong> Limited editions make each piece exclusive</li>
                <li><strong>Artist Support:</strong> Direct support to photographers without intermediaries</li>
                <li><strong>High Resolution:</strong> Access to full-quality images for display and printing</li>
                <li><strong>Story & Context:</strong> Rich metadata including location, date, and story behind each shot</li>
              </ul>

              <h3>Photography NFT Marketplace</h3>
              <p>
                The photography NFT market has attracted both emerging and established photographers. 
                From world-renowned photojournalists to talented amateurs, the space offers 
                diverse opportunities for discovery and collecting.
              </p>

              <h3>Print Rights & Usage</h3>
              <p>
                Many photography NFTs include commercial usage rights, allowing collectors to 
                create physical prints, use in publications, or license for commercial purposes. 
                Always check the specific terms associated with each NFT.
              </p>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Featured Photographers</h4>
                <ul>
                  <li>Kevin Abosch</li>
                  <li>Trevor Jones</li>
                  <li>Justin Aversano</li>
                  <li>Cath Simard</li>
                  <li>Drift & Foundation</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Collecting Tips</h4>
                <p>
                  Research the photographer's reputation, consider the artistic merit, 
                  and check what rights are included with your purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/discover" className="btn-primary">
            Explore Photography NFTs
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Photography;