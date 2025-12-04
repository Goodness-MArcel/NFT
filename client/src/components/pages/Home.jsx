import { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import CoverflowCarousel from "../ui/CoverflowCarousel";
import Footer from "../ui/Footer";
import TrendingNFTs from "../nft/TrendingNFTs";
import GamingCollection from "../nft/DoodlesCollection";
import Artnft from "../nft/Artnft";
import PFPCollection from '../nft/PFP';
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
    const [showSearch, setShowSearch] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleSearch = () => {
      setShowSearch(!showSearch);
    };

    // Handle scroll effect for header
    useEffect(() => {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 50;
        setScrolled(isScrolled);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <>
        <div className="hero-section">
          <div className="hero-background">
            <div className="hero-overlay"></div>
            <div className="animated-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
              <div className="logo-section">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h2 className="logo-text">Art<span>magic</span></h2>
              </div>


              <div className="header-actions">
                <button className="search-btn" onClick={toggleSearch} aria-label="Search">
                  <FaSearch size={24} color="black" />
                </button>
                <Link to='/login' className="login-btn">
                  <span>login</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">✨ Premium NFT Marketplace</span>
            </div>
            <div className="hero-text">
              <h1 className="hero-title">
                Discover Rare
                <span className="gradient-text"> Digital Masterpieces</span>
              </h1>
              <p className="hero-subtitle">
                Immerse yourself in a curated collection of extraordinary NFTs from the world's most talented digital artists. Experience the future of art ownership.
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">🎨</div>
                  <span>Curated Art</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <span>Secure Trading</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌟</div>
                  <span>Premium Quality</span>
                </div>
              </div>
              <div className="hero-buttons">
                <button className="btn-primary">
                  <span>Explore Gallery</span>
                  <div className="btn-shine"></div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </button>
                <button className="btn-secondary">
                  <span>Create NFT</span>
                  <div className="btn-ripple"></div>
                </button>
              </div>
            </div>
          
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">250K+</div>
                <div className="stat-label">NFTs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Artists</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15K+</div>
                <div className="stat-label">Collections</div>
              </div>
            </div>
          </div>

          <div className="carousel-section">
            <CoverflowCarousel />
          </div>

          <div className="scroll-indicator">
            <div className="scroll-line"></div>
            <div className="scroll-text">Scroll to explore</div>
          </div>
        </div>

        <main className="main-content">
          <section className="collection-section trending-section">
            <div className="section-header">
              <div className="section-decoration"></div>
              <h2 className="section-title">Trending Collections</h2>
              <p className="section-subtitle">Discover the most sought-after digital assets</p>
            </div>
            <TrendingNFTs />
          </section>

          <section className="collection-section gaming-section">
            <div className="section-header">
              <div className="section-decoration"></div>
              <h2 className="section-title">Gaming Universe</h2>
              <p className="section-subtitle">Immersive digital experiences and collectibles</p>
            </div>
            <GamingCollection />
          </section>

          <section className="collection-section art-section">
            <div className="section-header">
              <div className="section-decoration"></div>
              <h2 className="section-title">Digital Artistry</h2>
              <p className="section-subtitle">Exceptional works from renowned digital artists</p>
            </div>
            <Artnft />
          </section>
          
          <section className="collection-section pfp-section">
            <div className="section-header">
              <div className="section-decoration"></div>
              <h2 className="section-title">Profile Collections</h2>
              <p className="section-subtitle">Exclusive avatar collections for digital identity</p>
            </div>
            <PFPCollection />
          </section>
        </main>
      
       

        <Footer />
      </>
    );
}

export default Home;
