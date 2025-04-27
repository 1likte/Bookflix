/*
  # Initial Schema Setup for Bookflix

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Firebase auth ID
      - `email` (text, unique)
      - `display_name` (text)
      - `photo_url` (text)
      - `subscription` (text) - free, basic, premium
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `cover_url` (text)
      - `description` (text)
      - `categories` (text[])
      - `pdf_url` (text)
      - `total_pages` (integer)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reading_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `book_id` (uuid, foreign key)
      - `current_page` (integer)
      - `bookmarks` (integer[])
      - `last_read_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read and update their own user data
      - CRUD operations on their own books
      - CRUD operations on their own reading progress
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  display_name text,
  photo_url text,
  subscription text DEFAULT 'free' CHECK (subscription IN ('free', 'basic', 'premium')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  author text NOT NULL,
  cover_url text,
  description text,
  categories text[],
  pdf_url text NOT NULL,
  total_pages integer DEFAULT 1,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reading progress table
CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  current_page integer DEFAULT 1,
  bookmarks integer[] DEFAULT '{}',
  last_read_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Book Policies
CREATE POLICY "Users can read own books"
  ON books
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own books"
  ON books
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Reading Progress Policies
CREATE POLICY "Users can read own reading progress"
  ON reading_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own reading progress"
  ON reading_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own reading progress"
  ON reading_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own reading progress"
  ON reading_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reading_progress_updated_at
  BEFORE UPDATE ON reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();