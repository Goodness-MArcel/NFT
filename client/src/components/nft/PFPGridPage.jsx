import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PFPGridPage.css';

function PFPGridPage() {
    const { contractAddress } = useParams();
    const navigate = useNavigate();
    const [nfts, setNfts] = useState([]);
    const [collectionInfo, setCollectionInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [selectedNft, setSelectedNft] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPFPNFTs = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch collection info
            const collectionRes = await fetch(`https://api.reservoir.tools/collections/v7?id=${contractAddress}`);
            if (!collectionRes.ok) throw new Error('Failed to fetch collection info');
            const collectionData = await collectionRes.json();
            
            const collection = collectionData.collections?.[0];
            setCollectionInfo({
                name: collection.name,
                floorPrice: collection.floorAsk?.price?.amount?.native,
                totalSupply: collection.tokenCount,
                ownerCount: collection.ownerCount,
                volume: collection.volume?.allTime
            });

            // Fetch tokens with pagination
            const tokensRes = await fetch(
                `https://api.reservoir.tools/tokens/v7?collection=${contractAddress}&limit=100&sortBy=tokenId&page=${page}`
            );
            if (!tokensRes.ok) throw new Error('Failed to fetch NFTs');
            const tokensData = await tokensRes.json();

            const tokens = tokensData.tokens?.map(token => ({
                id: token.token?.tokenId,
                name: token.token?.name || `#${token.token?.tokenId}`,
                image: token.token?.image || token.token?.imageSmall,
                contractAddress: token.token?.contract,
                floorPrice: token.market?.floorAsk?.price?.amount?.native,
                lastSalePrice: token.market?.lastSale?.price?.amount?.native,
                attributes: token.token?.attributes,
                rarity: token.token?.rarityScore,
                rank: token.token?.rarityRank
            })) || [];

            setNfts(prev => [...prev, ...tokens]);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPFPNFTs();
    }, [contractAddress, page]);

    const formatPrice = (price) => price ? `${parseFloat(price).toFixed(3)} ETH` : 'N/A';

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    const openModal = (nft) => {
        setSelectedNft(nft);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div className="grid-container">
            <div className="grid-header">
                <a href='/' className="back-button text-decoration-none">
                    &larr; Back to Collection
                </a>
                <h1>{collectionInfo?.name || 'PFP Collection'}</h1>
                <div className="collection-stats">
                    <div className="stat-items">
                        <span className="stat-label">Floor:</span>
                        <span className="stat-value">{formatPrice(collectionInfo?.floorPrice)}</span>
                    </div>
                    <div className="stat-items">
                        <span className="stat-label">Items:</span>
                        <span className="stat-value">{collectionInfo?.totalSupply}</span>
                    </div>
                    <div className="stat-items">
                        <span className="stat-label">Owners:</span>
                        <span className="stat-value">{collectionInfo?.ownerCount}</span>
                    </div>
                </div>
            </div>

            {loading && nfts.length === 0 ? (
                <div className="loading">Loading NFTs...</div>
            ) : error ? (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={fetchPFPNFTs} className="retry-button">Try Again</button>
                </div>
            ) : (
                <>
                    <div className="nft-grid">
                        {nfts.map((nft) => (
                            <div 
                                key={nft.id} 
                                className="nft-card"
                                onClick={() => openModal(nft)}
                            >
                                <div className="nft-rank">
                                    {nft.rank ? `Rank #${nft.rank}` : `#${nft.id}`}
                                </div>
                                <div className="nft-image-container">
                                    {nft.image ? (
                                        <img
                                            src={nft.image}
                                            alt={nft.name}
                                            className="nft-image"
                                            // style={{ borderRadius: '50%' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="nft-placeholder" style={{ display: nft.image ? 'none' : 'flex', borderRadius: '50%' }}>
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="nft-info">
                                    <h4 className="nft-name">{nft.name}</h4>
                                    <div className="nft-price">
                                        <span className="price-label">Floor:</span>
                                        <span className="price-value">{formatPrice(nft.floorPrice)}</span>
                                    </div>
                                    {nft.lastSalePrice && (
                                        <div className="nft-last-sale">
                                            <span className="sale-label">Last:</span>
                                            <span className="sale-value">{formatPrice(nft.lastSalePrice)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {nfts.length > 0 && (
                        <button onClick={loadMore} className="load-more" disabled={loading}>
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    )}
                </>
            )}

            {/* NFT Modal */}
            {isModalOpen && selectedNft && (
                <div className="modal-backdrop" onClick={handleBackdropClick}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>
                            &times;
                        </button>
                        
                        <div className="modal-image-container">
                            <img 
                                src={selectedNft.image} 
                                alt={selectedNft.name} 
                                className="modal-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="modal-placeholder">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="modal-info">
                            <h2>{selectedNft.name}</h2>
                            <div className="modal-details">
                                <div className="detail-row">
                                    <span className="detail-label">Token ID:</span>
                                    <span className="detail-value">#{selectedNft.id}</span>
                                </div>
                                {selectedNft.rank && (
                                    <div className="detail-row">
                                        <span className="detail-label">Rarity Rank:</span>
                                        <span className="detail-value">#{selectedNft.rank}</span>
                                    </div>
                                )}
                                {selectedNft.rarity && (
                                    <div className="detail-row">
                                        <span className="detail-label">Rarity Score:</span>
                                        <span className="detail-value">{selectedNft.rarity.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="detail-label">Floor Price:</span>
                                    <span className="detail-value">{formatPrice(selectedNft.floorPrice)}</span>
                                </div>
                                {selectedNft.lastSalePrice && (
                                    <div className="detail-row">
                                        <span className="detail-label">Last Sale:</span>
                                        <span className="detail-value">{formatPrice(selectedNft.lastSalePrice)}</span>
                                    </div>
                                )}
                            </div>

                            {selectedNft.attributes && (
                                <div className="modal-attributes">
                                    <h3>Traits</h3>
                                    <div className="attributes-grid">
                                        {selectedNft.attributes.map((attr, index) => (
                                            <div key={index} className="attribute-item">
                                                <span className="attribute-type">{attr.key}</span>
                                                <span className="attribute-value">{attr.value}</span>
                                                {attr.rarity && (
                                                    <span className="attribute-rarity">
                                                        {parseFloat(attr.rarity).toFixed(2)}%
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PFPGridPage;