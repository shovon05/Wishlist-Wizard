"use client";

import React, { useState, useEffect } from 'react';
import CourseSelector from '@/components/CourseSelector';
import RecommendationsResult from '@/components/RecommendationsResult';

export default function Home() {
  const [cgpa, setCgpa] = useState('');
  const [completedCourses, setCompletedCourses] = useState([]);
  const [repeatCourses, setRepeatCourses] = useState([]);
  const [difficulty, setDifficulty] = useState('Balanced');
  const [maxCourses, setMaxCourses] = useState(5);
  
  const [allCourses, setAllCourses] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const difficultyOptions = ['Easy', 'Balanced', 'Hard'];

  // Mock initial courses fetch for the selector menus
  // In a real app, this would be a separate API call like GET /api/courses
  useEffect(() => {
    // For the UI selectors, we need a list of all possible courses
    // We will hardcode the mock list here to avoid adding a new endpoint just for the dropdowns
    const mockCourses = [
      { code: 'CS101', name: 'Introduction to Programming' },
      { code: 'MATH101', name: 'Calculus I' },
      { code: 'ENG101', name: 'English Composition' },
      { code: 'CS201', name: 'Data Structures' },
      { code: 'CS301', name: 'Algorithms' },
      { code: 'MATH201', name: 'Linear Algebra' },
      { code: 'PHY101', name: 'Physics I' },
      { code: 'ART101', name: 'Art History' },
      { code: 'CS401', name: 'Operating Systems' },
      { code: 'CS402', name: 'Machine Learning' },
      { code: 'BUS101', name: 'Introduction to Business' },
      { code: 'ECON101', name: 'Microeconomics' },
      { code: 'CS305', name: 'Web Development' },
      { code: 'CS405', name: 'Advanced Web Development' },
    ];
    setAllCourses(mockCourses);
  }, []);

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    if (!cgpa || isNaN(cgpa) || cgpa < 0 || cgpa > 4.0) {
      setError('Please enter a valid CGPA between 0.0 and 4.0');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cgpa: parseFloat(cgpa),
          completedCourses,
          repeatCourses,
          difficulty,
          maxCourses: parseInt(maxCourses),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError('Wizard encountered an error. Is the backend server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60"></div>
      
      <div className="page-container relative z-10 w-full">
        {/* Left Column: Input Form */}
        <section className="glass-panel p-8 flex flex-col h-full overflow-y-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-2xl shadow-lg shadow-primary/30">
              🧙‍♂️
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Wishlist Wizard
              </h1>
              <p className="text-sm text-slate-400">Your AI Academic Advisor</p>
            </div>
          </div>

          <form onSubmit={handleGetRecommendations} className="space-y-6 flex-1">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">CGPA (0.0 - 4.0)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="4"
                className="custom-input"
                placeholder="e.g. 3.5"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                required
              />
            </div>

            <CourseSelector 
              title="Completed Courses"
              options={allCourses}
              selected={completedCourses}
              onChange={setCompletedCourses}
            />

            <CourseSelector 
              title="Courses to Repeat"
              options={allCourses}
              selected={repeatCourses}
              onChange={setRepeatCourses}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Preferred Difficulty</label>
              <div className="radio-group flex-wrap">
                {difficultyOptions.map(opt => (
                  <label key={opt} className={`radio-label ${difficulty === opt ? 'bg-primary/20 border-primary shadow-sm' : ''}`}>
                    <input 
                      type="radio" 
                      name="difficulty" 
                      value={opt}
                      checked={difficulty === opt}
                      onChange={(e) => setDifficulty(e.target.value)}
                    />
                    <span className="font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex justify-between text-sm font-medium text-slate-300">
                <span>Maximum Courses</span>
                <span className="text-primary font-bold">{maxCourses}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={maxCourses}
                onChange={(e) => setMaxCourses(e.target.value)}
                className="w-full accent-primary h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 px-1">
                <span>1</span>
                <span>8</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="pt-4 mt-auto">
              <button 
                type="submit" 
                className="btn-primary flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Consulting Crystal Ball...
                  </>
                ) : (
                  <>🪄 Generate Wishlist</>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Results Area */}
        <section className="h-full w-full">
          <RecommendationsResult recommendations={recommendations} loading={loading} />
        </section>
      </div>
    </main>
  );
}
