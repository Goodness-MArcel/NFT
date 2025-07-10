import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
// import './ExhibitionNFTs.css';

function ExhibitionNFTs() {
  const [tickets, setTickets] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

//   const contractAddress = '0xEXHIBITION_CONTRACT_ADDRESS';
  const contractAddress = '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270';


  useEffect(() => {
    fetchExhibitionNFTs();
  }, []);

  const fetchExhibitionNFTs = async () => {
    try {
      setLoading(true);
      setError('');

      const colRes = await fetch(`https://api.reservoir.tools/collections/v7?id=${contractAddress}`, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Exhibition-NFT-Client/1.0'
        }
      });
      if (!colRes.ok) throw new Error('Collection info failed');
      const colData = await colRes.json();
      const col = colData.collections?.[0];
      if (col) {
        setCollectionInfo({
          name: col.name,
          floorPrice: col.floorAsk?.price?.amount?.native,
          totalSupply: col.tokenCount,
          ownerCount: col.ownerCount
        });
      }

      const tokRes = await fetch(`https://api.reservoir.tools/tokens/v7?collection=${contractAddress}&limit=30&sortBy=tokenId`, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Exhibition-NFT-Client/1.0'
        }
      });
      if (!tokRes.ok) throw new Error('Token fetch failed');
      const tokData = await tokRes.json();

      const tokens = tokData.tokens?.map(t => ({
        id: t.token?.tokenId,
        name: t.token?.name,
        image: t.token?.image,
        floorPrice: t.market?.floorAsk?.price?.amount?.native
      })) || [];

      setTickets(tokens);
    } catch (err) {
      console.error(err);
      setError('Failed to load exhibition NFTs');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = p => (p ? `${parseFloat(p).toFixed(3)} ETH` : 'N/A');

  return (
    <div className="exhibition-container mt-5">
      <h2>🎟️ Exhibition NFTs</h2>
      <p className="exhibition-subtitle">Limited-edition event passes and collectibles</p>

      {collectionInfo && (
        <div className="collection-stats">
          <div><strong>Floor:</strong> {formatPrice(collectionInfo.floorPrice)}</div>
          <div><strong>Supply:</strong> {collectionInfo.totalSupply}</div>
          <div><strong>Owners:</strong> {collectionInfo.ownerCount}</div>
        </div>
      )}

      {loading ? (
        <div className="spinner">Loading exhibition items…</div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchExhibitionNFTs}>Try Again</button>
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView="auto"
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={false}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 12 },
            480: { slidesPerView: 3, spaceBetween: 14 },
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 18 },
            1200: { slidesPerView: 6, spaceBetween: 20 }
          }}
          className="exhibition-swiper"
        >
          {tickets.map((n, i) => (
            <SwiperSlide key={n.id || i}>
              <div className="exhibition-nft-card">
                <div className="nft-rank">#{n.id}</div>
                <div className="nft-image-container">
                  {n.image ? (
                    <img src={n.image} alt={n.name} className="nft-image" />
                  ) : (
                    <div className="nft-placeholder">No Image</div>
                  )}
                </div>
                <div className="nft-info">
                  <h4>{n.name || `Token #${n.id}`}</h4>
                  {n.floorPrice && (
                    <div className="nft-price">
                      <span>Floor:</span><span>{formatPrice(n.floorPrice)}</span>
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

export default ExhibitionNFTs;
