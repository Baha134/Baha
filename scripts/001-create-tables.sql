-- Users table for IIN + PIN auth
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  iin VARCHAR(12) UNIQUE NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table (linked to users)
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  university VARCHAR(255),
  major VARCHAR(255),
  faculty VARCHAR(255),
  gpa DECIMAL(3,2),
  max_gpa DECIMAL(3,2) DEFAULT 4.0,
  year INTEGER,
  credits_earned INTEGER DEFAULT 0,
  credits_total INTEGER DEFAULT 240,
  bio TEXT,
  avatar VARCHAR(10),
  location VARCHAR(100),
  available_for_internship BOOLEAN DEFAULT false
);

-- Skills per student
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  hard_score INTEGER DEFAULT 0,
  soft_score INTEGER DEFAULT 0,
  category VARCHAR(10) DEFAULT 'hard'
);

-- Skill verifications
CREATE TABLE IF NOT EXISTS skill_verifications (
  id SERIAL PRIMARY KEY,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  verifier_name VARCHAR(255),
  verifier_role VARCHAR(255),
  verified_date VARCHAR(50),
  context TEXT
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  achievement_date VARCHAR(50),
  verified BOOLEAN DEFAULT false,
  description TEXT,
  verifier_name VARCHAR(255),
  verifier_title VARCHAR(255),
  verifier_department VARCHAR(255)
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  university VARCHAR(255),
  department VARCHAR(255),
  title VARCHAR(100)
);

-- Teacher-student relationship
CREATE TABLE IF NOT EXISTS teacher_students (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE(teacher_id, student_id)
);
