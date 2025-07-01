import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallary.css';

function Gallery({ showSearch, setShowSearch }) {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [loadingTokens, setLoadingTokens] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async (searchName = '', searchSlug = '') => {
        try {
            setLoading(true);
            setError('');
            let url = 'http://localhost:3000/api/nfts?limit=12';
            if (searchName) url += `&name=${encodeURIComponent(searchName)}`;
            if (searchSlug) url += `&slug=${encodeURIComponent(searchSlug)}`;
            
            const response = await axios.get(url);
            setCollections(response.data.collections);
        } catch (error) {
            console.error('Error fetching NFT collections:', error);
            setError('Failed to load NFT collections');
        } finally {
            setLoading(false);
        }
    };

    const fetchTokens = async (collectionId, collectionName) => {
        try {
            setLoadingTokens(true);
            setSelectedCollection(collectionName);
            setTokens([]);
            const response = await axios.get(`http://localhost:3000/api/nfts/${collectionId}/tokens?limit=8`);
            setTokens(response.data.tokens);
        } catch (error) {
            console.error('Error fetching NFT tokens:', error);
            setError('Failed to load NFT tokens');
        } finally {
            setLoadingTokens(false);
        }
    };

    const backToCollections = () => {
        setSelectedCollection(null);
        setTokens([]);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchCollections(searchQuery.trim());
        } else {
            fetchCollections();
        }
        // Close the search modal after searching
        setShowSearch(false);
    };

    const closeSearch = () => {
        setShowSearch(false);
        setSearchQuery('');
        fetchCollections(); // Reset to show all collections
    };

    const formatPrice = (price) => {
        if (!price) return 'Not listed';
        return `${price} ETH`;
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (loading) {
        return (
            <div className="gallery-container">
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p>Loading NFT Collections...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gallery-container">
                <div className="error-state">
                    <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h3>Error Loading Gallery</h3>
                    <p>{error}</p>
                    <button onClick={fetchCollections} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                {selectedCollection ? (
                    <div className="collection-header">
                        <button onClick={backToCollections} className="back-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Collections
                        </button>
                        <h1>{selectedCollection}</h1>
                    </div>
                ) : (
                    <div>
                        <h1>NFT Gallery</h1>
                        <p>Discover amazing NFT collections powered by Reservoir</p>
                        {showSearch && (
                            <div className="search-overlay">
                                <form onSubmit={handleSearch} className="search-form">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search collections by name..."
                                        className="search-input"
                                        autoFocus
                                    />
                                    <button type="submit" className="search-btns">
                                        <svg fill="black" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={20} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                
                                    </button>
                                    <button type="button" onClick={closeSearch} className="close-search-btn">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedCollection ? (
                <div className="tokens-grid">
                    {loadingTokens ? (
                        <div className="loading-tokens">
                            <div className="spinner-large"></div>
                            <p>Loading tokens...</p>
                        </div>
                    ) : tokens.length > 0 ? (
                        tokens.map((token) => (
                            <div key={token.id} className="token-card">
                                <div className="token-image">
                                    {token.image ? (
                                        <img src={token.image} alt={token.name} />
                                    ) : (
                                        <div className="no-image">
                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="token-info">
                                    <h3>{token.name || `Token #${token.id}`}</h3>
                                    {token.description && (
                                    <p className="token-description">{token.description}</p>
                                    )}
                                    <div className="token-details">
                                    {token.owner && (
                                    <span className="owner">Owner: {formatAddress(token.owner)}</span>
                                    )}
                                    {token.floorPrice && (
                                    <span className="floor-price">
                                    Floor: {parseFloat(token.floorPrice).toFixed(4)} ETH
                                    </span>
                                    )}
                                        {token.lastSalePrice && (
                                             <span className="last-sale">
                                                 Last Sale: {parseFloat(token.lastSalePrice).toFixed(4)} ETH
                                             </span>
                                         )}
                                         {token.rarity && (
                                             <span className="rarity">
                                                 Rarity: {Math.round(token.rarity)}
                                             </span>
                                         )}
                                     </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-tokens">
                            <p>No tokens found in this collection</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="collections-grid">
                    {collections.length > 0 ? (
                        collections.map((collection) => (
                            <div 
                                key={collection.id} 
                                className="collection-card"
                                onClick={() => fetchTokens(collection.contractAddress, collection.name)}
                            >
                                <div className="collection-image">
                                    {collection.image ? (
                                        <img src={collection.image} alt={collection.name} />
                                    ) : (
                                        <div className="no-image">
                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="collection-info">
                                    <h3>{collection.name}</h3>
                                    {collection.description && (
                                        <p className="collection-description">{collection.description}</p>
                                    )}
                                    <div className="collection-stats">
                                    {collection.totalSupply && (
                                    <span>Supply: {collection.totalSupply}</span>
                                    )}
                                    {collection.ownerCount && (
                                    <span>Owners: {collection.ownerCount}</span>
                                    )}
                                    {collection.floorPrice && (
                                    <span>Floor: {parseFloat(collection.floorPrice).toFixed(4)} ETH</span>
                                    )}
                                        {collection.volume && (
                                            <span>Volume: {parseFloat(collection.volume).toFixed(2)} ETH</span>
                                    )}
                                    </div>
                                    <div className="collection-address">
                                        <span>Contract: {formatAddress(collection.contractAddress)}</span>
                                    </div>
                                    {collection.verified && (
                                        <div className="verified-badge">
                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-collections">
                            <p>No collections found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Gallery;
