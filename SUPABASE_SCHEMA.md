# Supabase Database Schema for NFT Gallery Project

## Overview
This document outlines the complete database schema required for the NFT Gallery application built with React, Supabase, and Web3 integration.

---

## Tables

### 1. **profiles** (User Profiles)
Stores user profile information extended from Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  location TEXT,
  
  -- Social Media & Web
  website TEXT,
  twitter TEXT,
  instagram TEXT,
  
  -- Media
  avatar TEXT,
  cover_image TEXT,
  
  -- Balance & Permissions
  nft_balance DECIMAL(10, 6) DEFAULT 0,
  can_upload BOOLEAN DEFAULT false,
  admin_role BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for username lookups
CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_admin_idx ON profiles(admin_role) WHERE admin_role = true;
```

---

### 2. **nfts** (NFT Listings)
Stores user-created NFT data.

```sql
CREATE TABLE nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_email TEXT NOT NULL,
  
  -- NFT Details
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  price DECIMAL(10, 6) NOT NULL,
  category TEXT,
  
  -- Status
  status TEXT DEFAULT 'Listed' CHECK (status IN ('Listed', 'Sold', 'Delisted')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX nfts_owner_idx ON nfts(owner);
CREATE INDEX nfts_status_idx ON nfts(status);
CREATE INDEX nfts_category_idx ON nfts(category);
CREATE INDEX nfts_price_idx ON nfts(price);
CREATE INDEX nfts_created_at_idx ON nfts(created_at DESC);
```

---

### 3. **withdrawal_requests** (Withdrawal Tracking)
Manages user withdrawal requests for ETH balance.

```sql
CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User & Amount
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 6) NOT NULL,
  
  -- Wallet Information
  wallet_address TEXT NOT NULL,
  note TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'rejected')),
  
  -- Admin Fields
  processed_by UUID REFERENCES profiles(id),
  processing_note TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX withdrawal_requests_user_idx ON withdrawal_requests(user_id);
CREATE INDEX withdrawal_requests_status_idx ON withdrawal_requests(status);
CREATE INDEX withdrawal_requests_created_at_idx ON withdrawal_requests(created_at DESC);
```

---

### 4. **transactions** (Payment & Balance Tracking)
Records all ETH transactions for audit trail.

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User & Amount
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 6) NOT NULL,
  
  -- Transaction Details
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'purchase', 'sale', 'platform_fee', 'refund')),
  description TEXT,
  
  -- Related Entities
  nft_id UUID REFERENCES nfts(id) ON DELETE SET NULL,
  withdrawal_request_id UUID REFERENCES withdrawal_requests(id) ON DELETE SET NULL,
  
  -- Blockchain
  blockchain_tx_hash TEXT UNIQUE,
  wallet_address TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX transactions_user_idx ON transactions(user_id);
CREATE INDEX transactions_type_idx ON transactions(transaction_type);
CREATE INDEX transactions_nft_idx ON transactions(nft_id);
CREATE INDEX transactions_status_idx ON transactions(status);
CREATE INDEX transactions_created_at_idx ON transactions(created_at DESC);
```

---

### 5. **sales** (NFT Sales Records)
Tracks completed NFT sales for marketplace analytics.

```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- NFT & Parties
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Transaction Details
  sale_price DECIMAL(10, 6) NOT NULL,
  platform_fee DECIMAL(10, 6) DEFAULT 0,
  total_amount DECIMAL(10, 6) NOT NULL,
  
  -- Blockchain
  blockchain_tx_hash TEXT UNIQUE,
  
  -- Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX sales_nft_idx ON sales(nft_id);
CREATE INDEX sales_seller_idx ON sales(seller_id);
CREATE INDEX sales_buyer_idx ON sales(buyer_id);
CREATE INDEX sales_status_idx ON sales(status);
CREATE INDEX sales_created_at_idx ON sales(created_at DESC);
```

---

### 6. **favorites** (User Favorites/Wishlist)
Allows users to favorite/bookmark NFTs.

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User & NFT
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint (one favorite per user per NFT)
  UNIQUE(user_id, nft_id)
);

-- Create indexes
CREATE INDEX favorites_user_idx ON favorites(user_id);
CREATE INDEX favorites_nft_idx ON favorites(nft_id);
```

---

### 7. **collections** (Collection Categories/Groups)
Organize NFTs into collections.

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Collection Details
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Media
  cover_image TEXT,
  
  -- Status
  is_public BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX collections_creator_idx ON collections(creator_id);
CREATE INDEX collections_is_public_idx ON collections(is_public);
```

---

### 8. **collection_items** (NFTs in Collections)
Junction table linking NFTs to collections.

```sql
CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  
  -- Ordering
  order_index INTEGER,
  
  -- Timestamps
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint
  UNIQUE(collection_id, nft_id)
);

-- Create indexes
CREATE INDEX collection_items_collection_idx ON collection_items(collection_id);
CREATE INDEX collection_items_nft_idx ON collection_items(nft_id);
```

---

### 9. **audit_logs** (Admin Actions)
Tracks admin actions for compliance and debugging.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Admin Info
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Action Details
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  changes JSONB,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX audit_logs_admin_idx ON audit_logs(admin_id);
CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at DESC);
```

---

### 10. **payment_methods** (User Payment Methods)
Stores user cryptocurrency wallet information securely.

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Wallet Info
  wallet_address TEXT NOT NULL,
  wallet_type TEXT, -- e.g., 'metamask', 'ledger', 'coinbase'
  
  -- Status
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX payment_methods_user_idx ON payment_methods(user_id);
CREATE INDEX payment_methods_wallet_address_idx ON payment_methods(wallet_address);
```

---

## Storage Configuration

### Supabase Storage Buckets

Create the following buckets in Supabase Storage:

```
nftproject/
├── nfts/              # User-uploaded NFT images
├── avatars/           # User profile avatars
├── covers/            # User profile cover images
└── collections/       # Collection cover images
```

**Bucket Policies:**
- `nfts/`: Public read access, authenticated users can upload
- `avatars/`: Public read access, users can upload only their own
- `covers/`: Public read access, users can upload only their own
- `collections/`: Public read access, users can upload only their own

---

## RLS (Row Level Security) Policies

### profiles Table
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND admin_role = true
    )
  );
```

### nfts Table
```sql
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "NFTs are viewable by everyone"
  ON nfts FOR SELECT
  USING (true);

-- Users can insert their own NFTs
CREATE POLICY "Users can create NFTs"
  ON nfts FOR INSERT
  WITH CHECK (auth.uid() = owner);

-- Users can update their own NFTs
CREATE POLICY "Users can update own NFTs"
  ON nfts FOR UPDATE
  USING (auth.uid() = owner)
  WITH CHECK (auth.uid() = owner);

-- Users can delete their own NFTs
CREATE POLICY "Users can delete own NFTs"
  ON nfts FOR DELETE
  USING (auth.uid() = owner);
```

### withdrawal_requests Table
```sql
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own withdrawal requests
CREATE POLICY "Users can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all withdrawal requests
CREATE POLICY "Admins can view all withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND admin_role = true
    )
  );

-- Users can create withdrawal requests
CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update withdrawal requests
CREATE POLICY "Admins can update withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND admin_role = true
    )
  );
```

---

## Views (Optional but Recommended)

### User Statistics
```sql
CREATE VIEW user_stats AS
SELECT 
  p.id,
  p.username,
  COUNT(DISTINCT n.id) as total_nfts,
  COUNT(DISTINCT CASE WHEN n.status = 'Sold' THEN n.id END) as sold_nfts,
  COUNT(DISTINCT CASE WHEN n.status = 'Listed' THEN n.id END) as active_listings,
  COALESCE(SUM(n.price), 0) as total_listed_value,
  p.nft_balance,
  p.can_upload,
  p.admin_role
FROM profiles p
LEFT JOIN nfts n ON p.id = n.owner
GROUP BY p.id, p.username, p.nft_balance, p.can_upload, p.admin_role;
```

### Marketplace Statistics
```sql
CREATE VIEW marketplace_stats AS
SELECT 
  COUNT(DISTINCT id) as total_nfts,
  COUNT(DISTINCT owner) as total_creators,
  COUNT(DISTINCT CASE WHEN status = 'Listed' THEN id END) as active_listings,
  COUNT(DISTINCT CASE WHEN status = 'Sold' THEN id END) as total_sold,
  COALESCE(AVG(CASE WHEN status = 'Listed' THEN price END), 0) as avg_listing_price,
  COALESCE(MAX(price), 0) as highest_price,
  COALESCE(MIN(CASE WHEN status = 'Listed' THEN price END), 0) as lowest_listed_price
FROM nfts;
```

---

## Database Functions (Optional)

### Update NFT Balance After Purchase
```sql
CREATE OR REPLACE FUNCTION update_user_balance_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Add sale amount to seller
  UPDATE profiles 
  SET nft_balance = nft_balance + NEW.sale_price
  WHERE id = NEW.seller_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_balance_on_sale
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION update_user_balance_on_sale();
```

### Auto-update updated_at Timestamp
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nfts_updated_at
BEFORE UPDATE ON nfts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Data Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                        auth.users                            │
│                      (Supabase Auth)                         │
└──────────────┬────────────────────────────────────────────────┘
               │
               ├─────────────────────────┬─────────────────────┐
               │                         │                     │
         ┌─────▼──────────┐      ┌──────▼──────┐      ┌────────▼────────┐
         │   profiles     │      │    nfts     │      │  collections    │
         │  (Extended)    │      │             │      │                 │
         └──────┬──────────┘      └──────┬──────┘      └────────┬────────┘
                │                       │                      │
                ├───────┬───────┬───────┤                 ┌─────▼────────┐
                │       │       │       │                 │ collection_  │
                │       │       │       │                 │    items     │
         ┌──────▼──┐  ┌─▼──────▼──┐  ┌─▼──────────┐      └──────────────┘
         │favorites│  │withdrawal │  │ payment_   │
         │         │  │ requests  │  │ methods    │
         └─────────┘  └───┬───────┘  └────────────┘
                          │
                    ┌─────▼─────┐
                    │transactions│
                    └────────────┘
```

---

## Setup Instructions

### 1. Connect to Supabase
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

### 2. Environment Variables (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Create Storage Buckets
- Go to Supabase Dashboard > Storage
- Create buckets: `nfts`, `avatars`, `covers`, `collections`
- Set appropriate CORS and access policies

### 4. Enable Auth
- Go to Supabase Dashboard > Authentication
- Enable Email provider
- Configure JWT expiry time (recommend 24 hours)

---

## Key Features Supported

✅ User authentication & profiles  
✅ NFT creation & management  
✅ User upload permissions (can_upload flag)  
✅ ETH balance tracking & withdrawals  
✅ Admin role management  
✅ NFT favorites/wishlist  
✅ Collections/grouping  
✅ Transaction history  
✅ Admin audit logging  
✅ Payment method storage  
✅ Sales tracking  

---

## Security Considerations

1. **RLS Policies**: All tables have appropriate Row Level Security
2. **Encryption**: Sensitive data (wallet addresses) should be encrypted
3. **Audit Logs**: All admin actions are logged
4. **Verification**: Payment methods can be verified before use
5. **Status Checks**: Withdrawal requests go through approval workflow

---

## Optimization Tips

1. Index frequently queried columns (done above)
2. Use pagination for large result sets
3. Cache user profiles in React context
4. Use database views for common queries
5. Consider partitioning large tables if they grow significantly
6. Regular backups through Supabase automated backups

---

## Migration Path

If migrating from another database:
1. Export data from existing database
2. Transform data to match schema
3. Disable RLS temporarily
4. Bulk insert data
5. Validate data integrity
6. Enable RLS again
7. Test thoroughly before going to production

