import React, { useState } from 'react';

export default function CourseSelector({ title, options, selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter(opt =>
        opt.code.toLowerCase().includes(search.toLowerCase()) ||
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (code) => {
        if (selected.includes(code)) {
            onChange(selected.filter(c => c !== code));
        } else {
            onChange([...selected, code]);
        }
        setSearch('');
    };

    const removeSelect = (code, e) => {
        e.stopPropagation();
        onChange(selected.filter(c => c !== code));
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium text-slate-300">{title}</label>

            <div
                className="select-container cursor-text"
                onClick={() => setIsOpen(true)}
            >
                {selected.map(code => (
                    <span key={code} className="course-tag">
                        {code}
                        <button
                            onClick={(e) => removeSelect(code, e)}
                            className="ml-1 hover:text-white focus:outline-none"
                        >
                            ×
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    className="bg-transparent border-none outline-none text-white flex-1 min-w-[120px]"
                    placeholder={selected.length === 0 ? "Search courses..." : ""}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 glass-card max-h-60 overflow-y-auto z-20 py-2">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((course) => {
                                const isSelected = selected.includes(course.code);
                                return (
                                    <div
                                        key={course.code}
                                        className={`px-4 py-2 cursor-pointer transition-colors flex justify-between items-center ${isSelected ? 'bg-primary/20 text-primary-hover' : 'hover:bg-white/5 text-slate-200'}`}
                                        onClick={() => handleSelect(course.code)}
                                    >
                                        <div>
                                            <span className="font-semibold">{course.code}</span>
                                            <span className="ml-2 text-sm opacity-70">{course.name}</span>
                                        </div>
                                        {isSelected && <span>✓</span>}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="px-4 py-2 text-slate-400 text-sm">No courses found</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
