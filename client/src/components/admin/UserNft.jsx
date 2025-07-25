import React, { useEffect, useState } from 'react';
import { supabase } from "../../services/supabase";
import './style.css'



function NftStatusTable() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch NFTs on load
  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nfts')
      .select('id, owner_email, status');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setNfts(data);
    }
    setLoading(false);
  };

  // Toggle status: approved <-> pending
  const updateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Listed' ? 'Sold' : 'Listed';
    const { error } = await supabase
      .from('nfts')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchNFTs(); // Refresh table
    }
  };

  return (
    <div className="container mt-5 nftcontainer">
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow rounded">
            <thead className="table-dark">
              <tr>
                <th scope="col">Owner Email</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {nfts.map((nft) => (
                <tr key={nft.id}>
                  <td>{nft.owner_email}</td>
                  <td>
                    <span className={`badge bg-${nft.status === 'Sold' ? 'success' : 'warning'} text-uppercase`}>
                      {nft.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => updateStatus(nft.id, nft.status)}
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
              {nfts.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">No NFTs Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NftStatusTable;
