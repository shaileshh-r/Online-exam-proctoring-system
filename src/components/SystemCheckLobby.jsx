import React, { useState, useEffect } from 'react';
import { Camera, Mic, Monitor, CheckCircle, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Aurora from './Aurora/Aurora';
import TextType from './TextType/TextType';
import TrueFocus from './TrueFocus/TrueFocus';

const SystemCheckLobby = ({ onStartExam }) => {
    const [checks, setChecks] = useState({
        webcam: 'pending',
        mic: 'pending',
        fullscreen: 'pending'
    });

    const checkMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().forEach(track => track.stop());
            setChecks(prev => ({ ...prev, webcam: 'success', mic: 'success' }));
        } catch (err) {
            console.error("Media Error:", err);
            setChecks(prev => ({ ...prev, webcam: 'fail', mic: 'fail' }));
        }
    };

    const requestFullscreen = () => {
        document.documentElement.requestFullscreen()
            .then(() => {
                setChecks(prev => ({ ...prev, fullscreen: 'success' }));
            })
            .catch((err) => {
                console.error("Fullscreen Error:", err);
                setChecks(prev => ({ ...prev, fullscreen: 'fail' }));
            });
    };

    useEffect(() => {
        const handleChange = () => {
            if (document.fullscreenElement) {
                setChecks(prev => ({ ...prev, fullscreen: 'success' }));
            } else {
                setChecks(prev => ({ ...prev, fullscreen: 'pending' }));
            }
        };
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    const allPassed = checks.webcam === 'success' && checks.mic === 'success' && checks.fullscreen === 'success';

    return (
        <div className="relative min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
            <Aurora colorStops={['#ef4444', '#f59e0b', '#ef4444']} amplitude={1.2} />

            <div className="relative z-10 max-w-2xl w-full">
                <div className="text-center mb-12 animate-fade-in-down" style={{ marginTop: '20px' }}>
                    <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter leading-none flex flex-col items-center">
                        <div className="h-20 flex items-center">
                            <TextType
                                text="Online Exam"
                                as="span"
                                loop={false}
                                typingSpeed={80}
                                cursorCharacter="|"
                                cursorClassName="text-red-500"
                            />
                        </div>
                        <div className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent py-4 text-center">
                            <TrueFocus
                                sentence="Proctoring System"
                                borderColor="#ef4444"
                                glowColor="rgba(239, 68, 68, 0.5)"
                                animationDuration={0.6}
                                pauseBetweenAnimations={1.5}
                            />
                        </div>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Please verify your environment and system permissions to ensure a secure exam session.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] p-8 md:p-10 border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-colors" />

                    <div className="space-y-6 relative z-10">
                        <div className="group/item relative flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/item:translate-x-0 transition-transform duration-500 ease-in-out pointer-events-none" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-3 rounded-xl ${checks.webcam === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                                    <Camera className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200">Webcam Access</h3>
                                    <p className="text-xs text-gray-500 italic">Required for visual monitoring</p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                {checks.webcam === 'success' ? (
                                    <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                                        <CheckCircle className="w-5 h-5" /> Secured
                                    </div>
                                ) : (
                                    <button
                                        onClick={checkMedia}
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                                    >
                                        Enable
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="group/item relative flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/item:translate-x-0 transition-transform duration-500 ease-in-out pointer-events-none" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-3 rounded-xl ${checks.mic === 'success' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-400'}`}>
                                    <Mic className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200">Microphone Access</h3>
                                    <p className="text-xs text-gray-500 italic">Required for audio analytics</p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                {checks.mic === 'success' ? (
                                    <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
                                        <CheckCircle className="w-5 h-5" /> Secured
                                    </div>
                                ) : (
                                    <button
                                        onClick={checkMedia}
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                                    >
                                        Enable
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="group/item relative flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/item:translate-x-0 transition-transform duration-500 ease-in-out pointer-events-none" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-3 rounded-xl ${checks.fullscreen === 'success' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}>
                                    <Monitor className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200">Fullscreen Mode</h3>
                                    <p className="text-xs text-gray-500 italic">Prevents tab switching</p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                {checks.fullscreen === 'success' ? (
                                    <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
                                        <CheckCircle className="w-5 h-5" /> Confirmed
                                    </div>
                                ) : (
                                    <button
                                        onClick={requestFullscreen}
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                                    >
                                        Enable
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={onStartExam}
                            disabled={!allPassed}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-500 relative overflow-hidden group/btn ${allPassed
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-[0.98]'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            <span className="relative z-10 flex items-center gap-2 text-lg">
                                Enter Proctored Session <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                            {allPassed && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center gap-4 animate-fade-in">
                    <span>Secure Protocol v2.4</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <span>End-to-End Encryption</span>
                </div>
            </div>
        </div>
    );
};

export default SystemCheckLobby;
