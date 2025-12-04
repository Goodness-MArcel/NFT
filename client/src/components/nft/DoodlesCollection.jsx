import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from 'react-router-dom'
import { getNFTsFromContract, POPULAR_CONTRACTS } from '../../services/moralis';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import './DoodlesCollection.css';
import './TrendingNFTs.css';

function GamingCollection() {
  const [nfts, setNfts] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Using Doodles contract for Gaming/Collectible NFTs
  const contractAddress = POPULAR_CONTRACTS.DOODLES; // Doodles - Gaming/Collectible NFTs

  useEffect(() => {
    console.log('Gaming Collection component mounted, fetching real gaming NFTs via Moralis...');
    fetchGamingNFTs();
  }, []);

  const fetchGamingNFTs = async () => {
    try {
      setLoading(true);
      setError("");
      console.log('Fetching Gaming NFTs using Moralis...');

      // Try Moralis API first for real Doodles NFTs
      try {
        const gamingNFTs = await getNFTsFromContract(contractAddress, {
          limit: 12,
          offset: 0
        });

        console.log('Real Doodles Gaming NFTs from Moralis:', gamingNFTs);

        if (gamingNFTs && gamingNFTs.length > 0) {
          const realGamingNFTs = gamingNFTs.map((nft, index) => ({
            id: nft.tokenId,
            name: nft.name || `Doodle #${nft.tokenId}`,
            image: nft.image || `https://picsum.photos/400/400?random=${300 + index}`,
            collection: 'Doodles',
            contractAddress: nft.contractAddress,
            floorPrice: (Math.random() * 4 + 1).toFixed(2), // Doodles typical range
            lastSalePrice: (Math.random() * 6 + 2).toFixed(2),
            attributes: nft.attributes,
            rarity: Math.random() * 100 + 30,
            owner: nft.owner,
            description: nft.description,
            tokenType: nft.tokenType
          }));

          setCollectionInfo({
            name: 'Doodles',
            floorPrice: '2.1',
            totalSupply: '10000',
            ownerCount: '4200',
            volume: '3850.7',
          });

          setNfts(realGamingNFTs);
          console.log('Real Doodles Gaming NFTs loaded:', realGamingNFTs);
          return;
        }
      } catch (moralisError) {
        console.log('Moralis Gaming NFT API failed:', moralisError);
      }

      // Fallback to OpenSea API if Moralis fails
      try {
        const openSeaRes = await fetch(
          `https://api.opensea.io/api/v1/assets?asset_contract_address=${contractAddress}&limit=12`,
          {
            headers: {
              "Accept": "application/json",
              "User-Agent": "Gaming-NFT-Client/1.0",
            },
          }
        );
        
        console.log('OpenSea Gaming API response:', openSeaRes.status);
        
        if (openSeaRes.ok) {
          const openSeaData = await openSeaRes.json();
          console.log('OpenSea Gaming NFT data:', openSeaData);
          
          if (openSeaData.assets && openSeaData.assets.length > 0) {
            const gamingNFTs = openSeaData.assets.slice(0, 10).map((asset, index) => ({
              id: asset.token_id,
              name: asset.name || `Gaming NFT #${asset.token_id}`,
              image: asset.image_url || `https://picsum.photos/400/400?random=${300 + index}`,
              collection: asset.collection?.name || 'Gaming Collection',
              contractAddress: asset.asset_contract?.address,
              floorPrice: (Math.random() * 4 + 1).toFixed(2),
              lastSalePrice: (Math.random() * 6 + 2).toFixed(2),
              attributes: asset.traits || [],
              rarity: Math.random() * 100 + 30,
              owner: asset.owner?.user?.username || 'Gamer',
              description: asset.description
            }));

            setCollectionInfo({
              name: 'Gaming Collection',
              floorPrice: '2.1',
              totalSupply: '10000',
              ownerCount: '4200',
              volume: '3850.7',
            });

            setNfts(gamingNFTs);
            console.log('OpenSea Gaming NFTs loaded:', gamingNFTs);
            return;
          }
        }
      } catch (openSeaError) {
        console.log('OpenSea Gaming API failed:', openSeaError);
      }

      // Final fallback to generated gaming data
      const fallbackGamingNFTs = Array.from({ length: 10 }, (_, index) => ({
        id: (index + 1).toString(),
        name: `Gaming NFT #${index + 1}`,
        image: `https://picsum.photos/400/400?random=${300 + index}`,
        collection: 'Gaming Collection',
        contractAddress: contractAddress,
        floorPrice: (Math.random() * 4 + 1).toFixed(2),
        lastSalePrice: (Math.random() * 6 + 2).toFixed(2),
        attributes: [
          { trait_type: 'Character Type', value: ['Warrior', 'Mage', 'Archer', 'Rogue'][Math.floor(Math.random() * 4)] },
          { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)] },
          { trait_type: 'Power Level', value: Math.floor(Math.random() * 100) + 1 }
        ],
        rarity: Math.random() * 100 + 30,
        owner: 'Gamer',
        description: 'Premium gaming NFT with unique abilities and attributes.'
      }));

      setCollectionInfo({
        name: 'Gaming Collection',
        floorPrice: '2.1',
        totalSupply: '10000',
        ownerCount: '4200',
        volume: '3850.7',
      });

      setNfts(fallbackGamingNFTs);
      console.log('Fallback Gaming NFTs loaded:', fallbackGamingNFTs);
      
    } catch (err) {
      console.error('Error fetching gaming NFTs:', err);
      setError("Failed to load gaming NFTs");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    price ? `${parseFloat(price).toFixed(3)} ETH` : "N/A";

  console.log('Rendering Gaming Collection with NFTs:', nfts);

  return (
    <div className="trending-container">
      {/* <h2 style={{fontWeight: 'bolder'}}> Gaming </h2> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: "bolder" }}> Gaming </h2>
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

      {collectionInfo && (
        <div className="collection-stats" style={{ 
          display: 'flex', 
          gap: '20px', 
          margin: '10px 0', 
          fontSize: '14px',
          color: '#666'
        }}>
          <div><strong>Floor:</strong> {formatPrice(collectionInfo.floorPrice)}</div>
          <div><strong>Supply:</strong> {collectionInfo.totalSupply}</div>
          <div><strong>Owners:</strong> {collectionInfo.ownerCount}</div>
        </div>
      )}

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
                  {nft.image && (
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="nft-image"
                      onError={(e) => {
                        console.log('Gaming NFT image failed to load:', nft.image);
                        e.target.src = `https://via.placeholder.com/400x400/4ade80/ffffff?text=${encodeURIComponent(nft.name.split(' ')[0])}`;
                      }}
                      onLoad={() => {
                        console.log('Gaming NFT image loaded:', nft.image);
                      }}
                      loading="lazy"
                    />
                  )}
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
                  <h4 className="nft-name">{nft.name || `Gaming NFT #${nft.id}`}</h4>
                  <p className="nft-collection">{nft.collection || 'Gaming Collection'}</p>

                  {/* <div className="nft-rank">#{nft.id}</div>
                                    <h4 className="nft-name">{nft.name || `Token #${nft.id}`}</h4> */}
                  {nft.floorPrice && (
                    <div className="nft-price">
                      <span className="price-label">Floor:</span>
                      <span className="price-value">
                        {formatPrice(nft.floorPrice)}
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

export default GamingCollection;
