import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoodlesCollection.css';

function DoodlesCollection() {
    const [cloneXNFTs, setCloneXNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [collectionInfo, setCollectionInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCloneXCollection();
    }, []);

    const fetchCloneXCollection = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Fetch CloneX collection from our server
            const response = await axios.get('https://artmagic-backend.onrender.com/api/doodles-collection?limit=50');
            setCloneXNFTs(response.data.tokens || []);
            setCollectionInfo(response.data.collection || null);
        } catch (error) {
            console.error('Error fetching CloneX collection:', error);
            setError('Failed to load CloneX collection');
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(cloneXNFTs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNFTs = cloneXNFTs.slice(startIndex, endIndex);

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return `${parseFloat(price).toFixed(3)} ETH`;
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleNFTClick = (nft) => {
        setSelectedNFT(nft);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedNFT(null);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="doodles-container">
                <h2>🤖 CloneX (by RTFKT)</h2>
                <div className="doodles-loading">
                    <div className="spinner"></div>
                    <p>Loading CloneX NFTs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="doodles-container">
                <h2>🤖 CloneX (by RTFKT)</h2>
                <div className="doodles-error">
                    <p>{error}</p>
                    <button onClick={fetchCloneXCollection} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="doodles-container">
            <div className="doodles-header">
                <h2>CloneX</h2>
                <p className="doodles-subtitle">Next-generation avatars for the metaverse</p>
                {collectionInfo && (
                    <div className="collection-stats">
                        <div className="stat">
                            <span className="stat-label">Floor Prices:</span>
                            <span className="stat-value">{formatPrice(collectionInfo.floorPrice)}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Total Supply:</span>
                            <span className="stat-value">{collectionInfo.totalSupply?.toLocaleString()}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Owners:</span>
                            <span className="stat-value">{collectionInfo.ownerCount?.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
            
            {cloneXNFTs.length > 0 ? (
                <>
                    <div className="doodles-grid">
                        {currentNFTs.map((nft, index) => (
                            <div 
                                key={nft.id || index} 
                                className="doodles-nft-card"
                                onClick={() => handleNFTClick(nft)}
                            >
                                <div className="nft-image-container">
                                    <div className="nft-number">#{nft.id}</div>
                                    <div className="nft-price-overlay">
                                        {nft.floorPrice ? (
                                            <span className="price-overlay">{formatPrice(nft.floorPrice)}</span>
                                        ) : nft.lastSalePrice ? (
                                            <span className="price-overlay">{formatPrice(nft.lastSalePrice)}</span>
                                        ) : (
                                            <span className="price-overlay">Not Listed</span>
                                        )}
                                    </div>
                                    {nft.image ? (
                                        <img 
                                            src={nft.image} 
                                            alt={nft.name} 
                                            className="nft-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="nft-placeholder" style={{ display: nft.image ? 'none' : 'flex' }}>
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="nft-info">
                                    <h4 className="nft-name">{nft.name || `CloneX #${nft.id}`}</h4>
                                    {nft.attributes && nft.attributes.length > 0 && (
                                        <div className="nft-traits">
                                            {nft.attributes.slice(0, 2).map((attr, idx) => (
                                                <div key={idx} className="trait">
                                                    <span className="trait-type">{attr.key}:</span>
                                                    <span className="trait-value">{attr.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={goToPrevPage} 
                                disabled={currentPage === 1}
                                className="pagination-btn prev-btn"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>

                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    if (
                                        page === 1 || 
                                        page === totalPages || 
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        page === currentPage - 2 || 
                                        page === currentPage + 2
                                    ) {
                                        return <span key={page} className="pagination-ellipsis">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button 
                                onClick={goToNextPage} 
                                disabled={currentPage === totalPages}
                                className="pagination-btn next-btn"
                            >
                                Next
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="no-doodles">
                    <p>No CloneX found</p>
                </div>
            )}

            {/* NFT Detail Modal */}
            {showModal && selectedNFT && (
                <div className="nft-modal-overlay" onClick={closeModal}>
                    <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <div className="modal-content">
                            <div className="modal-image-section">
                                {selectedNFT.image ? (
                                    <img 
                                        src={selectedNFT.image} 
                                        alt={selectedNFT.name} 
                                        className="modal-nft-image"
                                    />
                                ) : (
                                    <div className="modal-no-image">
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            <div className="modal-info-section">
                                <div className="modal-header">
                                    <h2>{selectedNFT.name || `CloneX #${selectedNFT.id}`}</h2>
                                    <div className="modal-token-id">Token ID: {selectedNFT.id}</div>
                                </div>
                                
                                <div className="modal-pricing">
                                    {selectedNFT.floorPrice && (
                                        <div className="modal-price-item">
                                            <span className="price-label">Floor Price</span>
                                            <span className="price-value">{formatPrice(selectedNFT.floorPrice)}</span>
                                        </div>
                                    )}
                                    {selectedNFT.lastSalePrice && (
                                        <div className="modal-price-item">
                                            <span className="price-label">Last Sale</span>
                                            <span className="price-value">{formatPrice(selectedNFT.lastSalePrice)}</span>
                                        </div>
                                    )}
                                    {selectedNFT.rarity && (
                                        <div className="modal-price-item">
                                            <span className="price-label">Rarity Score</span>
                                            <span className="rarity-value">{Math.round(selectedNFT.rarity)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-details">
                                    <div className="detail-group">
                                        <h3>Owner</h3>
                                        <p>{selectedNFT.owner ? formatAddress(selectedNFT.owner) : 'Unknown'}</p>
                                    </div>
                                    
                                    <div className="detail-group">
                                        <h3>Contract Address</h3>
                                        <p>{formatAddress(selectedNFT.contractAddress)}</p>
                                    </div>
                                </div>

                                {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                                    <div className="modal-attributes">
                                        <h3>Attributes</h3>
                                        <div className="attributes-grid">
                                            {selectedNFT.attributes.map((attr, index) => (
                                                <div key={index} className="attribute-item">
                                                    <div className="attribute-type">{attr.key}</div>
                                                    <div className="attribute-value">{attr.value}</div>
                                                    {attr.rarity && (
                                                        <div className="attribute-rarity">{attr.rarity}% rare</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button className="view-opensea-btn">
                                        View on OpenSea
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoodlesCollection;
