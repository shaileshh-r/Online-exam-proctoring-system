import React, { useState } from 'react';
import { BookOpen, Code, FileText, Clock, ChevronRight, Star, Calendar, ArrowLeft } from 'lucide-react';
import Aurora from './Aurora/Aurora';

const ExamSelection = ({ exams, submissions, onSelect, onLogout, onViewResults }) => {
    const [selectedId, setSelectedId] = useState(null);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Code': return <Code className="w-6 h-6" />;
            case 'BookOpen': return <BookOpen className="w-6 h-6" />;
            case 'FileText': return <FileText className="w-6 h-6" />;
            default: return <BookOpen className="w-6 h-6" />;
        }
    };

    return (
        <div className="relative min-h-screen bg-[#020617] text-white p-6 md:p-12 overflow-x-hidden font-sans">
            <Aurora colorStops={['#ef4444', '#f59e0b', '#ef4444']} amplitude={1.2} />

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 animate-fade-in-down">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Available <span className="text-blue-500">Exams</span></h1>
                        <p className="text-gray-400 text-lg">Select a test to begin your proctored session.</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-bold self-start md:self-center"
                    >
                        <ArrowLeft className="w-4 h-4" /> Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map((test, idx) => {
                        const isSubmitted = !!submissions[test.id];
                        return (
                            <div
                                key={test.id}
                                style={{ animationDelay: `${idx * 100}ms` }}
                                className={`group relative bg-white/5 backdrop-blur-xl border rounded-[2rem] p-8 transition-all duration-500 cursor-pointer hover:-translate-y-2 animate-fade-in-up
                                    ${selectedId === test.id ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-white/10 hover:border-white/20'}
                                    ${isSubmitted ? 'opacity-90' : ''}
                                `}
                                onClick={() => setSelectedId(test.id)}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${test.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity rounded-full`} />

                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${test.color} shadow-lg shadow-black/20`}>
                                        {getIcon(test.icon)}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-black tracking-widest text-gray-400">
                                            {test.type}
                                        </div>
                                        {isSubmitted && (
                                            <div className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-[9px] uppercase font-bold text-green-400">
                                                Submitted
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{test.title}</h3>
                                <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed">{test.description}</p>

                                <div className="flex flex-wrap gap-4 mb-8">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-white/5 px-3 py-2 rounded-xl">
                                        <Clock className="w-3.5 h-3.5 text-blue-400" /> {test.duration}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-white/5 px-3 py-2 rounded-xl">
                                        <FileText className="w-3.5 h-3.5 text-blue-400" /> {test.questions.length} Qs
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-white/5 px-3 py-2 rounded-xl">
                                        <Star className="w-3.5 h-3.5 text-blue-400" /> {test.difficulty}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isSubmitted) {
                                            onViewResults(test);
                                        } else {
                                            onSelect(test);
                                        }
                                    }}
                                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 
                                        ${isSubmitted
                                            ? 'bg-white/10 text-white hover:bg-white/20'
                                            : selectedId === test.id
                                                ? `bg-gradient-to-r ${test.color} text-white shadow-xl scale-[1.02]`
                                                : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}
                                    `}
                                >
                                    {isSubmitted ? 'View Submission' : 'Start Assessment'} <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex w-16 h-16 rounded-2xl bg-blue-500/20 items-center justify-center text-blue-400">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-1">Upcoming Laboratory Sessions</h4>
                            <p className="text-gray-400">Your next scheduled proctored exam is on July 24th, 2024.</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap">
                        View Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamSelection;
