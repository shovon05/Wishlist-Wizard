const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function importData() {
    try {
        // 1. Run setup.sql to recreate tables
        console.log('Running setup.sql...');
        const setupSqlPath = path.join(__dirname, '../../database/setup.sql');
        const setupSql = fs.readFileSync(setupSqlPath, 'utf-8');
        await db.query(setupSql);
        console.log('Tables created successfully.');

        // 2. Read courses.json
        console.log('Reading courses.json...');
        const coursesJsonPath = path.join(__dirname, '../../courses.json');
        const coursesData = JSON.parse(fs.readFileSync(coursesJsonPath, 'utf-8'));
        console.log(`Found ${coursesData.length} courses.`);

        // 3. Insert courses
        console.log('Inserting courses...');
        for (const course of coursesData) {
            await db.query(
                `INSERT INTO courses (code, name, credits, difficulty, type)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (code) DO NOTHING`,
                [course.code, course.name, course.credits, course.difficulty, course.type]
            );
        }
        console.log('Courses inserted successfully.');

        // 4. Insert prerequisites
        console.log('Inserting prerequisites...');
        for (const course of coursesData) {
            // Hard prerequisites
            if (course.hard_prerequisites && course.hard_prerequisites.length > 0) {
                for (const prereq of course.hard_prerequisites) {
                    // Verify prereq exists in DB (to avoid foreign key violation if json has bad data)
                    const checkPrereq = await db.query('SELECT code FROM courses WHERE code = $1', [prereq]);
                    if (checkPrereq.rows.length === 0) {
                        console.warn(`WARNING: Hard prerequisite '${prereq}' for course '${course.code}' not found in courses. Skipping.`);
                        continue;
                    }
                    await db.query(
                        `INSERT INTO hard_prerequisites (course_code, prerequisite_code)
             VALUES ($1, $2)
             ON CONFLICT (course_code, prerequisite_code) DO NOTHING`,
                        [course.code, prereq]
                    );
                }
            }

            // Soft prerequisites
            if (course.soft_prerequisites && course.soft_prerequisites.length > 0) {
                for (const prereq of course.soft_prerequisites) {
                    const checkPrereq = await db.query('SELECT code FROM courses WHERE code = $1', [prereq]);
                    if (checkPrereq.rows.length === 0) {
                        console.warn(`WARNING: Soft prerequisite '${prereq}' for course '${course.code}' not found in courses. Skipping.`);
                        continue;
                    }
                    await db.query(
                        `INSERT INTO soft_prerequisites (course_code, prerequisite_code)
             VALUES ($1, $2)
             ON CONFLICT (course_code, prerequisite_code) DO NOTHING`,
                        [course.code, prereq]
                    );
                }
            }
        }
        console.log('Prerequisites inserted successfully.');

        console.log('Import completed!');
        process.exit(0);

    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

importData();
