/*
  # Remove authentication requirements
  
  1. Changes
    - Drop existing RLS policies
    - Add public access policies
    - Remove user_id foreign key constraints
    - Make all data publicly accessible
*/

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can read own books" ON books;
DROP POLICY IF EXISTS "Users can insert own books" ON books;
DROP POLICY IF EXISTS "Users can update own books" ON books;
DROP POLICY IF EXISTS "Users can delete own books" ON books;
DROP POLICY IF EXISTS "Users can read own reading progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can insert own reading progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can update own reading progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can delete own reading progress" ON reading_progress;

-- Add public access policies
CREATE POLICY "Public read access for users"
  ON users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for books"
  ON books FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for reading_progress"
  ON reading_progress FOR SELECT
  TO public
  USING (true);

-- Make user_id optional in books and reading_progress
ALTER TABLE books ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE reading_progress ALTER COLUMN user_id DROP NOT NULL;