import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './TrendingNFTs.css';

function TrendingNFTs() {
    const [trendingNFTs, setTrendingNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTrendingNFTs();
    }, []);

    const fetchTrendingNFTs = async () => {
        try {
            setLoading(true);
            setError('');
            const limit = 20;

            // Fetch trending collections
            const collectionsRes = await fetch(`https://api.reservoir.tools/collections/v7?limit=${limit}&sortBy=1DayVolume`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'NFT-Gallery-App/1.0'
                }
            });

            if (!collectionsRes.ok) {
                throw new Error(`Collections fetch failed with status ${collectionsRes.status}`);
            }

            const collectionsData = await collectionsRes.json();
            const collections = collectionsData.collections?.slice(0, 10) || [];

            const trendingTokens = [];

            for (const collection of collections) {
                try {
                    const tokensRes = await fetch(`https://api.reservoir.tools/tokens/v7?collection=${collection.id}&limit=2&sortBy=floorAskPrice`, {
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'NFT-Gallery-App/1.0'
                        }
                    });

                    if (!tokensRes.ok) continue;

                    const tokensData = await tokensRes.json();

                    const tokens = tokensData.tokens?.map(token => ({
                        id: token.token?.tokenId,
                        name: token.token?.name || `${collection.name} #${token.token?.tokenId}`,
                        image: token.token?.image,
                        collection: collection.name,
                        contractAddress: token.token?.contract,
                        floorPrice: token.market?.floorAsk?.price?.amount?.native,
                        lastSalePrice: token.market?.lastSale?.price?.amount?.native,
                        collectionFloor: collection.floorAsk?.price?.amount?.native,
                        volume: collection.volume?.['1day']
                    })) || [];

                    trendingTokens.push(...tokens);
                } catch (tokenErr) {
                    console.error(`Error fetching tokens for ${collection.id}:`, tokenErr);
                }
            }

            setTrendingNFTs(trendingTokens.slice(0, limit));
        } catch (err) {
            console.error('Error fetching trending NFTs:', err);
            setError('Failed to load trending NFTs');
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="trending-container text-start">
                <h2>🔥 Trending NFTs</h2>
                <div className="trending-loading">
                    <div className="spinner"></div>
                    <p>Loading trending NFTs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trending-container">
                <h2>🔥 Trending NFTs</h2>
                <div className="trending-error">
                    <p>{error}</p>
                    <button onClick={fetchTrendingNFTs} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="trending-container mt-md-2">
            <h2>Trending NFTs</h2>
            {/* <p className="trending-subtitle">Discover the hottest NFTs in the market</p> */}

            {trendingNFTs.length > 0 ? (
                <Swiper
                    modules={[ Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={'auto'}
                    pagination={false}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 12 },
                        480: { slidesPerView: 3, spaceBetween: 14 },
                        768: { slidesPerView: 4, spaceBetween: 16 },
                        1024: { slidesPerView: 5, spaceBetween: 18 },
                        1200: { slidesPerView: 6, spaceBetween: 20 },
                    }}
                    className="trending-swiper"
                >
                    {trendingNFTs.map((nft, index) => (
                        <SwiperSlide key={nft.id || index} className="trending-slide">
                            <div className="trending-nft-card">
                                <div className="nft-rank">#{index + 1}</div>
                                <div className="nft-image-container">
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
                                    <h4 className="nft-name">{nft.name}</h4>
                                    <p className="nft-collection">{nft.collection}</p>
                                    {nft.floorPrice && (
                                        <div className="nft-price">
                                            <span className="price-label">Floor:</span>
                                            <span className="price-value">{formatPrice(nft.floorPrice)}</span>
                                        </div>
                                    )}
                                    {nft.lastSalePrice && (
                                        <div className="nft-last-sale">
                                            <span className="sale-label">Last Sale:</span>
                                            <span className="sale-value">{formatPrice(nft.lastSalePrice)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="no-trending">
                    <p>No trending NFTs found</p>
                </div>
            )}
        </div>
    );
}

export default TrendingNFTs;
