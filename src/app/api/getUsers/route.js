import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import logger from '../../components/Logger/logger';

// Set up the Postgres connection using a connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admindsafd',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
});

export async function GET(request) {
  try {
    // Query to select all users from the company_users table
    const query = 'SELECT * FROM company_users ORDER BY id ASC';
    const result = await pool.query(query);
    
    // Return the users in JSON format
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    logger.error('Error fetching user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}