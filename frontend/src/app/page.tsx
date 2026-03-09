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

      <h2>Recommended Course Sets</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
        {recommendations.map((set: any, index: number) => {

          const totalCredits = set.reduce((sum: number, c: any) => sum + c.credits, 0);

          const difficultyScore = set.reduce((sum: number, c: any) => {
            if (c.difficulty === "Easy") return sum + 1;
            if (c.difficulty === "Balanced") return sum + 2;
            if (c.difficulty === "Hard") return sum + 3;
            return sum;
          }, 0);

          return (
            <div
              key={index}
              style={{
                background: "rgba(30,41,59,0.7)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <h3>Option {index + 1}</h3>
              <p>Total Credits: {totalCredits}</p>
              <p>Semester Load: {difficultyScore} / 10</p>

              {set.map((course: any) => (
                <div key={course.code} style={{ marginBottom: "10px" }}>
                  <strong>{course.code}</strong> — {course.name}
                  <div style={{ fontSize: "14px", opacity: 0.8 }}>
                    Credits: {course.credits} | Difficulty: {course.difficulty}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}