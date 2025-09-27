-- Initialize Hessen Custom Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE address_type AS ENUM ('billing', 'shipping');
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff');

-- Set timezone
SET timezone = 'Asia/Singapore';
