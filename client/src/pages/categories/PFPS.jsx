import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';

function PFPS() {
  return (
    <div className="category-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Profile Picture NFTs</h1>
          <p className="page-subtitle">
            Express your digital identity with unique PFP (Profile Picture) NFTs. 
            Join exclusive communities and showcase your personality with these collectible avatars.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>What are PFP NFTs?</h2>
              <p>
                PFP (Profile Picture) NFTs are digital collectibles designed to be used as profile pictures across 
                social media platforms and digital spaces. They often feature unique combinations of traits and attributes, 
                making each NFT one-of-a-kind while belonging to a larger collection with shared themes or styles.
              </p>

              <h3>Popular PFP Collections</h3>
              <ul>
                <li><strong>Bored Ape Yacht Club:</strong> The legendary ape collection that started the PFP trend</li>
                <li><strong>CryptoPunks:</strong> The original NFT collection of pixelated characters</li>
                <li><strong>Azuki:</strong> Anime-inspired characters with unique traits</li>
                <li><strong>Doodles:</strong> Colorful, hand-drawn characters with playful designs</li>
                <li><strong>Cool Cats:</strong> Stylish feline characters with various accessories</li>
              </ul>

              <h3>Community and Identity</h3>
              <p>
                PFP NFTs are more than just images – they represent membership in exclusive communities. 
                Holders often gain access to private Discord servers, exclusive events, merchandise, 
                and other benefits. Your PFP becomes part of your digital identity and social status online.
              </p>

              <h3>Trait Rarity</h3>
              <p>
                Most PFP collections use a trait-based system where different attributes (background, clothing, 
                accessories, etc.) have varying levels of rarity. The combination of rare traits can significantly 
                impact an NFT's value and desirability within the collection.
              </p>

              <h3>Utility and Roadmaps</h3>
              <p>
                Many PFP projects offer additional utility beyond just the image, such as:
              </p>
              <ul>
                <li>Access to exclusive metaverse experiences</li>
                <li>Governance tokens for community decisions</li>
                <li>Physical merchandise and events</li>
                <li>Breeding mechanics to create new NFTs</li>
                <li>Integration with games and applications</li>
              </ul>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Top PFP Collections</h4>
                <ul>
                  <li>Bored Ape Yacht Club</li>
                  <li>Mutant Ape Yacht Club</li>
                  <li>CryptoPunks</li>
                  <li>Azuki</li>
                  <li>Clone X</li>
                  <li>Doodles</li>
                  <li>World of Women</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Collecting Tips</h4>
                <p>
                  Research the project's roadmap, community strength, and utility before purchasing. 
                  Consider both the artistic value and the long-term potential of the collection.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/discover" className="btn-primary">
            Explore PFP Collections
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PFPS;