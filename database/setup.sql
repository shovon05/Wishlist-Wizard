-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS soft_prerequisites CASCADE;
DROP TABLE IF EXISTS hard_prerequisites CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Balanced', 'Hard'
    type VARCHAR(50) NOT NULL
);

CREATE TABLE hard_prerequisites (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) REFERENCES courses(code) ON DELETE CASCADE,
    prerequisite_code VARCHAR(20) REFERENCES courses(code) ON DELETE CASCADE,
    UNIQUE(course_code, prerequisite_code)
);

CREATE TABLE soft_prerequisites (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) REFERENCES courses(code) ON DELETE CASCADE,
    prerequisite_code VARCHAR(20) REFERENCES courses(code) ON DELETE CASCADE,
    UNIQUE(course_code, prerequisite_code)
);
