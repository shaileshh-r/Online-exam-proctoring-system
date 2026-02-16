import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import Aurora from './Aurora/Aurora';
import TextType from './TextType/TextType';

const LoginPage = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => {
            onLogin(credentials.id);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
            <Aurora colorStops={['#3b82f6', '#8b5cf6', '#3b82f6']} amplitude={1.2} />

            <div className="relative z-10 w-full max-w-lg">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-6 animate-fade-in">
                        <ShieldCheck className="w-4 h-4" /> Secure Examination Portal
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">
                        <TextType
                            text="Student Login"
                            as="span"
                            loop={false}
                            typingSpeed={80}
                        />
                    </h1>
                    <p className="text-gray-400 text-lg">Enter your credentials to access your scheduled tests.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-400 ml-1">Student ID / Email</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="Enter your ID"
                                    value={credentials.id}
                                    onChange={(e) => setCredentials(prev => ({ ...prev, id: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-400 ml-1">Password</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-offset-0 focus:ring-blue-500" />
                                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group/btn ${isLoading
                                ? 'bg-blue-600/50 cursor-wait'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-900/40 active:scale-[0.98]'
                                }`}
                        >
                            <span className="relative z-10 flex items-center gap-2 text-lg">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>
                                )}
                            </span>
                            {!isLoading && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm animate-fade-in">
                    <p>New student? <a href="#" className="text-blue-400 hover:underline font-bold">Request Access</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
