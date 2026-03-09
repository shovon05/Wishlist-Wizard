"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [cgpa, setCgpa] = useState("");
  const [difficulty, setDifficulty] = useState("Balanced");
  const [maxCourses, setMaxCourses] = useState(4);
  const [recommendations, setRecommendations] = useState([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [repeatCourses, setRepeatCourses] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/recommendations/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const toggleRepeatCourse = (code: string) => {
    if (repeatCourses.includes(code)) {
      setRepeatCourses(repeatCourses.filter(c => c !== code));
    } else {
      setRepeatCourses([...repeatCourses, code]);
    }
  };

  const generateWishlist = async () => {
    const response = await fetch(
      "http://localhost:3001/api/recommendations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cgpa: parseFloat(cgpa),
          completedCourses,
          repeatCourses,
          difficulty,
          maxCourses,
        }),
      }
    );

    const data = await response.json();
    setRecommendations(data);
  };

  const toggleCourse = (code: string) => {
    if (completedCourses.includes(code)) {
      setCompletedCourses(completedCourses.filter(c => c !== code));
    } else {
      setCompletedCourses([...completedCourses, code]);
    }
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Wishlist Wizard</h1>
      <h3>Select Completed Courses</h3>

      <div>
        {courses.map((course: any) => (
          <label key={course.code} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={completedCourses.includes(course.code)}
              onChange={() => toggleCourse(course.code)}
            />
            {course.code} - {course.name}
          </label>
        ))}
      </div>

      <h3>Select Repeat Courses</h3>

      <div>
        {courses.map((course: any) => (
          <label key={course.code} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={repeatCourses.includes(course.code)}
              onChange={() => toggleRepeatCourse(course.code)}
            />
            {course.code} - {course.name}
          </label>
        ))}
      </div>
      <h2>Generate Course Wishlist</h2>

      <div>
        <label>CGPA:</label>
        <input
          type="number"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />
      </div>

      <div>
        <label>Preferred Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Balanced">Balanced</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div>
        <label>Max Courses:</label>
        <input
          type="number"
          value={maxCourses}
          onChange={(e) => setMaxCourses(Number(e.target.value))}
        />
      </div>

      <button onClick={generateWishlist}>Generate Wishlist</button>

      <h2>Recommended Courses</h2>

      <ul>
        {recommendations.map((course: any) => (
          <li key={course.code}>
            {course.code} - {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}