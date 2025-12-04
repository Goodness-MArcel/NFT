import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyPage.css';

function PrivacyPolicy() {
  return (
    <div className="company-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle">
            Your privacy is important to us. This policy outlines how we collect, 
            use, and protect your personal information.
          </p>
          <p className="last-updated">Last updated: December 4, 2025</p>
        </div>

        <div className="content-section">
          <div className="policy-content">
            <h2>1. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide when using our platform, including:
            </p>
            <ul>
              <li>Email address for account creation and notifications</li>
              <li>Wallet addresses for blockchain transactions</li>
              <li>Profile information you choose to share</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Usage Information</h3>
            <p>
              We automatically collect certain information about your use of our platform:
            </p>
            <ul>
              <li>IP address and browser information</li>
              <li>Pages visited and features used</li>
              <li>Transaction history on our platform</li>
              <li>Device and operating system information</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our NFT marketplace services</li>
              <li>Process transactions and verify blockchain activities</li>
              <li>Send important notifications about your account</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal requirements and prevent fraud</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information. We may share information in these limited circumstances:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in platform operations</li>
              <li>In connection with blockchain transactions (wallet addresses are public)</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information:
            </p>
            <ul>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
              <li>Secure server infrastructure</li>
            </ul>

            <h2>5. Blockchain and Cryptocurrency</h2>
            <p>
              Important considerations regarding blockchain technology:
            </p>
            <ul>
              <li>Blockchain transactions are permanent and publicly visible</li>
              <li>Wallet addresses and transaction history cannot be deleted</li>
              <li>We do not control or have access to your private keys</li>
              <li>Smart contract interactions are irreversible</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request corrections to inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Export your data in a machine-readable format</li>
            </ul>

            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and features</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>

            <h2>8. Third-Party Services</h2>
            <p>
              Our platform integrates with third-party services including:
            </p>
            <ul>
              <li>Blockchain networks (Ethereum, Polygon, etc.)</li>
              <li>Wallet providers (MetaMask, WalletConnect, etc.)</li>
              <li>Payment processors for fiat transactions</li>
              <li>Analytics and monitoring services</li>
            </ul>

            <h2>9. Children's Privacy</h2>
            <p>
              Our platform is not intended for users under 18 years of age. 
              We do not knowingly collect personal information from children.
            </p>

            <h2>10. International Users</h2>
            <p>
              By using our platform, international users consent to the transfer 
              of their information to our servers and processing according to this policy.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. Significant changes 
              will be communicated through our platform and email notifications.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or your personal information:
            </p>
            <ul>
              <li>Email: privacy@artmagic.com</li>
              <li>Contact form on our website</li>
              <li>Discord community server</li>
            </ul>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/terms-of-service" className="btn-primary">
            Terms of Service
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;