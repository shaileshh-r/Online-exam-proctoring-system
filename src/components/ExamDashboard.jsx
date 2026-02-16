import React, { useEffect, useState, useRef } from 'react';
import { Maximize, AlertTriangle, Activity, UserX, Copy, Monitor, Play, Send, LogOut, Terminal, ChevronDown, Code, Percent, CheckCircle2, XCircle, Award, BarChart3, ArrowLeft } from 'lucide-react';
import { useTypingAnalytics } from '../hooks/useTypingAnalytics';
import Editor from '@monaco-editor/react';

const languages = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'sql', label: 'SQL' }
];

const ExamDashboard = ({ examData, isViewOnly, previousSubmission, onFinish }) => {
    const questions = examData?.questions || [];
    const { handleKeyDown, stats, resetAnalytics } = useTypingAnalytics();
    const [warnings, setWarnings] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(true);
    const [showTelemetry, setShowTelemetry] = useState(!isViewOnly && examData?.type !== 'MCQ');
    const [isTerminated, setIsTerminated] = useState(false);
    const [timeLeft, setTimeLeft] = useState(2700);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        if (isViewOnly && previousSubmission) {
            const currentQid = questions[currentQuestion]?.id;
            const savedAnswers = previousSubmission[currentQid];
            if (typeof savedAnswers === 'object' && savedAnswers !== null) {
                const langWithCode = languages.find(l => savedAnswers[l.id] && savedAnswers[l.id].trim().length > 0);
                if (langWithCode) return langWithCode.id;
            }
        }
        return examData?.title?.includes('Database') ? 'sql' : 'javascript';
    });
    const [pasteCount, setPasteCount] = useState(0);
    const [showResults, setShowResults] = useState(isViewOnly);
    const [isCompiling, setIsCompiling] = useState(false);
    const [output, setOutput] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const videoRef = useRef(null);
    const timerRef = useRef(null);

    const [answers, setAnswers] = useState(() => {
        if (isViewOnly && previousSubmission) return previousSubmission;

        const initial = {};
        questions.forEach(q => {
            if (q.type === 'code') {
                const langData = {};
                languages.forEach(l => langData[l.id] = '');
                initial[q.id] = langData;
            } else if (q.type === 'mcq') {
                initial[q.id] = null;
            } else {
                initial[q.id] = '';
            }
        });
        return initial;
    });

    const calculateScore = () => {
        if (examData?.type !== 'MCQ') return { isManual: true };
        let correct = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.answer) correct++;
        });
        return {
            correct,
            total: questions.length,
            percent: Math.round((correct / questions.length) * 100)
        };
    };

    const score = isViewOnly ? calculateScore() : null;

    const handleCodeChange = (value) => {
        if (isViewOnly) return;
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestion].id]: {
                ...prev[questions[currentQuestion].id],
                [selectedLanguage]: value
            }
        }));
    };

    const handleAnswerChange = (val) => {
        if (isViewOnly) return;
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestion].id]: val
        }));
    };

    useEffect(() => {
        if (isViewOnly) return;
        let stream = null;
        const startWebcam = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Webcam Error:", err);
                setWarnings(prev => [...prev, "Webcam Access Lost"]);
            }
        };

        startWebcam();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isViewOnly]);

    useEffect(() => {
        if (isViewOnly) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    terminateExam("Time limit reached");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isViewOnly]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const terminateExam = (reason = "Security Violation: Fullscreen Exited") => {
        if (isViewOnly) return;
        setIsTerminated(true);
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
    };

    useEffect(() => {
        if (isViewOnly) return;
        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            if (!isFull && !isTerminated) {
                terminateExam();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [isTerminated, isViewOnly]);

    useEffect(() => {
        if (isViewOnly) return;
        const handleVisibilityChange = () => {
            if (document.hidden && !isTerminated) {
                setWarnings(prev => [...prev, "Tab Switch / Window Blur Detected"]);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isTerminated, isViewOnly]);

    if (isTerminated) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center">
                <AlertTriangle className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
                <h1 className="text-4xl font-bold mb-4">Exam Terminated</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    Your session has been closed due to a security violation or manual exit. All activity logs have been recorded for review.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                    Return to Lobby
                </button>
            </div>
        );
    }

    const handlePaste = (e) => {
        if (isViewOnly) return;
        if (e) e.preventDefault();

        setPasteCount(prev => {
            const next = prev + 1;
            if (next >= 2) {
                terminateExam("Security Violation: Multiple Paste Attempts (2/2)");
            } else {
                setWarnings(prevWarnings => [...prevWarnings, "Paste detected! Warning 1/2. Second attempt will terminate test."]);
            }
            return next;
        });
    };

    const handleEditorDidMount = (editor, monaco) => {
        if (isViewOnly) return;
        editor.onKeyDown((e) => {
            if (e.browserEvent) {
                handleKeyDown(e.browserEvent);
            }
        });

        editor.onDidPaste(() => {
            handlePaste();
        });
    };

    const handleSubmitExam = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = () => {
        onFinish(answers);
    };

    const handleRunCode = () => {
        setIsCompiling(true);
        setOutput('');

        // Simulate compilation and execution
        setTimeout(() => {
            setIsCompiling(false);
            const code = answers[currentQ.id]?.[selectedLanguage] || '';

            if (!code.trim()) {
                setOutput('> Error: No code provided to execute.');
                return;
            }

            // Simulated logic-based output
            if (selectedLanguage === 'javascript' || selectedLanguage === 'python') {
                if (code.toLowerCase().includes('print') || code.toLowerCase().includes('console.log')) {
                    setOutput('> Executing...\n> Output: Hello World\n> Process finished with exit code 0');
                } else {
                    setOutput('> Executing...\n> Process finished with exit code 0 (No output generated)');
                }
            } else if (selectedLanguage === 'sql') {
                setOutput('> Running Query...\n> Success: 15 rows affected\n> [Result Set Window Opened]');
            } else {
                setOutput('> Compiling...\n> Linked successfully.\n> Executing...\n> Finished.');
            }
        }, 1500);
    };

    const currentQ = questions[currentQuestion];

    return (
        <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden select-none">
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-blue-500" />
                        ProctorAI <span className="text-[10px] bg-red-500/10 text-red-500 px-2 rounded-full border border-red-500/20">{isViewOnly ? 'HISTORY' : 'LIVE'}</span>
                    </h1>
                </div>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        <h3 className="text-gray-500 text-xs uppercase tracking-wider font-bold">Questions</h3>
                        {questions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`w-full text-left p-3 rounded-xl transition-all ${currentQuestion === idx
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 font-medium'
                                    : 'hover:bg-white/5 text-gray-400'
                                    }`}
                            >
                                <span className="opacity-50 mr-2">{idx + 1}.</span> {q.title}
                            </button>
                        ))}
                    </div>

                    {!isViewOnly && (
                        <div className="space-y-2 pt-4">
                            <h3 className="text-gray-500 text-xs uppercase tracking-wider font-bold">System Health</h3>
                            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-green-400 text-sm flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Security Protocol v2.4
                            </div>
                        </div>
                    )}
                </div>

                {!isViewOnly && (
                    <div className="p-4 bg-black relative border-t border-gray-800">
                        <div className="aspect-video bg-gray-950 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] text-white flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> REC
                            </div>
                        </div>
                    </div>
                )}
                {isViewOnly && (
                    <div className="p-4 bg-blue-500/10 border-t border-gray-800 text-xs text-blue-300 italic text-center">
                        Viewing submitted assessment
                    </div>
                )}
            </aside>

            <main className="flex-1 flex flex-col relative bg-[#020617]">
                <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <h2 className="font-semibold text-lg">{examData?.title}</h2>
                    </div>

                    <div className="flex items-center gap-8">
                        {!isViewOnly ? (
                            <>
                                <div className={`p-1.5 px-3 rounded-lg border flex items-center gap-3 font-mono ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-blue-400'}`}>
                                    <span className="text-xs text-gray-500 font-sans">TIME_LEFT</span>
                                    {formatTime(timeLeft)}
                                </div>

                                <button
                                    onClick={handleSubmitExam}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all text-sm font-bold"
                                >
                                    <Send className="w-4 h-4" /> Submit Test
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => onFinish(null)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-xl transition-all text-sm font-bold"
                            >
                                <ArrowLeft className="w-4 h-4" /> Return to Selection
                            </button>
                        )}
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {showResults ? (
                        <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center">
                            <div className="max-w-4xl w-full space-y-12">
                                <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-12 text-center relative overflow-hidden group animate-fade-in-up">
                                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                                            <Award className="w-12 h-12 text-white" />
                                        </div>
                                        <h2 className="text-5xl font-black mb-4 tracking-tight">
                                            {score?.isManual ? 'Assessment Submitted' : 'Assessment Score'}
                                        </h2>
                                        {score?.isManual ? (
                                            <div className="flex flex-col items-center gap-2 mb-8">
                                                <div className="px-6 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 text-sm font-bold uppercase tracking-widest">
                                                    Manual Grading Pending
                                                </div>
                                                <p className="text-gray-500 text-sm">Your answers have been recorded and sent for review.</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-2 mb-8">
                                                <span className="text-8xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">{score?.correct}</span>
                                                <span className="text-3xl text-gray-500 font-bold">/ {score?.total}</span>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mt-4">
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                                <BarChart3 className="w-6 h-6 text-blue-400 mb-3 mx-auto" />
                                                <div className="text-2xl font-black">{score?.isManual ? '--' : `${score?.percent}%`}</div>
                                                <div className="text-xs text-gray-500 uppercase font-black tracking-widest">Accuracy</div>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                                <CheckCircle2 className="w-6 h-6 text-green-400 mb-3 mx-auto" />
                                                <div className="text-2xl font-black">{score?.isManual ? 'Saved' : score?.correct}</div>
                                                <div className="text-xs text-gray-500 uppercase font-black tracking-widest">Status</div>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                                <XCircle className="w-6 h-6 text-red-400 mb-3 mx-auto" />
                                                <div className="text-2xl font-black">{score?.isManual ? '0' : score?.total - score?.correct}</div>
                                                <div className="text-xs text-gray-500 uppercase font-black tracking-widest">Issues</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowResults(false)}
                                            className="mt-12 px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10 active:scale-95 flex items-center gap-2"
                                        >
                                            Review Questions <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-blue-400" /> Proctoring Log
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                                                <span className="text-gray-400 text-sm font-medium">Session Status</span>
                                                <span className="text-green-400 text-sm font-bold flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" /> Integrity Verified
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                                                <span className="text-gray-400 text-sm font-medium">Manual Flags</span>
                                                <span className="text-gray-200 text-sm font-bold">0 Detected</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                                                <span className="text-gray-400 text-sm font-medium">Verification Method</span>
                                                <span className="text-blue-400 text-sm font-bold">AI Biometrics</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                            <Monitor className="w-5 h-5 text-purple-400" /> Performance Analysis
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-white/5 rounded-2xl">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-400 text-sm font-medium">Topic Mastery</span>
                                                    <span className="text-white text-sm font-bold">{score?.isManual ? 'Pending' : `${score?.percent}%`}</span>
                                                </div>
                                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: score?.isManual ? '100%' : `${score?.percent}%` }} />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-2xl">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-400 text-sm font-medium">Peer Comparison</span>
                                                    <span className="text-white text-sm font-bold">Top 15%</span>
                                                </div>
                                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-2/5 p-8 border-r border-gray-800 overflow-y-auto bg-gray-900/50">
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm">
                                        {currentQuestion + 1}
                                    </span>
                                    <h3 className="text-xl font-bold">{currentQ.title}</h3>
                                </div>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    {currentQ.description}
                                </p>
                                {isViewOnly && (
                                    <button
                                        onClick={() => setShowResults(true)}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-blue-400 rounded-2xl font-bold border border-white/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col p-8 bg-[#020617] relative" onKeyDownCapture={!isViewOnly ? handleKeyDown : undefined}>
                                {currentQ.type === 'code' ? (
                                    <div className="flex-1 flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-[#1e1e1e] shadow-2xl">
                                        <div className="bg-[#252526] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 font-mono text-xs text-blue-400">
                                                    <Code className="w-4 h-4" />
                                                    Solution
                                                </div>
                                                <div className="relative group/lang">
                                                    <button className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 transition-all border border-white/5">
                                                        {languages.find(l => l.id === selectedLanguage).label}
                                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                                    </button>
                                                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#252526] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all z-50 p-2">
                                                        {languages.map(lang => (
                                                            <button
                                                                key={lang.id}
                                                                onClick={() => setSelectedLanguage(lang.id)}
                                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedLanguage === lang.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                                            >
                                                                {lang.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {!isViewOnly && (
                                                <button
                                                    onClick={handleRunCode}
                                                    disabled={isCompiling}
                                                    className="flex items-center gap-2 px-4 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    {isCompiling ? <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" /> : <Play className="w-3 h-3" />}
                                                    Run Code
                                                </button>
                                            )}
                                        </div>
                                        {isViewOnly && (
                                            <div className="bg-blue-600/10 border-b border-blue-500/20 px-4 py-2 flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                                <Award className="w-3 h-3" /> Submitted Solution Review Mode
                                            </div>
                                        )}
                                        <Editor
                                            height="100%"
                                            theme="vs-dark"
                                            onMount={handleEditorDidMount}
                                            language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                                            value={answers[currentQ.id]?.[selectedLanguage] || ''}
                                            onChange={handleCodeChange}
                                            options={{
                                                minimap: { enabled: false },
                                                fontSize: 14,
                                                padding: { top: 20 },
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true,
                                                readOnly: isViewOnly
                                            }}
                                        />
                                        <div className={`h-1/3 bg-[#050505] border-t border-white/10 flex flex-col transition-all overflow-hidden`}>
                                            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-black/40">
                                                <div className="flex items-center gap-2 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
                                                    <Terminal className="w-3 h-3 text-blue-400" /> Terminal Output
                                                </div>
                                                {output && (
                                                    <button onClick={() => setOutput('')} className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors font-bold uppercase">Clear</button>
                                                )}
                                            </div>
                                            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                                                {output ? (
                                                    <pre className="text-gray-300 leading-relaxed break-words whitespace-pre-wrap">{output}</pre>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-700 italic select-none">
                                                        No output to show. Click 'Run Code' to execute.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : currentQ.type === 'mcq' ? (
                                    <div className="flex-1 flex flex-col gap-4">
                                        {currentQ.options.map((opt, oIdx) => {
                                            const isSelected = answers[currentQ.id] === oIdx;
                                            const isCorrect = currentQ.answer === oIdx;

                                            let variantClasses = "border-white/10 hover:border-white/20 bg-white/5 text-gray-400";
                                            if (isViewOnly) {
                                                if (isCorrect) variantClasses = "border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
                                                else if (isSelected && !isCorrect) variantClasses = "border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                                            } else if (isSelected) {
                                                variantClasses = "border-blue-500 bg-blue-500/10 text-blue-400";
                                            }

                                            return (
                                                <button
                                                    key={oIdx}
                                                    disabled={isViewOnly}
                                                    onClick={() => handleAnswerChange(oIdx)}
                                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-4 ${variantClasses}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-current' : 'border-white/20'}`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 bg-current rounded-full" />}
                                                    </div>
                                                    <span className="text-lg font-medium">{opt}</span>
                                                    {isViewOnly && isCorrect && <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">Correct Answer</span>}
                                                    {isViewOnly && isSelected && !isCorrect && <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Your Choice</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-white/5">
                                        <textarea
                                            className="flex-1 bg-transparent p-6 text-gray-200 focus:outline-none font-sans italic resize-none leading-relaxed text-lg"
                                            placeholder="Type your answer here..."
                                            value={answers[currentQ.id] || ''}
                                            onKeyDown={handleKeyDown}
                                            onPaste={handlePaste}
                                            readOnly={isViewOnly}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="mt-8 flex justify-between items-center">
                                    <button
                                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestion === 0}
                                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all text-sm font-bold disabled:opacity-30 flex items-center gap-2"
                                    >
                                        Previous
                                    </button>
                                    <div className="text-gray-500 font-mono text-sm">
                                        Question {currentQuestion + 1} of {questions.length}
                                    </div>
                                    <button
                                        onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                                        disabled={currentQuestion === questions.length - 1}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-all text-sm font-bold disabled:opacity-30 flex items-center gap-2"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {showTelemetry && (
                    <div className="absolute bottom-6 right-6 w-80 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 z-50">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <h4 className="text-sm font-bold flex items-center gap-2 text-blue-400">
                                <Activity className="w-4 h-4" /> Telemetry
                            </h4>
                            <button onClick={() => setShowTelemetry(false)} className="text-gray-500 hover:text-white"><LogOut className="w-4 h-4 rotate-180" /></button>
                        </div>
                        <div className="space-y-4 text-xs font-mono">
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                <span className="text-gray-500">IKI_MEAN</span>
                                <span className="text-white text-sm">{stats.ikiMean.toFixed(1)}ms</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                <span className="text-gray-500">VARIANCE</span>
                                <span className={`text-sm font-bold ${stats.ikiSD < 5 && stats.ikiMean > 0 ? 'text-red-400' : 'text-green-400'}`}>±{stats.ikiSD.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                <span className="text-gray-500">BACKSPACE_USAGE</span>
                                <span className="text-white text-sm">{stats.backspacePercent.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                <span className="text-gray-500">TOTAL_KEYS</span>
                                <span className="text-white text-sm">{stats.totalKeystrokes}</span>
                            </div>
                            {stats.flags.length > 0 && (
                                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                    {stats.flags.map((flag, i) => (
                                        <div key={i} className="flex items-center gap-2 text-red-300 text-[10px] font-bold uppercase mb-1"><UserX className="w-3.5 h-3.5" /> {flag}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!isViewOnly && warnings.length > 0 && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-max max-w-md pointer-events-none z-50">
                        {warnings.slice(-3).map((w, i) => (
                            <div key={i} className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-bold text-sm">{w}</span>
                            </div>
                        ))}
                    </div>
                )}

                {showSubmitModal && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
                        <div className="bg-gray-900 border border-white/10 rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 rounded-3xl bg-blue-600/20 flex items-center justify-center mb-8 mx-auto">
                                <Send className="w-10 h-10 text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-black text-center mb-4">Ready to Submit?</h2>
                            <p className="text-gray-400 text-center mb-10 leading-relaxed font-medium">
                                Once submitted, you won't be able to change your answers. All proctoring data will be synced with your profile.
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={confirmSubmit}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                >
                                    Confirm & Submit Test
                                </button>
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl font-bold transition-all border border-white/10 active:scale-95"
                                >
                                    Review Answers
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExamDashboard;
