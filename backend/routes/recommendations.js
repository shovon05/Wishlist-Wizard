const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/courses', async (req, res) => {
  try {
    const result = await db.query('SELECT code, name FROM courses ORDER BY code');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { cgpa, completedCourses, repeatCourses, difficulty, maxCourses } = req.body;

    // Validate inputs
    if (cgpa === undefined || !difficulty || maxCourses === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Fetch all courses
    const allCoursesResult = await db.query('SELECT * FROM courses');
    let courses = allCoursesResult.rows;

    const completedSet = new Set(completedCourses || []);
    const repeatSet = new Set(repeatCourses || []);

    // Fetch prerequisite mapping
    const prereqResult = await db.query('SELECT course_code, prerequisite_code FROM hard_prerequisites');
    const prereqMap = {};
    prereqResult.rows.forEach(row => {
      if (!prereqMap[row.course_code]) prereqMap[row.course_code] = [];
      prereqMap[row.course_code].push(row.prerequisite_code);
    });

    // 2. Filter out completed courses, but keep repeat courses
    let eligibleCourses = courses.filter(course => {
      // If course is in repeat set, always keep it
      if (repeatSet.has(course.code)) return true;
      // Filter out completed courses
      if (completedSet.has(course.code)) return false;
      return true;
    });

    // 3. Filter by Prerequisites
    eligibleCourses = eligibleCourses.filter(course => {
      const reqs = prereqMap[course.code];
      if (!reqs || reqs.length === 0) return true;

      // A student must have completed all prerequisites to take the course
      return reqs.every(reqCode => completedSet.has(reqCode));
    });

    // 4. Sort and Prioritize based on constraints

    // Evaluate Difficulty matching based on CGPA and preference
    // Very naive scoring system:
    // User preference gets +10 points
    // Repeat courses get +20 points
    // CGPA impacts:
    // If Hard and CGPA < 3.0: -5 points
    // If Easy and CGPA > 3.5: -2 points (encourage harder courses)

    eligibleCourses.forEach(course => {
      let score = 0;

      // Priority for repeats
      if (repeatSet.has(course.code)) {
        score += 20;
      }

      // Priority for difficulty match
      if (course.difficulty === difficulty) {
        score += 10;
      }

      // CGPA adjustments
      if (course.difficulty === 'Hard' && cgpa < 3.0) {
        score -= 5;
      } else if (course.difficulty === 'Easy' && cgpa > 3.5) {
        score -= 2;
      }

      course.recommendationScore = score;
    });

    // Sort by score descending
    eligibleCourses.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // 5. Apply maxCourses limit
    function generateCombinations(arr, size) {
      const result = [];

      function combine(start, combo) {
        if (combo.length === size) {
          result.push([...combo]);
          return;
        }

        for (let i = start; i < arr.length; i++) {
          combo.push(arr[i]);
          combine(i + 1, combo);
          combo.pop();
        }
      }

      combine(0, []);
      return result;
    }

    const combinations = generateCombinations(eligibleCourses.slice(0, 10), maxCourses);

    // Return top 5 combinations
    const finalRecommendations = combinations.slice(0, 5);

    res.json(finalRecommendations);

  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
