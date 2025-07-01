import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// CORS configuration for frontend requests
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight requests
app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'NFT Server is running successfully!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'NFT API Server'
  });
});

// NFT Collections endpoint using Reservoir API
app.get('/api/nfts', async (req, res) => {
  try {
    const { limit = 12, name, slug } = req.query;
    
    // Build Reservoir API URL for collections
    let reservoirUrl = `https://api.reservoir.tools/collections/v7?limit=${limit}&sortBy=allTimeVolume`;
    
    // Add search parameters if provided
    if (name) {
      reservoirUrl += `&name=${encodeURIComponent(name)}`;
    }
    if (slug) {
      reservoirUrl += `&slug=${encodeURIComponent(slug)}`;
    }
    
    const response = await fetch(reservoirUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NFT-Gallery-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Reservoir API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data for our frontend
    const transformedData = {
      collections: data.collections?.map(collection => ({
        id: collection.id,
        name: collection.name || 'Unnamed Collection',
        description: collection.description || '',
        image: collection.image,
        contractAddress: collection.primaryContract,
        symbol: collection.symbol,
        totalSupply: collection.tokenCount,
        floorPrice: collection.floorAsk?.price?.amount?.native,
        volume: collection.volume?.allTime,
        ownerCount: collection.ownerCount,
        verified: collection.safelistRequestStatus === 'verified',
        createdAt: collection.createdAt,
        slug: collection.slug
      })) || [],
      pagination: {
        hasNextPage: data.continuation ? true : false,
        cursor: data.continuation
      }
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching NFT collections:', error);
    res.status(500).json({ 
      error: 'Failed to fetch NFT collections',
      message: error.message 
    });
  }
});

// Trending NFTs endpoint using Reservoir API
app.get('/api/trending-nfts', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Get trending collections first
    const collectionsResponse = await fetch(`https://api.reservoir.tools/collections/v7?limit=${limit}&sortBy=1DayVolume`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NFT-Gallery-App/1.0'
      }
    });

    if (!collectionsResponse.ok) {
      throw new Error(`Reservoir API responded with status: ${collectionsResponse.status}`);
    }

    const collectionsData = await collectionsResponse.json();
    
    // Get tokens from trending collections
    const trendingTokens = [];
    const collections = collectionsData.collections?.slice(0, 10) || [];
    
    for (const collection of collections) {
      try {
        const tokensResponse = await fetch(`https://api.reservoir.tools/tokens/v7?collection=${collection.id}&limit=2&sortBy=floorAskPrice`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'NFT-Gallery-App/1.0'
          }
        });

        if (tokensResponse.ok) {
          const tokensData = await tokensResponse.json();
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
        }
      } catch (error) {
        console.error(`Error fetching tokens for collection ${collection.id}:`, error);
        // Continue with other collections
      }
    }

    const transformedData = {
      tokens: trendingTokens.slice(0, limit),
      pagination: {
        hasNextPage: false,
        cursor: null
      }
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching trending NFTs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trending NFTs',
      message: error.message 
    });
  }
});

// CloneX Collection endpoint using Reservoir API
app.get('/api/doodles-collection', async (req, res) => {
  try {
    const { limit = 24 } = req.query;
    
    // CloneX contract address
    const cloneXContract = '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b';
    
    // Get collection info first
    const collectionResponse = await fetch(`https://api.reservoir.tools/collections/v7?id=${cloneXContract}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NFT-Gallery-App/1.0'
      }
    });

    let collectionInfo = null;
    if (collectionResponse.ok) {
      const collectionData = await collectionResponse.json();
      const collection = collectionData.collections?.[0];
      if (collection) {
        collectionInfo = {
          name: collection.name,
          floorPrice: collection.floorAsk?.price?.amount?.native,
          totalSupply: collection.tokenCount,
          ownerCount: collection.ownerCount,
          volume: collection.volume?.allTime
        };
      }
    }
    
    // Get CloneX tokens
    const tokensResponse = await fetch(`https://api.reservoir.tools/tokens/v7?collection=${cloneXContract}&limit=${limit}&sortBy=tokenId`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NFT-Gallery-App/1.0'
      }
    });

    if (!tokensResponse.ok) {
      throw new Error(`Reservoir API responded with status: ${tokensResponse.status}`);
    }

    const tokensData = await tokensResponse.json();
    
    const transformedData = {
      collection: collectionInfo,
      tokens: tokensData.tokens?.map(token => ({
        id: token.token?.tokenId,
        name: token.token?.name || `CloneX #${token.token?.tokenId}`,
        image: token.token?.image,
        contractAddress: token.token?.contract,
        floorPrice: token.market?.floorAsk?.price?.amount?.native,
        lastSalePrice: token.market?.lastSale?.price?.amount?.native,
        attributes: token.token?.attributes,
        rarity: token.token?.rarityScore,
        owner: token.token?.owner
      })) || [],
      pagination: {
        hasNextPage: tokensData.continuation ? true : false,
        cursor: tokensData.continuation
      }
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching CloneX collection:', error);
    res.status(500).json({ 
      error: 'Failed to fetch CloneX collection',
      message: error.message 
    });
  }
});

// NFT Tokens endpoint for specific collection using Reservoir API
app.get('/api/nfts/:collectionId/tokens', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { limit = 8 } = req.query;
    
    // Build Reservoir API URL for tokens in collection
    const reservoirUrl = `https://api.reservoir.tools/tokens/v7?collection=${collectionId}&limit=${limit}&sortBy=floorAskPrice`;
    
    const response = await fetch(reservoirUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NFT-Gallery-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Reservoir API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    const transformedData = {
      tokens: data.tokens?.map(token => ({
        id: token.token?.tokenId,
        name: token.token?.name || `${token.token?.collection?.name || 'Token'} #${token.token?.tokenId}`,
        description: token.token?.description || '',
        image: token.token?.image,
        owner: token.token?.owner,
        contractAddress: token.token?.contract,
        floorPrice: token.market?.floorAsk?.price?.amount?.native,
        lastSalePrice: token.market?.lastSale?.price?.amount?.native,
        rarity: token.token?.rarityScore,
        attributes: token.token?.attributes
      })) || [],
      pagination: {
        hasNextPage: data.continuation ? true : false,
        cursor: data.continuation
      }
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching NFT tokens:', error);
    res.status(500).json({ 
      error: 'Failed to fetch NFT tokens',
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 CORS enabled for frontend connections`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/health`);
});
