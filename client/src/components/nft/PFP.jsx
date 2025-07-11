import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import './TrendingNFTs.css';

function PFPCollection() {
  const [nfts, setNfts] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Using Bored Ape Yacht Club contract as an example PFP collection
  const contractAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

  useEffect(() => {
    fetchPFPNFTs();
  }, []);

  const fetchPFPNFTs = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch collection info
      const collectionRes = await fetch(
        `https://api.reservoir.tools/collections/v7?id=${contractAddress}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "PFP-NFT-Client/1.0",
          },
        }
      );

      if (!collectionRes.ok) throw new Error("Failed to fetch collection info");
      const collectionData = await collectionRes.json();

      if (
        !collectionData.collections ||
        collectionData.collections.length === 0
      ) {
        throw new Error("Collection not found");
      }

      const collection = collectionData.collections[0];
      setCollectionInfo({
        name: collection.name,
        floorPrice: collection.floorAsk?.price?.amount?.native,
        totalSupply: collection.tokenCount,
        ownerCount: collection.ownerCount,
        volume: collection.volume?.allTime,
      });

      // Fetch tokens - sorted by rarity for PFPs
      const tokensRes = await fetch(
        `https://api.reservoir.tools/tokens/v7?collection=${contractAddress}&limit=40&sortBy=rarity`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "PFP-NFT-Client/1.0",
          },
        }
      );

      if (!tokensRes.ok) throw new Error("Failed to fetch NFTs");
      const tokensData = await tokensRes.json();

      if (!tokensData.tokens || tokensData.tokens.length === 0) {
        throw new Error("No NFTs found in this collection");
      }

      const tokens = tokensData.tokens.map((token) => ({
        id: token.token?.tokenId,
        name: token.token?.name || `#${token.token?.tokenId}`,
        image: token.token?.imageSmall || token.token?.image, // Using imageSmall for better PFP display
        contractAddress: token.token?.contract,
        floorPrice: token.market?.floorAsk?.price?.amount?.native,
        lastSalePrice: token.market?.lastSale?.price?.amount?.native,
        attributes: token.token?.attributes,
        rarity: token.token?.rarityScore,
        owner: token.token?.owner,
        rank: token.token?.rarityRank, // Added rank for PFPs
      }));

      setNfts(tokens);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load PFP NFTs");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    price ? `${parseFloat(price).toFixed(3)} ETH` : "N/A";

  return (
    <div className="trending-container mt-md-2">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: "bolder" }}>
          {collectionInfo?.names || "PFP"}
        </h2>
        {!loading && !error && nfts.length > 0 && (
          <button
            onClick={() => navigate(`/pfp-grid/${contractAddress}`)}
            style={{
              padding: "8px 16px",
              background: "white",
              color: "black",
              border: "thin solid #3182ce",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <div className="spinner">Loading NFTs...</div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchPFPNFTs}>Try Again</button>
        </div>
      ) : nfts.length === 0 ? (
        <div className="no-nfts">
          <p>No NFTs found in this collection.</p>
          <button onClick={fetchPFPNFTs}>Refresh</button>
        </div>
      ) : (
        <>
          {/* {collectionInfo && (
                        <div className="collection-stats">
                            <p>Floor: {formatPrice(collectionInfo.floorPrice)}</p>
                            <p>Total Supply: {collectionInfo.totalSupply}</p>
                            <p>Owners: {collectionInfo.ownerCount}</p>
                            <p>Volume: {formatPrice(collectionInfo.volume)}</p>
                        </div>
                    )}
                     */}
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={"auto"}
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
            {nfts.map((nft, index) => (
              <SwiperSlide key={`${nft.id}-${index}`} className="doodles-slide">
                <div className="trending-nft-card">
                  <div className="nft-rank">
                    {nft.rank ? `Rank #${nft.rank}` : `#${nft.id}`}
                  </div>
                  <div className="nft-image-container">
                    {nft.image ? (
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="nft-image"
                        // Makes images circular for PFPs
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="nft-placeholder"
                      // style={{
                      //     display: nft.image ? 'none' : 'flex',
                      //     borderRadius: '50%'
                      // }}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="nft-info">
                    <h4 className="nft-name">{nft.name}</h4>
                    <div className="nft-price">
                      <span className="price-label">Floor:</span>
                      <span className="price-value">
                        {formatPrice(nft.floorPrice)}
                      </span>
                    </div>
                    {nft.lastSalePrice && (
                      <div className="nft-last-sale">
                        <span className="sale-label">Last Sale:</span>
                        <span className="sale-value">
                          {formatPrice(nft.lastSalePrice)}
                        </span>
                      </div>
                    )}
                    {nft.rarity && (
                      <div className="nft-rarity">
                        <span className="rarity-label">Rarity:</span>
                        <span className="rarity-value">
                          {nft.rarity.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
}

export default PFPCollection;
