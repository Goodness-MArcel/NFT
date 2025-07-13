import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import CoverflowCarousel from "../ui/CoverflowCarousel";
import Footer from "../ui/Footer";
// import Card from "../nft/Card";
// import Gallery from "../nft/Gallary";
import TrendingNFTs from "../nft/TrendingNFTs";
import GamingCollection from "../nft/DoodlesCollection";
// import MembershipNFTs from "../nft/Artnft";
// import ExhibitionNFTs from "../nft/ExhibitionNFTs";
import Artnft from "../nft/Artnft";
import PFPCollection from '../nft/PFP';
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
    const { logOut } = useAuth();
    const [showSearch, setShowSearch] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleSearch = () => {
      setShowSearch(!showSearch);
    };

    // const toggleMenu = () => {
    //   setIsMenuOpen(!isMenuOpen);
    // };

    // Handle scroll effect for header
    // useEffect(() => {
    //   const handleScroll = () => {
    //     const isScrolled = window.scrollY > 50;
    //     setScrolled(isScrolled);
    //   };

    //   window.addEventListener('scroll', handleScroll);
    //   return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

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
                  <FaSearch size={84} color="black" />
                </button>
                <Link to='/login' className="login-btn">
                  <span>login</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Discover Rare
                <span className="gradient-text"> Digital Assets</span>
              </h1>
              <p className="hero-subtitle">
                Explore, collect, and trade extraordinary NFTs from top creators around the world
              </p>
              <div className="hero-buttons">
                <button className="btn-primary">
                  <span>Explore Gallery</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </button>
                <button className="btn-secondary">
                  <span>Create NFT</span>
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

        <section className="trending-section">
          <TrendingNFTs />
        </section>

        <section className="doodles-section">
          <GamingCollection />
        </section>

        <section className="doodles-section">
          <Artnft />
        </section>
        
        <section className="doodles-section">
          <PFPCollection />
        </section>
      
        {/* <section className="gallery-section">
          <div className="container">
            <Gallery showSearch={showSearch} setShowSearch={setShowSearch} />
          </div>
        </section> */}

        <Footer />
      </>
    );
}

export default Home;
