import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';

function Exhibition() {
  return (
    <div className="category-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">NFT Exhibitions</h1>
          <p className="page-subtitle">
            Discover curated NFT exhibitions and virtual galleries. 
            Experience digital art in immersive environments and participate in exclusive showcases.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>Virtual NFT Exhibitions</h2>
              <p>
                NFT exhibitions bring digital art into carefully curated environments, both virtual and physical. 
                These showcases provide context, education, and immersive experiences that enhance 
                the appreciation of digital art and collectibles.
              </p>

              <h3>Types of NFT Exhibitions</h3>
              <ul>
                <li><strong>Virtual Galleries:</strong> 3D spaces showcasing NFT collections with interactive features</li>
                <li><strong>Metaverse Exhibitions:</strong> Immersive experiences in virtual worlds like Decentraland</li>
                <li><strong>Hybrid Shows:</strong> Combination of physical spaces with digital NFT displays</li>
                <li><strong>Themed Exhibitions:</strong> Curated shows focusing on specific genres or movements</li>
                <li><strong>Artist Retrospectives:</strong> Comprehensive showcases of individual creators</li>
                <li><strong>Community Exhibitions:</strong> Collaborative shows featuring community collections</li>
              </ul>

              <h3>Exhibition Features</h3>
              <ul>
                <li><strong>Curated Collections:</strong> Expert curation highlighting significant works</li>
                <li><strong>Artist Talks:</strong> Live discussions with featured creators</li>
                <li><strong>Interactive Elements:</strong> Gamification and user engagement features</li>
                <li><strong>Educational Content:</strong> Context and background about featured works</li>
                <li><strong>Exclusive Drops:</strong> Limited releases tied to exhibition themes</li>
                <li><strong>Virtual Reality:</strong> Immersive VR experiences for supported platforms</li>
              </ul>

              <h3>Upcoming & Past Exhibitions</h3>
              <p>
                Our exhibition calendar features rotating shows that celebrate different aspects 
                of the NFT ecosystem. From historical retrospectives to cutting-edge contemporary 
                works, each exhibition offers unique perspectives on digital ownership and creativity.
              </p>

              <h3>Participating in Exhibitions</h3>
              <p>
                Artists and collectors can submit their works for consideration in upcoming exhibitions. 
                We welcome diverse voices and innovative approaches to digital art and collectibles.
              </p>

              <h3>Educational Mission</h3>
              <p>
                Our exhibitions aim to educate visitors about the cultural and technological significance 
                of NFTs while providing accessible entry points for newcomers to the space.
              </p>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Current Exhibitions</h4>
                <ul>
                  <li>"Digital Renaissance" - Art NFTs</li>
                  <li>"Pixel Perfect" - Early NFT History</li>
                  <li>"Community Canvas" - Collaborative Art</li>
                  <li>"Future Worlds" - Metaverse Galleries</li>
                  <li>"Emerging Voices" - New Artist Showcase</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Exhibition Schedule</h4>
                <p>
                  New exhibitions launch monthly, with special events, artist talks, 
                  and interactive experiences throughout each show's run.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/discover" className="btn-primary">
            View Current Exhibitions
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Exhibition;