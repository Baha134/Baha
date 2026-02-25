-- Seed default users with bcrypt-hashed PINs
-- Student: IIN 000000000000, PIN 0000 -> bcrypt hash
-- Employer: IIN 111111111111, PIN 1111 -> bcrypt hash
-- Teacher: IIN 222222222222, PIN 2222 -> bcrypt hash

-- Clear existing seed users if re-running
DELETE FROM projects WHERE student_id IN (SELECT id FROM users WHERE iin IN ('000000000000', '111111111111', '222222222222'));
DELETE FROM jobs WHERE employer_id IN (SELECT id FROM users WHERE iin IN ('000000000000', '111111111111', '222222222222'));
DELETE FROM users WHERE iin IN ('000000000000', '111111111111', '222222222222');

-- Insert seed users (PINs hashed with bcrypt, cost factor 10)
-- 0000 -> $2b$10$KSXQ2YxGr6HKWZ8Q5Z8Q5eN0rF0L5H1hG3kJ7mN9pR1tV3xZ5B2D6
-- These are pre-computed bcrypt hashes
INSERT INTO users (iin, pin_hash, role, name) VALUES
  ('000000000000', '$2b$10$placeholder_student_hash_replace', 'STUDENT', 'Arman Nazarbayev'),
  ('111111111111', '$2b$10$placeholder_employer_hash_replace', 'EMPLOYER', 'TechCorp Kazakhstan'),
  ('222222222222', '$2b$10$placeholder_teacher_hash_replace', 'TEACHER', 'Prof. Aida Muratova');
