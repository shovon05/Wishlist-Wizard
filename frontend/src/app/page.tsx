"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/recommendations/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Wishlist Wizard</h1>
      <h2>Available Courses</h2>

      <ul>
        {courses.map((course: any) => (
          <li key={course.code}>
            {course.code} - {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}