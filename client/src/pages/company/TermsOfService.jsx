import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyPage.css';

function TermsOfService() {
  return (
    <div className="company-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Terms of Service</h1>
          <p className="page-subtitle">
            Please read these terms carefully before using our NFT marketplace platform. 
            By accessing our services, you agree to be bound by these terms.
          </p>
          <p className="last-updated">Last updated: December 4, 2025</p>
        </div>

        <div className="content-section">
          <div className="policy-content">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using ArtMagic ("the Platform"), you agree to comply with and be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform.
            </p>

            <h2>2. Platform Description</h2>
            <p>
              ArtMagic is a digital marketplace for NFTs (Non-Fungible Tokens) that allows users to:
            </p>
            <ul>
              <li>Browse and discover NFT collections</li>
              <li>Connect cryptocurrency wallets</li>
              <li>View NFT metadata and transaction history</li>
              <li>Access educational content about NFTs and blockchain technology</li>
            </ul>

            <h2>3. User Eligibility</h2>
            <p>To use our platform, you must:</p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into contracts</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not be prohibited from using our services under any applicable law</li>
            </ul>

            <h2>4. Account Responsibilities</h2>
            <p>When using our platform, you are responsible for:</p>
            <ul>
              <li>Maintaining the security of your cryptocurrency wallet</li>
              <li>All transactions made through your wallet connection</li>
              <li>Ensuring your wallet has sufficient funds for transactions</li>
              <li>Understanding the risks associated with blockchain transactions</li>
              <li>Complying with tax obligations in your jurisdiction</li>
            </ul>

            <h2>5. Blockchain and NFT Risks</h2>
            <p>
              You acknowledge and accept the following risks associated with NFTs and blockchain technology:
            </p>
            <ul>
              <li><strong>Volatility:</strong> NFT values can fluctuate dramatically</li>
              <li><strong>Technology Risks:</strong> Smart contracts may contain bugs or vulnerabilities</li>
              <li><strong>Regulatory Risk:</strong> Laws governing NFTs may change</li>
              <li><strong>Loss of Private Keys:</strong> Lost keys mean permanent loss of access</li>
              <li><strong>Network Congestion:</strong> Blockchain networks may experience delays</li>
              <li><strong>Gas Fees:</strong> Transaction costs can vary significantly</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <h3>Platform Content</h3>
            <p>
              All content on our platform, including text, graphics, logos, and software, 
              is owned by ArtMagic or our licensors and is protected by copyright and other intellectual property laws.
            </p>
            <h3>NFT Content</h3>
            <p>
              NFTs displayed on our platform are owned by their respective creators or current holders. 
              We do not claim ownership of NFT content and act solely as a display platform.
            </p>

            <h2>7. Prohibited Activities</h2>
            <p>Users may not:</p>
            <ul>
              <li>Use the platform for illegal activities or money laundering</li>
              <li>Attempt to manipulate NFT prices or engage in market manipulation</li>
              <li>Upload or display content that infringes on intellectual property rights</li>
              <li>Use automated systems to access the platform without permission</li>
              <li>Attempt to reverse engineer or compromise platform security</li>
              <li>Engage in harassment or abuse of other users</li>
            </ul>

            <h2>8. Platform Availability</h2>
            <p>
              We strive to maintain platform availability but cannot guarantee uninterrupted service. 
              The platform may be temporarily unavailable due to:
            </p>
            <ul>
              <li>Scheduled maintenance</li>
              <li>Technical difficulties</li>
              <li>Blockchain network issues</li>
              <li>Third-party service disruptions</li>
            </ul>

            <h2>9. Third-Party Services</h2>
            <p>
              Our platform integrates with third-party services including wallet providers, 
              blockchain networks, and data providers. We are not responsible for the 
              availability, accuracy, or functionality of these external services.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ArtMagic shall not be liable for:
            </p>
            <ul>
              <li>Loss of profits, data, or business opportunities</li>
              <li>NFT value fluctuations or investment losses</li>
              <li>Technical failures or blockchain network issues</li>
              <li>Actions of third-party services or wallet providers</li>
              <li>Unauthorized access to your wallet or accounts</li>
            </ul>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ArtMagic from any claims, damages, or expenses 
              arising from your use of the platform, violation of these terms, or infringement of third-party rights.
            </p>

            <h2>12. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your personal information.
            </p>

            <h2>13. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Significant changes will be 
              communicated through the platform, and continued use constitutes acceptance of updated terms.
            </p>

            <h2>14. Termination</h2>
            <p>
              We may suspend or terminate your access to the platform at our discretion, 
              particularly for violations of these terms or applicable laws.
            </p>

            <h2>15. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction in which ArtMagic operates, 
              without regard to conflict of law principles.
            </p>

            <h2>16. Contact Information</h2>
            <p>
              For questions about these terms:
            </p>
            <ul>
              <li>Email: legal@artmagic.com</li>
              <li>Contact form on our website</li>
              <li>Discord community server</li>
            </ul>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/privacy-policy" className="btn-primary">
            Privacy Policy
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;