import React, { useState } from 'react';
import { Plus, Users, Activity, FileText, X, Check, Trash2, Award } from 'lucide-react';

const TeacherDashboard = ({ exams, submissions, onCreateExam, onUpdateSubmission, onLogout }) => {
    const [viewingExam, setViewingExam] = useState(null);
    const [viewingStudent, setViewingStudent] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Create Test State
    const [newExamTitle, setNewExamTitle] = useState('');
    const [newExamCategory, setNewExamCategory] = useState('Mixed');
    const [newExamDuration, setNewExamDuration] = useState('60');
    const [newExamDesc, setNewExamDesc] = useState('');
    const [questions, setQuestions] = useState([]);

    // Temporary Question State
    const [qType, setQType] = useState('text');
    const [qTitle, setQTitle] = useState('');
    const [qDesc, setQDesc] = useState('');
    const [qOptions, setQOptions] = useState(['', '', '', '']);
    const [qAnswer, setQAnswer] = useState(0);

    // Grading State
    const [marks, setMarks] = useState({});

    const handleAddQuestion = () => {
        if (!qTitle || !qDesc) return;
        const newQ = {
            id: questions.length + 1,
            type: qType,
            title: qTitle,
            description: qDesc,
            ...(qType === 'mcq' ? { options: qOptions.filter(o => o.trim()), answer: qAnswer } : {})
        };
        setQuestions([...questions, newQ]);
        setQTitle(''); setQDesc(''); setQType('text'); setQOptions(['', '', '', '']); setQAnswer(0);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const newExam = {
            id: Date.now(),
            title: newExamTitle,
            type: newExamCategory,
            icon: 'FileText',
            duration: `${newExamDuration} mins`,
            questions: questions.length > 0 ? questions : [{ id: 1, type: 'text', title: 'Sample', description: 'Sample' }],
            difficulty: 'Medium',
            color: 'from-blue-500 to-indigo-600',
            description: newExamDesc || 'Dynamically created test.'
        };
        onCreateExam(newExam);
        setShowCreateModal(false);
        setNewExamTitle(''); setQuestions([]);
    };

    const handlePublishMarks = () => {
        const studentData = submissions[viewingExam.id][viewingStudent];
        onUpdateSubmission(viewingExam.id, viewingStudent, {
            ...studentData,
            marks,
            isPublished: true
        });
        alert('Marks Published Successfully!');
    };

    if (viewingStudent && viewingExam) {
        const studentData = submissions[viewingExam.id][viewingStudent];
        const isPublished = studentData?.isPublished;

        return (
            <div className="min-h-screen bg-[#020617] text-white p-8 overflow-y-auto">
                <button onClick={() => setViewingStudent(null)} className="mb-4 text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2">
                    &larr; Back to Students
                </button>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto space-y-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-black mb-6">Submission: {viewingStudent}</h2>
                        {isPublished ? (
                            <div className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-bold flex items-center gap-2">
                                <Check className="w-5 h-5"/> Marks Published
                            </div>
                        ) : (
                            <button onClick={handlePublishMarks} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50">
                                Publish Marks
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 overflow-hidden">
                            <h3 className="text-gray-400 font-bold mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Telemetry</h3>
                            <div className="text-sm font-mono text-blue-400 space-y-1">
                                <div>IKI Mean: {studentData?.telemetry?.ikiMean?.toFixed(1) || 0}ms</div>
                                <div>Total Keys: {studentData?.telemetry?.totalKeystrokes || 0}</div>
                                <div>Backspace: {studentData?.telemetry?.backspacePercent?.toFixed(1) || 0}%</div>
                            </div>
                        </div>
                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                            <h3 className="text-red-400 font-bold mb-2">Violations / Flags</h3>
                            {studentData?.telemetry?.flags?.length > 0 ? (
                                <ul className="list-disc pl-4 text-red-300 text-sm">
                                    {studentData.telemetry.flags.map((flag, i) => <li key={i}>{flag}</li>)}
                                </ul>
                            ) : (
                                <span className="text-green-400 text-sm">No standard violations</span>
                            )}
                            <div className="mt-2 text-sm text-red-300">Paste count: {studentData?.telemetry?.pasteCount || 0}</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-400 font-bold mb-4 text-xl flex items-center gap-2"><FileText className="w-5 h-5"/> Questions & Answers</h3>
                        {viewingExam.questions.map((q) => {
                            const ans = studentData?.answers?.[q.id];
                            return (
                                <div key={q.id} className="mb-6 bg-white/5 p-6 rounded-xl border border-white/10 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">{q.type}</div>
                                            <h4 className="text-lg font-bold">{q.title}</h4>
                                            <p className="text-gray-400 text-sm">{q.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <label className="text-xs font-bold text-gray-500">Marks</label>
                                            <input 
                                                type="number"
                                                value={marks[q.id] || studentData?.marks?.[q.id] || ''}
                                                onChange={(e) => setMarks(prev => ({...prev, [q.id]: e.target.value}))}
                                                className="w-16 bg-black/50 border border-white/20 rounded p-1 text-center font-bold"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-black/40 p-4 rounded-lg">
                                        <div className="text-xs text-gray-500 mb-2 uppercase font-bold">Student Answer:</div>
                                        {q.type === 'mcq' ? (
                                            <div className={`font-bold ${ans === q.answer ? 'text-green-400' : 'text-red-400'}`}>
                                                {ans !== undefined && ans !== null ? q.options[ans] : "No Answer"} 
                                                {ans !== q.answer && <div className="text-xs text-green-500 mt-1">Correct: {q.options[q.answer]}</div>}
                                            </div>
                                        ) : (
                                            <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans">
                                                {typeof ans === 'object' ? JSON.stringify(ans, null, 2) : (ans || "No Answer")}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (viewingExam) {
        const examSubmissions = submissions[viewingExam.id] || {};
        return (
            <div className="min-h-screen bg-[#020617] text-white p-8">
                <button onClick={() => setViewingExam(null)} className="mb-4 text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2">
                    &larr; Back to Dashboard
                </button>
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black mb-8">{viewingExam.title} - Submissions</h2>
                    {Object.keys(examSubmissions).length === 0 ? (
                        <div className="text-gray-500 italic p-8 bg-white/5 rounded-2xl text-center">No students have taken this test yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {Object.keys(examSubmissions).map(studentId => {
                                const st = examSubmissions[studentId];
                                return (
                                    <div key={studentId} className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                                <Users className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg">{studentId}</div>
                                                <div className="text-xs text-gray-500">{st.isPublished ? 'Graded' : 'Submitted Assessment'}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setViewingStudent(studentId)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5">
                                            View Details
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Teacher Dashboard</h1>
                        <p className="text-gray-500 mt-2">Manage your tests and monitor student performance.</p>
                    </div>
                    <button onClick={onLogout} className="text-gray-500 hover:text-white px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-bold">
                        Logout
                    </button>
                </header>

                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-400" /> Active Tests
                    </h2>
                    <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                        <Plus className="w-5 h-5" /> Create New Test
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map(exam => (
                        <div key={exam.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all flex flex-col relative overflow-hidden">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors relative z-10">{exam.title}</h3>
                            <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2 relative z-10">{exam.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{Object.keys(submissions[exam.id] || {}).length} Students</span>
                                <button onClick={() => setViewingExam(exam)} className="text-sm font-bold text-blue-400 hover:text-blue-300">View History &rarr;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-24">
                    <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl max-w-2xl w-full relative shadow-2xl">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-black mb-6">Create New Test</h2>
                        <form onSubmit={handleCreateSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-400 mb-1 block">Test Title</label>
                                    <input required value={newExamTitle} onChange={e => setNewExamTitle(e.target.value)} placeholder="e.g. Midterm OS" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"/>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-400 mb-1 block">Duration (mins)</label>
                                    <input type="number" required value={newExamDuration} onChange={e => setNewExamDuration(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-400 mb-1 block">Description</label>
                                <textarea value={newExamDesc} onChange={e => setNewExamDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-20"/>
                            </div>

                            <div className="border border-white/10 p-4 rounded-2xl bg-black/20">
                                <h3 className="text-lg font-bold mb-4">Add Question</h3>
                                <div className="space-y-3">
                                    <select value={qType} onChange={e => setQType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none">
                                        <option value="text">Descriptive / Text</option>
                                        <option value="code">Code / Programming</option>
                                        <option value="mcq">Multiple Choice</option>
                                    </select>
                                    <input placeholder="Question Title" value={qTitle} onChange={e => setQTitle(e.target.value)} className="w-full bg-white/5 font-bold border border-white/10 rounded-xl px-4 py-2 outline-none"/>
                                    <textarea placeholder="Question Description..." value={qDesc} onChange={e => setQDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none resize-none"/>
                                    
                                    {qType === 'mcq' && (
                                        <div className="space-y-2 mt-2">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Options (Select radio for correct answer)</p>
                                            {qOptions.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <input type="radio" name="correct" checked={qAnswer === i} onChange={() => setQAnswer(i)} className="w-4 h-4 text-blue-600"/>
                                                    <input placeholder={`Option ${i+1}`} value={opt} onChange={e => { const no = [...qOptions]; no[i] = e.target.value; setQOptions(no); }} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 outline-none text-sm"/>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <button type="button" onClick={handleAddQuestion} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
                                        <Plus className="w-4 h-4"/> Add Question
                                    </button>
                                </div>
                            </div>

                            {questions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-gray-400">Added Questions ({questions.length})</h4>
                                    {questions.map((q, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl text-sm border border-white/5">
                                            <span><strong>{q.type.toUpperCase()}:</strong> {q.title}</span>
                                            <button type="button" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="submit" disabled={questions.length === 0} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all disabled:opacity-50 mt-4">
                                Publish Entire Test
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
