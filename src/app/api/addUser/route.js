import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import logger from '../../components/Logger/logger';

// Setup the Postgres connection using a connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
});

export async function POST(request) {
  try {
    // Parse the request body
    const { name, age, email, position, department, is_active } = await request.json();

    // Insert the user into the company_users table
    const query = `
      INSERT INTO company_users (name, age, email, position, department, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, age, email, position, department, is_active];

    const result = await pool.query(query, values);
    // Return a successful response with the newly created user
    return NextResponse.json(
      { message: 'User added successfully', user: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error inserting user:', error);
    logger.error('Error inserting user:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}