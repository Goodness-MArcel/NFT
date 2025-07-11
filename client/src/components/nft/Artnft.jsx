import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from 'react-router-dom'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import './DoodlesCollection.css';
import './TrendingNFTs.css';

function  ArtCollection() {
  const [nfts, setNfts] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const contractAddress = "0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad"; // Parallel Alpha

  useEffect(() => {
    fetchGamingNFTs();
  }, []);

  const fetchGamingNFTs = async () => {
    try {
      setLoading(true);
      setError("");

      const collectionRes = await fetch(
        `https://api.reservoir.tools/collections/v7?id=${contractAddress}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Gaming-NFT-Client/1.0",
          },
        }
      );

      if (!collectionRes.ok) throw new Error("Failed to fetch collection info");
      const collectionData = await collectionRes.json();
      const collection = collectionData.collections?.[0];

      if (collection) {
        setCollectionInfo({
          name: collection.name,
          floorPrice: collection.floorAsk?.price?.amount?.native,
          totalSupply: collection.tokenCount,
          ownerCount: collection.ownerCount,
          volume: collection.volume?.allTime,
        });
      }

      const tokensRes = await fetch(
        `https://api.reservoir.tools/tokens/v7?collection=${contractAddress}&limit=40&sortBy=tokenId`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Gaming-NFT-Client/1.0",
          },
        }
      );

      if (!tokensRes.ok) throw new Error("Failed to fetch NFTs");
      const tokensData = await tokensRes.json();

      const tokens =
        tokensData.tokens?.map((token) => ({
          id: token.token?.tokenId,
          name: token.token?.name,
          image: token.token?.image,
          contractAddress: token.token?.contract,
          floorPrice: token.market?.floorAsk?.price?.amount?.native,
          lastSalePrice: token.market?.lastSale?.price?.amount?.native,
          attributes: token.token?.attributes,
          rarity: token.token?.rarityScore,
          owner: token.token?.owner,
        })) || [];

      setNfts(tokens);
    } catch (err) {
      console.error(err);
      setError("Failed to load gaming NFTs");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    price ? `${parseFloat(price).toFixed(3)} ETH` : "N/A";

  return (
    <div className="trending-container mt-md-5">
      {/* <h2 style={{fontWeight: 'bolder'}}> Arts </h2> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: "bolder" }}> Arts </h2>
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

      {/* {collectionInfo && (
                <div className="collection-stats">
                    <div><strong>Floor:</strong> {formatPrice(collectionInfo.floorPrice)}</div>
                    <div><strong>Supply:</strong> {collectionInfo.totalSupply}</div>
                    <div><strong>Owners:</strong> {collectionInfo.ownerCount}</div>
                </div>
            )} */}

      {loading ? (
        <div className="spinner">Loading NFTs...</div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchGamingNFTs}>Try Again</button>
        </div>
      ) : (
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
            <SwiperSlide key={nft.id || index} className="trending-slide">
              <div className="trending-nft-card">
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
                  <p className="nft-collection">{nft.collection}</p>

                  {/* <div className="nft-rank">#{nft.id}</div>
                                    <h4 className="nft-name">{nft.name || `Token #${nft.id}`}</h4> */}
                  {nft.floorPrice && (
                    <div className="nft-price">
                      <span className="price-label">Floor:</span>
                      <span className="price-value">
                        {formatPrice(nft.floorPrice || 'n/a')}
                      </span>
                    </div>
                  )}
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
      )}
    </div>
  );
}

export default  ArtCollection;
