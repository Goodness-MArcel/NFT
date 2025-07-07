import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: process.env.DB_POOL_MAX,
  idleTimeoutMillis: process.env.DB_POOL_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: process.env.DB_POOL_CONNECTION_TIMEOUT_MS,
  ssl: { rejectUnauthorized: false }
});

// Test connection and show success message
pool.query('SELECT NOW()')
  .then((res) => {
    console.log('✅ Database connection established successfully');
    console.log('🕒 Current database time:', res.rows[0].now);
    console.log('📊 Connection pool stats:', {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1); // Exit with error code if connection fails
  });

// Log connection events
pool.on('connect', () => {
  console.log('🔌 New client connected to pool');
});

pool.on('remove', () => {
  console.log('❎ Client removed from pool');
});

// Handle application termination
process.on('exit', () => {
  console.log('🔌 Closing database connection pool');
  pool.end();
});

export default pool;