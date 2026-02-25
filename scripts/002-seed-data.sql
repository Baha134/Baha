-- Seed demo users (PIN: 1234 for all, pre-hashed with bcrypt)
-- bcrypt hash of "1234": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO users (iin, pin_hash, role, full_name) VALUES
  ('030201123456', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student', 'Aidar Kasymov'),
  ('900101654321', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employer', 'Kaspi HR'),
  ('850515789012', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'teacher', 'Nurlan Akhmetov')
ON CONFLICT (iin) DO NOTHING;

-- Seed student profile for Aidar
INSERT INTO students (user_id, university, major, faculty, gpa, max_gpa, year, credits_earned, credits_total, bio, avatar, location, available_for_internship)
SELECT u.id, 'L.N. Gumilyov Eurasian National University', 'Software Engineering', 'Faculty of Information Technologies',
  3.67, 4.0, 3, 128, 240, 'Passionate about backend development and data engineering. Active contributor to open-source projects and competitive programming enthusiast.',
  'AK', 'Astana', true
FROM users u WHERE u.iin = '030201123456'
ON CONFLICT DO NOTHING;

-- Seed teacher profile
INSERT INTO teachers (user_id, university, department, title)
SELECT u.id, 'L.N. Gumilyov Eurasian National University', 'Department of Computer Science', 'Professor'
FROM users u WHERE u.iin = '850515789012'
ON CONFLICT DO NOTHING;

-- Link teacher to student
INSERT INTO teacher_students (teacher_id, student_id)
SELECT t.id, s.id
FROM teachers t, students s
WHERE t.user_id = (SELECT id FROM users WHERE iin = '850515789012')
  AND s.user_id = (SELECT id FROM users WHERE iin = '030201123456')
ON CONFLICT DO NOTHING;

-- Seed skills for Aidar
INSERT INTO skills (student_id, skill_name, hard_score, soft_score, category)
SELECT s.id, v.skill_name, v.hard_score, v.soft_score, v.category
FROM students s,
(VALUES
  ('Teamwork', 60, 92, 'soft'),
  ('Algorithms', 88, 45, 'hard'),
  ('Communication', 35, 85, 'soft'),
  ('System Design', 78, 50, 'hard'),
  ('Leadership', 30, 80, 'soft'),
  ('Databases', 82, 40, 'hard'),
  ('Problem Solving', 90, 70, 'both'),
  ('Presentation', 25, 75, 'soft')
) AS v(skill_name, hard_score, soft_score, category)
WHERE s.user_id = (SELECT id FROM users WHERE iin = '030201123456');

-- Seed skill verifications
INSERT INTO skill_verifications (skill_id, verifier_name, verifier_role, verified_date, context)
SELECT sk.id, v.verifier_name, v.verifier_role, v.verified_date, v.context
FROM skills sk
JOIN students s ON sk.student_id = s.id
JOIN users u ON s.user_id = u.id,
(VALUES
  ('Teamwork', 'Nurlan T. Akhmetov', 'Professor, Project Management', '12 Jan 2026', 'Demonstrated exceptional teamwork in capstone project'),
  ('Teamwork', 'Aizhan B. Serikova', 'Lecturer, Software Engineering', '15 Nov 2025', 'Led daily stand-ups and sprint retrospectives'),
  ('Algorithms', 'Daulet K. Ospanov', 'Assoc. Professor, CS Dept.', '20 Dec 2025', 'Algorithms course confirmed - A+ grade'),
  ('Communication', 'Gulnara M. Iskakova', 'Senior Lecturer, Rhetoric', '03 Oct 2025', 'Public speaking workshop - clear structure'),
  ('Communication', 'Nurlan T. Akhmetov', 'Professor, Project Management', '12 Jan 2026', 'Capstone project - excellent stakeholder presentations'),
  ('System Design', 'Aizhan B. Serikova', 'Lecturer, Software Engineering', '28 Nov 2025', 'Designed scalable microservice architecture'),
  ('Leadership', 'Nurlan T. Akhmetov', 'Professor, Project Management', '12 Jan 2026', 'Team lead in 6-person capstone project'),
  ('Databases', 'Marat S. Zhumabekov', 'Assoc. Professor, Data Systems', '18 Sep 2025', 'Optimized PostgreSQL schema with advanced indexing'),
  ('Databases', 'Daulet K. Ospanov', 'Assoc. Professor, CS Dept.', '05 Jan 2026', 'Research assistant - designed ETL pipeline'),
  ('Problem Solving', 'Daulet K. Ospanov', 'Assoc. Professor, CS Dept.', '20 Dec 2025', 'Top 5% in ENU 2025 programming olympiad'),
  ('Problem Solving', 'Aizhan B. Serikova', 'Lecturer, Software Engineering', '15 Nov 2025', 'ENU Hackathon 2025 - creative solution under time pressure'),
  ('Presentation', 'Gulnara M. Iskakova', 'Senior Lecturer, Rhetoric', '03 Oct 2025', 'Final rhetoric presentation - 95/100 score')
) AS v(skill_name, verifier_name, verifier_role, verified_date, context)
WHERE u.iin = '030201123456' AND sk.skill_name = v.skill_name;

-- Seed achievements for Aidar
INSERT INTO achievements (student_id, title, icon, category, achievement_date, verified, description, verifier_name, verifier_title, verifier_department)
SELECT s.id, v.title, v.icon, v.category, v.achievement_date, v.verified, v.description, v.verifier_name, v.verifier_title, v.verifier_department
FROM students s
JOIN users u ON s.user_id = u.id,
(VALUES
  ('Python Advanced', 'code', 'skill', '15.01.2026', true, 'Advanced Python certificate verified by CS Department', 'Zh.T. Akhmetov', 'Associate Professor', 'Dept. of Computer Science'),
  ('GPA 4.0 Distinction', 'star', 'academic', '20.12.2025', true, 'GPA 4.0 distinction - Deans List fall 2025', 'S.K. Nurmagambetova', 'Dean', 'Faculty of IT'),
  ('Machine Learning', 'brain', 'skill', '10.11.2025', true, 'Machine Learning course completed with A grade', 'B.A. Tulegenov', 'Professor', 'Dept. of AI & Data Science'),
  ('Hackathon Astana Hub', 'trophy', 'competition', '05.11.2025', true, 'Astana Hub hackathon certificate - 1st place EdTech track', 'A.M. Kairbekova', 'Director', 'ENU Innovation Lab'),
  ('AWS Cloud Practitioner', 'shield', 'certification', '18.09.2025', true, 'International AWS Cloud Practitioner certificate verified', 'R.E. Sadykov', 'Senior Lecturer', 'Dept. of Information Systems'),
  ('Research Publication', 'file', 'academic', '01.09.2025', true, 'NLP for Kazakh Language paper accepted at IEEE', 'Zh.T. Akhmetov', 'Associate Professor', 'Dept. of Computer Science'),
  ('System Design', 'cpu', 'skill', '15.06.2025', true, 'System Design skill verified from project course', 'D.N. Omarov', 'Lecturer', 'Dept. of Software Engineering'),
  ('UX/UI Design', 'palette', 'skill', '20.05.2025', false, 'UX/UI Design certificate - pending confirmation', 'L.V. Kim', 'Senior Lecturer', 'Dept. of Design & Media')
) AS v(title, icon, category, achievement_date, verified, description, verifier_name, verifier_title, verifier_department)
WHERE u.iin = '030201123456';
