// Moralis API service for NFT data fetching
// This service provides centralized access to Moralis APIs for all NFT-related operations

const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjFiNzAxYmJhLWQzN2QtNGIxNy1iNGRmLWZmNTQ0ZmY4MGI3MCIsIm9yZ0lkIjoiNDg0NTE2IiwidXNlcklkIjoiNDk4NDc4IiwidHlwZUlkIjoiMjEyM2VlZjItYTc4Yi00NDA5LTkxZjgtMmFlMjA4NTU1NTcyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NjQ4MzgzNTYsImV4cCI6NDkyMDU5ODM1Nn0.SoDVUGNrivPxyqf2g1RN08rATD-MqfQJmnGJVvp1CjI";
const BASE_URL = "https://deep-index.moralis.io/api/v2.2";

// Standard headers for Moralis API requests
const getHeaders = () => ({
    "Accept": "application/json",
    "X-API-Key": MORALIS_API_KEY,
});

// Helper function to parse NFT metadata
const parseMetadata = (metadataString) => {
    try {
        return metadataString ? JSON.parse(metadataString) : {};
    } catch (err) {
        console.warn("Failed to parse metadata:", err);
        return {};
    }
};

// Helper function to format IPFS URLs
const formatImageUrl = (imageUrl, fallbackIndex = 0) => {
    if (!imageUrl) return `https://picsum.photos/400/400?random=${1000 + fallbackIndex}`;
    
    // Convert IPFS URLs to HTTP gateway
    if (imageUrl.startsWith('ipfs://')) {
        return imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    return imageUrl || `https://picsum.photos/400/400?random=${1000 + fallbackIndex}`;
};

// Get NFTs from a specific contract
export const getNFTsFromContract = async (contractAddress, options = {}) => {
    const {
        limit = 10,
        offset = 0,
        chain = 'eth'
    } = options;

    try {
        const response = await fetch(
            `${BASE_URL}/nft/${contractAddress}?chain=${chain}&format=decimal&limit=${limit}&offset=${offset}`,
            {
                headers: getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Moralis API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Moralis NFT data for contract ${contractAddress}:`, data);
        
        if (!data.result || data.result.length === 0) {
            return [];
        }

        return data.result.map((nft, index) => {
            const metadata = parseMetadata(nft.metadata);
            
            return {
                id: nft.token_id,
                tokenId: nft.token_id,
                name: metadata.name || `Token #${nft.token_id}`,
                image: formatImageUrl(metadata.image, index),
                description: metadata.description || '',
                attributes: metadata.attributes || [],
                contractAddress: nft.token_address,
                tokenType: nft.contract_type,
                owner: nft.owner_of,
                tokenUri: nft.token_uri,
                metadata: metadata
            };
        });
    } catch (error) {
        console.error('Error fetching NFTs from Moralis:', error);
        throw error;
    }
};

// Get NFT collections
export const getNFTCollections = async (options = {}) => {
    const {
        limit = 10,
        chain = 'eth'
    } = options;

    try {
        // Note: This endpoint might need adjustment based on Moralis API documentation
        const response = await fetch(
            `${BASE_URL}/nft/collections?chain=${chain}&limit=${limit}`,
            {
                headers: getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Moralis Collections API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Moralis collections data:', data);
        
        return data.result || [];
    } catch (error) {
        console.error('Error fetching collections from Moralis:', error);
        throw error;
    }
};

// Get NFT metadata by token
export const getNFTMetadata = async (contractAddress, tokenId, options = {}) => {
    const { chain = 'eth' } = options;

    try {
        const response = await fetch(
            `${BASE_URL}/nft/${contractAddress}/${tokenId}?chain=${chain}&format=decimal`,
            {
                headers: getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Moralis NFT metadata error: ${response.status}`);
        }

        const data = await response.json();
        const metadata = parseMetadata(data.metadata);
        
        return {
            ...data,
            parsedMetadata: metadata,
            image: formatImageUrl(metadata.image)
        };
    } catch (error) {
        console.error('Error fetching NFT metadata from Moralis:', error);
        throw error;
    }
};

// Get NFT transfers for a contract
export const getNFTTransfers = async (contractAddress, options = {}) => {
    const {
        limit = 10,
        chain = 'eth'
    } = options;

    try {
        const response = await fetch(
            `${BASE_URL}/nft/${contractAddress}/transfers?chain=${chain}&limit=${limit}`,
            {
                headers: getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Moralis NFT transfers error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Moralis transfers data:', data);
        
        return data.result || [];
    } catch (error) {
        console.error('Error fetching NFT transfers from Moralis:', error);
        throw error;
    }
};

// Popular NFT contract addresses for easy reference
export const POPULAR_CONTRACTS = {
    BAYC: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    MAYC: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
    CRYPTOPUNKS: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    AZUKI: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
    DOODLES: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
    CLONE_X: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B'
};

// Default export with all functions
export default {
    getNFTsFromContract,
    getNFTCollections,
    getNFTMetadata,
    getNFTTransfers,
    POPULAR_CONTRACTS
};