import React from 'react';
import { Link } from 'react-router-dom';
import './AccountPage.css';

function MintNft() {
  return (
    <div className="account-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Mint NFT</h1>
          <p className="page-subtitle">
            Create and mint your own NFTs on the blockchain. Transform your digital creations 
            into unique, tradeable tokens with provable ownership and authenticity.
          </p>
        </div>

        <div className="content-section">
          <div className="row">
            <div className="col-md-8">
              <h2>What is NFT Minting?</h2>
              <p>
                Minting an NFT is the process of creating a unique digital token on the blockchain that represents 
                ownership of a digital asset. When you mint an NFT, you're essentially publishing your digital 
                creation to the blockchain, making it a permanent, verifiable, and tradeable asset.
              </p>

              <h3>Minting Process</h3>
              <ol>
                <li><strong>Prepare Your Digital Asset:</strong> Upload your image, video, audio, or other digital content</li>
                <li><strong>Add Metadata:</strong> Include title, description, and properties</li>
                <li><strong>Choose Blockchain:</strong> Select the blockchain network (Ethereum, Polygon, etc.)</li>
                <li><strong>Set Royalties:</strong> Configure creator royalties for future sales</li>
                <li><strong>Pay Gas Fees:</strong> Cover blockchain transaction costs</li>
                <li><strong>Complete Minting:</strong> Your NFT is created and added to your wallet</li>
              </ol>

              <h3>Supported File Types</h3>
              <ul>
                <li><strong>Images:</strong> JPEG, PNG, GIF, SVG (up to 100MB)</li>
                <li><strong>Videos:</strong> MP4, WEBM, MOV (up to 100MB)</li>
                <li><strong>Audio:</strong> MP3, WAV, OGG (up to 100MB)</li>
                <li><strong>3D Models:</strong> GLB, GLTF (up to 100MB)</li>
                <li><strong>Documents:</strong> PDF (up to 100MB)</li>
              </ul>

              <h3>Minting Costs</h3>
              <p>
                The cost of minting an NFT includes:
              </p>
              <ul>
                <li><strong>Gas Fees:</strong> Blockchain network transaction costs</li>
                <li><strong>Platform Fees:</strong> Service fees for using our minting platform</li>
                <li><strong>Storage Costs:</strong> IPFS storage for your digital assets</li>
              </ul>

              <h3>Best Practices</h3>
              <ul>
                <li>Use high-quality, original digital content</li>
                <li>Write detailed, engaging descriptions</li>
                <li>Add relevant tags and categories</li>
                <li>Consider rarity and uniqueness</li>
                <li>Set appropriate royalty percentages</li>
                <li>Choose the right blockchain for your needs</li>
              </ul>

              <h3>After Minting</h3>
              <p>
                Once your NFT is minted:
              </p>
              <ul>
                <li>It appears in your wallet and account dashboard</li>
                <li>You can list it for sale on marketplaces</li>
                <li>It becomes part of the permanent blockchain record</li>
                <li>You receive a unique token ID and contract address</li>
                <li>Others can discover and potentially purchase your NFT</li>
              </ul>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <h4>Minting Options</h4>
                <ul>
                  <li>Single NFT Minting</li>
                  <li>Collection Creation</li>
                  <li>Batch Minting</li>
                  <li>Lazy Minting</li>
                  <li>Gasless Minting</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Blockchain Networks</h4>
                <ul>
                  <li>Ethereum (ETH)</li>
                  <li>Polygon (MATIC)</li>
                  <li>Binance Smart Chain</li>
                  <li>Solana</li>
                  <li>Arbitrum</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Creator Tools</h4>
                <p>
                  Access advanced features like collection management, 
                  royalty tracking, and analytics for your minted NFTs.
                </p>
              </div>

              <div className="info-card">
                <h4>Gas Fee Estimator</h4>
                <p>
                  Use our real-time gas tracker to find the best times 
                  to mint your NFTs at lower costs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/create" className="btn-primary">
            Start Minting
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MintNft;