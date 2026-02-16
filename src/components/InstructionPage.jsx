import React from 'react';
import { ShieldAlert, Info, ArrowLeft, Play, ExternalLink, MinusCircle } from 'lucide-react';
import Aurora from './Aurora/Aurora';

const InstructionPage = ({ examData, onBack, onProceed }) => {
    return (
        <div className="relative min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
            <Aurora colorStops={['#ef4444', '#f59e0b', '#ef4444']} amplitude={1.2} />

            <div className="relative z-10 w-full max-w-3xl">
                <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/10 relative overflow-hidden group animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                            <Info className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">{examData.title}</h1>
                            <p className="text-gray-400">Please read the instructions carefully before starting.</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 text-red-400 mb-4">
                                <ShieldAlert className="w-5 h-5 font-bold" />
                                <h3 className="font-bold uppercase tracking-widest text-sm">Strict Proctoring Rules</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-start gap-3">
                                    <MinusCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                    <span><strong>Tab Switching:</strong> Switching tabs or windows will be detected and logged. Multiple attempts will lead to automatic termination.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MinusCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                    <span><strong>Fullscreen Mode:</strong> The assessment must be taken in fullscreen. Exiting fullscreen will flag your session.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MinusCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                    <span><strong>Copy-Pasting:</strong> Copying or pasting text is strictly prohibited and will be blocked or flagged.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MinusCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                    <span><strong>AI-Detection:</strong> Behavioral biometrics (typing patterns) are used to detect bot activity or assistance.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                <span className="text-xs text-gray-500 uppercase font-black block mb-1">Duration</span>
                                <span className="text-xl font-bold">{examData.duration}</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                <span className="text-xs text-gray-500 uppercase font-black block mb-1">Total Questions</span>
                                <span className="text-xl font-bold">{examData.questions.length} Questions</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onBack}
                            className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 transition-all border border-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" /> Go Back
                        </button>
                        <button
                            onClick={onProceed}
                            className="flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-900/40 transition-all active:scale-[0.98]"
                        >
                            I Understand, Proceed <Play className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Your webcam and audio will be requested in the next step.
                </p>
            </div>
        </div>
    );
};

export default InstructionPage;
