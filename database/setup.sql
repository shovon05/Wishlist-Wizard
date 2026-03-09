CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Balanced', 'Hard'
    prerequisites VARCHAR(255) -- comma-separated course codes, or JSON
);

-- Insert some mock base courses spanning different difficulties
INSERT INTO courses (code, name, credits, difficulty, prerequisites) VALUES
('CS101', 'Introduction to Programming', 3, 'Easy', NULL),
('MATH101', 'Calculus I', 4, 'Balanced', NULL),
('ENG101', 'English Composition', 3, 'Easy', NULL),
('CS201', 'Data Structures', 4, 'Balanced', 'CS101'),
('CS301', 'Algorithms', 4, 'Hard', 'CS201'),
('MATH201', 'Linear Algebra', 3, 'Balanced', 'MATH101'),
('PHY101', 'Physics I', 4, 'Hard', 'MATH101'),
('ART101', 'Art History', 3, 'Easy', NULL),
('CS401', 'Operating Systems', 4, 'Hard', 'CS201,CS301'),
('CS402', 'Machine Learning', 4, 'Hard', 'CS301,MATH201'),
('BUS101', 'Introduction to Business', 3, 'Easy', NULL),
('ECON101', 'Microeconomics', 3, 'Balanced', NULL),
('CS305', 'Web Development', 3, 'Balanced', 'CS101'),
('CS405', 'Advanced Web Development', 3, 'Hard', 'CS305');
