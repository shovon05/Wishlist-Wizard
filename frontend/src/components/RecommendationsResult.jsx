import React from 'react';

export default function RecommendationsResult({ recommendations, loading }) {
    if (loading) {
        return (
            <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-medium animate-pulse">Wizard is casting the recommendation spell...</p>
            </div>
        );
    }

    if (!recommendations) {
        return (
            <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-6xl mb-4">🪄</div>
                <h2 className="text-2xl font-bold mb-2">Ready for Magic?</h2>
                <p className="text-slate-400">Fill in your details and click the button to get course recommendations tailored just for you.</p>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-6xl mb-4">🥺</div>
                <h2 className="text-2xl font-bold mb-2">No Courses Found</h2>
                <p className="text-slate-400">We couldn't find any courses matching your specific criteria. Try adjusting your preferences!</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>✨</span> Your Magical Paths
                </h2>
                <span className="bg-primary/20 text-primary-hover px-3 py-1 rounded-full text-sm font-semibold">
                    {recommendations.length} Found
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {recommendations.map((course, index) => (
                    <div
                        key={course.code}
                        className="glass-card p-5 relative overflow-hidden group"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                    >
                        {/* Recommendation Score Indicator (visual bar) */}
                        <div
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                            style={{ width: `${Math.min(100, (course.recommendationScore + 10) * 3)}%` }}
                        />

                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                {course.code}
                            </h3>
                            <div className="flex gap-2">
                                <span className="text-xs font-semibold bg-white/10 px-2 py-1 rounded">
                                    {course.credits} Credits
                                </span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded
                  ${course.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                        course.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300' :
                                            'bg-blue-500/20 text-blue-300'}`}>
                                    {course.difficulty}
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-300 font-medium mb-3">{course.name}</p>

                        {course.prerequisites && (
                            <div className="text-sm mt-3 pt-3 border-t border-white/10">
                                <span className="text-slate-400">Prerequisites: </span>
                                <span className="text-slate-200">{course.prerequisites}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
