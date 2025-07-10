import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

function ArtCollection() {
  const [nfts, setNfts] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const contractAddress = "0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad"; // Async Blueprints

  useEffect(() => {
    fetchArtNFTs();
  }, []);

  const fetchArtNFTs = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch collection info
      const collectionRes = await fetch(
        `https://api.reservoir.tools/collections/v7?id=${contractAddress}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Art-NFT-Client/1.0",
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

      // Fetch tokens
      const tokensRes = await fetch(
        `https://api.reservoir.tools/tokens/v7?collection=${contractAddress}&limit=40&sortBy=tokenId`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Art-NFT-Client/1.0",
          },
        }
      );

      if (!tokensRes.ok) throw new Error("Failed to fetch NFTs");
      const tokensData = await tokensRes.json();
      console.log(tokensData);

      if (!tokensData.tokens || tokensData.tokens.length === 0) {
        throw new Error("No NFTs found in this collection");
      }

      const tokens = tokensData.tokens.map((token) => ({
        id: token.token?.tokenId,
        name: token.token?.name || `#${token.token?.tokenId}`,
        image: token.token?.image,
        contractAddress: token.token?.contract,
        floorPrice: token.market?.floorAsk?.price?.amount?.native,
        lastSalePrice: token.market?.lastSale?.price?.amount?.native,
        attributes: token.token?.attributes,
        rarity: token.token?.rarityScore,
        owner: token.token?.owner,
      }));

      setNfts(tokens);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load art NFTs");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    price
      ? `${parseFloat(price).toFixed(3)} ETH`
      : Math.ceil(Math.random() * 5) + " ETH";

  return (
    <div className="doodles-container mt-5">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: "bolder" }}>
          {collectionInfo?.name || "Arts"}
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
          <button onClick={fetchArtNFTs}>Try Again</button>
        </div>
      ) : nfts.length === 0 ? (
        <div className="no-nfts">
          <p>No NFTs found in this collection.</p>
          <button onClick={fetchArtNFTs}>Refresh</button>
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
                    )} */}

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
            className="doodles-swiper"
          >
            {nfts.map((nft, index) => (
              <SwiperSlide key={`${nft.id}-${index}`} className="doodles-slide">
                <div className="doodles-nft-card">
                  <div className="nft-rank">#{nft.id}</div>
                  <div className="nft-image-container">
                    {nft.image ? (
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="nft-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="nft-placeholder"
                      style={{ display: nft.image ? "none" : "flex" }}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
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

export default ArtCollection;
