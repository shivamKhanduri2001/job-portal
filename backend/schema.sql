CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('employer', 'job_seeker')),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  emplyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  about TEXT NOT NULL,
  website VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(), 
);
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  companies VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  salary VARCHAR(100),
  type VARCHAR(50) CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
  description TEXT NOT NULL,
  requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  seeker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resume_url VARCHAR(255),
  cover_letter TEXT,
  resume_url VARCHAR(255),
  status VARCHAR(50) CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT NOW(),
  unique (job_id, seeker_id)
);