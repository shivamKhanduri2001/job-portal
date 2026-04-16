CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('seeker', 'employer')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  about TEXT,
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  company VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  salary VARCHAR(100),
  type VARCHAR(50) CHECK (type IN ('Full-time','Part-time','Remote','Internship','Contract')),
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
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','reviewed','accepted','rejected')),
  applied_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, seeker_id)
);