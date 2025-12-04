import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';

function Gaming() {
  return (
    <div className="category-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Gaming NFTs</h1>
          <p className="page-subtitle">
            Enter the world of gaming NFTs where digital assets have real utility. 
            Collect in-game items, characters, and virtual land that you truly own.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>Gaming NFTs Revolution</h2>
              <p>
                Gaming NFTs are transforming the gaming industry by giving players true ownership of their in-game assets. 
                These tokens represent characters, weapons, skins, virtual land, and other game items that can be traded, 
                sold, or used across different games and platforms.
              </p>

              <h3>Types of Gaming NFTs</h3>
              <ul>
                <li><strong>Characters & Avatars:</strong> Unique playable characters with distinct attributes</li>
                <li><strong>Weapons & Items:</strong> Rare weapons, armor, and consumable items</li>
                <li><strong>Virtual Land:</strong> Plots of land in metaverse worlds and gaming platforms</li>
                <li><strong>Skins & Cosmetics:</strong> Visual enhancements and character customizations</li>
                <li><strong>Game Cards:</strong> Collectible trading cards with gameplay functionality</li>
              </ul>

              <h3>Play-to-Earn Gaming</h3>
              <p>
                Gaming NFTs enable play-to-earn models where players can earn real value through gameplay. 
                By owning NFT assets, players can participate in game economies, trade with other players, 
                and potentially profit from their gaming activities.
              </p>

              <h3>Cross-Platform Utility</h3>
              <p>
                One of the most exciting aspects of gaming NFTs is their potential for cross-platform use. 
                A sword earned in one game might be usable in another, creating a truly interconnected gaming ecosystem.
              </p>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Popular Gaming NFT Projects</h4>
                <ul>
                  <li>Axie Infinity</li>
                  <li>The Sandbox</li>
                  <li>Decentraland</li>
                  <li>Gods Unchained</li>
                  <li>Splinterlands</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Getting Started</h4>
                <p>
                  New to gaming NFTs? Start by exploring popular play-to-earn games and 
                  understanding the mechanics of each platform before making investments.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/discover" className="btn-primary">
            Explore Gaming NFTs
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Gaming;